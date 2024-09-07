import prisma from "@/db/prisma";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadFileToCloudinary = async (file: File, folder: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          type: "authenticated",
          transformation: { quality: "auto:good" },
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
};

export const deleteMultipleFilesCloudinary = async (publicIds: string[]) => {
  try {
    const deletePromises = publicIds.map((publicId) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
          publicId,
          { type: "authenticated" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
    });

    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error("Error deleting files: " + (error as any)?.message);
  }
};

export const getSignedUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });
};

type TableCount = {
  totalCount: number;
  diprosesCount: number;
  diterimaCount: number;
};

interface resultsObj {
  [key: string]: TableCount;
}

interface results {
  total: number;
  totalDiproses: number;
  totalDiterima: number;

  suratKelahiranCount: number;
  suratKematianCount: number;
  skBelumMenikahCount: number;
  skIjinKeramaianCount: number;
  skPenghasilanOrangTuaCount: number;
  skIzinBekerjaCount: number;
  skBelumMemilikiRumahCount: number;
  skTidakMemilikiPekerjaanCount: number;
  skUsahaCount: number;
  skDomisiliLembagaCount: number;
  skDomisiliImigrasiCount: number;
  skDomisiliSementaraCount: number;
  skTidakMampuCount: number;
  suratRekomendasiPembelianBbmCount: number;
  pendaftaranPindahWniCount: number;
}

export const getCountedPengajuan = async (batchSize = 5): Promise<results> => {
  const tables = [
    { model: prisma.suratKelahiran, name: "suratKelahiran" },
    { model: prisma.suratKematian, name: "suratKematian" },
    { model: prisma.skBelumMenikah, name: "skBelumMenikah" },
    { model: prisma.skIjinKeramaian, name: "skIjinKeramaian" },
    { model: prisma.skPenghasilanOrangTua, name: "skPenghasilanOrangTua" },
    { model: prisma.skIzinBekerja, name: "skIzinBekerja" },
    { model: prisma.skBelumMemilikiRumah, name: "skBelumMemilikiRumah" },
    {
      model: prisma.skTidakMemilikiPekerjaan,
      name: "skTidakMemilikiPekerjaan",
    },
    { model: prisma.skUsaha, name: "skUsaha" },
    { model: prisma.skDomisiliLembaga, name: "skDomisiliLembaga" },
    { model: prisma.skDomisiliImigrasi, name: "skDomisiliImigrasi" },
    { model: prisma.skDomisiliSementara, name: "skDomisiliSementara" },
    { model: prisma.skTidakMampu, name: "skTidakMampu" },
    {
      model: prisma.suratRekomendasiPembelianBbm,
      name: "suratRekomendasiPembelianBbm",
    },
    { model: prisma.pendaftaranPindahWni, name: "pendaftaranPindahWni" },
  ];

  const defaultCounts = { totalCount: 0, diprosesCount: 0, diterimaCount: 0 };

  const results: resultsObj = {
    suratKelahiran: defaultCounts,
    suratKematian: defaultCounts,
    skBelumMenikah: defaultCounts,
    skIjinKeramaian: defaultCounts,
    skPenghasilanOrangTua: defaultCounts,
    skIzinBekerja: defaultCounts,
    skBelumMemilikiRumah: defaultCounts,
    skTidakMemilikiPekerjaan: defaultCounts,
    skUsaha: defaultCounts,
    skDomisiliLembaga: defaultCounts,
    skDomisiliImigrasi: defaultCounts,
    skDomisiliSementara: defaultCounts,
    skTidakMampu: defaultCounts,
    suratRekomendasiPembelianBbm: defaultCounts,
    pendaftaranPindahWni: defaultCounts,
  };

  // Split tables into batches based on batchSize
  for (let i = 0; i < tables.length; i += batchSize) {
    const batch = tables.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (table) => {
        try {
          // @ts-ignore
          const totalCount = await table.model.count();
          // @ts-ignore
          const diprosesCount = await table.model.count({
            where: { status: "DIPROSES" },
          });
          // @ts-ignore
          const diterimaCount = await table.model.count({
            where: { status: "DITERIMA" },
          });
          return { [table.name]: { totalCount, diprosesCount, diterimaCount } };
        } catch (error) {
          console.error(`Error fetching counts for ${table.name}:`, error);
          return {
            [table.name]: { totalCount: 0, diprosesCount: 0, diterimaCount: 0 },
          }; // Handle errors as needed
        }
      })
    );

    // Merge the results
    batchResults.forEach((result) => {
      Object.assign(results, result);
    });
  }

  const total = Object.keys(results)
    .map((key) => results[key])
    .reduce((acc, cur) => acc + cur.totalCount, 0);
  const totalDiproses = Object.keys(results)
    .map((key) => results[key])
    .reduce((acc, cur) => acc + cur.diprosesCount, 0);
  const totalDiterima = Object.keys(results)
    .map((key) => results[key])
    .reduce((acc, cur) => acc + cur.diterimaCount, 0);

  const suratKelahiranCount = results.suratKelahiran.totalCount;
  const suratKematianCount = results.suratKematian.totalCount;
  const skBelumMenikahCount = results.skBelumMenikah.totalCount;
  const skIjinKeramaianCount = results.skIjinKeramaian.totalCount;
  const skPenghasilanOrangTuaCount = results.skPenghasilanOrangTua.totalCount;
  const skIzinBekerjaCount = results.skIzinBekerja.totalCount;
  const skBelumMemilikiRumahCount = results.skBelumMemilikiRumah.totalCount;
  const skTidakMemilikiPekerjaanCount =
    results.skTidakMemilikiPekerjaan.totalCount;
  const skUsahaCount = results.skUsaha.totalCount;
  const skDomisiliLembagaCount = results.skDomisiliLembaga.totalCount;
  const skDomisiliImigrasiCount = results.skDomisiliImigrasi.totalCount;
  const skDomisiliSementaraCount = results.skDomisiliSementara.totalCount;
  const skTidakMampuCount = results.skTidakMampu.totalCount;
  const suratRekomendasiPembelianBbmCount =
    results.suratRekomendasiPembelianBbm.totalCount;
  const pendaftaranPindahWniCount = results.pendaftaranPindahWni.totalCount;

  return {
    total,
    totalDiproses,
    totalDiterima,

    suratKelahiranCount,
    suratKematianCount,
    skBelumMenikahCount,
    skIjinKeramaianCount,
    skPenghasilanOrangTuaCount,
    skIzinBekerjaCount,
    skBelumMemilikiRumahCount,
    skTidakMemilikiPekerjaanCount,
    skUsahaCount,
    skDomisiliLembagaCount,
    skDomisiliImigrasiCount,
    skDomisiliSementaraCount,
    skTidakMampuCount,
    suratRekomendasiPembelianBbmCount,
    pendaftaranPindahWniCount,
  };
};

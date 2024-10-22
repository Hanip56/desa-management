import prisma from "@/db/prisma";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { existsSync } from "fs";
import { mkdir, writeFile, unlink, access } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// local file url
export const getUrl = (filename: string, folder?: string) => {
  return `/api/files?filename=${filename}&folder=${folder}`;
};

// Function to get buffer size in MB
const getBufferSizeInMB = (buffer: Buffer) => {
  return buffer.length / (1024 * 1024); // Convert bytes to MB
};

// Resize buffer recursively until it's under 3MB
const resizeBuffer = async (
  buffer: Buffer,
  quality = 80,
  widthReduction = 100
): Promise<Buffer> => {
  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch (error) {
    throw new Error("Error retrieving metadata from image");
  }

  let bufferSizeMB = getBufferSizeInMB(buffer);

  while (bufferSizeMB > 3) {
    if (metadata?.format === "jpeg" || metadata?.format === "jpg") {
      // Reduce JPEG quality progressively
      buffer = await sharp(buffer)
        .jpeg({ quality }) // Adjust JPEG quality
        .toBuffer();
      quality -= 10; // Reduce quality for next iteration
    } else if (metadata?.format === "png") {
      if (metadata.width) {
        // Resize PNG progressively by reducing dimensions
        buffer = await sharp(buffer)
          .resize({ width: Math.max(1, metadata.width - widthReduction) }) // Ensure width is at least 1
          .png({ compressionLevel: 9 }) // Max compression for PNG
          .toBuffer();
        widthReduction += 100; // Reduce dimensions further in each loop
      }
    }

    bufferSizeMB = getBufferSizeInMB(buffer);
  }

  return buffer;
};

// Main function to handle the resizing based on buffer size
export async function resizeImageBuffer(buffer: Buffer): Promise<Buffer> {
  const bufferSizeMB = getBufferSizeInMB(buffer);

  if (bufferSizeMB < 1) {
    return buffer; // No resizing required if buffer is less than 1 MB
  }

  if (bufferSizeMB >= 1 && bufferSizeMB < 3) {
    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch (error) {
      throw new Error("Error retrieving metadata from image");
    }

    if (metadata?.format === "jpeg" || metadata?.format === "jpg") {
      buffer = await sharp(buffer)
        .resize({ width: 1000 }) // Reduce dimensions for JPEG
        .jpeg({ quality: 80 }) // Adjust quality for JPEG
        .toBuffer();
    } else if (metadata?.format === "png") {
      buffer = await sharp(buffer)
        .resize({ width: 1000 }) // Reduce dimensions for PNG
        .png({ compressionLevel: 9 }) // Max compression for PNG
        .toBuffer();
    }
  }

  if (bufferSizeMB >= 3) {
    buffer = await resizeBuffer(buffer);
  }

  return buffer;
}

export const uploadFileToLocal = async (
  file: File,
  folder: string,
  userId: string
) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // resize buffer file
  const resizedBuffer = await resizeImageBuffer(buffer);

  const fileExtension = file.name.split(".").pop();

  // format filename with 'uuid--userId.ext'
  const filename = `${uuidv4()}--${userId}.${fileExtension}`;

  const filePath = join(cwd(), "uploads", folder, filename);
  const dirPath = join(cwd(), "uploads", folder);

  if (!existsSync(dirPath)) {
    await mkdir(dirPath);
  }

  await writeFile(filePath, resizedBuffer);

  return filename;
};

export const fileExists = async (filePath: string) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const deleteFile = async (filePath: string) => {
  if (await fileExists(filePath)) {
    try {
      await unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${(error as any)?.message}`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
};

// Function to delete multiple files using Promise.all
export const deleteMultipleLocalFiles = async (filePaths: string[]) => {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    console.log("No files to delete.");
    return;
  }

  // Create an array of promises for file deletions
  const deletionPromises = filePaths.map(async (filePath) => {
    try {
      await deleteFile(filePath);
    } catch (error) {
      console.error(
        `Error processing file ${filePath}: ${(error as any)?.message}`
      );
    }
  });

  try {
    // Execute all deletion promises concurrently
    await Promise.all(deletionPromises);
    console.log("All files processed.");
  } catch (error) {
    console.error("Error in deleting files:", (error as any)?.message);
  }
};

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

interface resultsCountProses {
  [key: string]: number;
}

interface RecordType {
  id: string;
  jenis: string;
  status: string;
  createdAt: string;
}

interface resultsGetDiprosesCountAndLatest {
  totalDiproses: number;
  latestRecords: RecordType[];
}

export const getDiprosesCountAndLatest = async (
  batchSize = 5
): Promise<resultsGetDiprosesCountAndLatest> => {
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

  const diprosesCount = 0;

  const results: resultsCountProses = {
    suratKelahiran: diprosesCount,
    suratKematian: diprosesCount,
    skBelumMenikah: diprosesCount,
    skIjinKeramaian: diprosesCount,
    skPenghasilanOrangTua: diprosesCount,
    skIzinBekerja: diprosesCount,
    skBelumMemilikiRumah: diprosesCount,
    skTidakMemilikiPekerjaan: diprosesCount,
    skUsaha: diprosesCount,
    skDomisiliLembaga: diprosesCount,
    skDomisiliImigrasi: diprosesCount,
    skDomisiliSementara: diprosesCount,
    skTidakMampu: diprosesCount,
    suratRekomendasiPembelianBbm: diprosesCount,
    pendaftaranPindahWni: diprosesCount,
  };

  for (let i = 0; i < tables.length; i += batchSize) {
    const batch = tables.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (table) => {
        try {
          // @ts-ignore
          const diprosesCount = await table.model.count({
            where: { status: "DIPROSES" },
          });
          return { [table.name]: diprosesCount };
        } catch (error) {
          console.error(`Error fetching counts for ${table.name}:`, error);
          return {
            [table.name]: 0,
          };
        }
      })
    );

    // Merge the results
    batchResults.forEach((result) => {
      Object.assign(results, result);
    });
  }

  const totalDiproses = Object.keys(results)
    .map((key) => results[key])
    .reduce((acc, cur) => acc + cur, 0);

  let latestRecords: any[] = [];

  try {
    latestRecords = await prisma.$queryRaw`
  SELECT * FROM (
    SELECT id,'Surat kelahiran' as jenis, "status", "createdAt" FROM "SuratKelahiran" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Surat kematian' as jenis, "status", "createdAt" FROM "SuratKematian" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk ijin keramaian' as jenis, "status", "createdAt" FROM "SkIjinKeramaian" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk belum menikah' as jenis, "status", "createdAt" FROM "SkBelumMenikah" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk penghasilan orang tua' as jenis, "status", "createdAt" FROM "SkPenghasilanOrangTua" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk izin bekerja' as jenis, "status", "createdAt" FROM "SkIzinBekerja" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk belum memiliki rumah' as jenis, "status", "createdAt" FROM "SkBelumMemilikiRumah" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk tidak memiliki pekerjaan' as jenis, "status", "createdAt" FROM "SkTidakMemilikiPekerjaan" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk usaha' as jenis, "status", "createdAt" FROM "SkUsaha" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk domisili lembaga' as jenis, "status", "createdAt" FROM "SkDomisiliLembaga" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk domisili imigrasi' as jenis, "status", "createdAt" FROM "SkDomisiliImigrasi" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk domisili sementara' as jenis, "status", "createdAt" FROM "SkDomisiliSementara" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Sk tidak mampu' as jenis, "status", "createdAt" FROM "SkTidakMampu" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Surat rekomendasi pembelian bbm' as jenis, "status", "createdAt" FROM "SuratRekomendasiPembelianBbm" WHERE "status" = 'DIPROSES'
    UNION ALL
    SELECT id,'Pendaftaran pindah wni' as jenis, "status", "createdAt" FROM "PendaftaranPindahWni" WHERE "status" = 'DIPROSES'
  ) AS combined
  ORDER BY combined."createdAt" DESC
  LIMIT 5;
`;
  } catch (error) {
    console.log(error);
    latestRecords = [];
  }

  return {
    totalDiproses,
    latestRecords: latestRecords,
  };
};

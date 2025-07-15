import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  formatDate,
  formatRupiah,
  getAlamat,
  getGender,
  getStatusPerkawinan,
} from "@/lib/utils";
import { SkPenghasilanOrangTua } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

export const generateSkPenghasilanOrangTua = async (
  data: SkPenghasilanOrangTua,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { width, height } = page.getSize();

  // font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const indent = 30;

  // layout
  const marginX = 55;
  const marginY = 30;

  await generateKopSurat({
    pdfDoc,
    page,
    marginX,
    marginY,
    font,
  });

  // Config
  //   startLine paragraph
  const startLine = height - 166;
  const gap = 10;
  const { p, pJustify, pColon, ttd, title } = generateUtils({
    pdfDoc,
    startLine,
    xColon: 220,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
    tte,
  });

  title("SURAT KETERANGAN PENGHASILAN ORANG TUA", data.noSurat ?? "");

  //   Content
  pJustify(
    `Yang bertanda tangan di bawah ini pemerintah Desa ${NAMA_DESA} Kecamatan Cicalengka`,
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama Lengkap`, data.namaLengkap, 8);
  pColon(`Nomor Induk Kependudukan`, data.nik, 10);
  pColon(`Tanggal Lahir`, formatDate(data.tanggalLahir), 12);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 14);
  pColon(`Agama`, data.agama, 16);
  pColon(`Pekerjaan`, data.pekerjaan, 18);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 20);
  pColon(`Kewarganegaraan`, data.kewarganegaraan, 22);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 24);

  pJustify(
    "Menurut keterangan RT/RW setempat dan data yang ada, benar bahwa yang",
    30,
    true
  );
  p(`bersangkutan penduduk Desa ${NAMA_DESA} Kecamatan Cicalengka dan :`, 32);

  p(
    `Benar mempunyai penghasilan rata-rata ${formatRupiah(
      data.penghasilan
    )},-/Bulan`,
    35,
    marginX + indent
  );
  pJustify(
    "Demikian surat Keterangan ini kami buat untuk dipergunakan sebagaimana mestinya,",
    38
  );
  p("atas perhatian dan kerjasamanya kami haturkan terima kasih.", 40);

  // ttd center
  ttd(
    635,
    "right",
    `${NAMA_DESA}, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    `Kepala Desa ${NAMA_DESA}`,
    namaKepalaDesa ?? "",
    "",
    true
  );

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

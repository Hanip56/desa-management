import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  formatRupiah,
  getGender,
} from "@/lib/utils";
import { SkPenghasilanOrangTua } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import fs from "fs";
import path from "path";

export const generateSkPenghasilanOrangTua = async (
  data: SkPenghasilanOrangTua,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void
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

  // Title
  const title = "SURAT KETERANGAN PENGHASILAN ORANG TUA";
  const titleWidth = bold.widthOfTextAtSize(title, 14);

  const titleX = width / 2 - titleWidth / 2;
  const titleY = height - 140;

  page.drawText(title, {
    x: titleX,
    y: titleY,
    size: 14,
    font: bold,
  });

  page.drawLine({
    start: { x: titleX, y: titleY - 3 },
    end: { x: titleX + titleWidth, y: titleY - 3 },
    thickness: 1,
  });

  const No = `Nomor: ${data.noSurat}`;
  const NoWidth = font.widthOfTextAtSize(No, 11);
  page.drawText(No, {
    x: width / 2 - NoWidth / 2,
    y: titleY - 16,
    size: 11,
    font: font,
  });

  //   Content
  //   config paragraph
  const startLine = height - 166;
  const gap = 10;
  const { p, pJustify, ttd } = generateUtils({
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
  });

  pJustify(
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  p(`Nama Lengkap                         : ${data.namaLengkap}`, 8);
  p(`Nomor Induk Kependudukan   : ${data.nik}`, 10);
  p(
    `Tanggal Lahir                           : ${formatDate(
      data.tanggalLahir
    )}`,
    12
  );
  p(
    `Jenis Kelamin                           : ${getGender(data.jenisKelamin)}`,
    14
  );
  p(`Agama                                      : ${data.agama}`, 16);
  p(`Pekerjaan                                  : ${data.pekerjaan}`, 18);
  p(
    `Status Perkawinan                    : ${data.statusPerkawinan.replace(
      "_",
      " "
    )}`,
    20
  );
  p(`Kewarganegaraan                     : ${data.kewarganegaraan}`, 22);
  p(`Alamat                                      : ${data.alamat}`, 24);

  pJustify(
    "Menurut keterangan RT/RW setempat dan data yang ada, benar bahwa yang",
    30,
    true
  );
  p("bersangkutan penduduk Desa Margaasih Kecamatan Cicalengka dan :", 32);

  p(
    `Benar mempunyai penghasilan rata-rata Rp. ${formatRupiah(
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
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Kepala Desa Margaasih",
    "YAYAN SURYANA"
  );

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  getGender,
} from "@/lib/utils";
import { SuratKematian } from "@prisma/client";

export const generateSuratKematian = async (
  data: SuratKematian,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void
) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the PDF document
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { width, height } = page.getSize();

  // Load the default font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  //   config
  const startLine = height - 120;
  const gap = 10;
  const indent = 30;
  const p = (content: string, indexY: number = 0, x?: number) => {
    page.drawText(content, {
      x: x ?? 65,
      y: startLine - gap * indexY,
      size: 13,
      font: font,
      maxWidth: 480,
      lineHeight: 15,
    });
  };

  const fontSize = 16;
  const title = "SURAT KEMATIAN";
  const titleWidth = bold.widthOfTextAtSize(title, fontSize);

  const titleX = width / 2 - titleWidth / 2;
  const titleY = height - 50;

  // Title
  page.drawText(title, {
    x: titleX,
    y: titleY,
    size: fontSize,
    font: bold,
  });

  page.drawLine({
    start: { x: titleX, y: titleY - 3 },
    end: { x: titleX + titleWidth, y: titleY - 3 },
    thickness: 1,
  });

  const No = `No: ${data.noSurat}`;
  const NoWidth = font.widthOfTextAtSize(No, fontSize);
  page.drawText(No, {
    x: width / 2 - NoWidth / 2,
    y: height - 70,
    size: fontSize,
    font: font,
  });

  //   Content
  p("Yang bertanda tangan dibawah ini :");
  p(`Nama                         : ${data.namaPemohon}`, 3);
  p(`Jenis Kelamin            : ${getGender(data.jenisKelaminPemohon)}`, 5);
  p(`No. NIK                     : ${data.noNikPemohon}`, 7);
  p(`Alamat                       : ${data.alamatPemohon}`, 9);
  p(`Hubungan Keluarga   : ${data.hubunganKeluargaPemohon}`, 11);

  p("Menerangkan bahwa yang bernama :", 15);
  p(`Nama                         : ${data.namaTerkait}`, 18);
  p(`Jenis Kelamin            : ${getGender(data.jenisKelaminTerkait)}`, 20);
  p(`No. NIK                     : ${data.noNikTerkait}`, 22);
  p(`Alamat                       : ${data.alamatTerkait}`, 24);

  p("Telah meninggal dunia pada :", 28);
  p(`Hari/Tanggal              : ${DateToDayAndDate(data.tanggal)}`, 31);
  p(`Waktu                         : ${DatetoTime(data.tanggal)}`, 33);
  p(`Penyebab                    : ${data.penyebab}`, 35);
  p(`Tempat                       : ${data.tempat}`, 37);
  p(`Meninggal`, 39);

  p(
    "Demikian Surat Keterangan Kematian ini kami buat dengan sebenarnya untuk",
    43,
    65 + indent
  );
  p("dipergunakan sebagaimana mestinya.", 45);

  // ttd right
  const boxWidth = 250;
  const boxHeight = 150;
  const boxX = width - 50 - boxWidth;
  const boxY = height - boxHeight - 635;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    height: boxHeight,
    width: boxWidth,
    color: rgb(1, 1, 1),
  });

  const tanggal = `Margaasih, ${
    data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
  }`;
  const tanggalWidth = font.widthOfTextAtSize(tanggal, 13);

  page.drawText(tanggal, {
    x: boxX + boxWidth / 2 - tanggalWidth / 2,
    y: boxY + boxHeight - 20,
    size: 13,
    font: font,
  });

  const kades = "Kepala Desa Margaasih";
  const kadesWidth = font.widthOfTextAtSize(kades, 13);
  page.drawText(kades, {
    x: boxX + boxWidth / 2 - kadesWidth / 2,
    y: boxY + boxHeight - 40,
    size: 13,
    font: font,
  });

  const tte = data.namaPemohon;
  const tteWidth = font.widthOfTextAtSize(tte, 13);
  page.drawText(tte, {
    x: boxX + boxWidth / 2 - tteWidth / 2,
    y: boxY + boxHeight - 120,
    size: 13,
    font: font,
  });

  // ttd left
  const boxLeftX = 50;

  page.drawRectangle({
    x: boxLeftX,
    y: boxY,
    height: boxHeight,
    width: boxWidth,
    color: rgb(1, 1, 1),
  });

  const tteLeft1 = `Mengetahui`;
  const tteLeft1Width = font.widthOfTextAtSize(tteLeft1, 13);

  page.drawText(tteLeft1, {
    x: boxLeftX + boxWidth / 2 - tteLeft1Width / 2,
    y: boxY + boxHeight - 20,
    size: 13,
    font: font,
  });

  const tteLeft2 = "Kepala Desa Margaasih";
  const tteLeft2Width = font.widthOfTextAtSize(tteLeft2, 13);
  page.drawText(tteLeft2, {
    x: boxLeftX + boxWidth / 2 - tteLeft2Width / 2,
    y: boxY + boxHeight - 40,
    size: 13,
    font: font,
  });

  const tteLeft3 = "tte";
  const tteLeft3Width = font.widthOfTextAtSize(tteLeft3, 13);
  page.drawText(tteLeft3, {
    x: boxLeftX + boxWidth / 2 - tteLeft3Width / 2,
    y: boxY + boxHeight - 120,
    size: 13,
    font: font,
  });

  // Draw bounding rectangle
  page.drawRectangle({
    x: 50,
    y: 20,
    width: 500,
    height: 800,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

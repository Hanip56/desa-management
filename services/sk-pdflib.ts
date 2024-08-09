import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatTanggal, getGender } from "@/lib/utils";
import { SuratKelahiran } from "@prisma/client";

export const generateSk = async (
  data: SuratKelahiran,
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

  const fontSize = 16;
  const title = "SURAT KELAHIRAN";
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

  page.drawText(
    "Yang bertanda tangan dibawah ini Kepala Desa Margaasih menerangkan bahwa :",
    {
      x: 65,
      y: height - 120,
      size: 13,
      font: font,
      maxWidth: 480,
    }
  );

  // Content
  page.drawText(`Nama                   : ${data.namaTerkait}`, {
    x: 65,
    y: height - 155,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Jenis Kelamin      : ${getGender(data.jenisKelaminTerkait)}`, {
    x: 65,
    y: height - 180,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(
    `Tempat/tgl lahir   : ${data.tempatLahirTerkait}, ${formatTanggal(
      data.tanggalLahirTerkait.toString()
    )}`,
    {
      x: 65,
      y: height - 205,
      size: 13,
      font: font,

      maxWidth: 480,
      lineHeight: 15,
    }
  );

  page.drawText(`Alamat                 : ${data.alamatTerkait}`, {
    x: 65,
    y: height - 230,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText("Adalah benar Anak dari :", {
    x: 65,
    y: height - 275,
    size: 13,
    font: font,
    maxWidth: 480,
  });

  page.drawText(`Nama Ayah          : ${data.namaAyah}`, {
    x: 65,
    y: height - 310,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Jenis Kelamin      : ${getGender(data.jenisKelaminAyah)}`, {
    x: 65,
    y: height - 335,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(
    `Tempat/tgl lahir   : ${data.tempatLahirAyah}, ${formatTanggal(
      data.tanggalLahirAyah.toString()
    )}`,
    {
      x: 65,
      y: height - 360,
      size: 13,
      font: font,

      maxWidth: 480,
      lineHeight: 15,
    }
  );

  page.drawText(`Agama                 : ${data.agamaAyah}`, {
    x: 65,
    y: height - 385,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Alamat                 : ${data.alamatAyah}`, {
    x: 65,
    y: height - 410,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Nama                   : ${data.namaIbu}`, {
    x: 65,
    y: height - 450,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Jenis Kelamin      : ${getGender(data.jenisKelaminIbu)}`, {
    x: 65,
    y: height - 475,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(
    `Tempat/tgl lahir   : ${data.tempatLahirIbu}, ${formatTanggal(
      data.tanggalLahirIbu.toString()
    )}`,
    {
      x: 65,
      y: height - 500,
      size: 13,
      font: font,

      maxWidth: 480,
      lineHeight: 15,
    }
  );

  page.drawText(`Agama                 : ${data.agamaIbu}`, {
    x: 65,
    y: height - 525,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(`Alamat                 : ${data.alamatIbu}`, {
    x: 65,
    y: height - 550,
    size: 13,
    font: font,
    maxWidth: 480,
    lineHeight: 15,
  });

  page.drawText(
    "Demikian Surat Keterangan Kelahiran ini kami buat dengan sebenarnya untuk",
    {
      x: 95,
      y: height - 600,
      size: 13,
      font: font,

      maxWidth: 480,
      lineHeight: 15,
    }
  );

  page.drawText("dipergunakan sebagaimana mestinya.", {
    x: 65,
    y: height - 625,
    size: 13,
    font: font,

    maxWidth: 480,
    lineHeight: 15,
  });

  // ttd
  const boxWidth = 200;
  const boxHeight = 150;
  const boxX = width - 50 - boxWidth;
  const boxY = height - boxHeight - 665;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    height: boxHeight,
    width: boxWidth,
    color: rgb(1, 1, 1),
  });

  const tanggal = `Margaasih, ${formatTanggal(
    (data.tanggalPembuatan ?? "-").toString()
  )}`;
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

  const tte = "tte";
  const tteWidth = font.widthOfTextAtSize(tte, 13);
  page.drawText(tte, {
    x: boxX + boxWidth / 2 - tteWidth / 2,
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

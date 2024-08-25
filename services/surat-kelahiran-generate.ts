import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate, getAlamat, getGender } from "@/lib/utils";
import { Setting, SuratKelahiran } from "@prisma/client";
import { generateUtils } from "./utils";

export const generateSuratKelahiran = async (
  data: SuratKelahiran,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array
) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the PDF document
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { width, height } = page.getSize();
  const marginX = 65;

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

  //   config
  const startLine = height - 110;
  const gap = 10;
  const indent = 30;
  const { p, pJustify, ttd } = generateUtils({
    pdfDoc,
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
    tte,
  });

  p(
    "Yang bertanda tangan dibawah ini Kepala Desa Margaasih menerangkan bahwa :"
  );

  // Content
  p(`Nama                   : ${data.namaTerkait}`, 3);

  p(`Jenis Kelamin      : ${getGender(data.jenisKelaminTerkait)}`, 5);

  p(
    `Tempat/tgl lahir   : ${data.tempatLahirTerkait}, ${formatDate(
      data.tanggalLahirTerkait
    )}`,
    7
  );

  p(
    `Alamat                 : ${getAlamat(
      data.kampungTerkait,
      data.rtTerkait,
      data.rwTerkait
    )}`,
    9
  );

  p("Adalah benar Anak dari :", 12);

  p(`Nama Ayah          : ${data.namaAyah}`, 15);

  p(`Jenis Kelamin      : ${getGender(data.jenisKelaminAyah)}`, 17);

  p(
    `Tempat/tgl lahir   : ${data.tempatLahirAyah}, ${formatDate(
      data.tanggalLahirAyah
    )}`,
    19
  );

  p(`Agama                 : ${data.agamaAyah}`, 21);

  p(
    `Alamat                 : ${getAlamat(
      data.kampungAyah,
      data.rtAyah,
      data.rwAyah
    )}`,
    23
  );

  p(`Nama                   : ${data.namaIbu}`, 26);

  p(`Jenis Kelamin      : ${getGender(data.jenisKelaminIbu)}`, 28);

  p(
    `Tempat/tgl lahir   : ${data.tempatLahirIbu}, ${formatDate(
      data.tanggalLahirIbu
    )}`,
    30
  );

  p(`Agama                 : ${data.agamaIbu}`, 32);

  p(
    `Alamat                 : ${getAlamat(
      data.kampungIbu,
      data.rtIbu,
      data.rwIbu
    )}`,
    34
  );

  pJustify(
    "Demikian Surat Keterangan Kelahiran ini kami buat dengan sebenarnya untuk",
    38,
    true
  );

  p("dipergunakan sebagaimana mestinya.", 40);

  ttd(
    635,
    "right",
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Kepala Desa Margaasih",
    namaKepalaDesa ?? "-",
    "",
    true
  );

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

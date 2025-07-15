import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate, getAlamat, getGender } from "@/lib/utils";
import { SuratKelahiran } from "@prisma/client";
import { generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

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
  const { p, pColon, pJustify, ttd } = generateUtils({
    pdfDoc,
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 12.5,
    tte,
  });

  p(
    `Yang bertanda tangan dibawah ini Kepala Desa ${NAMA_DESA} menerangkan bahwa :`
  );

  // Content
  pColon(`Nama`, data.namaTerkait, 3);

  pColon(`Jenis Kelamin`, getGender(data.jenisKelaminTerkait), 5);

  pColon(
    `Tempat/tgl lahir`,
    `${data.tempatLahirTerkait}, ${formatDate(data.tanggalLahirTerkait)}`,
    7
  );

  pColon(`Alamat`, data.alamatTerkait.replace(/\n/g, " "), 9);

  p("Adalah benar Anak dari :", 14);

  pColon(`Nama Ayah`, data.namaAyah, 17);

  pColon(`Jenis Kelamin`, getGender(data.jenisKelaminAyah), 19);

  pColon(
    `Tempat/tgl lahir`,
    `${data.tempatLahirAyah}, ${formatDate(data.tanggalLahirAyah)}`,
    21
  );

  pColon(`Agama`, data.agamaAyah, 23);

  pColon(`Alamat`, data.alamatAyah.replace(/\n/g, " "), 25);

  pColon(`Nama`, data.namaIbu, 30);

  pColon(`Jenis Kelamin`, getGender(data.jenisKelaminIbu), 32);

  pColon(
    `Tempat/tgl lahir`,
    `${data.tempatLahirIbu}, ${formatDate(data.tanggalLahirIbu)}`,
    34
  );

  pColon(`Agama`, data.agamaIbu, 36);

  pColon(`Alamat`, data.alamatIbu.replace(/\n/g, " "), 38);

  pJustify(
    "Demikian Surat Keterangan Kelahiran ini kami buat dengan sebenarnya untuk",
    43,
    true
  );

  p("dipergunakan sebagaimana mestinya.", 45);

  ttd(
    635,
    "right",
    `${NAMA_DESA}, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    `Kepala Desa ${NAMA_DESA}`,
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

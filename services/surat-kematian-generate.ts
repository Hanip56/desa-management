import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  getAlamat,
  getGender,
} from "@/lib/utils";
import { SuratKematian } from "@prisma/client";
import { generateUtils } from "./utils";

export const generateSuratKematian = async (
  data: SuratKematian,
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

  // Load the default font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  //   config
  const startLine = height - 110;
  const gap = 10;
  const indent = 30;

  const fontSize = 16;
  const title = "SURAT KEMATIAN";
  const titleWidth = bold.widthOfTextAtSize(title, fontSize);

  const titleX = width / 2 - titleWidth / 2;
  const titleY = height - 50;
  const marginX = 65;

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

  //   Content
  p("Yang bertanda tangan dibawah ini :");
  pColon(`Nama`, data.namaPemohon, 3);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelaminPemohon), 5);
  pColon(`No. NIK`, data.noNikPemohon, 7);
  pColon(`Hubungan Keluarga`, data.hubunganKeluargaPemohon, 9);
  pColon(`Alamat`, data.alamatPemohon, 11);

  p("Menerangkan bahwa yang bernama :", 16);
  pColon(`Nama`, data.namaTerkait, 19);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelaminTerkait), 21);
  pColon(`No. NIK`, data.noNikTerkait, 23);
  pColon(`Alamat`, data.alamatTerkait, 25);

  p("Telah meninggal dunia pada :", 30);
  pColon(`Hari/Tanggal`, DateToDayAndDate(data.tanggal), 33);
  pColon(`Waktu`, `${DatetoTime(data.tanggal)}`, 35);
  pColon(`Penyebab`, data.penyebab, 37);
  pColon(`Tempat`, data.tempat, 39);
  p(`Meninggal`, 41);

  pJustify(
    "Demikian Surat Keterangan Kematian ini kami buat dengan sebenarnya untuk",
    44,
    true
  );
  p("dipergunakan sebagaimana mestinya.", 46);

  // ttd right
  ttd(
    635,
    "right",
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Pelapor",
    data.namaPemohon ?? "-",
    ""
  );

  // ttd left
  ttd(
    635,
    "left",
    "Mengetahui",
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

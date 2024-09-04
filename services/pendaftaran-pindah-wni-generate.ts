import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateTableWni, generateUtils } from "./utils";
import { AnggotaPindahWni, PendaftaranPindahWni } from "@prisma/client";

export const generatePendaftaranPindahWni = async (
  data: PendaftaranPindahWni & {
    anggotaPindah: AnggotaPindahWni[];
  },
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { height, width } = page.getSize();

  // font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // layout
  const marginX = 55;
  const marginY = 30;

  //   Content

  //   rectangle
  const rectWidth = 70;
  const rectHeight = 20;
  const rectX = width - rectWidth - marginX;
  const rectY = height - rectHeight - marginY;
  page.drawRectangle({
    width: rectWidth,
    height: rectHeight,
    x: rectX,
    y: rectY,
    borderWidth: 0.5,
    borderColor: rgb(0, 0, 0),
  });

  const codeFormulir = "F 1.03";
  const codeFormulirFontSize = 11;
  page.drawText(codeFormulir, {
    x:
      rectX +
      rectWidth / 2 -
      bold.widthOfTextAtSize(codeFormulir, codeFormulirFontSize) / 2,
    y: rectY + rectHeight / 2 - codeFormulirFontSize / 4,
    font: bold,
    size: codeFormulirFontSize,
  });

  const { p: pHeader, pColon: pColonHeader } = generateUtils({
    pdfDoc,
    startLine: height - 55,
    font: bold,
    xColon: 195,
    bold,
    gap: 8,
    marginX,
    page,
    fontSize: 10,
    tte,
  });

  pHeader("PEMERINTAHAN PROVINSI JAWA BARAT", 2);
  pHeader("PEMERINTAHAN KABUPATEN BANDUNG", 4);
  pColonHeader("KECAMATAN", "CICALENGKA", 6);
  pColonHeader("DESA/KELURAHAN", "MARGAASIH", 8);

  // Config
  //   startLine paragraph
  const startLine = height - 156;
  const gap = 6.5;
  const { p, pColon, ttd, title } = generateUtils({
    pdfDoc,
    startLine,
    xColon: 205,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 11,
  });

  title(
    "FORMULIR PENDAFTARAN PINDAH WNI",
    data?.noSurat ?? "",
    height - 150,
    13
  );

  p("DATA DAERAH ASAL :", 4, undefined, bold);

  const noListIndent = 20;
  const textListIndent = 40;

  p("1.", 7, marginX + noListIndent);
  pColon("NO KK", data.noKk, 7, textListIndent);

  p("2.", 9, marginX + noListIndent);
  pColon("Nama lengkap pemohon", data.namaLengkapPemohon, 9, textListIndent);

  p("3.", 11, marginX + noListIndent);
  pColon("NIK", data.nik, 11, textListIndent);

  p("4.", 13, marginX + noListIndent);
  pColon("Jenis permohonan", data.jenisPermohonan, 13, textListIndent);

  p("ALAMAT ASAL :", 18, undefined, bold);

  const xPColon = 225;

  pColon("Alamat", data.alamatAsal, 21, noListIndent, xPColon);
  pColon("Desa", data.desaAsal, 23, noListIndent, xPColon);
  pColon("Kecamatan", data.kecamatanAsal, 25, noListIndent, xPColon);
  pColon("Kabupaten", data.kabupatenAsal, 27, noListIndent, xPColon);
  pColon("Provinsi", data.provinsiAsal, 29, noListIndent, xPColon);
  pColon("Kode Pos", data.kodePosAsal, 31, noListIndent, xPColon);

  p("ALAMAT TUJUAN :", 36, undefined, bold);

  pColon("Alamat", data.alamatTujuan, 39, noListIndent, xPColon);
  pColon("Desa/Kelurahan", data.desaTujuan, 41, noListIndent, xPColon);
  pColon("Kecamatan", data.kecamatanTujuan, 43, noListIndent, xPColon);
  pColon("Kota/Kabupaten", data.kabupatenTujuan, 45, noListIndent, xPColon);
  pColon("Provinsi", data.provinsiTujuan, 47, noListIndent, xPColon);
  pColon("Kode Pos", data.kodePosTujuan, 49, noListIndent, xPColon);

  p("1.", 54, marginX + noListIndent);
  pColon(
    "Klasifikasi Kepindahan",
    data.klasifikasiKepindahan,
    54,
    textListIndent
  );

  p("2.", 56, marginX + noListIndent);
  pColon("Alasan Pindah", data.alasanPindah, 56, textListIndent);

  p("3.", 58, marginX + noListIndent);
  pColon("Jenis Kepindahan", data.jenisKepindahan, 58, textListIndent);

  p("4.", 60, marginX + noListIndent);
  pColon("Daftar Anggota Yang Pindah", "", 60, textListIndent);

  // ttd left
  ttd(695, "left", "", "Pemohon", data.namaLengkapPemohon, "", true);
  // ttd right
  ttd(
    695,
    "right",
    `Margaasih, ${"-"}`,
    "Kepala Desa Margaasih",
    namaKepalaDesa ?? "",
    "",
    true
  );

  // table wni
  await generateTableWni({
    data: data.anggotaPindah,
    page,
    font,
    bold,
    fontSize: 10,
    margin: 20,
    y: 255,
  });

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

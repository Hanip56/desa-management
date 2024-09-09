import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  DateToDayAndDate,
  DatetoTime,
  formatDate,
  getAlamat,
} from "@/lib/utils";
import { SkIjinKeramaian } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import fs from "fs";
import path from "path";

export const generateSkIjinKeramaian = async (
  data: SkIjinKeramaian,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array,
  namaBabinsa?: string,
  pangkatNrpBabinsa?: string,
  namaBhabinkamtibmas?: string,
  pangkatNrpBhabinkamtibmas?: string
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { width, height } = page.getSize();

  // font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

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

  //   Config
  // startLine Paragraph
  const startLine = height - 166;
  const gap = 8;
  const xColon = 175;
  const { p, pJustify, pColon, ttd, title } = generateUtils({
    pdfDoc,
    startLine,
    xColon,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 12,
    lineHeight: 15,
    tte,
  });
  const listImageBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "four-square.png")
  );
  const listImage = await pdfDoc.embedPng(listImageBytes);
  const { width: listImgWidth, height: listImgHeight } = listImage.scale(0.3);

  title("SURAT PENGANTAR KETERANGAN IJIN KERAMAIAN", data.noSurat ?? "");

  //   Content
  pJustify(
    "Pemerintah Desa Margaasih Kecamatan Cicalengka Kabupaten Bandung dalam rangka",
    2,
    true
  );
  p("permohonan izin rame rame dari :", 4);
  pColon(`Nama`, data.nama, 8);
  pColon(`NIK`, data.nik, 10);
  pColon(
    `Tempat, Tgl Lahir`,
    `${data.tempatLahir}, ${formatDate(data.tanggalLahir)}`,
    12
  );
  pColon("Acara", data.acara, 14);
  pColon(
    `Waktu dan Maksud`,
    `${DateToDayAndDate(data.waktu)}, ${data.maksud}`,
    16
  );
  pColon("Pukul", `${DatetoTime(data.waktu)}`, 18);
  pColon("Alamat", data.alamat, 20);

  pJustify(
    "Dengan ini menerangkan bahwa pada prinsipnya tidak keberatan atas permohonan yang",
    25,
    true
  );
  p("bersangkutan dengan ketentuan sebagai berikut :", 27);

  page.drawImage(listImage, {
    y: startLine - 8 * 30,
    x: marginX + 35,
    width: listImgWidth,
    height: listImgHeight,
  });
  pJustify(
    "Pada waktu dilaksanakan rame-rame harus disertai dengan ketentraman dan ketertiban",
    30,
    55
  );
  pJustify(
    "dalam lingkungannya baik hubungan dengan tetangga, menghargai waktu-waktu ibadah",
    32,
    55
  );
  pJustify(
    "dalam menciptakan kerukunan umat beragama maupun kebersihan lingkungan setelah",
    34,
    55
  );
  p("selesai rame-rame.", 36, marginX + 55);

  page.drawImage(listImage, {
    y: startLine - 8 * 38,
    x: marginX + 35,
    width: listImgWidth,
    height: listImgHeight,
  });
  pJustify(
    "Pada waktu dilaksanakan rame-rame tidak dibenarkan/dilarang melakukan hal hal yang",
    38,
    55
  );
  p(
    "bertentangan dengan ketentuan yang berlaku dan adat istiadat bangsa.",
    40,
    marginX + 55
  );

  // ttd right
  ttd(
    535,
    "right",
    undefined,
    "Babinsa Desa Margaasih",
    namaBabinsa ?? "",
    pangkatNrpBabinsa ?? ""
  );

  // ttd left
  ttd(
    535,
    "left",
    undefined,
    "Bhabinkamtibmas Desa Margaasih",
    namaBhabinkamtibmas ?? "",
    pangkatNrpBhabinkamtibmas ?? ""
  );

  // ttd center
  ttd(
    685,
    "center",
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Kepala Desa Margaasih",
    namaKepalaDesa ?? "",
    "",
    true
  );

  const mengetahuiText = "MENGETAHUI :";
  const mengetahiWidthText = font.widthOfTextAtSize(mengetahuiText, 12);
  page.drawText(mengetahuiText, {
    x: width / 2 - mengetahiWidthText / 2,
    y: height - 545,
    font,
    size: 12,
  });

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

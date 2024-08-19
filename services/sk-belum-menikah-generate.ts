import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, getGender } from "@/lib/utils";
import { SkBelumMenikah } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";

export const generateSkBelumMenikah = async (
  data: SkBelumMenikah,
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
  const title = "SURAT KETERANGAN BELUM MENIKAH";
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
    pdfDoc,
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    tte,
  });

  pJustify(
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  p(`Nama Lengkap                       : ${data.namaLengkap}`, 8);
  p(`Nomor Induk Kependudukan : ${data.nik}`, 10);
  p(
    `Tanggal Lahir                         : ${formatDate(data.tanggalLahir)}`,
    12
  );
  p(
    `Jenis Kelamin                         : ${getGender(data.jenisKelamin)}`,
    14
  );
  p(`Agama                                    : ${data.agama}`, 16);
  p(`Pekerjaan                                : ${data.pekerjaan}`, 18);
  p(
    `Status Perkawinan                  : ${data.statusPerkawinan.replace(
      "_",
      " "
    )}`,
    20
  );
  p(`Kewarganegaraan                   : ${data.kewarganegaraan}`, 22);
  p(`alamat                                     : ${data.alamat}`, 24);

  pJustify(
    "Orang tersebut diatas Benar penduduk warga Desa kami, dan menurut keterangan dari",
    28,
    true
  );
  pJustify(
    "RT/RW setempat bahwa orang tersebut sampai dengan dikeluarkannya surat keterangan ini",
    30
  );
  p("benar-benar", 32);
  page.drawText("BELUM PERNAH MENIKAH.", {
    x: marginX + font.widthOfTextAtSize("benar-benar", 13) + 5,
    y: startLine - gap * 32,
    font: bold,
    size: 13,
  });

  pJustify(
    "Demikian surat Keterangan ini kami buat untuk dipergunakan sebagaimana mestinya,",
    35,
    true
  );
  p("atas perhatian dan kerjasamanya kami sampaikan terima kasih.", 37);

  // ttd right
  ttd(
    635,
    "right",
    data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-",
    "Kepala Desa Margaasih",
    namaKepalaDesa ?? "",
    "",
    true
  );

  // ttd left
  ttd(
    635,
    "left",
    `Melihat,`,
    "KUA Cicalengka",
    data.namaKua ?? "_______________"
  );

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

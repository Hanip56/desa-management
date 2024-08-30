import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, getGender, getStatusPerkawinan } from "@/lib/utils";
import { SkUsaha } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";

export const generateSkUsaha = async (
  data: SkUsaha,
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
  const italicBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

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
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
    tte,
  });

  title("SURAT KETERANGAN USAHA", data.noSurat ?? "");

  //   Content
  pJustify(
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama Lengkap`, data.namaLengkap, 8);
  pColon(`NIK`, data.nik, 10);
  pColon(`Tanggal Lahir`, formatDate(data.tanggalLahir), 12);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 14);
  pColon(`Agama`, data.agama, 16);
  pColon(`Pekerjaan`, data.pekerjaan, 18);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 20);
  pColon(`Kewarganegaraan`, data.kewarganegaraan, 22);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 24);

  pJustify(
    "Berdasarkan keterangan Rt/Rw setempat bahwa yang bersangkutan benar pada saat ini",
    29,
    true
  );
  p("memiliki usaha:", 31);

  pColon("Nama Usaha", data.namaUsaha, 34);
  pColon("Alamat Usaha", data.alamatUsaha.replace(/\n/g, " "), 36);

  pJustify(
    "Demikian surat Keterangan ini kami buat untuk dipergunakan sebagaimana mestinya",
    41,
    true
  );
  p("atas perhatian dan kerjasamanya kami haturkan terima kasih.", 43);

  ttd(
    655,
    "right",
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Kepala Desa Margaasih",
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

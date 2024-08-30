import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  formatDate,
  getAlamat,
  getGender,
  getStatusPerkawinan,
} from "@/lib/utils";
import { SkBelumMemilikiRumah } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";

export const generateSkBelumMemilikiRumah = async (
  data: SkBelumMemilikiRumah,
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
    xColon: 220,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
    tte,
  });

  title("SURAT KETERANGAN BELUM MEMILIKI RUMAH", data.noSurat ?? "");

  //   Content
  pJustify(
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama Lengkap`, data.namaLengkap, 8);
  pColon(`Nomor Induk Kependudukan`, data.nik, 10);
  pColon(`Tanggal Lahir`, formatDate(data.tanggalLahir), 12);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 14);
  pColon(`Agama`, data.agama, 16);
  pColon(`Pekerjaan`, data.pekerjaan, 18);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 20);
  pColon(`Kewarganegaraan`, data.kewarganegaraan, 22);
  pColon(`Alamat`, `${getAlamat(data.kampung, data.rt, data.rw)}`, 24);

  pJustify(
    "Orang tersebut diatas Benar penduduk warga Desa kami dan menurut keterangan dari",
    28,
    true
  );
  pJustify(
    "RT RW setempat bahwa orang tersebut benar-benar belum memiliki rumah atau tempat",
    30
  );
  p("tinggal.", 32);

  page.drawText(`KEPERLUAN : ${data.keperluan}`, {
    x: marginX + 50,
    y: startLine - gap * 35,
    size: 13,
    font: italicBold,
    maxWidth: width - 2 * (marginX + 50),
  });

  pJustify(
    "Demikian surat keterangan ini kami buat untuk dipergunakan sebagaimana mestinya,",
    38,
    true
  );
  p("atas perhatian dan kerjasamanya kami sampaikan terima kasih.", 40);

  // ttd center
  ttd(
    635,
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

import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, getGender, getStatusPerkawinan } from "@/lib/utils";
import { SkDomisiliSementara } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

export const generateSkDomisiliSementara = async (
  data: SkDomisiliSementara,
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

  // Config
  //   startLine paragraph
  const startLine = height - 166;
  const gap = 10;
  const indent = 30;
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

  title("SURAT KETERANGAN DOMISILI", data.noSurat ?? "");

  //   Content
  pJustify(
    `Yang bertanda tangan di bawah ini pemerintah Desa ${NAMA_DESA} Kecamatan Cicalengka`,
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama Lengkap`, data.namaLengkap, 7);
  pColon(`NIK`, data.nik, 9);
  pColon(`Tanggal Lahir`, formatDate(data.tanggalLahir), 11);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 13);
  pColon(`Agama`, data.agama, 15);
  pColon(`Pekerjaan`, data.pekerjaan, 17);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 19);
  pColon(`Kewarganegaraan`, data.kewarganegaraan, 21);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 23);

  pJustify(
    "Orang tersebut diatas adalah benar penduduk sementara warga Desa kami, dan",
    28,
    true
  );
  pJustify(
    "berdasarkan keterangan RT/RW setempat bahwa orang tersebut sampai dengan dikeluarkannya",
    30
  );
  p(
    `surat keterangan ini benar-benar BERDOMISILI di alamat ${data.domisiliSementara.replace(
      /\n/g,
      " "
    )}.`,
    32
  );

  pJustify(
    "Demikian surat keterangan Domisili ini kami buat dengan sebenar-benarnya, dan untuk",
    37,
    true
  );
  p("dipergunakan dengan semestinya.", 39);

  ttd(
    635,
    "right",
    `${NAMA_DESA}, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    `Kepala Desa ${NAMA_DESA}`,
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

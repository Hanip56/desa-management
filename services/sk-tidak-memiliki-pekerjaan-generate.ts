import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  formatDate,
  getAlamat,
  getGender,
  getStatusPerkawinan,
} from "@/lib/utils";
import { SkTidakMemilikiPekerjaan } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

export const generateSkTidakMemilikiPekerjaan = async (
  data: SkTidakMemilikiPekerjaan,
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

  title("SURAT KETERANGAN TIDAK MEMILIKI PEKERJAAN", data.noSurat ?? "");

  //   Content
  pJustify(
    `Yang bertanda tangan di bawah ini pemerintah Desa ${NAMA_DESA} Kecamatan Cicalengka`,
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama`, data.nama, 8);
  pColon(`No. NIK`, data.nik, 10);
  pColon(`No. KK`, data.noKk, 12);
  pColon(
    `Tempat/Tgl Lahir`,
    `${data.tempatLahir}, ${formatDate(data.tanggalLahir)}`,
    14
  );
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 16);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 18);
  pColon(`Pekerjaan`, data.pekerjaan, 20);
  pColon(`Agama`, data.agama, 22);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 24);

  pJustify(
    "Orang tersebut diatas Benar penduduk warga Desa kami dan menurut keterangan dari",
    29,
    true
  );
  pJustify(
    "RT RW setempat bahwa orang tersebut sampai dikeluarkannya surat keterangan ini",
    31
  );
  p("benar-benar tidak memiliki pekerjaan.", 33);

  pJustify(
    "Demikian surat keterangan ini kami buat dengan keadaan yang sebenarnya agar dapat,",
    36,
    true
  );
  p("dipergunakan dengan sebagaimana mestinya.", 38);

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

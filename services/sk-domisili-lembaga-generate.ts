import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate } from "@/lib/utils";
import { SkDomisiliLembaga } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

export const generateSkDomisiliLembaga = async (
  data: SkDomisiliLembaga,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size (595x842 points)
  const { height } = page.getSize();

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

  title("SURAT KETERANGAN DOMISILI LEMBAGA", data.noSurat ?? "");

  //   Content
  pJustify(
    `Yang bertanda tangan di bawah ini pemerintah Desa ${NAMA_DESA} Kecamatan Cicalengka`,
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama`, data.nama, 7);
  pColon(
    `Tempat Tanggal Lahir`,
    `${data.tempatLahir}, ${formatDate(data.tanggalLahir)}`,
    9
  );
  pColon(`Jabatan`, data.jabatan, 11);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 13);

  pJustify(
    "Orang tersebut adalah benar memiliki lembaga yang berdomisili di wilayah Desa",
    18,
    true
  );
  p(`${NAMA_DESA} dengan keterangan sebagai berikut :`, 20);

  pColon("Nama Lembaga", data.namaLembaga, 23);
  pColon("Alamat Lembaga", data.alamatLembaga.replace(/\n/g, " "), 25);

  pJustify(
    "Demikian surat keterangan ini kami buat dan untuk dipergunakan sebagaimana mestinya.",
    30,
    true
  );

  ttd(
    635,
    "right",
    `${NAMA_DESA}, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    "Kepala Desa ${NAMA_DESA}",
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

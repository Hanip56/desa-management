import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, getGender, getRangeDays } from "@/lib/utils";
import { SkIzinBekerja } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";
import { NAMA_DESA } from "@/contants";

export const generateSkIzinBekerja = async (
  data: SkIzinBekerja,
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
    xColon: 220,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 13,
    lineHeight: 19,
    tte,
  });

  title("SURAT KETERANGAN IZIN BEKERJA", data.noSurat ?? "");

  //   Content
  pJustify(
    `Yang bertanda tangan di bawah ini pemerintah Desa ${NAMA_DESA} Kecamatan Cicalengka`,
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
  pColon(`Bagian`, data.bagian, 20);
  pColon(`Nomor ID`, data.nomorId, 22);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 24);

  pJustify(
    "Sesuai dengan nama yang tertera diatas adalah benar bahwa orang tersebut",
    29,
    true
  );
  pJustify(
    "adalah warga Desa kami, dan surat keterangan ini dibuat untuk keperluan izin tidak",
    31
  );
  p(
    "masuk kerja di " +
      data.tempatKerja +
      " selama " +
      getRangeDays(data.izinDariHari, data.izinSampaiHari).number +
      " hari yaitu pada tanggal " +
      getRangeDays(data.izinDariHari, data.izinSampaiHari).text +
      ", izin kerja dikarenakan " +
      data.alasan +
      ".",
    33
  );
  pJustify(
    "Demikian surat keterangan ini kami buat untuk dipergunakan sebagaimana",
    39,
    true
  );
  p(
    "mestinya, atas perhatian dan kerjasamanya kami sampaikan terima kasih.",
    41
  );

  // ttd center
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

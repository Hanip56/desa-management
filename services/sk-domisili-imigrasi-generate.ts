import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, getGender, getStatusPerkawinan } from "@/lib/utils";
import { SkDomisiliImigrasi } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";

export const generateSkDomisiliImigrasi = async (
  data: SkDomisiliImigrasi,
  dataCb: (chunk: Uint8Array) => void,
  endCb: () => void,
  namaKepalaDesa?: string,
  tte?: Uint8Array,
  namaCamat?: string | null
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
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
    2,
    true
  );
  p("Kabupaten Bandung, menerangkan dengan sebenarnya bahwa :", 4);
  pColon(`Nama Lengkap`, data.namaLengkap, 7);
  pColon(`Tanggal Lahir`, formatDate(data.tanggalLahir), 9);
  pColon(`Jenis Kelamin`, getGender(data.jenisKelamin), 11);
  pColon(`Agama`, data.agama, 13);
  pColon(`Pekerjaan`, data.pekerjaan, 15);
  pColon(`Status Perkawinan`, getStatusPerkawinan(data.statusPerkawinan), 17);
  pColon(`Kewarganegaraan`, data.kewarganegaraan, 19);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 21);

  p("Menurut pengamatan kami beserta keterangan kami", 26);

  p("-", 29, marginX + indent);
  p("Kementrian Hukum dan", 29, marginX + indent + 10);

  page.drawText("RI DIREKTORAT JENDRAL IMIGRASI", {
    x:
      marginX +
      indent +
      10 +
      font.widthOfTextAtSize("Kementrian Hukum dan", 13) +
      5,
    y: startLine - gap * 29,
    size: 13,
    font: bold,
    maxWidth: width - 2 * marginX,
  });

  pJustify(
    "Bahwa nama orang tersebut diatas pada saat ini berdomisili dialamat tersebut diatas.",
    32,
    indent + 10
  );
  p(
    `Surat keterangan ini diperlukan untuk melengkapi persyaratan ${data.keperluan}`,
    34
  );

  pJustify(
    "Demikian surat keterangan ini kami buat dengan sebenar-benarnya, agar pihak yang",
    39,
    indent + 10
  );
  p("berkepentingan menjadi tahu dan untuk dijadikan bahan seperlunya.", 41);

  ttd(
    635,
    "left",
    `Melihat:`,
    "Camat Cicalengka",
    namaCamat ?? "_________________",
    ""
  );

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

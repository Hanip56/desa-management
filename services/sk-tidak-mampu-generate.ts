import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate } from "@/lib/utils";
import { SkTidakMampu } from "@prisma/client";
import { generateKopSurat, generateUtils } from "./utils";

export const generateSkTidakMampu = async (
  data: SkTidakMampu,
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
  const gap = 8.5;
  const indent = 30;
  const { p, pJustify, pColon, ttd, title } = generateUtils({
    pdfDoc,
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    fontSize: 12,
    tte,
  });

  title("SURAT KETERANGAN TIDAK MAMPU", data.noSurat ?? "");

  //   Content
  pJustify(
    "Yang bertanda tangan di bawah ini pemerintah Desa Margaasih Kecamatan Cicalengka",
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
  pColon(`NO NIK`, data.nik, 11);
  pColon(`NO KK`, data.noKk, 13);
  pColon(`Pekerjaan`, data.pekerjaan, 15);
  pColon(`Alamat`, data.alamat.replace(/\n/g, " "), 17);

  p("Adalah benar anak dari :", 22);
  pColon(`Nama`, data.namaOrangTua, 25);
  pColon(
    `Tempat Tanggal Lahir`,
    `${data.tempatLahirOrangTua}, ${formatDate(data.tanggalLahirOrangTua)}`,
    27
  );
  pColon(`NO NIK`, data.nikOrangTua, 29);
  pColon(`Pekerjaan`, data.pekerjaanOrangTua, 31);
  pColon(`Alamat`, data.alamatOrangTua, 33);

  pJustify(
    "Berdasarkan surat keterangan dari RT RW setempat dan data yang ada di kantor kami bahwa",
    38,
    true
  );
  pJustify(
    "keluarga tersebut diatas adalah benar-benar tergolong keluarga tidak mampu/ pemerlu pelayanan",
    40
  );
  pJustify(
    "kesejahteraan sosial (PPKS) dan surat keterangan ini akan dipergunakan untuk melengkapi persyaratan",
    42
  );
  p(`${data.keperluan}.`, 44);

  pJustify(
    "Demikian surat keterangan ini kami buat dengan sebenar-benarnya agar pihak yang",
    47,
    true
  );
  pJustify(
    "berkepentingan menjadikan bahan pertimbangan selanjutnya sesuai dengan peraturan perundang-",
    49
  );
  p("undangan yang berlaku.", 51);

  ttd(
    660,
    "left",
    `No. Reg. ${data.noRegCamat ?? "......................."}`,
    "Camat Cicalengka",
    "",
    "",
    true
  );

  p("Melihat,", 58, marginX + 103);

  ttd(
    660,
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

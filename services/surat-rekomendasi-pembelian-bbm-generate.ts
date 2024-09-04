import { PDFDocument, StandardFonts } from "pdf-lib";
import { generateKopSurat, generateTableBbm, generateUtils } from "./utils";
import { SuratRekomendasiPembelianBbm } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const generateSuratRekomendasiPembelianBbm = async (
  data: SuratRekomendasiPembelianBbm,
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
  const startLine = height - 150;
  const gap = 6;
  const { p, pColon, ttd, title } = generateUtils({
    pdfDoc,
    startLine,
    font,
    bold,
    gap,
    marginX,
    page,
    lineHeight: 12,
    fontSize: 9.5,
    tte,
  });

  title(
    "SURAT REKOMENDASI PEMBELIAN JENIS BBM TERTENTU",
    data.noSurat ?? "",
    height - 130,
    11
  );

  //   Content
  p("Dasar hukum", 2);

  const noListIndent = marginX + 20;
  const textListIndent = marginX + 35;

  p("1.", 4, noListIndent);
  p(
    "Undang-undang No 22 Tahun 2001 tentang Minyak dan Gas Bumi",
    4,
    textListIndent
  );

  p("2.", 6, noListIndent);
  p(
    "Undang-undang No 23 Tahun 2014 tentang Pemerintahan Daerah",
    6,
    textListIndent
  );

  p("3.", 8, noListIndent);
  p(
    "Peraturan Presiden No 101 tahun 2014 tentang penyediaan, pendistribusian dan harga eceran",
    8,
    textListIndent
  );

  p(
    "Bahan bakar minyak sebagaimana telah diubah dengan peraturan presiden No 43 Tahun 2018 tentang perubahan atas",
    10,
    textListIndent
  );

  p(
    "peraturan presiden No 191 Tahun 2014 tentang penyediaan, pendistribusian dan harga jual eceran bahan bakar minyak",
    12,
    textListIndent
  );

  p("4.", 14, noListIndent);
  p(
    "Peraturan badan pengaturan hilir minyak dan gas bumi No 2 Tahun 2023 tentang penerbitan surat",
    14,
    textListIndent
  );

  p(
    "Rekomendasi untuk pembelian jenis bahan bakar minyak tertentu dan jenis bahan minyak khusus.",
    16,
    textListIndent
  );

  p("Penugasan:", 18, textListIndent);

  p("Dengan ini memberikan rekomendasi kepada :", 20);

  pColon("Nama", data.nama, 23, 35);
  pColon("Konsumen pengguna", data.konsumenPengguna, 25, 35);
  pColon("Jenis Usaha Kegiatan", data.jenisUsahaKegiatan, 27, 35);
  pColon("NIK", data.nik, 29, 35);
  pColon("Alamat Usaha", data.alamatUsaha, 31, 35);

  p("1.", 36, noListIndent);
  p(
    "Berdasarkan hasil verifikasi dan surat pengantar dari Rt/Rw kebutuhan BBM digunakan untuk sarana sebagai berikut.",
    36,
    textListIndent
  );

  const { tabbleEndY } = await generateTableBbm({
    data,
    page,
    font,
    fontSize: 9,
    margin: 20,
    y: startLine - gap * 44,
  });

  const { p: p2, pColon: pColon2 } = generateUtils({
    pdfDoc,
    startLine: tabbleEndY,
    xColon: 185,
    font,
    bold,
    gap,
    marginX,
    page,
    lineHeight: 15,
    fontSize: 9.5,
  });

  p2("2.", 4, noListIndent);
  p2(
    "Diberikan jenis BBM tertentu jenis minyak solar (gas oil)",
    4,
    textListIndent
  );

  //
  const numIndentDot = 35 + 20 * 2; // or  textListIndent + 25

  p2("•", 6.1, textListIndent + 25);
  pColon2("Alokasi Volume", data.alokasiVolume ?? "", 6, numIndentDot);

  p2("•", 8.1, textListIndent + 25);
  pColon2("Tempat Pengambilan", data.tempatPengambilan ?? "", 8, numIndentDot);

  p2("•", 10.1, textListIndent + 25);
  pColon2(
    "Nomor Lembaga Penyalur",
    data.nomorLembagaPenyalur ?? "",
    10,
    numIndentDot
  );

  p2("•", 12.1, textListIndent + 25);
  pColon2("Lokasi", data.lokasi ?? "", 12, numIndentDot);

  p2("•", 14.1, textListIndent + 25);
  pColon2(
    "Alat pembelian digunakan",
    data.alatPembelianDigunakan ?? "",
    14,
    numIndentDot
  );

  p2("•", 16.1, textListIndent + 25);
  pColon2(
    "Masa berlaku surat rekomendasi",
    data.masaBerlakuRekomendasi ? formatDate(data.masaBerlakuRekomendasi) : "",
    16,
    numIndentDot
  );
  //

  //
  p2("3.", 19, noListIndent);
  p2(
    "Penyalur SPBU wajib mencatat riwayat pembelian konsumen pengguna.",
    19,
    textListIndent
  );

  p2("4.", 21, noListIndent);
  p2(
    "Surat rekomendasi ini hanya berlaku perorangan sesuai dengan identitas pemohon surat rekomendasi.",
    21,
    textListIndent
  );

  p2("5.", 23, noListIndent);
  p2(
    "Surat rekomendasi ini di larang untuk diberikan, dipindah tangankan atau dialihkan kepada pihak lain.",
    23,
    textListIndent
  );

  p2("6.", 25, noListIndent);
  p2(
    "Jenis BBM tertentu atau jenis BBM Khusus penugasan yang diperoleh tidak diperjualbelikan kembali.",
    25,
    textListIndent
  );

  p2("7.", 27, noListIndent);
  p2(
    "Apabila pengguna surat rekomendasi ini tidak sesuai sebagai mana mestinya, maka akan di cabut dan akan ditindaklanjuti",
    27,
    textListIndent
  );
  p2(
    "dengan proses hukum sesuai dengan ketentuan dan perundang-undangan.",
    29,
    textListIndent
  );

  p2("8.", 31, noListIndent);
  p2(
    "Surat Rekomendasi ini Beserta Lampiran nya harus di lampirkan kembali saat perpanjangan atau pengajuan ulang",
    31,
    textListIndent
  );
  p2("permohonan surat rekomendasi.", 33, textListIndent);
  //

  ttd(
    700,
    "right",
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : ""
    }`,
    "Kepala Desa Margaasih",
    namaKepalaDesa,
    "",
    true
  );

  // Save the document and get the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Write PDF bytes to stream
  dataCb(pdfBytes);
  endCb();
};

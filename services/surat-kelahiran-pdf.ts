import { formatDate, getGender } from "@/lib/utils";
import { SuratKelahiran } from "@prisma/client";
import PDFDocument from "pdfkit";

export const generateSuratKelahiranPdf = (
  data: SuratKelahiran,
  dataCb: (chunk: any) => void,
  endCb: () => void
) => {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      bottom: 30,
      top: 30,
      left: 60,
      right: 60,
    },
  });
  doc.on("data", dataCb);
  doc.on("end", endCb);

  // Set the font
  doc.font("Times-Roman");

  //   Content here...

  // Title
  doc.font("Times-Bold").fontSize(15);
  doc.text("SURAT KELAHIRAN", {
    align: "center",
    underline: true,
  });

  doc.font("Times-Roman");
  doc.text(`No: ${data.noSurat}`, {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(13);
  doc.text(
    "Yang bertanda tangan dibawah ini Kepala Desa Margaasih menerangkan bahwa :",
    {
      width: 480,
    }
  );

  doc.moveDown();

  doc.text(`Nama                   : ${data.namaTerkait}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(`Jenis Kelamin      : ${getGender(data.jenisKelaminTerkait)}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(
    `Tempat/tgl lahir   : ${data.tempatLahirTerkait}, ${formatDate(
      data.tanggalLahirTerkait
    )}`,
    {
      width: 480,
      lineGap: 2,
    }
  );
  doc.text(`Alamat                 : ${data.alamatTerkait}`, {
    width: 480,
    lineGap: 2,
  });

  doc.moveDown(2);

  doc.text("Adalah benar Anak dari :", {
    width: 480,
  });

  doc.moveDown();

  doc.text(`Nama Ayah          : ${data.namaAyah}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(`Jenis Kelamin      : ${getGender(data.jenisKelaminAyah)}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(
    `Tempat/tgl lahir   : ${data.tempatLahirAyah}, ${formatDate(
      data.tanggalLahirAyah
    )}`,
    {
      width: 480,
      lineGap: 2,
    }
  );
  doc.text(`Agama                 : ${data.agamaAyah}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(`Alamat                 : ${data.alamatAyah}`, {
    width: 480,
    lineGap: 2,
  });

  doc.moveDown(2);

  doc.text(`Nama                   : ${data.namaIbu}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(`Jenis Kelamin      : ${getGender(data.jenisKelaminIbu)}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(
    `Tempat/tgl lahir   : ${data.tempatLahirIbu}, ${formatDate(
      data.tanggalLahirIbu
    )}`,
    {
      width: 480,
      lineGap: 2,
    }
  );
  doc.text(`Agama                 : ${data.agamaIbu}`, {
    width: 480,
    lineGap: 2,
  });
  doc.text(`Alamat                 : ${data.alamatIbu}`, {
    width: 480,
    lineGap: 2,
  });

  doc.moveDown(3);

  doc.text(
    "Demikian Surat Keterangan Kelahiran ini kami buat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.",
    {
      indent: 40,
      width: 480,
      lineGap: 2,
    }
  );

  doc.moveDown(3);

  doc.text(
    `Margaasih, ${
      data.tanggalPembuatan ? formatDate(data.tanggalPembuatan) : "-"
    }`,
    doc.page.width / 2,
    doc.page.height - doc.page.height / 3.2,
    {
      width: 250,
      align: "center",
    }
  );
  doc.text(
    "Kepala Desa Margaasih",
    doc.page.width / 2,
    doc.page.height - doc.page.height / 3.2 + 17,
    {
      width: 250,
      align: "center",
    }
  );

  doc.moveDown(4);

  doc.text(
    "tte",
    doc.page.width / 2,
    doc.page.height - doc.page.height / 3.2 + 90,
    {
      width: 250,
      align: "center",
    }
  );

  // draw bounding rectangle
  doc.rect(50, 20, 500, 800).stroke();

  doc.end();
};

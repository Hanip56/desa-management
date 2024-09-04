import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import path from "path";
import fs from "fs";
import { AnggotaPindahWni, SuratRekomendasiPembelianBbm } from "@prisma/client";
import { formatDate } from "@/lib/utils";

type GenerateKopSuratProps = {
  pdfDoc: PDFDocument;
  page: PDFPage;
  marginX: number;
  marginY: number;
  font: PDFFont;
};

type GenerateUtils = {
  pdfDoc: PDFDocument;
  page: PDFPage;
  marginX: number;
  font: PDFFont;
  bold: PDFFont;
  startLine: number;
  xColon?: number;
  gap: number;
  fontSize?: number;
  lineHeight?: number;
  tte?: Uint8Array | null;
};

export const generateUtils = ({
  pdfDoc,
  font,
  bold,
  gap,
  marginX,
  page,
  startLine,
  xColon = 175,
  fontSize = 13,
  lineHeight = 20,
  tte,
}: GenerateUtils) => {
  const { width, height } = page.getSize();

  const title = (
    title: string,
    nomor: string,
    y?: number,
    fontSize: number = 14
  ) => {
    const titleWidth = bold.widthOfTextAtSize(title, fontSize);
    const titleX = width / 2 - titleWidth / 2;
    const titleY = y ?? height - 140;

    page.drawText(title, {
      x: titleX,
      y: titleY,
      size: fontSize,
      font: bold,
    });

    page.drawLine({
      start: { x: titleX, y: titleY - 3 },
      end: { x: titleX + titleWidth, y: titleY - 3 },
      thickness: 1,
    });

    const No = `Nomor: ${nomor}`;
    const NoWidth = font.widthOfTextAtSize(No, 11);
    page.drawText(No, {
      x: width / 2 - NoWidth / 2,
      y: titleY - 16,
      size: 11,
      font: font,
    });
  };

  const p = (
    content: string,
    indexY: number = 0,
    x?: number,
    fontP: PDFFont = font
  ) => {
    page.drawText(content, {
      x: x ?? marginX,
      y: startLine - gap * indexY,
      size: fontSize,
      font: fontP,
      maxWidth: width - 2 * marginX,
      lineHeight,
    });
  };

  const pColon = (
    label: string,
    value: string,
    indexY: number,
    indent: number = 0,
    xPColon: number = xColon
  ) => {
    p(label, indexY, marginX + indent);
    p(`: `, indexY, xPColon + indent);
    page.drawText(value, {
      x: xPColon + indent + 7,
      y: startLine - gap * indexY,
      size: fontSize,
      font: font,
      maxWidth: width - marginX - xPColon - indent - 5,
      lineHeight,
    });
  };

  const pJustify = (
    content: string,
    indexY: number = 0,
    indent: boolean | number = false
  ) => {
    const words = content.split(" ");
    const wordsWidth = words.reduce(
      (acc, cur) => acc + font.widthOfTextAtSize(cur, fontSize),
      0
    );
    const indentGap =
      typeof indent === "number" ? indent : indent === true ? 30 : 0;

    const lineWidth = width - 2 * marginX - indentGap;

    const totalSpace = lineWidth - wordsWidth;
    const spaceBetweenWord = totalSpace / (words.length - 1);

    let indexX = marginX + indentGap;
    words.forEach((word) => {
      p(word, indexY, indexX);

      indexX += font.widthOfTextAtSize(word, fontSize) + spaceBetweenWord;
    });
  };

  const ttd = (
    y: number,
    direction: "left" | "center" | "right",
    line1?: string,
    line2?: string,
    line3?: string,
    line4?: string,
    withTtd?: boolean
  ) => {
    const boxWidth = 250;
    const boxHeight = 140;
    const boxX =
      direction === "left"
        ? marginX
        : direction === "right"
        ? width - marginX - boxWidth
        : width / 2 - boxWidth / 2;
    const boxY = height - boxHeight - y;

    page.drawRectangle({
      x: boxX,
      y: boxY,
      height: boxHeight,
      width: boxWidth,
      color: rgb(1, 1, 1),
    });

    if (line1) {
      const text1 = line1;
      const text1Width = font.widthOfTextAtSize(text1, fontSize);

      page.drawText(text1, {
        x: boxX + boxWidth / 2 - text1Width / 2,
        y: boxY + boxHeight - fontSize * 2,
        size: fontSize,
        font: font,
        lineHeight,
      });
    }

    if (line2) {
      const text2 = line2;
      const text2Width = font.widthOfTextAtSize(text2, fontSize);
      page.drawText(text2, {
        x: boxX + boxWidth / 2 - text2Width / 2,
        y: boxY + boxHeight - fontSize * 3.5,
        size: fontSize,
        font: font,
        lineHeight,
      });
    }

    if (line3) {
      const text3 = line3;
      const text3Width = bold.widthOfTextAtSize(text3, fontSize - 1);
      page.drawText(text3, {
        x: boxX + boxWidth / 2 - text3Width / 2,
        y: boxY + boxHeight - fontSize * 10,
        size: fontSize - 1,
        font: bold,
        lineHeight,
      });
      // underline
      page.drawLine({
        start: {
          x: boxX + boxWidth / 2 - text3Width / 2,
          y: boxY + boxHeight - fontSize * 10 - 3,
        },
        end: {
          x: boxX + boxWidth / 2 - text3Width / 2 + text3Width,
          y: boxY + boxHeight - fontSize * 10 - 3,
        },
      });
    }

    if (line4) {
      const text4 = line4;
      const text4Width = bold.widthOfTextAtSize(text4, fontSize - 1);
      page.drawText(text4, {
        x: boxX + boxWidth / 2 - text4Width / 2,
        y: boxY + boxHeight - fontSize * 11.4,
        size: fontSize - 1,
        font: bold,
      });
    }

    if (withTtd) {
      const createTtdImage = async () => {
        if (!tte) return;
        // const destPath = path.join(process.cwd(), "public", "qrDB.png");
        // fs.writeFileSync(destPath, tte);

        // const imagePath = path.join(process.cwd(), "public", "ttd-qr.png");
        // const imageBytes = fs.readFileSync(imagePath);
        const ttdImage = await pdfDoc.embedPng(tte);
        const ttdSize = fontSize * 4;

        page.drawImage(ttdImage, {
          x: boxX + boxWidth / 2 - ttdSize / 2,
          y: boxY + boxHeight - fontSize * 8.5,
          width: ttdSize,
          height: ttdSize,
        });
      };

      createTtdImage();
    }
  };

  return { p, pJustify, ttd, title, pColon };
};

export const generateKopSurat = async ({
  pdfDoc,
  page,
  marginX,
  marginY,
  font,
}: GenerateKopSuratProps) => {
  const { width, height } = page.getSize();

  const imagePath = path.join(process.cwd(), "public", "logo-desa.png");
  const imageBytes = fs.readFileSync(imagePath);
  const image = await pdfDoc.embedPng(imageBytes);
  const { width: imgWidth, height: imgHeight } = image.scale(0.2);
  page.drawImage(image, {
    x: 55,
    y: height - imgHeight - marginY,
    width: imgWidth,
    height: imgHeight,
  });

  //   Config title Kop
  const titleBoxWidth = (width * 2) / 3;
  const titleBoxHeight = 75;
  const titleBoxX = width - titleBoxWidth - marginX;
  const titleBoxY = height - titleBoxHeight - marginY;

  page.drawRectangle({
    x: titleBoxX,
    y: titleBoxY,
    width: titleBoxWidth,
    height: titleBoxHeight,
    color: rgb(1, 1, 1),
  });

  const titleFontSize = 17;
  const t1 = `PEMERINTAHAN KABUPATEN BANDUNG`;
  const t1Width = font.widthOfTextAtSize(t1, titleFontSize);

  page.drawText(t1, {
    x: titleBoxX + titleBoxWidth / 2 - t1Width / 2,
    y: titleBoxY + titleBoxHeight - 10,
    size: titleFontSize,
    font: font,
  });

  const t2 = `KECAMATAN CICALENGKA`;
  const t2Width = font.widthOfTextAtSize(t2, titleFontSize);

  page.drawText(t2, {
    x: titleBoxX + titleBoxWidth / 2 - t2Width / 2,
    y: titleBoxY + titleBoxHeight - 30,
    size: titleFontSize,
    font: font,
  });

  const t3 = `DESA MARGAASIH`;
  const t3Width = font.widthOfTextAtSize(t3, 22);

  page.drawText(t3, {
    x: titleBoxX + titleBoxWidth / 2 - t3Width / 2,
    y: titleBoxY + titleBoxHeight - 55,
    size: 22,
    font: font,
    lineHeight: 15,
  });

  const t4 = `Jl. Margaasih No. 24 Kec. Cicalengka Kab. Bandung, 40395`;
  const t4Width = font.widthOfTextAtSize(t4, 12);

  page.drawText(t4, {
    x: titleBoxX + titleBoxWidth / 2 - t4Width / 2,
    y: titleBoxY + titleBoxHeight - 70,
    size: 12,
    font: font,
    lineHeight: 15,
  });

  page.drawLine({
    start: { x: marginX, y: titleBoxY - 5 },
    end: { x: width - marginX, y: titleBoxY - 5 },
    thickness: 2,
  });
};

type GenerateTableBbm = {
  data: SuratRekomendasiPembelianBbm;
  page: PDFPage;
  margin: number;
  fontSize: number;
  font: PDFFont;
  y: number;
};

export const generateTableBbm = async ({
  data,
  page,
  margin,
  fontSize,
  font,
  y,
}: GenerateTableBbm) => {
  const tableTop = y;
  const cellPadding = 5;
  const numberOfRows = 3;
  const numberOfColumns = 6;
  const getWidth = (percent: number) =>
    ((page.getWidth() - margin * 2) * percent) / 100;
  const cellWidths = [5, 15, 10, 25, 15, 30].map((v) => getWidth(v));

  // row 0
  const titleColHeight = 35;
  const titleColContent = [
    ["NO"],
    ["JENIS ALAT"],
    ["JUMLAH", "ALAT"],
    ["FUNGSI ALAT"],
    ["JAM OPERASI"],
    ["KONSUMSI JENIS BBM TERTENTU", "LITER PER (HARI/MINGGU/BULAN)"],
  ];

  // row 1 = cell/data/content Config
  const cellFontSize = 10;
  const cellContent = [
    "1",
    data.jenisAlat, // in frontend max Length should be 10
    data.jumlahAlat.toString(),
    data.fungsiAlat, // this max length 20
    data.jamOperasi,
    data.konsumsi,
  ];

  // search the maximum row of cellContent
  const maxRow = cellContent.reduce((result, current, i) => {
    const currentRow = Math.ceil(
      font.widthOfTextAtSize(current, cellFontSize) /
        (cellWidths[i] - cellPadding * 4)
    );
    if (result < currentRow) {
      result = currentRow;
    }
    return result;
  }, 0);

  // times it with fontSize * 1.8 for each text-row
  const cellHeight = cellFontSize * 1.8 * maxRow;

  // row 2 = footer
  const footerHeight = cellFontSize * 1.9;
  const footerWidths = [55, 15, 30].map((v) => getWidth(v));
  const footerContent = ["JUMLAH", data.jamOperasi, data.konsumsi];

  // Draw table cells
  for (let row = 0; row < numberOfRows; row++) {
    // title column generate
    if (row === 0) {
      for (let col = 0; col < numberOfColumns; col++) {
        const x =
          margin +
          [0, ...cellWidths]
            .filter((w, i) => i <= col)
            .reduce((acc, cur) => acc + cur);
        const y = tableTop - row * titleColHeight;

        // Draw cell border
        page.drawRectangle({
          x,
          y,
          width: cellWidths[col],
          height: titleColHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        const textGap = 13;

        titleColContent[col].forEach((val, i) => {
          // Add text to cell
          page.drawText(val, {
            x:
              x +
              cellWidths[col] / 2 -
              font.widthOfTextAtSize(val, fontSize) / 2,
            y: y + titleColHeight - fontSize - cellPadding - textGap * i,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        });
      }
    }
    // data/cell column generate
    if (row === 1) {
      for (let col = 0; col < numberOfColumns; col++) {
        const x =
          margin +
          [0, ...cellWidths]
            .filter((w, i) => i <= col)
            .reduce((acc, cur) => acc + cur);
        const y = tableTop - row * cellHeight;

        // Draw cell border
        page.drawRectangle({
          x,
          y,
          width: cellWidths[col],
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        // Add text to cell
        page.drawText(cellContent[col], {
          x:
            col > 3 || col === 2
              ? x +
                cellWidths[col] / 2 -
                font.widthOfTextAtSize(cellContent[col], cellFontSize) / 2
              : x + cellPadding,
          y: y + cellHeight - cellFontSize - cellPadding / 2,
          size: cellFontSize,
          font,
          color: rgb(0, 0, 0),
          maxWidth: cellWidths[col] - cellPadding * 2,
          lineHeight: 15,
        });
      }
    }

    // footer column generate
    if (row === 2) {
      for (let col = 0; col < 3; col++) {
        const x =
          margin +
          [0, ...footerWidths]
            .filter((w, i) => i <= col)
            .reduce((acc, cur) => acc + cur);
        const y = tableTop - cellHeight - footerHeight;

        // Draw cell border
        page.drawRectangle({
          x,
          y,
          width: footerWidths[col],
          height: footerHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        // Add text to cell
        page.drawText(footerContent[col], {
          x:
            x +
            footerWidths[col] / 2 -
            font.widthOfTextAtSize(footerContent[col], cellFontSize) / 2,

          y: y + footerHeight - cellFontSize - cellPadding / 2,
          size: cellFontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  return { tabbleEndY: tableTop - cellHeight - footerHeight };
};

type GenerateTableWni = {
  data: AnggotaPindahWni[];
  page: PDFPage;
  margin: number;
  fontSize: number;
  font: PDFFont;
  bold: PDFFont;
  y: number;
};

export const generateTableWni = async ({
  data,
  page,
  margin,
  fontSize,
  font,
  bold,
  y,
}: GenerateTableWni) => {
  const tableTop = y;
  const cellPadding = 5;
  const numberOfColumns = 5;
  const getWidth = (percent: number) =>
    ((page.getWidth() - margin * 2) * percent) / 100;
  const cellWidths = [5, 20, 35, 22, 18].map((v) => getWidth(v));

  // row 0
  const titleColHeight = 35;
  const titleColContent = [
    ["NO"],
    ["NIK"],
    ["NAMA LENGKAP"],
    ["MASA BERLAKU KTP", "sd"],
    ["SHDK"],
  ];

  // row !== 0
  const cellHeight = 20;
  const cellContents = data.map((d, i) => [
    (i + 1).toString(),
    d.nik,
    d.namaLengkap,
    formatDate(d.masaBerlakuKtp),
    d.shdk,
  ]);
  const numberOfRows = cellContents.length + 1;

  // Draw table cells
  for (let row = 0; row < numberOfRows; row++) {
    // title column generate
    if (row === 0) {
      for (let col = 0; col < numberOfColumns; col++) {
        const x =
          margin +
          [0, ...cellWidths]
            .filter((w, i) => i <= col)
            .reduce((acc, cur) => acc + cur);
        const y = tableTop - row * titleColHeight;

        // Draw cell border
        page.drawRectangle({
          x,
          y,
          width: cellWidths[col],
          height: titleColHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        const textGap = 13;

        titleColContent[col].forEach((val, i) => {
          // Add text to cell
          page.drawText(val, {
            x:
              x +
              cellWidths[col] / 2 -
              bold.widthOfTextAtSize(val, fontSize) / 2,
            y:
              y +
              titleColHeight -
              fontSize -
              (titleColContent[col].length === 1
                ? cellPadding * 2
                : cellPadding) -
              textGap * i,
            size: fontSize,
            font: bold,
            color: rgb(0, 0, 0),
          });
        });
      }
    } else if (row <= cellContents.length) {
      for (let col = 0; col < numberOfColumns; col++) {
        const x =
          margin +
          [0, ...cellWidths]
            .filter((w, i) => i <= col)
            .reduce((acc, cur) => acc + cur);
        const y = tableTop - row * cellHeight;

        // Draw cell border
        page.drawRectangle({
          x,
          y,
          width: cellWidths[col],
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        // Add text to cell
        page.drawText(cellContents[row - 1][col], {
          x:
            x +
            cellPadding / 2 +
            cellWidths[col] / 2 -
            bold.widthOfTextAtSize(cellContents[row - 1][col], fontSize) / 2,
          y: y + cellHeight - fontSize - cellPadding,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  return { tabbleEndY: tableTop - cellHeight * numberOfRows };
};

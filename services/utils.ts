import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import path from "path";
import fs from "fs";

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
  tte,
}: GenerateUtils) => {
  const { width, height } = page.getSize();

  const title = (title: string, nomor: string, y?: number) => {
    const titleWidth = bold.widthOfTextAtSize(title, 14);
    const titleX = width / 2 - titleWidth / 2;
    const titleY = y ?? height - 140;

    page.drawText(title, {
      x: titleX,
      y: titleY,
      size: 14,
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

  const p = (content: string, indexY: number = 0, x?: number) => {
    page.drawText(content, {
      x: x ?? marginX,
      y: startLine - gap * indexY,
      size: fontSize,
      font: font,
      maxWidth: width - 2 * marginX,
    });
  };

  const pColon = (label: string, value: string, indexY: number) => {
    p(label, indexY);
    p(`: ${value}`, indexY, xColon);
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
        y: boxY + boxHeight - 20,
        size: fontSize,
        font: font,
      });
    }

    if (line2) {
      const text2 = line2;
      const text2Width = font.widthOfTextAtSize(text2, fontSize);
      page.drawText(text2, {
        x: boxX + boxWidth / 2 - text2Width / 2,
        y: boxY + boxHeight - 40,
        size: fontSize,
        font: font,
      });
    }

    if (line3) {
      const text3 = line3;
      const text3Width = bold.widthOfTextAtSize(text3, fontSize - 1);
      page.drawText(text3, {
        x: boxX + boxWidth / 2 - text3Width / 2,
        y: boxY + boxHeight - 115,
        size: fontSize - 1,
        font: bold,
      });
      // underline
      page.drawLine({
        start: {
          x: boxX + boxWidth / 2 - text3Width / 2,
          y: boxY + boxHeight - 118,
        },
        end: {
          x: boxX + boxWidth / 2 - text3Width / 2 + text3Width,
          y: boxY + boxHeight - 118,
        },
      });
    }

    if (line4) {
      const text4 = line4;
      const text4Width = bold.widthOfTextAtSize(text4, fontSize - 1);
      page.drawText(text4, {
        x: boxX + boxWidth / 2 - text4Width / 2,
        y: boxY + boxHeight - 130,
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
        const ttdSize = 52;

        page.drawImage(ttdImage, {
          x: boxX + boxWidth / 2 - ttdSize / 2,
          y: boxY + boxHeight - 100,
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

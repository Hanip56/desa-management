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
  page: PDFPage;
  marginX: number;
  font: PDFFont;
  startLine: number;
  gap: number;
};

export const generateUtils = ({
  font,
  gap,
  marginX,
  page,
  startLine,
}: GenerateUtils) => {
  const { width, height } = page.getSize();

  const p = (content: string, indexY: number = 0, x?: number) => {
    page.drawText(content, {
      x: x ?? marginX,
      y: startLine - gap * indexY,
      size: 13,
      font: font,
      maxWidth: width - 2 * marginX,
      lineHeight: 15,
    });
  };

  const pJustify = (
    content: string,
    indexY: number = 0,
    indent: boolean = false
  ) => {
    const words = content.split(" ");
    const wordsWidth = words.reduce(
      (acc, cur) => acc + font.widthOfTextAtSize(cur, 13),
      0
    );
    const indentGap = indent ? 30 : 0;

    const lineWidth = width - 2 * marginX - indentGap;

    const totalSpace = lineWidth - wordsWidth;
    const spaceBetweenWord = totalSpace / (words.length - 1);

    let indexX = marginX + indentGap;
    words.forEach((word) => {
      p(word, indexY, indexX);

      indexX += font.widthOfTextAtSize(word, 13) + spaceBetweenWord;
    });
  };

  const ttd = (
    y: number,
    direction: "left" | "center" | "right",
    line1: string,
    line2: string,
    line3: string
  ) => {
    const boxWidth = 250;
    const boxHeight = 150;
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

    const text1 = line1;
    const text1Width = font.widthOfTextAtSize(text1, 13);

    page.drawText(text1, {
      x: boxX + boxWidth / 2 - text1Width / 2,
      y: boxY + boxHeight - 20,
      size: 13,
      font: font,
    });

    const text2 = line2;
    const text2Width = font.widthOfTextAtSize(text2, 13);
    page.drawText(text2, {
      x: boxX + boxWidth / 2 - text2Width / 2,
      y: boxY + boxHeight - 40,
      size: 13,
      font: font,
    });

    const text3 = line3;
    const text3Width = font.widthOfTextAtSize(text3, 13);
    page.drawText(text3, {
      x: boxX + boxWidth / 2 - text3Width / 2,
      y: boxY + boxHeight - 120,
      size: 13,
      font: font,
    });
  };

  return { p, pJustify, ttd };
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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  const hashPass = await bcrypt.hash("bluebird03", 10);

  const basicPassword = await bcrypt.hash("123456", 10);

  const setting = await prisma.setting.create({
    data: {
      namaKepalaDesa: "YAYAN SURYANA",

      namaCamat: "______________",
      noRegCamat: "123456789",

      namaBabinsa: "IIP NASARIP",
      pangkatBabinsa: "Sersan Dua",
      nrpBabinsa: "31010528541080",
      jabatanBabinsa: "Babinsa Margaasih Koramil 2402/Cicalengka",

      namaBhabinkamtibmas: "ANDRIK SLAMET",
      pangkatBhabinkamtibmas: "Bripka",
      nrpBhabinkamtibmas: "80040405",
      jabatanBhabinkamtibmas: "Bhabinkamtibmas desa Margaasih",
    },
  });

  const sky = await prisma.user.upsert({
    where: { nomorWa: "08123456789" },
    update: {},
    create: {
      nomorWa: "08123456789",
      username: "Sky",
      password: hashPass,
      role: "SUPERADMIN",
      hidden: true,
    },
  });

  const superadmin = await prisma.user.upsert({
    where: { nomorWa: "0887654321" },
    update: {},
    create: {
      nomorWa: "0887654321",
      username: "Superadmin",
      password: basicPassword,
      role: "SUPERADMIN",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import {
  dataSkBelumMenikah,
  dataSkIjinKeramaian,
  dataSkPenghasilanOrangTua,
  dataSuratKelahiran,
  dataSuratKematian,
} from "@/contants/dummy-data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const hashPass =
    "$2a$10$SYy2q91bFYEq..zAcn/qF.qimiZsyNqQf.Hkdk32m9660U96X1/ji";

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.io" },
    update: {},
    create: {
      email: "alice@example.io",
      username: "Alice",
      password: hashPass,
      role: "USER",
      suratKelahirans: {
        create: dataSuratKelahiran.filter((_, i) => i <= 4),
      },
      suratKematians: {
        create: dataSuratKematian.filter((_, i) => i <= 4),
      },
      skBelumMenikahs: {
        create: dataSkBelumMenikah.filter((_, i) => i <= 4),
      },
      skIjinKeramaian: {
        create: dataSkIjinKeramaian.filter((_, i) => i <= 4),
      },
      skPenghasilanOrangTua: {
        create: dataSkPenghasilanOrangTua.filter((_, i) => i <= 4),
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@example.io" },
    update: {},
    create: {
      email: "bob@example.io",
      username: "Bob",
      password: hashPass,
      suratKematians: {
        create: dataSuratKematian.filter((_, i) => i > 4 && i <= 8),
      },
      suratKelahirans: {
        create: dataSuratKelahiran.filter((_, i) => i > 4 && i <= 8),
      },
      skBelumMenikahs: {
        create: dataSkBelumMenikah.filter((_, i) => i > 4 && i <= 8),
      },
      skIjinKeramaian: {
        create: dataSkIjinKeramaian.filter((_, i) => i > 4 && i <= 8),
      },
      skPenghasilanOrangTua: {
        create: dataSkPenghasilanOrangTua.filter((_, i) => i > 4 && i <= 8),
      },
    },
  });

  const wise = await prisma.user.upsert({
    where: { email: "wise@example.io" },
    update: {},
    create: {
      email: "wise@example.io",
      username: "Wise",
      password: hashPass,
      suratKelahirans: {
        create: dataSuratKelahiran.filter((_, i) => i > 8),
      },
      suratKematians: {
        create: dataSuratKematian.filter((_, i) => i > 8),
      },
      skBelumMenikahs: {
        create: dataSkBelumMenikah.filter((_, i) => i > 8),
      },
      skIjinKeramaian: {
        create: dataSkIjinKeramaian.filter((_, i) => i > 8),
      },
      skPenghasilanOrangTua: {
        create: dataSkPenghasilanOrangTua.filter((_, i) => i > 8),
      },
    },
  });

  console.log({ alice, bob, wise });
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

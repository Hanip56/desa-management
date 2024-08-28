// max length for input
export const maxLengthInput = 50;

type SuratList = {
  type: "online" | "offline";
  name: string;
  href: string;
};

export const suratList: SuratList[] = [
  {
    type: "online",
    name: "Surat kelahiran",
    href: "/pengajuan/surat-kelahiran",
  },
  {
    type: "online",
    name: "Surat kematian",
    href: "/pengajuan/surat-kematian",
  },
  {
    type: "online",
    name: "SK belum menikah",
    href: "/pengajuan/sk-belum-menikah",
  },
  {
    type: "online",
    name: "SK ijin keramaian",
    href: "/pengajuan/sk-ijin-keramaian",
  },
  {
    type: "online",
    name: "SK penghasilan orang tua",
    href: "/pengajuan/sk-penghasilan-orang-tua",
  },
  {
    type: "offline",
    name: "Pendaftaran pindah WNI",
    href: "/pengajuan/pendaftaran-pindah-wni",
  },
  {
    type: "offline",
    name: "Keterangan tidak mampu",
    href: "/pengajuan/sk-tidak-mampu",
  },
];

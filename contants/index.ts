// max length for input
export const maxLengthInput = 50;

export const alamatPlaceholder =
  "Kp. ... RT ... RW ... Ds. ... Kec. ... Kab. ...";

export const NAMA_PROVINSI = "Jawa Barat";
export const NAMA_KABUPATEN = "Purwakarta";
export const NAMA_KECAMATAN = "Cicalengka";
export const NAMA_DESA = "Sindangkasih";
export const NAMA_BUPATI = "Saepul Bahri Binzein";
export const NAMA_KADES = "Abang Ijo Hapidin";
export const JALAN_DESA =
  "Jalan Basuki Rahmat No. 34-36 Kec. Purwakarta, Kab.Purwakarta, 41112";

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
    type: "online",
    name: "SK izin bekerja",
    href: "/pengajuan/sk-izin-bekerja",
  },
  {
    type: "online",
    name: "SK belum memiliki rumah",
    href: "/pengajuan/sk-belum-memiliki-rumah",
  },
  {
    type: "online",
    name: "SK tidak memiliki pekerjaan",
    href: "/pengajuan/sk-tidak-memiliki-pekerjaan",
  },
  {
    type: "online",
    name: "SK usaha",
    href: "/pengajuan/sk-usaha",
  },
  {
    type: "online",
    name: "SK domisili lembaga",
    href: "/pengajuan/sk-domisili-lembaga",
  },
  {
    type: "online",
    name: "SK domisili imigrasi",
    href: "/pengajuan/sk-domisili-imigrasi",
  },
  {
    type: "online",
    name: "SK domisili sementara",
    href: "/pengajuan/sk-domisili-sementara",
  },
  {
    type: "online",
    name: "SK tidak mampu",
    href: "/pengajuan/sk-tidak-mampu",
  },
  {
    type: "online",
    name: "Surat rekomendasi pembelian bbm",
    href: "/pengajuan/surat-rekomendasi-pembelian-bbm",
  },
  {
    type: "online",
    name: "Pendaftaran pindah wni",
    href: "/pengajuan/pendaftaran-pindah-wni",
  },
  {
    type: "offline",
    name: "Persyaratan buat SPPT (OP BARU)",
    href: "/pengajuan/persyaratan-buat-sppt",
  },
  {
    type: "offline",
    name: "Persyaratan mutasi",
    href: "/pengajuan/persyaratan-mutasi",
  },
  {
    type: "offline",
    name: "Persyaratan aktivasi",
    href: "/pengajuan/persyaratan-aktivasi",
  },
  {
    type: "offline",
    name: "Persyaratan fatwa-waris",
    href: "/pengajuan/persyaratan-fatwa-waris",
  },
];

export const pengajuanRoutes = [
  {
    label: "Surat kelahiran",
    href: "/pengajuan/surat-kelahiran",
  },
  {
    label: "Surat kematian",
    href: "/pengajuan/surat-kematian",
  },
  {
    label: "SK belum menikah",
    href: "/pengajuan/sk-belum-menikah",
  },
  {
    label: "SK ijin keramaian",
    href: "/pengajuan/sk-ijin-keramaian",
  },
  {
    label: "SK penghasilan orang tua",
    href: "/pengajuan/sk-penghasilan-orang-tua",
  },
  {
    label: "SK izin bekerja",
    href: "/pengajuan/sk-izin-bekerja",
  },
  {
    label: "SK belum memiliki rumah",
    href: "/pengajuan/sk-belum-memiliki-rumah",
  },
  {
    label: "SK tidak memiliki pekerjaan",
    href: "/pengajuan/sk-tidak-memiliki-pekerjaan",
  },
  {
    label: "SK usaha",
    href: "/pengajuan/sk-usaha",
  },
  {
    label: "SK tidak mampu",
    href: "/pengajuan/sk-tidak-mampu",
  },
  {
    label: "SK domisili sementara",
    href: "/pengajuan/sk-domisili-sementara",
  },
  {
    label: "SK domisili imigrasi",
    href: "/pengajuan/sk-domisili-imigrasi",
  },
  {
    label: "SK domisili lembaga",
    href: "/pengajuan/sk-domisili-lembaga",
  },
  {
    label: "Pendaftaran pindah WNI",
    href: "/pengajuan/pendaftaran-pindah-wni",
  },
  {
    label: "Surat rekomendasi pembelian BBM",
    href: "/pengajuan/surat-rekomendasi-pembelian-bbm",
  },
  {
    label: "Persyaratan buat SPPT (OP BARU)",
    href: "/pengajuan/persyaratan-buat-sppt",
  },
  {
    label: "Persyaratan mutasi",
    href: "/pengajuan/persyaratan-mutasi",
  },
  {
    label: "Persyaratan aktivasi",
    href: "/pengajuan/persyaratan-aktivasi",
  },
  {
    label: "Persyaratan fatwa-waris",
    href: "/pengajuan/persyaratan-fatwa-waris",
  },
];

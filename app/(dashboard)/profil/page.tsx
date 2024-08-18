import Header from "../components/header";
import ProfilClient from "./components/profil-client";

const Profil = async () => {
  return (
    <main>
      <Header title="Profil" subtitle="Aplikasi pengelolaan desa Margaasih" />

      <ProfilClient />
    </main>
  );
};

export default Profil;

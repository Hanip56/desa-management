import Header from "../components/header";
import ProfilClient from "./components/profil-client";

const Profil = async () => {
  return (
    <main>
      <Header title="Profil" subtitle="lorem ipsum dolor sit amet" />

      <ProfilClient />
    </main>
  );
};

export default Profil;

import Navbar from "@/components/navbar";

// bg-[linear-gradient(to_bottom,_#047857_0%,_#059669_45%,_#059669_45%,_#ffffff_45%,_#ffffff_45%)]

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full relative">
      <div className="h-96 w-full bg-gradient-to-b from-emerald-700 to-emerald-600 absolute -z-10 top-0 left-0" />
      {/* navbar */}
      <Navbar />
      <div className="mt-4 pb-8 max-w-screen-xl mx-auto px-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;

import NavMenu from "./nav-menu";
import Logo from "./logo";
import LogoutBtn from "./logout-btn";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between gap-4 md:gap-16 lg:gap-20 md:justify-start p-4 md:py-6 max-w-screen-xl mx-auto">
      <div className="text-white">
        <Logo />
      </div>
      <NavMenu />
      <div className="hidden md:block ml-auto">
        <LogoutBtn />
      </div>
    </nav>
  );
};

export default Navbar;

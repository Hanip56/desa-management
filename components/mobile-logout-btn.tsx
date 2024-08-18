import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useRef } from "react";

const MobileLogoutBtn = () => {
  const router = useRouter();
  const [LogoutValidation, confirm] = useConfirm(
    "Apa anda yakin?",
    "Anda akan logout dari akun ini"
  );
  const logoutBtnRef = useRef<HTMLButtonElement>(null);

  const handleAction = async () => {
    const ok = await confirm();

    if (!ok) return;

    logoutBtnRef.current?.click();
  };

  return (
    <>
      <LogoutValidation />
      <form
        action={() =>
          logout().then((data) => data?.success && router.push("/masuk"))
        }
        className="py-2 px-4"
      >
        <Button
          onClick={handleAction}
          type="button"
          aria-label="diplay-logout-button"
          className="sm:w-fit bg-destructive/10 hover:bg-destructive/20 hover:text-red-600 text-red-600 border border-red-300 rounded-full text-sm"
          variant="ghost"
        >
          {/* Keluar */}
          <LogOut className="size-4 mr-1" />
          keluar
        </Button>
        <Button
          ref={logoutBtnRef}
          type="submit"
          className="sr-only"
          aria-label="Logout-button"
        >
          Logout
        </Button>
      </form>
    </>
  );
};

export default MobileLogoutBtn;

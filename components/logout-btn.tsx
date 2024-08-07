"use client";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useRef } from "react";

const LogoutBtn = () => {
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
      >
        <Button
          onClick={handleAction}
          type="button"
          size="icon"
          aria-label="diplay-logout-button"
          className="rounded-full bg-emerald-800 hover:bg-rose-900"
        >
          {/* Keluar */}
          <LogOut className="size-4 ml-1" />
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

export default LogoutBtn;

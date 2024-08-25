"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListSetting from "./list-setting";
import { useSession } from "next-auth/react";
import EditProfilDialog from "./edit-profil-dialog";
import { useState } from "react";
import EditPasswordDialog from "./edit-password-dialog";

const ProfilClient = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  return (
    <>
      <EditPasswordDialog
        open={openPasswordDialog}
        handleClose={() => setOpenPasswordDialog(false)}
      />
      <EditProfilDialog open={open} handleClose={() => setOpen(false)} />
      <Card className="mt-8 rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
          <CardTitle className="text-xl">Informasi akun</CardTitle>
          <Button
            onClick={() => setOpen(true)}
            className="w-full sm:w-fit ml-auto"
          >
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <ul>
            <ListSetting
              label="Username"
              value={session?.user.username ?? ""}
            />
            <ListSetting label="Nomor WA" value={session?.user.nomorWa ?? ""} />
            <ListSetting label="Role" value={session?.user.role ?? ""} />
            <ListSetting
              label="Password"
              value="******"
              actionLabel="edit password"
              action={() => setOpenPasswordDialog(true)}
            />
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfilClient;

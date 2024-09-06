"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListSetting from "./list-setting";
import { useSession } from "next-auth/react";
import EditProfilDialog from "./edit-profil-dialog";
import { useState } from "react";
import EditPasswordDialog from "./edit-password-dialog";
import Image from "next/image";
import UploadDocumentDialog from "../../components/upload-document-dialog";

type Props = {
  ktpUrl?: string;
  kkUrl?: string;
};

const ProfilClient = ({ ktpUrl, kkUrl }: Props) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);

  return (
    <>
      <EditPasswordDialog
        open={openPasswordDialog}
        handleClose={() => setOpenPasswordDialog(false)}
      />
      <UploadDocumentDialog
        open={openDocumentDialog}
        handleClose={() => setOpenDocumentDialog(false)}
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
            <li className="flex flex-col gap-2 sm:flex-row items-center justify-between py-6 border-t">
              <p className="basis-[30%] font-semibold">KTP & KK</p>
              <div className="flex-1 justify-start">
                <div className="flex gap-2">
                  {ktpUrl && (
                    <Image
                      className="text-sm w-20 h-20 object-contain"
                      src={ktpUrl}
                      alt="ktp"
                      width={500}
                      height={500}
                    />
                  )}
                  {kkUrl && (
                    <Image
                      className="text-sm w-20 h-20 object-contain"
                      src={kkUrl}
                      alt="ktp"
                      width={500}
                      height={500}
                    />
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="text-sm text-slate-500 font-normal"
                onClick={() => setOpenDocumentDialog(true)}
              >
                edit ktp & kk
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfilClient;

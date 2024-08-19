"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ListSetting from "../../components/list-setting";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EditNamaDialog from "./edit-nama-dialog";
import EditTteDialog from "./edit-tte-dialog";
import { SettingClient } from "../page";
import { base64ToFile } from "@/lib/utils";

type Props = {
  setting: SettingClient | null;
};

const PengaturanClient = ({ setting }: Props) => {
  const [openEditNama, setOpenEditNama] = useState(false);
  const [openEditTte, setOpenEditTte] = useState(false);
  const [ttePreview, setTtePreview] = useState<File>();

  useEffect(() => {
    if (setting?.tte) {
      setTtePreview(base64ToFile(setting.tte, "tte", "image/png"));
    }
  }, [setting]);

  if (!setting) {
    return (
      <div className="p-4 rounded-xl bg-white shadow-md">
        <h1 className="text-xl text-rose-700 font-semibold">
          Error 404: Setting not found
        </h1>
      </div>
    );
  }

  return (
    <>
      {setting && (
        <>
          <EditNamaDialog
            setting={setting}
            open={openEditNama}
            handleClose={() => setOpenEditNama(false)}
          />
          <EditTteDialog
            setting={setting}
            open={openEditTte}
            handleClose={() => setOpenEditTte(false)}
          />
        </>
      )}
      <Card className="mt-8 rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
          <CardTitle className="text-xl">Informasi desa</CardTitle>
          {/* <Button className="w-full sm:w-fit ml-auto" variant="secondary">
          Edit
        </Button> */}
        </CardHeader>
        <CardContent>
          <ul>
            <ListSetting
              label="Nama kepala desa"
              value={setting?.namaKepalaDesa ?? "-"}
              actionLabel="edit nama"
              action={() => setOpenEditNama(true)}
            />
            <li className="flex flex-col gap-2 sm:flex-row items-center justify-between py-6 border-t">
              <p className="basis-[30%] font-semibold">TTE</p>
              <div className="flex-1 justify-start">
                {ttePreview && (
                  <Image
                    className="text-sm w-20 h-20"
                    src={URL.createObjectURL(ttePreview)}
                    alt="tte"
                    width={500}
                    height={500}
                  />
                )}
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="text-sm text-slate-500 font-normal"
                onClick={() => setOpenEditTte(true)}
              >
                edit tte
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default PengaturanClient;

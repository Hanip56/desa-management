"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Newspaper, Plus } from "lucide-react";
import UploadDocumentDialog from "./upload-document-dialog";
import { useState } from "react";

const UploadDocument = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <UploadDocumentDialog open={open} handleClose={() => setOpen(false)} />
      <div className="flex gap-8">
        <Card className="border-none drop-shadow-md p-5 flex-1">
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center text-center sm:text-start border rounded-lg p-4 sm:p-8">
            <div>
              <Newspaper className="size-10 text-sky-600" />
            </div>
            <div>
              <h6 className="text-sm sm:text-base font-semibold mb-2">
                Sebelum Membuat Pengajuan Mohon Lampirkan Dokumen Data Diri Anda
              </h6>
              <p className="text-xs sm:text-sm">
                Unggah dokumen anda dengan menekan tombol ini!
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              size="sm"
              className="rounded-full text-xs bg-sky-600 hover:bg-sky-600/80"
            >
              <Plus className="size-4 mr-2" /> Unggah
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UploadDocument;

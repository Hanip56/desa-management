import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import ListPengaturan from "./list-pengaturan";

const PengaturanClient = () => {
  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader className="flex flex-col md:flex-row items-center md:justify-between gap-y-2">
        <CardTitle className="text-xl">Informasi desa</CardTitle>
        <Button className="w-full sm:w-fit ml-auto" variant="secondary">
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <ul>
          <ListPengaturan label="Nama kepala desa" value="Yayan Suryana" />
          <ListPengaturan label="TTE" value="~~~~~~~" />
        </ul>
      </CardContent>
    </Card>
  );
};

export default PengaturanClient;

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AnggotaPindahSchema,
  pendaftaranPindahWniSchema,
} from "@/schemas/pendaftaran-pindah-wni";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPendaftaranPindahWni,
  updatePendaftaranPindahWni,
} from "@/fetcher/pendaftaran-pindah-wni-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PendaftaranPindahWniWithUser } from "@/types";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import UpsertAnggotaDialog from "./upsert-anggota-dialog";
import { useState } from "react";
import ListAnggotaPindah from "./list-anggota-pindah";
import { Plus } from "lucide-react";

type Props = {
  initialData?: PendaftaranPindahWniWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const [upsertAnggotaOpenId, setUpsertAnggotaOpenId] = useState<number>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof pendaftaranPindahWniSchema>>({
    resolver: zodResolver(pendaftaranPindahWniSchema),
    defaultValues: {
      namaLengkapPemohon: initialData?.namaLengkapPemohon ?? "",
      nik: initialData?.nik ?? "",
      noKk: initialData?.noKk ?? "",
      jenisPermohonan: initialData?.jenisPermohonan ?? "",
      alamatAsal: initialData?.alamatAsal ?? "",
      desaAsal: initialData?.desaAsal ?? "",
      kecamatanAsal: initialData?.kecamatanAsal ?? "",
      kabupatenAsal: initialData?.kabupatenAsal ?? "",
      provinsiAsal: initialData?.provinsiAsal ?? "",
      kodePosAsal: initialData?.kodePosAsal ?? "",
      alamatTujuan: initialData?.alamatTujuan ?? "",
      desaTujuan: initialData?.desaTujuan ?? "",
      kecamatanTujuan: initialData?.kecamatanTujuan ?? "",
      kabupatenTujuan: initialData?.kabupatenTujuan ?? "",
      provinsiTujuan: initialData?.provinsiTujuan ?? "",
      kodePosTujuan: initialData?.kodePosTujuan ?? "",
      klasifikasiKepindahan: initialData?.klasifikasiKepindahan ?? "",
      alasanPindah: initialData?.alasanPindah ?? "",
      jenisKepindahan: initialData?.jenisKepindahan ?? "",
      anggotaPindah: initialData?.anggotaPindah ?? [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createPendaftaranPindahWni,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/pendaftaran-pindah-wni");

      queryClient.invalidateQueries({
        queryKey: ["pendaftaran-pindah-wnis"],
        exact: true,
      });
    },
    onError: (error) => {
      toast("Data gagal diajukan.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePendaftaranPindahWni,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/pendaftaran-pindah-wni");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["pendaftaran-pindah-wnis"],
        exact: true,
      });
    },
    onError: (error) => {
      toast("Data gagal di ubah.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = async (
    values: z.infer<typeof pendaftaranPindahWniSchema>
  ) => {
    if (initialData) {
      updateMutation.mutate({
        body: {
          ...values,
        },
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body: {
          ...values,
        },
      });
    }
  };

  const disabledCondition =
    createMutation.isPending || updateMutation.isPending;

  const anggotaPindahState = form.watch("anggotaPindah");
  const initialDataTambahAnggota =
    typeof upsertAnggotaOpenId === "number"
      ? anggotaPindahState[upsertAnggotaOpenId]
      : undefined;

  return (
    <>
      <UpsertAnggotaDialog
        open={typeof upsertAnggotaOpenId === "number"}
        handleClose={() => setUpsertAnggotaOpenId(undefined)}
        initialData={initialDataTambahAnggota}
        handleChange={(value: z.infer<typeof AnggotaPindahSchema>) =>
          form.setValue(
            "anggotaPindah",
            anggotaPindahState.length < 1
              ? [value]
              : anggotaPindahState.length === upsertAnggotaOpenId
              ? [...anggotaPindahState, value]
              : anggotaPindahState.map((v, i) =>
                  i === upsertAnggotaOpenId ? value : v
                )
          )
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-10 md:gap-y-12 disabled:text-black!"
        >
          {/* keterangan pemohon */}
          <div>
            <h2 className="text-xl font-medium mb-6">Keterangan pemohon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
              <FormField
                control={form.control}
                name="namaLengkapPemohon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama lengkap pemohon</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Nama lengkap pemohon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="NIK"
                        type="number"
                        min={0}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noKk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No KK</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="No KK"
                        type="number"
                        min={0}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jenisPermohonan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis permohonan</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Jenis permohonan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Surat keterangan kependudukan">
                            Surat keterangan kependudukan
                          </SelectItem>
                          <SelectItem value="Surat keterangan pindah">
                            Surat keterangan pindah
                          </SelectItem>
                          <SelectItem value="Surat keterangan pindah luar negeri (SKPLN)">
                            Surat keterangan pindah luar negeri (SKPLN)
                          </SelectItem>
                          <SelectItem value="Surat keterangan tempat tinggal (SKTT)">
                            Surat keterangan tempat tinggal (SKTT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* keterangan alamat asal */}
          <div>
            <h2 className="text-xl font-medium mb-6">Keterangan alamat asal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
              <FormField
                control={form.control}
                name="alamatAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Jalan / Kampung RT RW"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desaAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Desa"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kecamatanAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kecamatan"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kabupatenAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kabupaten</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kabupaten"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provinsiAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Provinsi"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kodePosAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode pos</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kode pos"
                        type="number"
                        min={0}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* keterangan alamat tujuan */}
          <div>
            <h2 className="text-xl font-medium mb-6">
              Keterangan alamat tujuan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
              <FormField
                control={form.control}
                name="alamatTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Jalan / Kampung RT RW"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desaTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Desa"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kecamatanTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kecamatan"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kabupatenTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kabupaten</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kabupaten"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provinsiTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Provinsi"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kodePosTujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode pos</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kode pos"
                        type="number"
                        min={0}
                        onWheel={(e: any) => e.target.blur()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* keterangan pindah */}
          <div>
            <h2 className="text-xl font-medium mb-6">Keterangan pindah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
              <FormField
                control={form.control}
                name="klasifikasiKepindahan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klasifikasi kepindahan</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Jenis permohonan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dalam satu desa/kelurahan">
                            Dalam satu desa/kelurahan
                          </SelectItem>
                          <SelectItem value="Antar desa/kelurahan">
                            Antar desa/kelurahan
                          </SelectItem>
                          <SelectItem value="Antar kecamatan">
                            Antar kecamatan
                          </SelectItem>
                          <SelectItem value="Antar kabupaten">
                            Antar kabupaten
                          </SelectItem>
                          <SelectItem value="Antar provinsi">
                            Antar provinsi
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alasanPindah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alasan pindah</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Pekerjaan / Pendidikan / Kesehatan / dll"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jenisKepindahan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis kepindahan</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Jenis kepindahan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kepala keluarga">
                            Kepala keluarga
                          </SelectItem>
                          <SelectItem value="Kepala keluarga dan seluruh anggota keluarga">
                            Kepala keluarga dan seluruh anggota keluarga
                          </SelectItem>
                          <SelectItem value="Kepala keluarga dan sebagian anggota keluarga">
                            Kepala keluarga dan sebagian anggota keluarga
                          </SelectItem>
                          <SelectItem value="Anggota keluarga">
                            Anggota keluarga
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* anggota pindah */}
          <div>
            <h2 className="text-xl font-medium mb-6">Anggota pindah</h2>
            <div>
              <FormField
                name="anggotaPindah"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-6">
                    <ListAnggotaPindah
                      anggotaPindah={anggotaPindahState}
                      setUpsertAnggotaOpenId={setUpsertAnggotaOpenId}
                      handleDelete={(idx: number) =>
                        form.setValue(
                          "anggotaPindah",
                          anggotaPindahState.filter((v, i) => i !== idx)
                        )
                      }
                    />
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() =>
                          setUpsertAnggotaOpenId(
                            anggotaPindahState.length > 0
                              ? anggotaPindahState.length
                              : 0
                          )
                        }
                        variant="outline"
                        disabled={anggotaPindahState.length >= 5}
                        className="w-full text-sm"
                      >
                        <Plus className="size-5 mr-2" /> Tambah anggota pindah
                      </Button>
                      {anggotaPindahState.length >= 5 && (
                        <p className="text-xs font-medium text-center">
                          Catatan: untuk pendaftaran online maksimal hanya 5
                          anggota
                        </p>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={disabledCondition} type="submit" size="lg">
            {initialData ? "Simpan" : "Ajukan"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpsertForm;

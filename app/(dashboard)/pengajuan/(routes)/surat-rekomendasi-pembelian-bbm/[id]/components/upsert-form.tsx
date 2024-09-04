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
import { suratRekomendasiPembelianBbmSchema } from "@/schemas/surat-rekomendasi-pembelian-bbm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSuratRekomendasiPembelianBbm,
  updateSuratRekomendasiPembelianBbm,
} from "@/fetcher/surat-rekomendasi-pembelian-bbm-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SuratRekomendasiPembelianBbmWithUser } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { alamatPlaceholder } from "@/contants";

type Props = {
  initialData?: SuratRekomendasiPembelianBbmWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof suratRekomendasiPembelianBbmSchema>>({
    resolver: zodResolver(suratRekomendasiPembelianBbmSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      nik: initialData?.nik ?? "",
      alamatUsaha: initialData?.alamatUsaha ?? "",
      konsumenPengguna: initialData?.konsumenPengguna ?? "",
      jenisUsahaKegiatan: initialData?.jenisUsahaKegiatan ?? "",
      jenisAlat: initialData?.jenisAlat ?? "",
      jumlahAlat: initialData?.jumlahAlat ?? undefined,
      fungsiAlat: initialData?.fungsiAlat ?? "",
      jamOperasi: initialData?.jamOperasi ?? "",
      konsumsi: initialData?.konsumsi ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSuratRekomendasiPembelianBbm,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-rekomendasi-pembelian-bbm");

      queryClient.invalidateQueries({
        queryKey: ["surat-rekomendasi-pembelian-bbms"],
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
    mutationFn: updateSuratRekomendasiPembelianBbm,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-rekomendasi-pembelian-bbm");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["surat-rekomendasi-pembelian-bbms"],
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
    values: z.infer<typeof suratRekomendasiPembelianBbmSchema>
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

  return (
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
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nama"
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
              name="alamatUsaha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat usaha</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabledCondition}
                      {...field}
                      placeholder={alamatPlaceholder}
                      className="resize-none"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="konsumenPengguna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konsumen pengguna</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Konsumen pengguna"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jenisUsahaKegiatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis usaha kegiatan</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Jenis usaha kegiatan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* keterangan alat */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan alat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="jenisAlat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis alat</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Jenis alat"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jumlahAlat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah alat</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      placeholder="Jumlah alat"
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
              name="fungsiAlat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fungsi alat</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Fungsi alat"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jamOperasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jam operasi</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="ct: 8 jam/hari"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="konsumsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Konsumsi jenis bbm tertentu liter per (HARI/MINGGU/BULAN)
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="ct: 30 liter/minggu"
                    />
                  </FormControl>
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
  );
};

export default UpsertForm;

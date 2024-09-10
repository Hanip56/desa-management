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
import { skTidakMampuSchema } from "@/schemas/sk-tidak-mampu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkTidakMampu,
  updateSkTidakMampu,
} from "@/fetcher/sk-tidak-mampu-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkTidakMampuWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { alamatPlaceholder, maxLengthInput } from "@/contants";

type Props = {
  initialData?: SkTidakMampuWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skTidakMampuSchema>>({
    resolver: zodResolver(skTidakMampuSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      tempatLahir: initialData?.tempatLahir ?? "",
      tanggalLahir: initialData?.tanggalLahir ?? undefined,
      alamat: initialData?.alamat ?? "",
      nik: initialData?.nik ?? "",
      noKk: initialData?.noKk ?? "",
      pekerjaan: initialData?.pekerjaan ?? "",
      namaOrangTua: initialData?.namaOrangTua ?? "",
      tempatLahirOrangTua: initialData?.tempatLahirOrangTua ?? "",
      tanggalLahirOrangTua: initialData?.tanggalLahirOrangTua ?? undefined,
      alamatOrangTua: initialData?.alamatOrangTua ?? "",
      nikOrangTua: initialData?.nikOrangTua ?? "",
      pekerjaanOrangTua: initialData?.pekerjaanOrangTua ?? "",
      keperluan: initialData?.keperluan ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkTidakMampu,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-tidak-mampu");

      queryClient.invalidateQueries({
        queryKey: ["sk-tidak-mampus"],
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
    mutationFn: updateSkTidakMampu,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-tidak-mampu");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-tidak-mampus"],
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

  const onSubmit = async (values: z.infer<typeof skTidakMampuSchema>) => {
    if (initialData) {
      updateMutation.mutate({
        body: {
          ...values,
          tanggalLahir: dateTimeToISO(values.tanggalLahir),
          tanggalLahirOrangTua: dateTimeToISO(values.tanggalLahirOrangTua),
        },
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body: {
          ...values,
          tanggalLahir: dateTimeToISO(values.tanggalLahir),
          tanggalLahirOrangTua: dateTimeToISO(values.tanggalLahirOrangTua),
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
                      maxLength={maxLengthInput}
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
              name="tempatLahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat lahir</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Tempat lahir"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
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
                  <FormLabel>NO KK</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="NO KK"
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
              name="pekerjaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Pekerjaan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabledCondition}
                      {...field}
                      placeholder={alamatPlaceholder}
                      rows={2}
                      className="resize-none"
                      maxLength={120}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keperluan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keperluan</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Keperluan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan orang tua</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaOrangTua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
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
              name="tempatLahirOrangTua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat lahir</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Tempat lahir"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahirOrangTua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nikOrangTua"
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
              name="pekerjaanOrangTua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Pekerjaan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamatOrangTua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabledCondition}
                      {...field}
                      placeholder={alamatPlaceholder}
                      rows={2}
                      className="resize-none"
                      maxLength={120}
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

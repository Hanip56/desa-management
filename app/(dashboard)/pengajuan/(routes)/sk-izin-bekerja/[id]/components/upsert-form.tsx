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
import { skIzinBekerjaSchema } from "@/schemas/sk-izin-bekerja";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectGender from "@/components/select-gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkIzinBekerja,
  updateSkIzinBekerja,
} from "@/fetcher/sk-izin-bekerja-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkIzinBekerjaWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { alamatPlaceholder, maxLengthInput } from "@/contants";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialData?: SkIzinBekerjaWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skIzinBekerjaSchema>>({
    resolver: zodResolver(skIzinBekerjaSchema),
    defaultValues: {
      namaLengkap: initialData?.namaLengkap ?? "",
      nik: initialData?.nik ?? "",
      tanggalLahir: initialData?.tanggalLahir ?? undefined,
      jenisKelamin: initialData?.jenisKelamin ?? undefined,
      agama: initialData?.agama ?? "",
      pekerjaan: initialData?.pekerjaan ?? "",
      bagian: initialData?.bagian ?? "",
      nomorId: initialData?.nomorId ?? "",
      alamat: initialData?.alamat ?? "",
      tempatKerja: initialData?.tempatKerja ?? "",
      alasan: initialData?.alasan ?? "",
      waktuIzin: {
        from: initialData?.izinDariHari ?? undefined,
        to: initialData?.izinSampaiHari ?? undefined,
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkIzinBekerja,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-izin-bekerja");

      queryClient.invalidateQueries({
        queryKey: ["sk-izin-bekerjas"],
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
    mutationFn: updateSkIzinBekerja,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-izin-bekerja");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-izin-bekerjas"],
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

  const onSubmit = async (values: z.infer<typeof skIzinBekerjaSchema>) => {
    const body = {
      ...values,
      waktuIzin: undefined,
      tanggalLahir: dateTimeToISO(values.tanggalLahir),
      izinDariHari: dateTimeToISO(values.waktuIzin.from),
      izinSampaiHari: values.waktuIzin.to
        ? dateTimeToISO(values.waktuIzin.to)
        : dateTimeToISO(values.waktuIzin.from),
    };

    if (initialData) {
      updateMutation.mutate({
        body,
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nama lengkap"
                      maxLength={maxLengthInput}
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
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis kelamin</FormLabel>
                  <FormControl>
                    <SelectGender
                      onChange={field.onChange}
                      disabled={disabledCondition}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Agama"
                      maxLength={maxLengthInput}
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
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Pekerjaan"
                      maxLength={maxLengthInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bagian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bagian</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Bagian"
                      maxLength={maxLengthInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nomorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor ID</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nomor ID"
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
              name="tempatKerja"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Kerja</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Tempat Kerja"
                      maxLength={maxLengthInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="alasan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Alasan"
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="waktuIzin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Izin</FormLabel>
                  <FormControl>
                    <DatePickerWithRange
                      date={field.value}
                      setDate={(dateRange) => field.onChange(dateRange)}
                    />
                  </FormControl>
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

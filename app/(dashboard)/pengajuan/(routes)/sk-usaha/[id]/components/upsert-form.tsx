"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { skUsahaSchema } from "@/schemas/sk-usaha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectGender from "@/components/select-gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkUsaha, updateSkUsaha } from "@/fetcher/sk-usaha-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkUsahaWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { alamatPlaceholder, maxLengthInput } from "@/contants";
import { TextAlignment } from "pdf-lib";

type Props = {
  initialData?: SkUsahaWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skUsahaSchema>>({
    resolver: zodResolver(skUsahaSchema),
    defaultValues: {
      namaLengkap: initialData?.namaLengkap ?? "",
      nik: initialData?.nik ?? "",
      tanggalLahir: initialData?.tanggalLahir ?? undefined,
      jenisKelamin: initialData?.jenisKelamin ?? undefined,
      agama: initialData?.agama ?? "",
      pekerjaan: initialData?.pekerjaan ?? "",
      statusPerkawinan: initialData?.statusPerkawinan ?? undefined,
      kewarganegaraan: initialData?.kewarganegaraan ?? "",
      alamat: initialData?.alamat ?? "",
      namaUsaha: initialData?.namaUsaha ?? "",
      alamatUsaha: initialData?.alamatUsaha ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkUsaha,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-usaha");

      queryClient.invalidateQueries({
        queryKey: ["sk-usahas"],
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
    mutationFn: updateSkUsaha,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-usaha");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-usahas"],
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

  const onSubmit = async (values: z.infer<typeof skUsahaSchema>) => {
    if (initialData) {
      updateMutation.mutate({
        body: {
          ...values,
          tanggalLahir: dateTimeToISO(values.tanggalLahir),
        },
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body: {
          ...values,
          tanggalLahir: dateTimeToISO(values.tanggalLahir),
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
              name="statusPerkawinan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status perkawinan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={disabledCondition}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status perkawinan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KAWIN">Kawin</SelectItem>
                        <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
                        <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
                        <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kewarganegaraan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Kewarganegaraan"
                      maxLength={maxLengthInput}
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
        {/* keterangan usaha */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan usaha</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaUsaha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama usaha</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nama usaha"
                      maxLength={maxLengthInput}
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
                      cols={10}
                      rows={1}
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

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
import { skDomisiliImigrasiSchema } from "@/schemas/sk-domisili-imigrasi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectGender from "@/components/select-gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkDomisiliImigrasi,
  updateSkDomisiliImigrasi,
} from "@/fetcher/sk-domisili-imigrasi-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkDomisiliImigrasiWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import { alamatPlaceholder, maxLengthInput } from "@/contants";
import SelectStatusPerkawinan from "@/components/select-status-perkawinan";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialData?: SkDomisiliImigrasiWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skDomisiliImigrasiSchema>>({
    resolver: zodResolver(skDomisiliImigrasiSchema),
    defaultValues: {
      namaLengkap: initialData?.namaLengkap ?? "",
      tanggalLahir: initialData?.tanggalLahir ?? undefined,
      jenisKelamin: initialData?.jenisKelamin ?? undefined,
      agama: initialData?.agama ?? "",
      pekerjaan: initialData?.pekerjaan ?? "",
      statusPerkawinan: initialData?.statusPerkawinan ?? undefined,
      kewarganegaraan: initialData?.kewarganegaraan ?? "",
      alamat: initialData?.alamat ?? "",
      keperluan: initialData?.keperluan ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkDomisiliImigrasi,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-imigrasi");

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-imigrasis"],
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
    mutationFn: updateSkDomisiliImigrasi,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-imigrasi");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-imigrasis"],
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

  const onSubmit = async (values: z.infer<typeof skDomisiliImigrasiSchema>) => {
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
              name="statusPerkawinan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status perkawinan</FormLabel>
                  <FormControl>
                    <SelectStatusPerkawinan
                      onChange={field.onChange}
                      value={field.value}
                      disabled={disabledCondition}
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
              name="keperluan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keperluan</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Keperluan"
                      maxLength={100}
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

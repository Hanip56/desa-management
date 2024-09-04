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
import { skDomisiliSementaraSchema } from "@/schemas/sk-domisili-sementara";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkDomisiliSementara,
  updateSkDomisiliSementara,
} from "@/fetcher/sk-domisili-sementara-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkDomisiliSementaraWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { alamatPlaceholder, maxLengthInput } from "@/contants";
import SelectGender from "@/components/select-gender";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  initialData?: SkDomisiliSementaraWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skDomisiliSementaraSchema>>({
    resolver: zodResolver(skDomisiliSementaraSchema),
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
      domisiliSementara: initialData?.domisiliSementara ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkDomisiliSementara,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-sementara");

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-sementaras"],
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
    mutationFn: updateSkDomisiliSementara,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-sementara");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-sementaras"],
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
    values: z.infer<typeof skDomisiliSementaraSchema>
  ) => {
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
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nama lengkap"
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
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Agama"
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
              name="kewarganegaraan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Kewarganegaraan"
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
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat asal</FormLabel>
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
              name="domisiliSementara"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domisili sementara</FormLabel>
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

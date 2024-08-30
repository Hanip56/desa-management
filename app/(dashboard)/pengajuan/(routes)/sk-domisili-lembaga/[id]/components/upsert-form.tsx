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
import { skDomisiliLembagaSchema } from "@/schemas/sk-domisili-lembaga";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkDomisiliLembaga,
  updateSkDomisiliLembaga,
} from "@/fetcher/sk-domisili-lembaga-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dateTimeToISO } from "@/lib/utils";
import { SkDomisiliLembagaWithUser } from "@/types";
import DatePicker from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { alamatPlaceholder, maxLengthInput } from "@/contants";

type Props = {
  initialData?: SkDomisiliLembagaWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof skDomisiliLembagaSchema>>({
    resolver: zodResolver(skDomisiliLembagaSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      tempatLahir: initialData?.tempatLahir ?? "",
      tanggalLahir: initialData?.tanggalLahir ?? undefined,
      jabatan: initialData?.jabatan ?? "",
      alamat: initialData?.alamat ?? "",
      namaLembaga: initialData?.namaLembaga ?? "",
      alamatLembaga: initialData?.alamatLembaga ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSkDomisiliLembaga,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-lembaga");

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-lembagas"],
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
    mutationFn: updateSkDomisiliLembaga,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/sk-domisili-lembaga");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-domisili-lembagas"],
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

  const onSubmit = async (values: z.infer<typeof skDomisiliLembagaSchema>) => {
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
              name="jabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Jabatan"
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
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan lembaga</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaLembaga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lembaga</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={maxLengthInput}
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Nama lembaga"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamatLembaga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat lembaga</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabledCondition}
                      {...field}
                      placeholder={alamatPlaceholder}
                      rows={2}
                      className="resize-none"
                      maxLength={100}
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

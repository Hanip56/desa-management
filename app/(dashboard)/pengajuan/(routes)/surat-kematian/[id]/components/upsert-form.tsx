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
import { suratKematianSchema } from "@/schemas/surat-kematian";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectGender from "@/components/select-gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSuratKematian,
  updateSuratKematian,
} from "@/fetcher/surat-kematian-fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { id } from "date-fns/locale";
import { dateTimeToISO } from "@/lib/utils";
import { SuratKematianWithUser } from "@/types";

type Props = {
  initialData?: SuratKematianWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof suratKematianSchema>>({
    resolver: zodResolver(suratKematianSchema),
    defaultValues: {
      namaPemohon: initialData?.namaPemohon ?? "",
      jenisKelaminPemohon: initialData?.jenisKelaminPemohon ?? undefined,
      noNikPemohon: initialData?.noNikPemohon ?? "",
      kampungPemohon: initialData?.kampungPemohon ?? "",
      rtPemohon: initialData?.rtPemohon ?? "",
      rwPemohon: initialData?.rwPemohon ?? "",
      hubunganKeluargaPemohon: initialData?.hubunganKeluargaPemohon ?? "",
      namaTerkait: initialData?.namaTerkait ?? "",
      jenisKelaminTerkait: initialData?.jenisKelaminTerkait ?? undefined,
      noNikTerkait: initialData?.noNikTerkait ?? "",
      kampungTerkait: initialData?.kampungTerkait ?? "",
      rtTerkait: initialData?.rtTerkait ?? "",
      rwTerkait: initialData?.rwTerkait ?? "",
      tanggal: initialData?.tanggal ?? undefined,
      penyebab: initialData?.penyebab ?? "",
      tempat: initialData?.tempat ?? "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createSuratKematian,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-kematian");

      queryClient.invalidateQueries({
        queryKey: ["surat-kematians"],
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
    mutationFn: updateSuratKematian,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-kematian");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["surat-kematians"],
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

  const onSubmit = async (values: z.infer<typeof suratKematianSchema>) => {
    const offset = values.tanggal.getTimezoneOffset() * 60000;

    if (initialData) {
      updateMutation.mutate({
        body: {
          ...values,
          tanggal: dateTimeToISO(values.tanggal),
        },
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body: {
          ...values,
          tanggal: dateTimeToISO(values.tanggal),
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
              name="namaPemohon"
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
              name="jenisKelaminPemohon"
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
              name="noNikPemohon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. NIK</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="NIK"
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hubunganKeluargaPemohon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hubungan Keluarga</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Hubungan keluarga"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="kampungPemohon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kampung"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 [&>*]:flex-1">
                <FormField
                  control={form.control}
                  name="rtPemohon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">RT</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabledCondition}
                          {...field}
                          placeholder="RT"
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rwPemohon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">RW</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabledCondition}
                          {...field}
                          placeholder="RW"
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* keterangan orang terkait */}
        <div>
          <h2 className="text-xl font-medium mb-6">
            Keterangan orang yang meninggal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaTerkait"
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
              name="jenisKelaminTerkait"
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
              name="noNikTerkait"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. NIK</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="NIK"
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="kampungTerkait"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        disabled={disabledCondition}
                        {...field}
                        placeholder="Kampung"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 [&>*]:flex-1">
                <FormField
                  control={form.control}
                  name="rtTerkait"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">RT</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabledCondition}
                          {...field}
                          placeholder="RT"
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rwTerkait"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">RW</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabledCondition}
                          {...field}
                          placeholder="RW"
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* keterngan meninggal */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan Meninggal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Meninggal</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      locale={id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Meninggal</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Tempat meninggal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="penyebab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penyebab Meninggal</FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabledCondition}
                      {...field}
                      placeholder="Penyebab meninggal"
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

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
import { suratKelahiranSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectGender from "@/components/select-gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSuratKelahiran,
  updateSuratKelahiran,
} from "@/fetcher/surat-kelahiran-fetcher";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DatePicker from "@/components/ui/date-picker";
import { endOfDay, formatISO } from "date-fns";
import { SuratKelahiranWithUser } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  initialData?: SuratKelahiranWithUser | null;
};

const UpsertForm = ({ initialData }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof suratKelahiranSchema>>({
    resolver: zodResolver(suratKelahiranSchema),
    defaultValues: {
      namaTerkait: initialData?.namaTerkait ?? "",
      kampungTerkait: initialData?.kampungTerkait ?? "",
      rtTerkait: initialData?.rtTerkait ?? "",
      rwTerkait: initialData?.rwTerkait ?? "",
      tempatLahirTerkait: initialData?.tempatLahirTerkait ?? "",
      tanggalLahirTerkait: initialData?.tanggalLahirTerkait
        ? new Date(initialData.tanggalLahirTerkait)
        : undefined,
      jenisKelaminTerkait: initialData?.jenisKelaminTerkait ?? undefined,
      namaAyah: initialData?.namaAyah ?? "",
      jenisKelaminAyah: initialData?.jenisKelaminAyah ?? undefined,
      kampungAyah: initialData?.kampungAyah ?? "",
      rtAyah: initialData?.rtAyah ?? "",
      rwAyah: initialData?.rwAyah ?? "",
      tempatLahirAyah: initialData?.tempatLahirAyah ?? "",
      tanggalLahirAyah: initialData?.tanggalLahirAyah
        ? new Date(initialData.tanggalLahirAyah)
        : undefined,
      agamaAyah: initialData?.agamaAyah ?? "",
      namaIbu: initialData?.namaIbu ?? "",
      kampungIbu: initialData?.kampungIbu ?? "",
      rtIbu: initialData?.rtIbu ?? "",
      rwIbu: initialData?.rwIbu ?? "",
      tempatLahirIbu: initialData?.tempatLahirIbu ?? "",
      tanggalLahirIbu: initialData?.tanggalLahirIbu
        ? new Date(initialData.tanggalLahirIbu)
        : undefined,
      agamaIbu: initialData?.agamaIbu ?? "",
      jenisKelaminIbu: initialData?.jenisKelaminIbu ?? undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: createSuratKelahiran,
    onSuccess: (data) => {
      toast("Data berhasil diajukan.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-kelahiran");

      queryClient.invalidateQueries({
        queryKey: ["surat-kelahirans"],
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
    mutationFn: updateSuratKelahiran,
    onSuccess: (data) => {
      toast("Data berhasil di ubah.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      router.push("/pengajuan/surat-kelahiran");
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["surat-kelahirans"],
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

  const onSubmit = async (values: z.infer<typeof suratKelahiranSchema>) => {
    if (initialData) {
      updateMutation.mutate({
        body: {
          ...values,
          tanggalLahirTerkait: formatISO(endOfDay(values.tanggalLahirTerkait)),
          tanggalLahirAyah: formatISO(endOfDay(values.tanggalLahirAyah)),
          tanggalLahirIbu: formatISO(endOfDay(values.tanggalLahirIbu)),
        },
        id: initialData.id,
      });
    } else {
      createMutation.mutate({
        body: {
          ...values,
          tanggalLahirTerkait: formatISO(endOfDay(values.tanggalLahirTerkait)),
          tanggalLahirAyah: formatISO(endOfDay(values.tanggalLahirAyah)),
          tanggalLahirIbu: formatISO(endOfDay(values.tanggalLahirIbu)),
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
        {/* keterangan orang terkait */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan orang terkait</h2>
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
              name="tempatLahirTerkait"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat lahir</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tempat lahir"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahirTerkait"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal lahir</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
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
                          onWheel={(e: any) => e.target.blur()}
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
                          onWheel={(e: any) => e.target.blur()}
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
        {/* keterangan ayah */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan ayah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nama"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jenisKelaminAyah"
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
              name="agamaAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Agama"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempatLahirAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat lahir</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tempat lahir"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahirAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal lahir</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* alamat ayah */}
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="kampungAyah"
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
                  name="rtAyah"
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
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rwAyah"
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
                          onWheel={(e: any) => e.target.blur()}
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
        {/* keterangan ibu */}
        <div>
          <h2 className="text-xl font-medium mb-6">Keterangan ibu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
            <FormField
              control={form.control}
              name="namaIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nama"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jenisKelaminIbu"
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
              name="agamaIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama Ibu</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Agama ibu"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempatLahirIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat lahir</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tempat lahir"
                      disabled={disabledCondition}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalLahirIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal lahir</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="kampungIbu"
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
                  name="rtIbu"
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
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rwIbu"
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
                          onWheel={(e: any) => e.target.blur()}
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

        <Button disabled={disabledCondition} type="submit" size="lg">
          {initialData ? "Simpan" : "Ajukan"}
        </Button>
      </form>
    </Form>
  );
};

export default UpsertForm;

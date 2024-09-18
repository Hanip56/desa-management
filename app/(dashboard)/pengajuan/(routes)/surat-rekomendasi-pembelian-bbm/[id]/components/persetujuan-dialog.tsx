"use client";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { maxLengthInput } from "@/contants";
import { updateSuratRekomendasiPembelianBbm } from "@/fetcher/surat-rekomendasi-pembelian-bbm-fetcher";
import { dateToISO } from "@/lib/utils";
import { SuratRekomendasiPembelianBbmWithUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: SuratRekomendasiPembelianBbmWithUser;
};

const formSchema = z.object({
  tempatPengambilan: z.string().min(1, {
    message: "Kolom Tempat pengambilan harus diisi",
  }),
  nomorLembagaPenyalur: z.string().min(1, {
    message: "Kolom Nomor lembaga penyalur harus diisi",
  }),
  lokasi: z.string().min(1, {
    message: "Kolom Lokasi harus diisi",
  }),
  alatPembelianDigunakan: z.string().min(1, {
    message: "Kolom Alat pembelian digunakan harus diisi",
  }),
  masaBerlakuRekomendasi: z.date({
    message: "Kolom Masa berlaku rekomendasi harus diisi",
  }),
  noSurat: z.string().min(1, {
    message: "Kolom No surat harus diisi",
  }),
  tanggal: z.date({
    message: "Kolom tanggal pembuatan harus diisi",
  }),
});

const PersetujuanDialog = ({ open, handleClose, initialData }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const noSuratDefault = `1 KAB/...../32.04.25.2006/TANI/SOLAR/${new Date().getFullYear()}`;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tempatPengambilan: "",
      nomorLembagaPenyalur: "",
      lokasi: "",
      alatPembelianDigunakan: "",
      masaBerlakuRekomendasi: undefined,
      noSurat: noSuratDefault,
      tanggal: undefined,
    },
  });

  const persetujuanMutation = useMutation({
    mutationFn: updateSuratRekomendasiPembelianBbm,
    onSuccess: () => {
      toast("Pengajuan berhasil disetujui.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.reset();
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["surat-rekomendasi-pembelian-bbms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications-admin"],
      });
    },
    onError: (error) => {
      toast("Pengajuan gagal disetujui.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const body = {
      ...values,
      tanggalPembuatan: dateToISO(values.tanggal),
      tanggal: undefined,
      masaBerlakuRekomendasi: dateToISO(values.masaBerlakuRekomendasi),
      status: "DITERIMA" as const,
    };

    persetujuanMutation.mutate({
      id: initialData.id,
      body,
    });
  };

  const disabledCondition = persetujuanMutation.isPending;

  return (
    <Modal
      title="Terima pengajuan"
      description="Surat rekomendasi pembelian BBM"
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 max-h-96 overflow-y-auto px-2"
        >
          <FormField
            control={form.control}
            name="tempatPengambilan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat pengambilan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tempat pengambilan"
                    disabled={disabledCondition}
                    maxLength={maxLengthInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomorLembagaPenyalur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor lembaga penyalur</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nomor lembaga penyalur"
                    disabled={disabledCondition}
                    maxLength={maxLengthInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lokasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Lokasi"
                    disabled={disabledCondition}
                    maxLength={maxLengthInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alatPembelianDigunakan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alat pembelian digunakan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Alat pembelian digunakan"
                    disabled={disabledCondition}
                    maxLength={maxLengthInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="masaBerlakuRekomendasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masa berlaku rekomendasi</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noSurat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No Surat</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={noSuratDefault}
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Pembuatan</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={disabledCondition} variant="confirm">
            Konfirmasi
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default PersetujuanDialog;

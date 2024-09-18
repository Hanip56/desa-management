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
import { updateSuratKematian } from "@/fetcher/surat-kematian-fetcher";
import { dateToISO } from "@/lib/utils";
import { SuratKematianWithUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: SuratKematianWithUser;
};

const formSchema = z.object({
  noSurat: z.string().min(1, {
    message: "Kolom No surat harus diisi",
  }),
  tanggal: z.date({
    message: "Kolom tanggal pembuatan harus diisi",
  }),
});

const PersetujuanDialog = ({ open, handleClose, initialData }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const noSuratDefault = `S-17/.../PEM/${new Date().getFullYear()}`;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noSurat: noSuratDefault,
    },
  });

  const persetujuanMutation = useMutation({
    mutationFn: updateSuratKematian,
    onSuccess: () => {
      toast("Pengajuan berhasil disetujui.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.reset();
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["surat-kematians"],
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
      noSurat: values.noSurat,
      tanggalPembuatan: dateToISO(values.tanggal),
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
      description="Surat kematian"
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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

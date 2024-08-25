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
import { updateSkIjinKeramaian } from "@/fetcher/sk-ijin-keramaian-fetcher";
import { dateToISO } from "@/lib/utils";
import { SkIjinKeramaianWithUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: SkIjinKeramaianWithUser;
};

const formSchema = z.object({
  noSurat: z.string().min(1, {
    message: "Kolom No surat harus diisi",
  }),
  tanggal: z.date({
    message: "Kolom Tanggal pembuatan harus diisi",
  }),
});

const PersetujuanDialog = ({ open, handleClose, initialData }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noSurat: "S-12/.../PEM/2024",
      tanggal: undefined,
    },
  });

  const persetujuanMutation = useMutation({
    mutationFn: updateSkIjinKeramaian,
    onSuccess: () => {
      toast("Pengajuan berhasil disetujui.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.reset();
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-ijin-keramaians"],
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
      tanggal: undefined,
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
      description="Surat keterangan ijin keramaian"
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="max-h-96 overflow-y-auto px-2 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="noSurat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Surat</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="S.21/.../PEM/2024"
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
          </div>
          <Button disabled={disabledCondition} variant="confirm">
            Konfirmasi
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default PersetujuanDialog;

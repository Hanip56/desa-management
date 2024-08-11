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
import Modal from "@/components/ui/modal";
import { updateSkBelumMenikah } from "@/fetcher/sk-belum-menikah-fetcher";
import { SkBelumMenikahWithUser } from "@/types";
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
  initialData: SkBelumMenikahWithUser;
};

const formSchema = z.object({
  alasanDitolak: z.string().optional(),
});

const TolakDialog = ({ open, handleClose, initialData }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alasanDitolak: "",
    },
  });

  const tolakMutation = useMutation({
    mutationFn: updateSkBelumMenikah,
    onSuccess: () => {
      toast("Pengajuan berhasil ditolak.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      handleClose();
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ["sk-belum-menikahs"],
      });
    },
    onError: (error) => {
      toast("Pengajuan gagal ditolak.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    tolakMutation.mutate({
      id: initialData.id,
      body: { pesanDitolak: values.alasanDitolak, status: "DITOLAK" },
    });
  };

  const disabledCondition = tolakMutation.isPending;

  return (
    <Modal
      title="Tolak pengajuan"
      description="Surat keterangan belum menikah"
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
            name="alasanDitolak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alasan ditolak</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Alasan pengajuan ditolak"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={disabledCondition} variant="destructive">
            Konfirmasi
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default TolakDialog;

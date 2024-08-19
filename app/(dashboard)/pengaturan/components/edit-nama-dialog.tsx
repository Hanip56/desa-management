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
import { updateSetting } from "@/fetcher/setting-fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SettingClient } from "../page";

type Props = {
  setting: SettingClient;
  open: boolean;
  handleClose: () => void;
};

const formSchema = z.object({
  namaKepalaDesa: z.string().min(1, {
    message: "Kolom Nama Kepala Desa harus diisi",
  }),
});

const EditNamaDialog = ({ setting, open, handleClose }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaKepalaDesa: setting.namaKepalaDesa ?? "",
    },
  });

  const settingMutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: (data) => {
      toast("Pengaturan berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.setValue("namaKepalaDesa", data.namaKepalaDesa);
      router.refresh();
    },
    onError: (error) => {
      toast("Pengaturan gagal diedit.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    settingMutation.mutate({
      ...values,
    });
  };

  const disabledCondition = settingMutation.isPending;

  return (
    <Modal
      title="Edit pengaturan"
      description="Nama kepala desa"
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
            name="namaKepalaDesa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama kepala desa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nama kepala desa"
                    disabled={disabledCondition}
                  />
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

export default EditNamaDialog;

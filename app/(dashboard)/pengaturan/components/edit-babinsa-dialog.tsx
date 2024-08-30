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
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  pangkat: z.string().min(1, {
    message: "Kolom pangkat harus diisi",
  }),
  nrp: z.string().min(1, {
    message: "Kolom nrp harus diisi",
  }),
  jabatan: z.string().min(1, {
    message: "Kolom jabatan harus diisi",
  }),
});

const EditBabinsaDialog = ({ setting, open, handleClose }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: setting.namaBabinsa ?? "",
      pangkat: setting.pangkatBabinsa ?? "",
      nrp: setting.nrpBabinsa ?? "",
      jabatan: setting.jabatanBabinsa ?? "",
    },
  });

  const settingMutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: (data) => {
      toast("Pengaturan berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.setValue("nama", data.namaBabinsa);
      form.setValue("pangkat", data.pangkatBabinsa);
      form.setValue("nrp", data.nrpBabinsa);
      form.setValue("jabatan", data.jabatanBabinsa);
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
      namaBabinsa: values.nama,
      pangkatBabinsa: values.pangkat,
      nrpBabinsa: values.nrp,
      jabatanBabinsa: values.jabatan,
    });
  };

  const disabledCondition = settingMutation.isPending;

  return (
    <Modal
      title="Edit pengaturan"
      description="Babinsa"
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
            name="nama"
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
            name="pangkat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pangkat</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Pangkat"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NRP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="NRP"
                    disabled={disabledCondition}
                    min={0}
                    type="number"
                    onWheel={(e: any) => e.target.blur()}
                  />
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
                    {...field}
                    placeholder="Jabatan"
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

export default EditBabinsaDialog;

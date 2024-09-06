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
import { updateUser } from "@/fetcher/user-fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Kolom Username harus diisi",
  }),
  nomorWa: z.string().min(1, {
    message: "Kolom Nomor WA harus diisi",
  }),
});

const EditProfilDialog = ({ open, handleClose }: Props) => {
  const { update, data: session } = useSession();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user.username ?? "",
      nomorWa: session?.user.nomorWa ?? "",
    },
  });

  const userMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast("Profil berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.setValue("nomorWa", data.nomorWa);
      form.setValue("username", data.username);
      update({ username: data.username, nomorWa: data.nomorWa });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      toast("Profil gagal diedit.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id) return;

    userMutation.mutate({
      userId: session?.user.id,
      ...values,
    });
  };

  const disabledCondition = userMutation.isPending;

  return (
    <Modal
      title="Edit profil"
      description="username / nomorWa"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Username"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomorWa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WA</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nomor WA"
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

export default EditProfilDialog;

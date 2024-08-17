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
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const formSchema = z.object({
  passwordLama: z.string().min(1, {
    message: "Kolom Password lama harus diisi",
  }),
  passwordBaru: z.string().min(6, {
    message: "Kolom Password minimal harus 6 karakter",
  }),
});

const EditPasswordDialog = ({ open, handleClose }: Props) => {
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordLama: "",
      passwordBaru: "",
    },
  });

  const userMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast("Password berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.reset();
    },
    onError: (error) => {
      toast("Password gagal diedit.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id) return;

    userMutation.mutate({
      userId: session?.user.id,
      password: values.passwordBaru,
      oldPassword: values.passwordLama,
    });
  };

  const disabledCondition = userMutation.isPending;

  return (
    <Modal
      title="Edit profil"
      description="password"
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
            name="passwordLama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password lama</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Password lama"
                    disabled={disabledCondition}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordBaru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Password baru"
                    disabled={disabledCondition}
                    type="password"
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

export default EditPasswordDialog;

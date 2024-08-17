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
import { useRouter } from "next/navigation";
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
  email: z.string().email({
    message: "Kolom Email tidak valid",
  }),
});

const EditProfilDialog = ({ open, handleClose }: Props) => {
  const { update, data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user.username ?? "",
      email: session?.user.email ?? "",
    },
  });

  const userMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast("Profil berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.setValue("email", data.email);
      form.setValue("username", data.username);
      update({ username: data.username, email: data.email });

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
      description="username / email"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
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

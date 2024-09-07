"use client";

import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/fetcher/user-fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  nomorWa: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
    message: "Kolom nomor WA tidak valid",
  }),
  password: z.string().min(6, {
    message: "Kolom kata sandi harus diisi minimal 6 karakter",
  }),
  passwordConfirmation: z.string().min(1, {
    message: "Kolom konfirmasi kata sandi harus diisi",
  }),
  role: z.string().min(1, {
    message: "Kolom role harus diisi",
  }),
});

const InsertComp = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: "",
      nomorWa: "",
      role: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const userMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast("User berhasil dibuat.", {
        className: "text-emerald-600 font-semibold",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/pengguna");
    },
    onError: (error) => {
      toast("User gagal dibuat.", {
        className: "text-rose-600 font-semibold",
      });
      setError(error?.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    if (values.password !== values.passwordConfirmation) {
      setError("Kolom konfirmasi password tidak sama");
      return;
    }
    setError("");

    userMutation.mutate({
      username: values.nama,
      nomorWa: values.nomorWa,
      password: values.password,
      role: values.role,
    });
  };

  const disabledCondition = userMutation.isPending;

  return (
    <Card className="mt-8 rounded-2xl overflow-hidden">
      <CardContent className="py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 sm:gap-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukan nama"
                        disabled={disabledCondition}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 [&>*]:flex-1">
                <FormField
                  control={form.control}
                  name="nomorWa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor WA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukan nomor WA"
                          type="number"
                          min={0}
                          onWheel={(e: any) => e.target.blur()}
                          disabled={disabledCondition}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                          disabled={disabledCondition}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="USER">USER</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 [&>*]:flex-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata sandi</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukan kata sandi"
                          type="password"
                          disabled={disabledCondition}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem className="sm:pt-6">
                      <FormLabel className="sr-only">Kata sandi</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Konfirmasi kata sandi"
                          type="password"
                          disabled={disabledCondition}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
            </div>
            <Button
              type="submit"
              className="mt-6 w-full rounded-3xl"
              disabled={disabledCondition}
            >
              Buat
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InsertComp;

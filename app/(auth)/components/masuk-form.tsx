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
import { masukSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState, useTransition } from "react";
import login from "@/actions/login";
import { FormError } from "@/components/form-error";

const MasukForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof masukSchema>>({
    resolver: zodResolver(masukSchema),
    defaultValues: {
      nomorWa: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof masukSchema>) => {
    setError("");
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          toast("Selamat datang kembali!", {
            className: "text-emerald-600 font-semibold",
            description:
              "Aplikasi pengelolaan surat desa Margaasih, Buat surat pengajuan secara online.",
            descriptionClassName: "text-slate-600",
          });
          window.location.href = "/";
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 sm:gap-4">
          <FormField
            control={form.control}
            name="nomorWa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WA</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukan Nomor WA"
                    type="number"
                    min={0}
                    onWheel={(e: any) => e.target.blur()}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
        </div>
        <Button
          type="submit"
          className="mt-6 w-full rounded-3xl"
          disabled={isPending}
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
};

export default MasukForm;

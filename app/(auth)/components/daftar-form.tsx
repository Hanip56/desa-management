"use client";

import login from "@/actions/login";
import { FormError } from "@/components/form-error";
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
import { daftarSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const DaftarForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof daftarSchema>>({
    resolver: zodResolver(daftarSchema),
    defaultValues: {
      nama: "",
      nomorWa: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof daftarSchema>) => {
    setError("");

    const body = {
      nomorWa: values.nomorWa,
      password: values.password,
      username: values.nama,
    };

    try {
      setIsLoading(true);
      const res = await axios.post(`/api/auth/register`, body);

      if (res.status !== 200 && res.data) {
        console.log({ resData: res.data });
        throw new Error(res.data);
      }

      // after register success invoke login
      await login({ nomorWa: values.nomorWa, password: values.password }).then(
        (data) => {
          if (data?.error) {
            setError(data.error);
          } else if (data?.success) {
            toast("Daftar telah berhasil!", {
              className: "text-emerald-600 font-semibold",
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero neque ducimus doloremque.",
              descriptionClassName: "text-slate-600",
            });
            window.location.href = "/";
          }
        }
      );
    } catch (error) {
      console.log(error);
      setError((error as any)?.response?.data || (error as any)?.message || "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                    disabled={isLoading}
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
                    placeholder="Masukan nomor Wa"
                    type="number"
                    min={0}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukan password"
                    type="password"
                    disabled={isLoading}
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
          disabled={isLoading}
        >
          Daftar
        </Button>
      </form>
    </Form>
  );
};

export default DaftarForm;

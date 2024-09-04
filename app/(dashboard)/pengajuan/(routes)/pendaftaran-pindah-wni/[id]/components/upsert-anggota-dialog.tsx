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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnggotaPindahSchema } from "@/schemas/pendaftaran-pindah-wni";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const shdks = [
  "Kepala keluarga",
  "Suami",
  "Istri",
  "Anak",
  "Menantu",
  "Cucu",
  "Orang tua",
  "Mertua",
  "Famili lainnya",
  "Pembantu",
];

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: z.infer<typeof AnggotaPindahSchema>;
  handleChange: (value: z.infer<typeof AnggotaPindahSchema>) => void;
};

const UpsertAnggotaDialog = ({
  open,
  handleClose,
  initialData,
  handleChange,
}: Props) => {
  const form = useForm<z.infer<typeof AnggotaPindahSchema>>({
    resolver: zodResolver(AnggotaPindahSchema),
    defaultValues: {
      namaLengkap: initialData?.namaLengkap ?? "",
      nik: initialData?.nik ?? "",
      masaBerlakuKtp: initialData?.masaBerlakuKtp ?? undefined,
      shdk: initialData?.shdk ?? "",
    },
  });

  useEffect(() => {
    if (!initialData) return;

    form.setValue("namaLengkap", initialData?.namaLengkap ?? "");
    form.setValue("nik", initialData?.nik ?? "");
    form.setValue("shdk", initialData?.shdk ?? "");
    if (initialData?.masaBerlakuKtp) {
      form.setValue("masaBerlakuKtp", initialData?.masaBerlakuKtp);
    }
  }, [initialData]);

  const onSubmit = (values: z.infer<typeof AnggotaPindahSchema>) => {
    handleChange(values);
    handleClose();
    form.reset();
  };

  const disabledCondition = false;

  return (
    <Modal
      title="Tambah anggota pindah"
      description="Pendaftaran pindah wni"
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
            name="namaLengkap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama lengkap</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nama lengkap"
                    disabled={disabledCondition}
                    maxLength={25}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="NIK"
                    disabled={disabledCondition}
                    type="number"
                    min={0}
                    onWheel={(e: any) => e.target.blur()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="masaBerlakuKtp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masa Berlaku KTP</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shdk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SHDK</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status Hubungan Dalam Keluarga" />
                    </SelectTrigger>
                    <SelectContent>
                      {shdks.map((shdk) => (
                        <SelectItem key={shdk} value={shdk}>
                          {shdk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={disabledCondition} variant="confirm">
            Tambah
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertAnggotaDialog;

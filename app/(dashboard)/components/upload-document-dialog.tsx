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
import { patchUser } from "@/fetcher/user-fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 mb
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  ktp: z
    .any()
    .refine((file) => file, { message: "Kolom KTP harus diisi" })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: "Format image harus; jpeg/jpg/png/webp",
    })
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File harus kurang dari 5mb",
    }),
  kk: z
    .any()
    .refine((file) => file, { message: "Kolom KK harus diisi" })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: "Format image harus; jpeg/jpg/png/webp",
    })
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File harus kurang dari 5mb",
    }),
});

const UploadDocumentDialog = ({ open, handleClose }: Props) => {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ktp: undefined,
      kk: undefined,
    },
  });

  const ktpRef = useRef<HTMLInputElement>(null);
  const kkRef = useRef<HTMLInputElement>(null);
  const ktpState = form.watch("ktp");
  const kkState = form.watch("kk");

  const userMutation = useMutation({
    mutationFn: patchUser,
    onSuccess: (data) => {
      toast("Dokumen berhasil diunggah.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      update({ ktpUrl: data.ktpUrl, kkUrl: data.kkUrl });
      form.reset();
    },
    onError: (error) => {
      toast("Dokumen gagal diunggah.", {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    userMutation.mutate({
      ktpFile: values.ktp,
      kkFile: values.kk,
    });
  };

  const disabledCondition = userMutation.isPending;

  return (
    <Modal
      title="Unggah KTP & KK"
      description="Harap masukan dokumen yang valid."
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 [&>*]:flex-1">
            <FormField
              control={form.control}
              name="ktp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KTP</FormLabel>
                  {ktpState && (
                    <div key={`preview-ktp-image`} className="relative">
                      <Image
                        src={URL.createObjectURL(ktpState)}
                        alt="Preview-image"
                        width={500}
                        height={500}
                        className="w-full h-28 sm:h-40 object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => field.onChange(undefined)}
                        className="absolute top-1 left-1 w-8 h-8"
                        size="icon"
                        variant="destructive"
                      >
                        <Trash className="w-4 h-4" />{" "}
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    {!ktpState && (
                      <div>
                        <Input
                          {...field}
                          disabled={disabledCondition}
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          type="file"
                          ref={ktpRef}
                          className="sr-only"
                          aria-label="sr-only input"
                        />
                        <button
                          className="w-full h-28 sm:h-40 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center hover:bg-slate-50"
                          type="button"
                          onClick={() => ktpRef.current?.click()}
                        >
                          <Plus className="size-10 text-slate-400" />
                        </button>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KK</FormLabel>
                  {kkState && (
                    <div key={`preview-kk-image`} className="relative">
                      <Image
                        src={URL.createObjectURL(kkState)}
                        alt="Preview-image"
                        width={500}
                        height={500}
                        className="w-full h-28 sm:h-40 object-contain rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => field.onChange(undefined)}
                        className="absolute top-1 left-1 w-8 h-8"
                        size="icon"
                        variant="destructive"
                      >
                        <Trash className="w-4 h-4" />{" "}
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    {!kkState && (
                      <div>
                        <Input
                          {...field}
                          disabled={disabledCondition}
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          type="file"
                          ref={kkRef}
                          className="sr-only"
                          aria-label="sr-only input"
                        />
                        <button
                          className="w-full h-28 sm:h-40 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center hover:bg-slate-50"
                          type="button"
                          onClick={() => kkRef.current?.click()}
                        >
                          <Plus className="size-10 text-slate-400" />
                        </button>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={disabledCondition}
            className="bg-sky-600 hover:bg-sky-600/80"
          >
            Unggah
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UploadDocumentDialog;

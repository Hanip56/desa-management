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
import { Setting } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { PictureInPicture, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SettingClient } from "../page";
import { base64ToFile } from "@/lib/utils";

type Props = {
  setting: SettingClient;
  open: boolean;
  handleClose: () => void;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 mb
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  tte: z
    .any()
    .refine((file) => file, { message: "Kolom TTE harus diisi" })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      message: "Format image harus; jpeg/jpg/png/webp",
    })
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: "File harus kurang dari 1mb",
    }),
});

const EditTteDialog = ({ setting, open, handleClose }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tte: undefined,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const tteState = form.watch("tte");

  const settingMutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: (data) => {
      toast("Pengaturan berhasil diedit.", {
        className: "text-emerald-600 font-semibold",
      });
      handleClose();
      form.reset();
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
    settingMutation.mutate(values);
  };

  const disabledCondition = settingMutation.isPending;

  return (
    <Modal
      title="Edit pengaturan"
      description="Tanda tangan / tte"
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
            name="tte"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TTE</FormLabel>
                {tteState && (
                  <div key={`preview-tte- image`} className="relative">
                    <Image
                      src={URL.createObjectURL(tteState)}
                      alt="Preview-image"
                      width={500}
                      height={500}
                      className="w-40 h-40 object-contain rounded-lg"
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
                  {!tteState && (
                    <div>
                      <Input
                        {...field}
                        disabled={disabledCondition}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        type="file"
                        ref={inputRef}
                        className="sr-only"
                        aria-label="sr-only input"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                      >
                        <PictureInPicture className="w-4 h-4 mr-2" /> Upload
                        Gambar
                      </Button>
                    </div>
                  )}
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

export default EditTteDialog;

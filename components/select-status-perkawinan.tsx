import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  onChange: (...event: any[]) => void;
  value: "KAWIN" | "BELUM_KAWIN" | "CERAI_HIDUP" | "CERAI_MATI";
  disabled?: boolean;
};

const SelectStatusPerkawinan = ({ onChange, disabled, value }: Props) => {
  return (
    <Select onValueChange={onChange} disabled={disabled} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih status perkawinan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="KAWIN">Kawin</SelectItem>
        <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
        <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
        <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectStatusPerkawinan;

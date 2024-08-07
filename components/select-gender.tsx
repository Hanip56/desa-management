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
  value: "L" | "P";
  disabled?: boolean;
};

const SelectGender = ({ onChange, disabled, value }: Props) => {
  return (
    <Select onValueChange={onChange} disabled={disabled} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih jenis kelamin" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="L">Laki-laki</SelectItem>
        <SelectItem value="P">Perempuan</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectGender;

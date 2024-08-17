import React from "react";

type Props = {
  label: string;
  value: string;
};

const ListPengaturan = ({ label, value }: Props) => {
  return (
    <li className="flex items-center justify-between py-6 border-t">
      <p className="basis-[30%] font-semibold">{label}</p>
      <p className="flex-1 text-sm">{value}</p>
    </li>
  );
};

export default ListPengaturan;

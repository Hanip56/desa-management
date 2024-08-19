import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  label: string;
  value: string;
  action?: () => void;
  actionLabel?: string;
};

const ListSetting = ({ label, value, action, actionLabel }: Props) => {
  return (
    <li className="flex flex-col gap-2 sm:flex-row items-center justify-between py-6 border-t">
      <p className="basis-[30%] font-semibold">{label}</p>
      <p className="flex-1 text-sm">{value}</p>
      {action && actionLabel && (
        <Button
          size="sm"
          variant="secondary"
          className="text-sm text-slate-500 font-normal"
          onClick={action}
        >
          {actionLabel}
        </Button>
      )}
    </li>
  );
};

export default ListSetting;

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

const StatusBadge = ({
  status,
}: {
  status: "DIPROSES" | "DITERIMA" | "DITOLAK";
}) => {
  return (
    <Badge
      className={cn(
        status === "DIPROSES" &&
          "bg-yellow-600/15 text-yellow-600 hover:bg-yellow-600/15",
        status === "DITERIMA" &&
          "bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600/15",
        status === "DITOLAK" &&
          "bg-rose-700/15 text-rose-700 hover:bg-rose-700/15"
      )}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RiInboxArchiveFill } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import ModalNotifForAdmin from "./modal-notif-for-admin";
import { useQuery } from "@tanstack/react-query";
import { getPengajuanCountAndLatest } from "@/fetcher/pengajuan-fetcher";

const NotifForAdmin = () => {
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ["notifications-admin"],
    queryFn: () => getPengajuanCountAndLatest(),
    refetchInterval: 60 * 1000 * 5, // 5 minutes
  });

  if (query.isError) return null;

  const disabledCondition = query.isFetching || query.isLoading;

  return (
    <>
      <div className="fixed z-[5] bottom-5 right-2">
        <ModalNotifForAdmin
          isVisible={open}
          list={query.data?.latestRecords ?? []}
          totalDiproses={query?.data?.totalDiproses ?? 0}
          handleClose={() => setOpen(false)}
        />

        <div className="relative">
          {!open && !disabledCondition && (
            <div className="absolute -top-2 -right-1 size-6 bg-yellow-400 rounded-full border-2 border-white text-xs flex items-center justify-center text-center font-bold text-emerald-900">
              {query.data?.totalDiproses ?? 0}
            </div>
          )}
          <Button
            id="notif-btn"
            size="icon"
            className="size-14 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-600/80"
            onClick={() => setOpen((prev) => !prev)}
            disabled={disabledCondition}
          >
            {!open && <RiInboxArchiveFill color="#ffffff" className="size-6" />}
            {open && <FiChevronDown color="#ffffff" className="size-6" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotifForAdmin;

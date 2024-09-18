import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { RecordTypeGetPengajuanCountAndLatest } from "@/fetcher/pengajuan-fetcher";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { id } from "date-fns/locale";

const ModalNotifForAdmin = ({
  isVisible,
  list,
  totalDiproses,
  handleClose,
}: {
  isVisible: boolean;
  list: RecordTypeGetPengajuanCountAndLatest[];
  totalDiproses: number;
  handleClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (
      ref.current &&
      !ref.current.contains(target) &&
      target?.id !== "notif-btn"
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      className={
        "overflow-hidden shadow-xl bg-white fixed w-full h-full top-0 left-0 sm:top-auto sm:left-auto sm:absolute sm:right-1 sm:bottom-16 sm:w-96 sm:h-fit sm:rounded-2xl sm:border border-slate-300 animate-fade-in"
      }
    >
      <div className="w-full py-2 bg-emerald-600 text-center flex items-center justify-center font-semibold text-white">
        <div>
          <h5>Pengajuan diproses ({totalDiproses})</h5>
          <p className="text-slate-200 text-xs font-light">
            Menampilkan {list.length < 5 ? list.length : 5} terbaru
          </p>
        </div>
      </div>
      {list && list.length > 0 ? (
        <ul>
          {list.map((record, i) => (
            <li
              key={i}
              className="px-4 hover:bg-gray-100 transition-[background]"
            >
              <Link
                href={record.link}
                className=" border-b text-sm px-1 py-3 flex gap-3 items-center"
                onClick={handleClose}
              >
                <div className="text-center text-emerald-600 border-r pr-3">
                  <b className="text-base">
                    {format(new Date(record.createdAt), "d")}
                  </b>
                  <p className="text-[0.55rem]">
                    {format(new Date(record.createdAt), "MMM y", {
                      locale: id,
                    })}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{record.jenis}</p>
                  <p className="text-[0.65rem] text-slate-400">
                    ID: {record.id}
                  </p>
                </div>
                <div className="flex items-center justify-center basis-[5%]">
                  <FiChevronRight className="size-4"></FiChevronRight>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full h-80 flex flex-col gap-3 items-center justify-center text-center text-slate-400">
          <CheckCircle className="size-8" />
          <p className="text-xs font-medium">Semua pengajuan telah diproses</p>
        </div>
      )}
    </div>
  );
};

export default ModalNotifForAdmin;

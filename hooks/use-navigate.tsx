"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { StatusType } from "@/types";

export const useNavigate = (): [
  number,
  () => void,
  () => void,
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  string, // status
  (status?: StatusType) => void // handleFilterStatus
] => {
  const params = qs.parse(useSearchParams().toString());
  const router = useRouter();
  const pathname = usePathname();
  const page = params?.page ? Number(params.page) : 1;
  const status = params?.status ? params.status.toString() : "";
  const [search, setSearch] = useState(params?.search?.toString() ?? "");
  const debouncedSearch = useDebounce(search);

  const handleNavigate = useCallback(
    (q: Record<string, string | number>) => {
      const query = {
        ...params,
        ...q,
      };

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query,
        },
        { skipEmptyString: true, skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [params, router, pathname]
  );

  const handleNext = () => {
    handleNavigate({
      page: page + 1,
    });
  };

  const handlePrevious = () => {
    handleNavigate({
      page: page - 1,
    });
  };

  const handleFilterStatus = (status?: StatusType) => {
    handleNavigate({
      status: status ?? "",
      page: 1,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // handle Search
  useEffect(() => {
    handleNavigate({
      search: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch]);

  return [
    page,
    handleNext,
    handlePrevious,
    search,
    handleSearch,
    status,
    handleFilterStatus,
  ];
};

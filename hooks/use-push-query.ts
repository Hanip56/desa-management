"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback } from "react";

export const usePushQuery = (): ((
  q: Record<string, string | number>
) => void) => {
  const params = qs.parse(useSearchParams().toString());
  const router = useRouter();
  const pathname = usePathname();

  const handlePushQuery = useCallback(
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

  return handlePushQuery as (q: Record<string, string | number>) => void;
};

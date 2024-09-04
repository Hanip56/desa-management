import React from "react";

type Props = {
  lists: string[];
};

const ListsPersyaratan = ({ lists }: Props) => {
  return (
    <ul>
      {lists.map((list, i) => (
        <li key={i} className="flex gap-4 sm:gap-10 items-center py-4 border-b">
          <div className="size-8 sm:size-10 flex-shrink-0 rounded-full text-center flex items-center justify-center bg-emerald-600/15 text-emerald-600 font-semibold text-sm sm:text-base">
            {i + 1}
          </div>
          <span className="font-medium text-sm sm:text-base">{list}</span>
        </li>
      ))}
    </ul>
  );
};

export default ListsPersyaratan;

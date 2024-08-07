import React from "react";

type Props = {
  label: string;
  value: string;
};

const SemiField = ({ label, value }: Props) => {
  return (
    <div>
      {/* label */}
      <small className="font-semibold">{label}</small>
      <p className="mt-2">{value}</p>
    </div>
  );
};

export default SemiField;

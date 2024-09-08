"use client";

import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: "/masuk",
    });
  }, []);

  return <div></div>;
};

export default LogoutPage;

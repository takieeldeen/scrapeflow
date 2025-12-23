import Logo from "@/components/Logo";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-4 py-4 items-center justify-center ">
      <Logo />
      {children}
    </div>
  );
}

export default AuthLayout;

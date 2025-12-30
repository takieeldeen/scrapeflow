import BreadcrumbHeader from "@/components/breadcrumpHeader";
import DesktopSidebar from "@/components/sidebar";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen ">
        <header className="flex items-center justify-between px-6 py-4 h-12.5 container w-full  max-w-full">
          <BreadcrumbHeader />
          <div className="gap-1 flex items-center">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        <Separator />
        <div className="overflow-auto h-full">
          <div className="flex-1 container max-w-full px-4 py-2 text-accent-foreground h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;

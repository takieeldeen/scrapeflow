import React, { ComponentProps } from "react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface props {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  titleProps?: Omit<ComponentProps<"p">, "children">;
  subtitleProps?: Omit<ComponentProps<"p">, "children">;
  iconProps?: LucideProps;
}
function CustomDialogHeader({
  title,
  subtitle,
  icon,
  titleProps,
  subtitleProps,
  iconProps,
}: props) {
  const Icon = icon;
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild {...titleProps}>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon
              {...iconProps}
              size={30}
              className={cn("stroke-primary", iconProps?.className)}
            />
          )}
          {title && (
            <p
              {...titleProps}
              className={cn("text-xl text-primary", titleProps?.className)}
            >
              {title}
            </p>
          )}
          {subtitle && (
            <p
              {...subtitleProps}
              className={cn(
                "text-sm text-muted-foreground",
                subtitleProps?.className
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}

export default CustomDialogHeader;

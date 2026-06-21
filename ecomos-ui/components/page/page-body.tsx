import { cn } from "@/lib/utils";

/** Standard page workspace padding. Tables/timelines may opt out of max-width. */
export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-4 py-4 sm:px-6 sm:py-5", className)}>{children}</div>;
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type YcBadgeProps = {
  batch: string;
  url?: string | null;
  className?: string;
};

export function YcBadge({ batch, url, className }: YcBadgeProps) {
  const content = (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border-[#ff5a1f]/35 bg-[#ff5a1f]/10 px-2.5 py-1 font-mono text-[10px] font-normal text-[#ff5a1f]",
        className,
      )}
    >
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-[#ff5a1f] text-[11px] font-semibold leading-none text-white"
        aria-hidden="true"
      >
        Y
      </span>
      <span className="truncate">YC backed - {batch}</span>
    </Badge>
  );

  if (!url) {
    return content;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label={`YC backed, ${batch}`}
    >
      {content}
    </a>
  );
}

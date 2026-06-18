import {
  siAirbnb,
  siDatadog,
  siDuolingo,
  siFigma,
  siNotion,
  siPerplexity,
  siShopify,
  siStripe,
  siZillow,
  type SimpleIcon,
} from "simple-icons";

import { cn } from "@/lib/utils";

type StartupLogoProps = {
  slug: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

type LogoDefinition =
  | {
      type: "simple";
      icon: SimpleIcon;
    }
  | {
      type: "remote";
      src: string;
    }
  | {
      type: "wordmark";
      label: string;
      color: string;
    };

const logos: Record<string, LogoDefinition> = {
  airbnb: { type: "simple", icon: siAirbnb },
  canva: {
    type: "remote",
    src: "https://api.iconify.design/devicon/canva.svg",
  },
  datadog: { type: "simple", icon: siDatadog },
  docusign: {
    type: "remote",
    src: "https://api.iconify.design/cib/docusign.svg?color=%23f2efdf",
  },
  duolingo: { type: "simple", icon: siDuolingo },
  figma: { type: "simple", icon: siFigma },
  mercury: {
    type: "remote",
    src: "https://mercury.com/icon.svg",
  },
  notion: { type: "simple", icon: siNotion },
  perplexity: { type: "simple", icon: siPerplexity },
  ramp: {
    type: "wordmark",
    label: "R",
    color: "#e4ff54",
  },
  salesforce: {
    type: "remote",
    src: "https://api.iconify.design/logos/salesforce.svg",
  },
  shopify: { type: "simple", icon: siShopify },
  stripe: { type: "simple", icon: siStripe },
  toast: {
    type: "wordmark",
    label: "T",
    color: "#f05a28",
  },
  twilio: {
    type: "remote",
    src: "https://api.iconify.design/logos/twilio-icon.svg",
  },
  workday: {
    type: "remote",
    src: "https://api.iconify.design/arcticons/workday.svg?color=%23f68d2e",
  },
  zillow: { type: "simple", icon: siZillow },
};

const sizeClasses = {
  sm: "size-9 rounded-md",
  md: "size-12 rounded-md",
  lg: "size-16 rounded-lg",
};

const iconSizeClasses = {
  sm: "size-5",
  md: "size-7",
  lg: "size-9",
};

export function StartupLogo({
  slug,
  name,
  size = "md",
  className,
}: StartupLogoProps) {
  const logo = logos[slug];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-border bg-background/70",
        sizeClasses[size],
        className,
      )}
      title={`${name} logo`}
    >
      {logo?.type === "simple" ? (
        <svg
          role="img"
          aria-label={`${name} logo`}
          viewBox="0 0 24 24"
          className={iconSizeClasses[size]}
          style={{ fill: `#${logo.icon.hex}` }}
        >
          <path d={logo.icon.path} />
        </svg>
      ) : null}

      {logo?.type === "remote" ? (
        <img
          src={logo.src}
          alt=""
          aria-hidden="true"
          className={cn("object-contain", iconSizeClasses[size])}
        />
      ) : null}

      {logo?.type === "wordmark" ? (
        <span
          className={cn(
            "font-mono font-semibold leading-none",
            size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm",
          )}
          style={{ color: logo.color }}
          aria-hidden="true"
        >
          {logo.label}
        </span>
      ) : null}

      {!logo ? (
        <span
          className="font-mono text-sm font-semibold text-muted-foreground"
          aria-hidden="true"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      ) : null}
    </div>
  );
}

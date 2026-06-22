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
      darkModeFilter?: string;
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
    darkModeFilter: "invert(1)",
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

const DARK_BADGE_BACKGROUND = "#0b0d0a";
const MIN_GRAPHIC_CONTRAST = 3;

function getContrastAwareColor(hex: string): string {
  const brandColor = `#${hex}`;

  return getContrastRatio(brandColor, DARK_BADGE_BACKGROUND) <
    MIN_GRAPHIC_CONTRAST
    ? "var(--foreground)"
    : brandColor;
}

function getContrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const channel =
      Number.parseInt(normalized.slice(offset, offset + 2), 16) / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return (
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  );
}

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
          style={{ fill: getContrastAwareColor(logo.icon.hex) }}
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
          style={
            logo.darkModeFilter ? { filter: logo.darkModeFilter } : undefined
          }
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

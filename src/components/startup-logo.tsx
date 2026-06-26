"use client";

import { useState } from "react";

import {
  siAirbnb,
  siBrex,
  siCoinbase,
  siDatadog,
  siDoordash,
  siDropbox,
  siDuolingo,
  siFigma,
  siGitlab,
  siGusto,
  siInstacart,
  siNotion,
  siPerplexity,
  siRetool,
  siShopify,
  siStripe,
  siWebflow,
  siZapier,
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
  amplitude: {
    type: "remote",
    src: "https://api.iconify.design/logos/amplitude.svg",
  },
  brex: { type: "simple", icon: siBrex },
  canva: {
    type: "remote",
    src: "https://api.iconify.design/devicon/canva.svg",
  },
  coinbase: { type: "simple", icon: siCoinbase },
  datadog: { type: "simple", icon: siDatadog },
  deel: { type: "wordmark", label: "Deel", color: "#25C9D0" },
  docusign: {
    type: "remote",
    src: "https://api.iconify.design/cib/docusign.svg?color=%23f2efdf",
  },
  doordash: { type: "simple", icon: siDoordash },
  dropbox: { type: "simple", icon: siDropbox },
  duolingo: { type: "simple", icon: siDuolingo },
  faire: { type: "wordmark", label: "Faire", color: "#C8A876" },
  figma: { type: "simple", icon: siFigma },
  flexport: { type: "wordmark", label: "Flexport", color: "#4DA6FF" },
  gitlab: { type: "simple", icon: siGitlab },
  gusto: { type: "simple", icon: siGusto },
  heroku: {
    type: "remote",
    src: "https://api.iconify.design/logos/heroku.svg",
  },
  instacart: { type: "simple", icon: siInstacart },
  mercury: {
    type: "remote",
    src: "https://mercury.com/icon.svg",
    darkModeFilter: "invert(1)",
  },
  notion: { type: "simple", icon: siNotion },
  perplexity: { type: "simple", icon: siPerplexity },
  ramp: { type: "wordmark", label: "Ramp", color: "#6EE7B7" },
  retool: { type: "simple", icon: siRetool },
  rippling: { type: "wordmark", label: "Rippling", color: "#FFBE45" },
  "scale-ai": { type: "wordmark", label: "Scale", color: "#A78BFA" },
  segment: {
    type: "remote",
    src: "https://api.iconify.design/logos/segment.svg",
  },
  salesforce: {
    type: "remote",
    src: "https://api.iconify.design/logos/salesforce.svg",
  },
  shopify: { type: "simple", icon: siShopify },
  stripe: { type: "simple", icon: siStripe },
  toast: { type: "wordmark", label: "Toast", color: "#FF6B35" },
  twilio: {
    type: "remote",
    src: "https://api.iconify.design/logos/twilio-icon.svg",
  },
  webflow: { type: "simple", icon: siWebflow },
  whatnot: { type: "wordmark", label: "Whatnot", color: "#C084FC" },
  workday: {
    type: "remote",
    src: "https://api.iconify.design/arcticons/workday.svg?color=%23f68d2e",
  },
  zapier: { type: "simple", icon: siZapier },
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
  const [imgFailed, setImgFailed] = useState(false);

  const showFallback = !logo || (logo.type === "remote" && imgFailed);

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

      {logo?.type === "remote" && !imgFailed ? (
        <img
          src={logo.src}
          alt=""
          aria-hidden="true"
          className={cn("object-contain", iconSizeClasses[size])}
          style={
            logo.darkModeFilter ? { filter: logo.darkModeFilter } : undefined
          }
          onError={() => setImgFailed(true)}
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

      {showFallback ? (
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

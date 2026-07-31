import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    // CLAUDE.md §12 — AVIF/WebP zorunlu
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);

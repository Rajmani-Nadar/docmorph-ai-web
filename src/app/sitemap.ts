import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com", lastModified: new Date() },
    { url: "https://example.com/features", lastModified: new Date() },
    { url: "https://example.com/pricing", lastModified: new Date() },
    { url: "https://example.com/contact", lastModified: new Date() },
    { url: "https://example.com/upload", lastModified: new Date() },
    { url: "https://example.com/dashboard", lastModified: new Date() },
    { url: "https://example.com/history", lastModified: new Date() },
    { url: "https://example.com/settings", lastModified: new Date() },
    { url: "https://example.com/login", lastModified: new Date() },
    { url: "https://example.com/register", lastModified: new Date() },
  ];
}

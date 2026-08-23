export type PlatformId = "windows" | "macos" | "linux";

export interface Download {
  label: string;
  url: string;
  count?: number;
  sha256?: string;
  sigUrl?: string;
  os: PlatformId;
}

export interface ReleaseInfo {
  tag: string;
  publishedAt: string;
  htmlUrl: string;
  downloads: Download[];
  totals: Record<PlatformId, number>;
}

export interface PlatformData {
  nameKey: string;
  descKey: string;
  reqKey: string;
}

export const platformData: Record<PlatformId, PlatformData> = {
  windows: {
    nameKey: "install.platforms.windows",
    descKey: "install.platforms.windowsDesc",
    reqKey: "install.platforms.windowsReq",
  },
  linux: {
    nameKey: "install.platforms.linux",
    descKey: "install.platforms.linuxDesc",
    reqKey: "install.platforms.linuxReq",
  },
  macos: {
    nameKey: "install.platforms.macos",
    descKey: "install.platforms.macosDesc",
    reqKey: "install.platforms.macosReq",
  },
};

const platformLabelOrder: Record<PlatformId, string[]> = {
  windows: ["x64-setup.exe", ".msi"],
  macos: [".dmg", "x64.dmg", ".app.tar.gz", "x64.app.tar.gz"],
  linux: [".deb", ".appimage", "x86_64.rpm", "Arch PKGBUILD", "Nix flake"],
};

const externalLinuxDownloads: Download[] = [
  {
    label: "Arch PKGBUILD",
    url: "https://dev.cubiclauncher.org/docs/es-ES/guias/arch",
    os: "linux",
  },
  {
    label: "Nix flake",
    url: "https://dev.cubiclauncher.org/docs/es-ES/guias/nix",
    os: "linux",
  },
];

export const fallbackDownloads: Record<PlatformId, Download[]> = {
  windows: [
    { label: "x64-setup.exe", url: "#", os: "windows" },
    { label: ".msi", url: "#", os: "windows" },
  ],
  macos: [
    { label: ".dmg", url: "#", os: "macos" },
    { label: "x64.dmg", url: "#", os: "macos" },
    { label: ".app.tar.gz", url: "#", os: "macos" },
    { label: "x64.app.tar.gz", url: "#", os: "macos" },
  ],
  linux: [
    { label: ".deb", url: "#", os: "linux" },
    { label: ".appimage", url: "#", os: "linux" },
    { label: "x86_64.rpm", url: "#", os: "linux" },
    ...externalLinuxDownloads,
  ],
};

function labelPriority(os: PlatformId, label: string): number {
  const i = platformLabelOrder[os].indexOf(label);
  return i === -1 ? 999 : i;
}

export function sortDownloads(downloads: Download[]): Download[] {
  return [...downloads].sort(
    (a, b) =>
      a.os.localeCompare(b.os) ||
      labelPriority(a.os, a.label) - labelPriority(b.os, b.label)
  );
}

export function detectOS(userAgent: string): PlatformId {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";
  return "windows";
}

function extractSha256(digest: unknown): string | undefined {
  const value = typeof digest === "string" ? digest : "";
  return value.startsWith("sha256:") ? value.slice(7) : undefined;
}

function findSigAsset(assets: any[], fileName: string): any | undefined {
  return assets.find((a) => a?.name === `${fileName}.sig`);
}

function matchAssetRule(name: string): { os: PlatformId; label: string } | null {
  const n = name.toLowerCase();

  if (n.endsWith(".sig")) return null;
  if (n.includes("setup.exe")) return { os: "windows", label: "x64-setup.exe" };
  if (n.endsWith(".msi")) return { os: "windows", label: ".msi" };
  if (n.endsWith("x64.dmg")) return { os: "macos", label: "x64.dmg" };
  if (
    n.endsWith("aarch64.dmg") ||
    (n.endsWith(".dmg") && !n.includes("x64"))
  )
    return { os: "macos", label: ".dmg" };
  if (n.endsWith("x64.app.tar.gz")) return { os: "macos", label: "x64.app.tar.gz" };
  if (
    n.endsWith("aarch64.app.tar.gz") ||
    (n.endsWith(".app.tar.gz") && !n.includes("x64"))
  )
    return { os: "macos", label: ".app.tar.gz" };
  if (n.endsWith(".rpm")) return { os: "linux", label: "x86_64.rpm" };
  if (n.endsWith(".deb")) return { os: "linux", label: ".deb" };
  if (n.endsWith(".appimage")) return { os: "linux", label: ".appimage" };

  return null;
}

export function parseReleaseAssets(assets: any[]): {
  downloads: Download[];
  totals: Record<PlatformId, number>;
} {
  const totals: Record<PlatformId, number> = {
    windows: 0,
    macos: 0,
    linux: 0,
  };
  const downloads: Download[] = [];

  for (const asset of assets) {
    const name = asset?.name ?? "";
    const rule = matchAssetRule(name);
    if (!rule) continue;

    const count = asset.download_count || 0;
    totals[rule.os] += count;

    const sigAsset = findSigAsset(assets, name);

    downloads.push({
      label: rule.label,
      url: asset.browser_download_url ?? "#",
      count,
      sha256: extractSha256(asset.digest),
      os: rule.os,
      sigUrl: sigAsset?.browser_download_url,
    });
  }

  const linuxWithExternal = [
    ...downloads.filter((d) => d.os === "linux"),
    ...externalLinuxDownloads,
  ];

  const merged = [
    ...downloads.filter((d) => d.os !== "linux"),
    ...linuxWithExternal,
  ];

  return { downloads: sortDownloads(merged), totals };
}

export async function fetchLatestRelease(signal?: AbortSignal): Promise<ReleaseInfo> {
  const res = await fetch(
    "https://api.github.com/repos/CubicLauncherDevs/CubicLauncher/releases/latest",
    { signal }
  );

  if (!res.ok) throw new Error(`GitHub respondió con ${res.status}`);
  const data = await res.json();

  if (!data || !Array.isArray(data.assets)) {
    throw new Error("No se pudieron obtener los assets");
  }

  const { downloads, totals } = parseReleaseAssets(data.assets);

  return {
    tag: data.tag_name ?? "",
    publishedAt: data.published_at ?? "",
    htmlUrl: data.html_url ?? "",
    downloads,
    totals,
  };
}

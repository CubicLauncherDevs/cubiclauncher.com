<script lang="ts">
  import type { PlatformId } from "$lib/utils/install";
  import IconWindows from "~icons/simple-icons/windows";
  import IconApple from "~icons/simple-icons/apple";
  import IconLinux from "~icons/simple-icons/linux";
  import IconDebian from "~icons/simple-icons/debian";
  import IconFedora from "~icons/simple-icons/fedora";
  import IconArchlinux from "~icons/simple-icons/archlinux";
  import IconNixos from "~icons/simple-icons/nixos";
  import IconDownload from "~icons/ph/download-simple";

  interface Props {
    label: string;
    os: PlatformId;
    class?: string;
  }

  let { label, os, class: klass = "" }: Props = $props();

  const lower = label.toLowerCase();

  const Icon = $derived(
    os === "windows"
      ? IconWindows
      : os === "macos"
        ? IconApple
        : lower.endsWith(".deb")
          ? IconDebian
          : lower.includes("arch") || lower.includes("pkgbuild")
            ? IconArchlinux
            : lower.includes("nix") || lower.includes("flake")
              ? IconNixos
              : lower.endsWith(".rpm")
                ? IconFedora
                : lower.endsWith(".appimage") || label === ".appimage"
                  ? IconLinux
                  : IconDownload
  );
</script>

<Icon class={klass} />

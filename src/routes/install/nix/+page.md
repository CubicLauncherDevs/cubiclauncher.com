<script lang="ts">
  import { t } from "$lib/i18n";

  const keys = {
    title: "install.cachix.pageTitle",
    intro: "install.cachix.intro",
    profileTitle: "install.cachix.profileTitle",
    noCacheText: "install.cachix.noCacheText",
    cacheTitle: "install.cachix.cacheTitle",
    cacheConfigured: "install.cachix.cacheConfigured",
    setup: "install.cachix.setup",
    chooseChannel: "install.cachix.chooseChannel",
    stable: "install.cachix.stable",
    beta: "install.cachix.beta",
    specificTitle: "install.cachix.specificTitle",
    specificText: "install.cachix.specificText",
    nixosTitle: "install.cachix.nixosTitle",
    nixosText: "install.cachix.nixosText",
    nixosApply: "install.cachix.nixosApply",
  };
</script>

<svelte:head>
  <title>{$t("install.cachix.pageTitle")} | CubicLauncher</title>
  <meta name="description" content={$t("install.cachix.intro")} />
</svelte:head>

<main class="min-h-screen bg-cl-base px-4 py-8 text-cl-muted sm:py-12">
  <div class="mx-auto max-w-3xl">
    <a href="/install" class="mb-6 inline-flex text-sm text-cl-muted underline hover:text-cl-text">
      ← {$t("install.cachix.back")}
    </a>

    <article class="space-y-6 leading-relaxed [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-cl-text [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-cl-text [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-medium [&_h3]:text-cl-text [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border [&_pre]:border-cl-border [&_pre]:bg-cl-surface [&_pre]:p-3 [&_pre]:text-sm [&_code]:text-cl-text [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-6">
# {$t(keys.title)}

{$t(keys.intro)}

## {$t(keys.profileTitle)}

{$t(keys.noCacheText)}

{$t(keys.chooseChannel)}

### {$t(keys.stable)}

```sh
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-release
```

### {$t(keys.beta)}

```sh
nix profile add github:CubicLauncherDevs/CubicLauncher/latest-beta
```

## {$t(keys.specificTitle)}

{$t(keys.specificText)}

```sh
nix profile add github:CubicLauncherDevs/CubicLauncher/TAG
```

## {$t(keys.cacheTitle)}

{$t(keys.setup)}

```sh
nix run nixpkgs#cachix -- use cubiclauncher
```

{$t(keys.cacheConfigured)}

## {$t(keys.nixosTitle)}

{$t(keys.nixosText)}

```nix
imports = [ ./cachix.nix ];
```

{$t(keys.nixosApply)}

```sh
sudo nixos-rebuild switch
```
    </article>
  </div>
</main>

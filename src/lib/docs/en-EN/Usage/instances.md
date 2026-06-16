---
title: Instances | CubicLauncher
---

# Instances

An **instance** is a self-contained directory with its own copy of Minecraft, mods, resource packs, screenshots and configuration. Each instance represents a specific combination of Minecraft version and mod loader.

## Disk structure

Instances are located inside `.cubic/instances/`. Each instance is a folder with the name you gave it:

```
.cubic/
└── instances/
    └── My Instance/
        ├── instance.cub        ← instance metadata
        ├── mods/               ← mods (.jar / .jar.disabled)
        ├── resourcepacks/      ← resource packs (.zip)
        ├── screenshots/        ← screenshots (.png)
        └── ...                 ← Minecraft runtime files
```

The `instance.cub` file stores metadata in JSON:

```jsonc
{
  "name": "My Instance",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null
}
```

## Creating an instance

1. Click **"Create Instance"** in the sidebar.
2. Choose a **name** (maximum 16 ASCII characters).
3. Select a **version** from the downloaded ones (if the one you want is not listed, download it first from the downloads button).
4. Choose an **icon** (Vanilla, Fabric, Forge or Modrinth).
5. Press **Create**.

> The version determines the mod loader automatically: if the ID contains `fabric` it is detected as Fabric, if it contains `forge` as Forge, if it contains `quilt` as Quilt, otherwise it is Vanilla.

## The instance view

When selecting an instance, its main panel opens with:

- **Hero** — banner with name, icon, version, loader and current status
- **"Play" button** — launches Minecraft with this instance
- **Status bar** — shows real-time status (Off / Starting / Started / Error)

### Details tab

Shows general instance information:

- Version and loader badges (Vanilla, Fabric, Forge, Quilt)
- Disk path with button to open the folder
- Quick access to mods, screenshots and resource packs folders
- Live console with Minecraft output (with autoscroll)
- **"Force close"** button if the instance is running

### Mods tab

Lists installed mods with their name, version and a toggle to enable/disable them (renames `.jar` ↔ `.jar.disabled`).

Only visible if the instance uses a mod loader (Fabric, Forge or Quilt).

### Get Mods tab

Built-in Modrinth search. You can:

- Search mods by name
- Filter by categories and loader
- Add mods to a basket
- Choose the mod version compatible with your Minecraft version
- Download with dependency resolution

Only visible if the instance uses a mod loader.

### Resources tab

Manage the instance's resource packs (`.zip`):

- Upload new packs from the filesystem
- Delete existing packs

### Screenshots tab

Gallery of screenshots taken inside the instance:

- Thumbnail preview
- Lightbox viewer on click
- Delete screenshots

## Lifecycle

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — the instance is not running
- **Starting** — the launcher is preparing and launching Minecraft
- **Started** — Minecraft is running
- **Error** — an error occurred while starting (missing version, incorrect Java, etc.)

## Managing instances

From the sidebar you can:

- **Rename** — change the name (also renames the folder on disk)
- **Delete** — removes the instance and all its content (mods, screenshots, etc.)
- **Open folder** — access the instance directory directly

You can also open specific folders from the Details tab: mods, resource packs, screenshots.

## Downloading versions

Use the downloads button in the sidebar to open the **Version Downloader**. There you can download:

- **Vanilla versions** — release and snapshot
- **Alpha/Beta versions** — old versions
- **Fabric** — versions with Fabric Loader

Downloaded versions are stored in `.cubic/shared/versions/` and are shared across all instances.

## RAM Memory

You can configure custom memory per instance by editing `instance.cub`. If `min_memory` or `max_memory` are not set, the global configuration values are used.

---
title: How to install a theme | CubicLauncher
---

# How to install a theme

Installing a theme in CubicLauncher is very simple. Just follow these 3 steps.

## Step 1: Download the theme

Find a theme in the [Themes](/themes) section of the page or in the official [CubicLauncher Themes](https://github.com/CubicLauncherDevs/Themes) repository. Download it as a ZIP file.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step1.png" alt="Download button" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Step 2: Unzip

Extract the contents of the ZIP. Inside you will find a folder with the theme name containing the theme files.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step2.png" alt="Theme ZIP file" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Step 3: Place the folder in `.cubic/themes/`

Move the extracted theme folder to `.cubic/themes/`. The `.cubic` folder is in the user directory according to your operating system:

| System | Path |
|---|---|
| **Windows** | `C:\Users\<user>\.cubic\themes\` |
| **Linux** | `/home/<user>/.cubic/themes/` |
| **macOS** | `/Users/<user>/.cubic/themes/` |

The structure should look like this:

```
.cubic/
└── themes/
    └── Name:Author/
        ├── theme.json
        └── (optional) bg.jpg
```

> If the `.cubic/themes/` folder does not exist, create it manually.

Once placed, open CubicLauncher, go to the theme selector and choose the one you just installed.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step3.png" alt="Configure theme in the launcher" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

And that's it! You now have your theme installed.

---
title: Privacy Policy | CubicLauncher
---

# Privacy Policy

CubicLauncher is a completely **open source** project for the community. This means anyone can review the source code, use it and contribute to its development. Our priority is transparency and the security of our users.

<div class="my-6 flex gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-red-400">Important</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			CubicLauncher is not associated, affiliated, sponsored or endorsed by Mojang AB.<br>Minecraft is a registered trademark of Mojang Synergies AB.
		</div>
	</div>
</div>

## Transparency and Security

Transparency is the fundamental pillar of CubicLauncher. Being an open source project, the code is visible to anyone, allowing auditing of how data is handled and the internal workings of the program.

### Build Process

To ensure that the program you download is exactly what you see in the code, we use **GitHub Workflows** for automated compilation. This ensures that no third-party elements or malicious modifications are introduced during the build process. Everything is generated directly from the source code visible in our repository.

## Data Collection

CubicLauncher **does not collect any type of user information**. We have no ads, we do not sell data and we are sustained solely through voluntary donations from the community.

## Network Connections

CubicLauncher is an **offline launcher by nature**: it does not communicate with external servers except when strictly necessary for the game to function. The only connections it makes are:

- **Mojang servers**: To download game versions, obtain manifests and resources needed to run Minecraft.
- **Microsoft (OAuth2)**: For account authentication. CubicLauncher never has access to your password; identification is done directly on Microsoft servers using the official OAuth2 flow, the same standard used by the official launcher and recognized launchers like **Prism Launcher**.
- **GitHub**: To get launcher updates.
- **Modrinth**: For the mod manager service.

There are no other connections to external servers.

## Data Handling

CubicLauncher does not store your login credentials.

- **Login**: Authentication is done through Microsoft's **official OAuth2 flow**, guaranteeing that CubicLauncher never accesses your password.
- **Downloads**: Game files are downloaded directly from Mojang's official servers.

### Mojang Meta URLs
- version_manifest: https://piston-meta.mojang.com/mc/game/version_manifest_v2.json

By using official methods for downloading and authentication, we ensure your information remains secure.

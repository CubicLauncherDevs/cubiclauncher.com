---
title: Installation sur Arch Linux | CubicLauncher
---

# Arch Linux

## Installation

Sur Arch Linux, il est recommandé de compiler CubicLauncher localement en utilisant le `PKGBUILD` officiel. Il n'est pas nécessaire de cloner le dépôt complet ni d'installer les dépendances manuellement : le `PKGBUILD` télécharge le code source et `makepkg` se charge de résoudre et d'installer les dépendances nécessaires.

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
			La compilation locale est obligatoire.
		</span>

		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			<p class="mt-1">
				Arch Linux est une distribution <em>rolling release</em>, donc les versions des bibliothèques et dépendances changent fréquemment.
			</p>

			<p class="mt-1">
				Les binaires générés par GitHub Actions (Ubuntu) peuvent présenter des incompatibilités ou échouer sur des systèmes Arch à jour.
			</p>

			<p class="mt-1">
				Compiler le programme sur votre propre système garantit la compatibilité avec les bibliothèques installées et permet d'obtenir un paquet adapté à votre environnement.
			</p>
		</div>
	</div>
</div>

```bash
mkdir cubiclauncher-build
cd cubiclauncher-build

wget https://raw.githubusercontent.com/CubicLauncher/CubicLauncher/main/dist/arch/PKGBUILD
makepkg -si
```

## Mettre à jour vers une nouvelle version

Lorsqu'une nouvelle version de CubicLauncher est publiée, vous pouvez mettre à jour le paquet compilé localement sans avoir à télécharger le `PKGBUILD` depuis le début.

Accédez au répertoire où vous avez téléchargé le `PKGBUILD`, modifiez le fichier et changez la valeur de `pkgver` pour la nouvelle version :

```bash
cd cubiclauncher-build
nano PKGBUILD
```

Cherchez la ligne `pkgver=` et mettez-la à jour. Ensuite, mettez à jour les checksums automatiquement avec `updpkgsums` :

```bash
updpkgsums
```

Enfin, recompilez et installez le paquet mis à jour :

```bash
makepkg -si
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">NOTE</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			La commande <code>updpkgsums</code> appartient au paquet <code>pacman-contrib</code>. Si vous ne l'avez pas installée, vous pouvez l'obtenir avec <code>sudo pacman -S pacman-contrib</code>.
		</div>
	</div>
</div>

## L'auto-mise à jour ne fonctionne pas sur Arch

CubicLauncher inclut un mécanisme d'auto-mise à jour intégré qui télécharge le dernier binaire depuis GitHub Releases et remplace l'exécutable actuel. Sur Arch Linux, ce mécanisme **ne fonctionne pas** et ne peut pas être corrigé, pour les raisons suivantes :

1. **Permissions système** : Lors de l'installation via `makepkg -si`, le binaire est copié dans `/usr/bin/cubiclauncher` avec les permissions **root** (`root:root`). L'utilisateur normal n'a pas les permissions d'écriture sur `/usr/bin`, donc l'auto-updater ne peut pas écraser le fichier.

2. **Incompatibilité des binaires** : Même si l'auto-updater était exécuté en tant que root, les binaires précompilés de GitHub Actions sont liés aux bibliothèques d'Ubuntu, ce qui peut provoquer des échecs sur Arch.

3. **Philosophie d'Arch** : Sur Arch Linux, la façon correcte de mettre à jour un programme est via `pacman`. Utiliser des auto-updaters externes contourne le gestionnaire de paquets, laissant le système dans un état incohérent (pacman ne saura pas que le binaire a été remplacé).

## Problèmes courants

### Erreur lors du téléchargement des dépendances (404)

Si pendant l'installation vous voyez des erreurs similaires à :

```text
error: failed retrieving file 'gst-plugins-good-*.pkg.tar.zst'
error: failed retrieving file 'gst-plugins-bad-*.pkg.tar.zst'
error: failed to commit transaction (failed to retrieve some files)
```

Il est probable qu'un des miroirs configurés sur votre système soit obsolète. Avant de réexécuter `makepkg`, mettez à jour la base de données des paquets et synchronisez le système :

```bash
sudo pacman -Syu
```

Si le problème persiste, mettez à jour votre liste de miroirs ou essayez avec des miroirs plus récents :

```bash
sudo pacman -S reflector
sudo reflector --latest 20 --sort rate --save /etc/pacman.d/mirrorlist
sudo pacman -Syyu
```

Une fois le système mis à jour, réexécutez :

```bash
makepkg -si
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">AVERTISSEMENT</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
        Cette erreur n'est pas liée à CubicLauncher ni au PKGBUILD ; elle se produit lorsqu'un miroir Arch Linux n'a pas encore synchronisé les paquets les plus récents.
		</div>
	</div>
</div>

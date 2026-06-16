---
title: Politique de Confidentialité | CubicLauncher
---

# Politique de Confidentialité

CubicLauncher est un projet complètement **open source** pour la communauté. Cela signifie que n'importe qui peut consulter le code source, l'utiliser et contribuer à son développement. Notre priorité est la transparence et la sécurité de nos utilisateurs.

<div class="my-6 flex gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-red-400">Important</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			CubicLauncher n'est pas associé, affilié, sponsorisé ni approuvé par Mojang AB.<br>Minecraft est une marque déposée de Mojang Synergies AB.
		</div>
	</div>
</div>

## Transparence et Sécurité

La transparence est le pilier fondamental de CubicLauncher. Étant un projet open source, le code est visible par tous, ce qui permet d'auditer comment les données sont traitées et le fonctionnement interne du programme.

### Processus de Compilation

Pour garantir que le programme que vous téléchargez est exactement ce que vous voyez dans le code, nous utilisons **GitHub Workflows** pour la compilation automatisée. Cela garantit qu'aucun élément tiers ni modification malveillante n'est introduit pendant le processus de compilation. Tout est généré directement à partir du code source visible dans notre dépôt.

## Collecte de Données

CubicLauncher **ne collecte aucun type d'information utilisateur**. Nous n'avons pas de publicité, nous ne vendons pas de données et nous sommes financés uniquement par des dons volontaires de la communauté.

## Connexions Réseau

CubicLauncher est un launcher **hors ligne par nature** : il ne communique pas avec des serveurs externes sauf lorsque cela est strictement nécessaire au fonctionnement du jeu. Les seules connexions effectuées sont :

- **Serveurs Mojang** : Pour télécharger les versions du jeu, obtenir les manifestes et ressources nécessaires pour exécuter Minecraft.
- **Microsoft (OAuth2)** : Pour l'authentification des comptes. CubicLauncher n'a jamais accès à votre mot de passe ; l'identification se fait directement sur les serveurs de Microsoft via le flux OAuth2 officiel, le même standard utilisé par le launcher officiel et les launchers reconnus comme **Prism Launcher**.
- **GitHub** : Pour obtenir les mises à jour du launcher.
- **Modrinth** : Pour le service du gestionnaire de mods.

Il n'existe aucune autre connexion à des serveurs externes.

## Gestion des Données

CubicLauncher ne stocke pas vos identifiants de connexion.

- **Connexion** : L'authentification est effectuée via le **flux OAuth2 officiel** de Microsoft, garantissant que CubicLauncher n'accède jamais à votre mot de passe.
- **Téléchargements** : Les fichiers du jeu sont téléchargés directement depuis les serveurs officiels de Mojang.

### URLs Meta Mojang
- version_manifest: https://piston-meta.mojang.com/mc/game/version_manifest_v2.json

En utilisant des méthodes officielles pour le téléchargement et l'authentification, nous nous assurons que vos informations restent sécurisées.

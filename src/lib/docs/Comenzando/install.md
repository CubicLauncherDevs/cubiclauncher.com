---
title: Instalación | CubicLauncher
---

# Instalación

Instalar CubicLauncher es un proceso sencillo. Sigue las instrucciones correspondientes a tu sistema operativo para comenzar.

## Requisitos Previos

Antes de instalar, asegúrate de tener instalado **Java** en tu sistema. Recomendamos las siguientes versiones:

- **Java 21:** Para versiones de Minecraft 1.21 y superiores.
- **Java 17:** Para versiones de Minecraft 1.17 y superiores.
- **Java 8:** Para versiones de Minecraft 1.16.5 e inferiores.

<div class="my-6 flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-blue-400">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-blue-400">Tip</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			CubicLauncher no necesita java instalado en el sistema para funcionar. pero si necesitas tener java instalado en el sistema para poder jugar a minecraft.
		</div>
	</div>
</div>

## Windows

1. Descarga el instalador `.exe` o `.msi` desde nuestra página de descargas.
2. Ejecuta el archivo y sigue los pasos del instalador.
3. Una vez finalizado, CubicLauncher estará listo en tu escritorio.

## Linux

Ofrecemos soporte para múltiples formatos en Linux:

- **RPM:** Descarga, otorga permisos de ejecución y abre.
- **AppImage:** Descarga, otorga permisos de ejecución y abre.
- **Debian/Ubuntu:** Instala el paquete `.deb` usando `sudo apt install ./cubiclauncher.deb`.
- **ARCH APKGBUILD:** Compilar localmente es obligatorio. Los binarios generados por las CI de GitHub (Ubuntu) pueden no ser compatibles con Arch Linux debido a su modelo rolling release. <a href="/docs/arch" class="text-blue-400 hover:underline">Guia</a>.

## macOS

1. Descarga el archivo correspondiente (`.dmg`, `x64.dmg`, `.app.tar.gz` o `x64.app.tar.gz`).
2. Si descargaste un `.dmg` o `x64.dmg`, ábrelo y arrastra **CubicLauncher** a tu carpeta de Aplicaciones.
3. Si descargaste un `.app.tar.gz` o `x64.app.tar.gz`, descomprímelo y mueve **CubicLauncher.app** a tu carpeta de Aplicaciones.
4. La primera vez que lo abras, es posible que debas permitir la ejecución desde **Preferencias del Sistema > Seguridad y Privacidad**.
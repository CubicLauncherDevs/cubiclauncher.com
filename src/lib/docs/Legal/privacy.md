---
title: Política de Privacidad | CubicLauncher
---

# Política de Privacidad

CubicLauncher es un proyecto completamente de **código abierto** para la comunidad. Esto significa que cualquier persona puede revisar el código fuente, utilizarlo y contribuir a su desarrollo. Nuestra prioridad es la transparencia y la seguridad de nuestros usuarios.

<div class="my-6 flex gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-red-400">Importante</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			CubicLauncher no está asociado, afiliado, patrocinado ni respaldado por Mojang AB.<br>Minecraft es una marca registrada de Mojang Synergies AB.
		</div>
	</div>
</div>

## Transparencia y Seguridad

La transparencia es el pilar fundamental de CubicLauncher. Al ser un proyecto de código abierto, el código es visible para cualquier persona, lo que permite auditar cómo se manejan los datos y el funcionamiento interno del programa.

### Proceso de Compilación

Para garantizar que el programa que descargás sea exactamente lo que ves en el código, utilizamos **GitHub Workflows** para la compilación automatizada. Esto asegura que no se introduzcan elementos de terceros ni modificaciones malintencionadas durante el proceso de compilación. Todo se genera directamente desde el código fuente visible en nuestro repositorio.

## Recolección de Datos

CubicLauncher **no recolecta ningún tipo de información del usuario final**. No tenemos anuncios, no vendemos datos y nos sostenemos únicamente a través de donaciones voluntarias de la comunidad.

## Conexiones de Red

CubicLauncher es un launcher **offline por naturaleza**: no se comunica con servidores externos salvo cuando es estrictamente necesario para el funcionamiento del juego. Las únicas conexiones que realiza son:

- **Servidores de Mojang**: Para descargar versiones del juego, obtener manifiestos y recursos necesarios para ejecutar Minecraft.
- **Microsoft (OAuth2)**: Para la autenticación de cuentas. CubicLauncher nunca tiene acceso a tu contraseña; la identificación se realiza directamente en los servidores de Microsoft mediante el flujo oficial de OAuth2, el mismo estándar utilizado por el launcher oficial y launchers reconocidos como **Prism Launcher**.
- **GitHub**: Para obtener actualizaciones del launcher.

No existe ninguna otra conexión a servidores externos.

## Manejo de Datos

CubicLauncher no almacena tus credenciales de acceso.

- **Inicio de Sesión**: La autenticación se realiza mediante el **flujo oficial de OAuth2** de Microsoft, garantizando que CubicLauncher nunca acceda a tu contraseña.
- **Descargas**: Los archivos del juego se descargan directamente desde los servidores oficiales de Mojang.

### Mojang Meta URLs
- version_manifest: https://piston-meta.mojang.com/mc/game/version_manifest_v2.json

Al utilizar métodos oficiales para la descarga y autenticación, nos aseguramos de que tu información permanezca segura.

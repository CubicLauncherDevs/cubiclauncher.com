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
Para garantizar que el programa que descargas sea exactamente lo que ves en el código, utilizamos **GitHub Workflows** para la compilación automatizada. Esto asegura que no se introduzcan elementos de terceros ni modificaciones malintencionadas durante el proceso de conpilacion. Todo se genera directamente desde el código fuente visible en nuestro repositorio.

## Manejo de Datos
CubicLauncher no almacena tus credenciales de acceso.

- **Inicio de Sesión**: La autenticación de las cuentas de Microsoft se realiza mediante el **flujo oficial de OAuth2**. Este es el mismo estándar de seguridad y método de autenticación utilizado por el launcher oficial de Minecraft y otros launchers de renombre como **Prism Launcher**. Este proceso garantiza que CubicLauncher nunca tenga acceso a tu contraseña, ya que la identificación se realiza directamente en los servidores de Microsoft.
- **Descargas**: La descarga de archivos del juego se realiza mediante el **version_manifest** y servidores de Mojang.

### Mojang Meta URLs
- version_manifest: https://gist.github.com/skyrising/95a8e6a7287634e097ecafa2f21c240f


Al utilizar métodos oficiales para la descarga y autenticación, nos aseguramos de que tu información permanezca segura.

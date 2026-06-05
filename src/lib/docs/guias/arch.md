---
title: Instalación en Arch Linux | CubicLauncher
---

# Arch Linux

## Instalación

En Arch Linux se recomienda compilar CubicLauncher localmente utilizando el `PKGBUILD` oficial. No es necesario clonar el repositorio completo ni instalar dependencias manualmente: el propio `PKGBUILD` descarga el código fuente y `makepkg` se encarga de resolver e instalar las dependencias necesarias.

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">
			La compilación local es obligatoria.
		</span>

		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			<p class="mt-1">
				Arch Linux es una distribución <em>rolling release</em>, por lo que las versiones de bibliotecas y dependencias cambian con frecuencia.
			</p>

			<p class="mt-1">
				Los binarios generados por GitHub Actions (Ubuntu) pueden presentar incompatibilidades o fallar al ejecutarse en sistemas Arch actualizados.
			</p>

			<p class="mt-1">
				Compilar el programa en tu propio sistema garantiza la compatibilidad con las bibliotecas instaladas y permite obtener un paquete adaptado a tu entorno.
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

## Actualizar a una nueva versión

Cuando se publique una nueva versión de CubicLauncher, puedes actualizar el paquete compilado localmente sin necesidad de volver a descargar el `PKGBUILD` desde cero.

Accede al directorio donde descargaste el `PKGBUILD`, edita el archivo y cambia el valor de `pkgver` por la nueva versión:

```bash
cd cubiclauncher-build
nano PKGBUILD
```

Busca la línea `pkgver=` y actualízala. Luego actualiza los checksums automáticamente con `updpkgsums`:

```bash
updpkgsums
```

Finalmente, recompila e instala el paquete actualizado:

```bash
makepkg -si
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">NOTA</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
			El comando <code>updpkgsums</code> pertenece al paquete <code>pacman-contrib</code>. Si no lo tienes instalado, puedes obtenerlo con <code>sudo pacman -S pacman-contrib</code>.
		</div>
	</div>
</div>

## La auto-actualización no funciona en Arch

CubicLauncher incluye un mecanismo de auto-actualización integrado que descarga el binario más reciente desde GitHub Releases y reemplaza el ejecutable actual. En Arch Linux este mecanismo **no funciona** y no se puede solucionar, por las siguientes razones:

1. **Permisos del sistema**: Al instalar mediante `makepkg -si`, el binario se copia a `/usr/bin/cubiclauncher` con permisos de **root** (`root:root`). El usuario normal no tiene permisos de escritura sobre `/usr/bin`, por lo que el auto-updater no puede sobrescribir el archivo.

2. **Incompatibilidad de binarios**: Aunque se ejecutara el auto-updater como root, los binarios precompilados de GitHub Actions están vinculados contra las bibliotecas de Ubuntu, lo que puede generar fallos en Arch.

3. **Filosofía de Arch**: En Arch Linux la forma correcta de actualizar cualquier programa es a través de `pacman`. Usar auto-actualizadores externos bypassa el gestor de paquetes, dejando el sistema en un estado inconsistente (pacman no sabrá que el binario fue reemplazado).

## Problemas comunes

### Error al descargar dependencias (404)

Si durante la instalación aparecen errores similares a los siguientes:

```text
error: failed retrieving file 'gst-plugins-good-*.pkg.tar.zst'
error: failed retrieving file 'gst-plugins-bad-*.pkg.tar.zst'
error: failed to commit transaction (failed to retrieve some files)
```

Es probable que alguno de los mirrors configurados en tu sistema esté desactualizado. Antes de volver a ejecutar `makepkg`, actualiza la base de datos de paquetes y sincroniza el sistema:

```bash
sudo pacman -Syu
```

Si el problema persiste, actualiza tu lista de mirrors o prueba con otros mirrors más recientes:

```bash
sudo pacman -S reflector
sudo reflector --latest 20 --sort rate --save /etc/pacman.d/mirrorlist
sudo pacman -Syyu
```

Una vez actualizado el sistema, vuelve a ejecutar:

```bash
makepkg -si
```

<div class="my-6 flex gap-3 rounded-lg border border-yellow-500 bg-yellow-500/5 p-4 text-yellow-500">
	<div class="flex flex-col gap-1">
		<span class="text-sm font-bold uppercase tracking-wider text-yellow-400">AVISO</span>
		<div class="m-0 text-sm leading-relaxed text-neutral-400">
        Este error no está relacionado con CubicLauncher ni con el PKGBUILD; ocurre cuando un mirror de Arch Linux todavía no ha sincronizado los paquetes más recientes.
		</div>
	</div>
</div>

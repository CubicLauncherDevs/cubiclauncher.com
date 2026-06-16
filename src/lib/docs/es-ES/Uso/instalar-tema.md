---
title: Cómo poner un theme | CubicLauncher
---

# Cómo poner un theme

Instalar un theme en CubicLauncher es muy sencillo. Solo tenés que seguir estos 3 pasos.

## Paso 1: Descargar el theme

Buscá un theme en la sección [Temas](/themes) de la página o en el repositorio oficial de [CubicLauncher Themes](https://github.com/CubicLauncher/Themes). Descargalo como archivo ZIP.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step1.png" alt="Botón de descargar" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Paso 2: Descomprimir

Extraé el contenido del ZIP. Dentro vas a encontrar una carpeta con el nombre del theme que contiene los archivos del tema.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step2.png" alt="Archivo ZIP del theme" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Paso 3: Colocar la carpeta en `.cubic/themes/`

Mové la carpeta del theme extraída a `.cubic/themes/`. La carpeta `.cubic` está en el directorio de usuario según tu sistema operativo:

| Sistema | Ruta |
|---|---|
| **Windows** | `C:\Users\<usuario>\.cubic\themes\` |
| **Linux** | `/home/<usuario>/.cubic/themes/` |
| **macOS** | `/Users/<usuario>/.cubic/themes/` |

La estructura debería quedar así:

```
.cubic/
└── themes/
    └── Nombre:Autor/
        ├── theme.json
        └── (opcional) bg.jpg
```

> Si la carpeta `.cubic/themes/` no existe, creala manualmente.

Una vez colocada, abrí CubicLauncher, andá al selector de temas y elegí el que acabas de instalar.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step3.png" alt="Configurar theme en el launcher" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

¡Y listo! Ya tenés tu theme instalado.

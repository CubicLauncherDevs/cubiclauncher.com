# cubiclauncher.org

Pagina web Oficial de CubicLauncher

## Changelogs

La página `/changelogs` y el launcher pueden consumir el historial público en
`/api/v1/changelogs.json`. Ver el [contrato y la guía de integración](docs/changelogs-api.md).

Actualizar la copia local: `bun run fetch-changelogs`.

## Despliegue e indexación

El sitio usa `adapter-static` y genera el contenido en `build/`. En Vercel,
`vercel.json` habilita `cleanUrls` para servir los archivos `.html` desde las
rutas sin extensión del sitemap, como `/themes` y `/themes/notstaff-windows7`.

El dominio principal es `https://www.cubiclauncher.org`, definido en
`src/lib/utils/site.js`. En Vercel se debe mantener la redirección permanente
de `cubiclauncher.org` a `www.cubiclauncher.org`. Si cambia el dominio principal,
actualizar también `static/robots.txt` y regenerar el sitemap con
`bun run fetch-themes` (se ejecuta automáticamente antes de `bun run build`).

Tras desplegar, comprobar que las URLs del sitemap responden HTTP 200 al abrirlas
directamente y que las URLs con `.html` redirigen a sus equivalentes sin extensión.
Después enviar `https://www.cubiclauncher.org/sitemap.xml` a Search Console y usar
«Probar URL publicada» y «Solicitar indexación» en las fichas afectadas.

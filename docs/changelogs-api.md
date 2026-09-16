# Changelogs para el launcher

Una vez desplegada la web, el historial está disponible mediante:

```http
GET https://cubiclauncher.org/api/v1/changelogs.json
```

Es un JSON público y estático, compartido por `/changelogs` y los clientes del launcher. No requiere autenticación ni consultas a la API de GitHub desde el cliente.

## Contrato v1

Ejemplo abreviado (la respuesta real contiene todo el historial):

```json
{
  "schemaVersion": 1,
  "repository": "CubicLauncherDevs/CubicLauncher",
  "source": "https://github.com/CubicLauncherDevs/CubicLauncher/releases",
  "generatedAt": "2026-09-15T12:00:00.000Z",
  "notesFormat": "markdown",
  "releases": [
    {
      "id": 385264860,
      "tag": "v34.0.1",
      "name": "CubicLauncher v34.0.1",
      "body": "# CubicLauncher 34.0.1\n\nNotas de la versión…",
      "publishedAt": "2026-09-10T00:48:53Z",
      "updatedAt": "2026-09-10T00:48:53Z",
      "prerelease": false,
      "htmlUrl": "https://github.com/CubicLauncherDevs/CubicLauncher/releases/tag/v34.0.1"
    }
  ]
}
```

- `schemaVersion`: versión del contrato. Los cambios incompatibles se publicarán bajo otra ruta, por ejemplo `/api/v2/`. Los clientes deben aceptar campos adicionales desconocidos.
- `generatedAt`: fecha UTC de generación de esta copia. No cambia si el contenido de GitHub sigue siendo el mismo; no representa la última comprobación.
- `releases`: todas las publicaciones públicas, incluidas las preliminares, sin borradores. Orden descendente por `publishedAt`; en caso de empate, por `id`. Puede estar vacío.
- `id`: identificador de GitHub, útil para recordar las notas vistas por el usuario.
- `tag`: etiqueta exacta, conservando prefijos como `v`. No se modifica ni se interpreta como SemVer.
- `name`: título del release; si no tiene título, se utiliza el tag.
- `body`: Markdown original, sin traducción automática. Puede ser una cadena vacía. Al convertirlo en HTML, sanitizar el resultado como hace la web.
- `updatedAt`: fecha de modificación del release en GitHub. Permite detectar correcciones de las notas.
- `prerelease`: `true` para versiones preliminares.
- `htmlUrl`: enlace a las notas y descargas originales de esa versión.

El feed es un historial de cambios, no un manifiesto de actualizaciones. La primera entrada estable es la más reciente **por fecha de publicación**, no necesariamente la versión marcada como “Latest” por GitHub.

## Ejemplo de consumo (TypeScript)

```ts
type Release = {
  id: number;
  tag: string;
  name: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  prerelease: boolean;
  htmlUrl: string;
};

async function loadChangelogs(): Promise<Release[]> {
  const response = await fetch(
    "https://cubiclauncher.org/api/v1/changelogs.json",
    { signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) throw new Error(`Changelogs: HTTP ${response.status}`);
  const feed = await response.json();
  if (feed.schemaVersion !== 1 || feed.notesFormat !== "markdown" || !Array.isArray(feed.releases)) {
    throw new Error("Formato de changelogs incompatible");
  }
  return feed.releases;
}

const releases = await loadChangelogs();
const stableReleases = releases.filter((release) => !release.prerelease);
const installedRelease = releases.find((release) => release.tag === "v34.0.1");
```

La validación completa y los tipos reutilizables están en `src/lib/utils/changelog-feed.js` (`isChangelogFeed`, `ChangelogFeed` y `LauncherRelease`). El launcher puede portar este contrato a su cliente HTTP nativo. Conviene conservar localmente la última respuesta válida para mostrar el historial sin conexión. La paginación de la web es local, en grupos de 10; el JSON no recibe parámetros de paginación.

## Actualización y despliegue

```sh
npm run fetch-changelogs
npm run test:changelogs
```

- `fetch-changelogs` consulta todas las páginas de GitHub y escribe `static/api/v1/changelogs.json` de forma atómica, después de validar la respuesta completa.
- También se ejecuta durante `npm run build` mediante `prebuild`.
- Puede usar `GITHUB_TOKEN` en el proceso de sincronización; el token nunca se incluye en el JSON ni se necesita en el launcher.
- Si GitHub falla, se conserva la última copia válida y se informa en los logs. Si no existe una copia válida, el proceso termina con error.
- El workflow `Sync launcher changelogs` comprueba el historial cada hora y permite ejecución manual. Solo crea un commit cuando cambia el contenido.
- El workflow actualiza el archivo en `main`; **el hosting debe desplegar ese commit** para actualizar la URL pública. No configura un proveedor de despliegue. Un push hecho con `GITHUB_TOKEN` no dispara otros workflows de GitHub basados en `push`; si el despliegue usa GitHub Actions, conectarlo mediante `workflow_run` o ejecutarlo en el propio workflow.
- Los horarios de GitHub Actions pueden retrasarse; este feed es una copia periódica, no una API en tiempo real.

## Acceso desde una WebView

`static/_headers` declara CORS público y caché HTTP de cinco minutos para hosts compatibles con ese formato, como Cloudflare Pages o Netlify. En otro hosting hay que configurar esas cabeceras en el servidor/CDN. Comprobarlo después del despliegue:

```sh
curl -I https://cubiclauncher.org/api/v1/changelogs.json
```

Una petición `fetch` desde el origen del launcher necesita `Access-Control-Allow-Origin: *`. Un cliente HTTP nativo del launcher no está sujeto al CORS del navegador. La copia servida localmente por Vite es suficiente para desarrollar la página web; `_headers` lo interpreta el proveedor de hosting, no Vite.

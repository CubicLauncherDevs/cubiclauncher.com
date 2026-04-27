# Proton

**Proton** es la potente librería de descarga de alto rendimiento desarrollada íntegramente en **Rust** para **CubicLauncher**. Su objetivo es gestionar la descarga masiva de archivos de Minecraft (librerías, activos, nativos y el cliente) de forma extremadamente rápida, segura y eficiente.

Con la migración a Rust nativo en todo el launcher, Proton ahora se integra directamente en el núcleo sin necesidad de capas intermedias como JNI, lo que reduce la latencia y mejora la estabilidad.

## Características Principales

- **Descargas Concurrentes**: Utiliza un sistema de semáforos para gestionar cientos de descargas simultáneas sin saturar el sistema (optimizado para conexiones de alta velocidad).
- **Integridad de Datos**: Verificación automática de archivos mediante hashes (SHA-1) para asegurar que no haya descargas corruptas.
- **Extracción Automática**: Gestiona la extracción de archivos nativos específicos del sistema operativo inmediatamente después de su descarga.
- **Arquitectura Asíncrona**: Basado en `tokio` para operaciones de entrada/salida no bloqueantes, permitiendo que la interfaz del launcher siga siendo fluida durante las descargas.
- **Integración Nativa**: Se comunica con el frontend de Tauri a través de canales de eventos en tiempo real.

---

## Uso en CubicLauncher (Rust)

Proton se utiliza dentro del backend de Tauri para gestionar las tareas de descarga.

### Ejemplo de integración

```rust
use proton::{MinecraftDownloader, resolve_version_data};
use std::path::PathBuf;

#[tauri::command]
async fn start_download(window: tauri::Window, version: String, path: String) -> Result<(), String> {
    let game_path = PathBuf::from(path);
    
    // Resolver datos de la versión
    let version_data = resolve_version_data(version).await
        .map_err(|e| e.to_string())?;

    // Crear el descargador
    let downloader = MinecraftDownloader::new(game_path, version_data);

    // Iniciar descarga con seguimiento de progreso
    downloader.download_with_callback(|progress| {
        window.emit("download-progress", progress).unwrap();
    }).await.map_err(|e| e.to_string())?;

    Ok(())
}
```

---

## Uso como Librería Independiente

Si deseas utilizar Proton en otro proyecto de Rust:

### Agregar al `Cargo.toml`
```toml
[dependencies]
proton = { git = "https://github.com/CubicLauncher/Proton" }
```

---

## Detalles Técnicos

### Concurrencia y Rendimiento
Proton utiliza constantes internas para optimizar el rendimiento según el tipo de tarea:
- `MAX_CONCURRENT_DOWNLOADS = 128`: Máximo de conexiones HTTP simultáneas.
- `MAX_CONCURRENT_EXTRACTIONS = 8`: Máximo de hilos dedicados a la descompresión de archivos.

### Estructura de Directorios
La librería organiza automáticamente los archivos siguiendo el estándar de Minecraft:
- `/assets/objects/`: Objetos de recursos indexados por su hash.
- `/libraries/`: Bibliotecas JAR organizadas por paquetes.
- `/versions/`: Archivos JSON de configuración y cliente JAR.

---

<div class="alert alert-note">
    <strong>Nota de Rendimiento:</strong>
    <p>Al ser nativo, Proton puede aprovechar al máximo el ancho de banda disponible y las capacidades multihilo del procesador sin la sobrecarga de la recolección de basura de lenguajes de alto nivel.</p>
</div>

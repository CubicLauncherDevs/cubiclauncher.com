# Guía de Instalación de CubicLauncher

Bienvenido a la guía oficial de instalación de CubicLauncher. Sigue estos pasos detallados para configurar correctamente el launcher en tu sistema operativo y disfrutar de la mejor experiencia.

## Requisitos de Sistema

Con la migración a **Rust + Tauri**, CubicLauncher es ahora una aplicación nativa, lo que reduce drásticamente el consumo de recursos y elimina la necesidad de Java para el launcher mismo.

### Requisitos de Software

- **Launcher**: No requiere Java (es una aplicación nativa).
- **Minecraft**: Requiere **OpenJDK 21** o superior para las versiones más recientes.
- **Sistema Operativo**: 
  - **Windows**: Windows 10 o Windows 11 (64 bits).
  - **Linux**: Distribuciones modernas (Ubuntu, Arch, Fedora, Debian).
  - **macOS**: macOS 11.0 o superior (Big Sur en adelante).

### Requisitos de Hardware

- **Memoria RAM**:
  - Mínimo: 2 GB (para el sistema y el juego).
  - Recomendado: 4 GB o más.
- **Procesador (CPU)**: CPU de 64 bits.
- **Gráficos (GPU)**: Compatibilidad con OpenGL 3.3 o superior.
- **Espacio en Disco**: 
  - ~20 MB para el launcher nativo.
  - Espacio adicional para las versiones de Minecraft y activos.

---

## 1. Descarga del Launcher

Puedes obtener la última versión nativa de CubicLauncher desde nuestro sitio oficial o desde GitHub:

- **Sitio Web**: [cubiclauncher.com/install](https://www.cubiclauncher.com/install)
- **GitHub**: [Releases oficial de CubicLauncher](https://github.com/CubicLauncher/CubicLauncher/releases)

---

## 2. Instalación por Sistema Operativo

### Windows
1. Descarga el instalador `.exe`.
2. Ejecuta el archivo y sigue las instrucciones en pantalla.
3. El launcher se instalará y creará un acceso directo en tu escritorio.
4. **Ubicación de archivos**: Tus configuraciones y mundos se guardarán en `%APPDATA%\CubicLauncher`.

### Linux
1. Descarga el paquete `.deb` (para Debian/Ubuntu) o el `.AppImage`.
2. **Para .deb**: Instálalo usando `sudo apt install ./cubiclauncher.deb`.
3. **Para .AppImage**: Otorga permisos de ejecución (`chmod +x ...`) y ejecútalo directamente.
4. **Ubicación de archivos**: Los archivos se almacenarán en `~/.local/share/cubiclauncher` o `~/.cubic`.

### macOS
1. Descarga el archivo `.dmg`.
2. Ábrelo y arrastra el icono de CubicLauncher a la carpeta de **Aplicaciones**.
3. **Ubicación de archivos**: Se guardarán en `~/Library/Application Support/CubicLauncher`.

---

## 3. Instalación de Java para Minecraft

Aunque el launcher no lo necesite, Minecraft sí. Recomendamos **Adoptium Temurin**:

1. Visita [Adoptium.net](https://adoptium.net/temurin/releases/?version=21).
2. Descarga e instala la versión 21.
3. CubicLauncher detectará automáticamente la instalación de Java o te permitirá seleccionarla en la configuración.

---

## 4. Solución de Problemas Comunes

- **"SmartScreen de Windows protegió su PC"**: Al ser un software nuevo de código abierto, Windows puede mostrar esta advertencia. Haz clic en "Más información" y luego en "Ejecutar de todas formas".
- **Falta de librerías en Linux**: Asegúrate de tener instaladas las dependencias de WebKit2GTK si usas una distribución muy minimalista.
- **Minecraft no inicia**: Verifica que tienes Java instalado y asignado correctamente en la configuración de la instancia.

---

<div class="alert alert-sugerencia">
    <strong>Soporte en Discord</strong>
    <p>¿Aún tienes problemas? Únete a nuestro <a href="https://discord.gg7VaqSrPukm">Discord</a> y nuestro equipo te ayudará con gusto.</p>
</div>

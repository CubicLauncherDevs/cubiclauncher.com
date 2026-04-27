# CLaunch

**CLaunch** es la librería de lanzamiento de Minecraft desarrollada por CubicLauncher. Portada íntegramente a **Rust**, esta biblioteca es el motor encargado de construir el comando de ejecución del juego, gestionando dependencias, classpath, nativos y argumentos de la JVM de manera eficiente.

## Características de la versión Rust

- **Seguridad de Tipos**: Aprovecha el sistema de tipos de Rust para evitar errores en la construcción de argumentos.
- **Rendimiento Nativo**: Sin la sobrecarga de la JVM para la lógica de preparación del lanzamiento.
- **Manejo de JSON**: Procesamiento ultra rápido de los manifiestos de versión de Minecraft.
- **Soporte Multiplataforma**: Construcción de comandos específica para Windows, Linux y macOS.

---

## Punto de Entrada en Rust

En la nueva arquitectura, CLaunch se integra como un módulo de Rust dentro del backend de CubicLauncher, ofreciendo un sistema de gestión de sesiones robusto.

### Ejemplo de Lanzamiento

```rust
use claunch::{Launcher, LaunchOptions, auth::MinecraftUser};
use std::path::PathBuf;

#[tokio::main]
async fn main() {
    let launcher = Launcher::new(
        PathBuf::from("/ruta/al/json/1.20.1.json"),
        PathBuf::from("/ruta/al/directorio/base"),
        PathBuf::from("/ruta/a/la/instancia")
    );

    let options = LaunchOptions::default()
        .with_ram("2G", "4G")
        .with_resolution(1920, 1080)
        .with_java_path("/usr/bin/java");

    // Usuario (puede ser Microsoft o Cracked)
    let user = MinecraftUser::new_cracked("JugadorCubic");

    match launcher.launch_with_options(&options, &user).await {
        Ok(_) => println!("Juego iniciado con éxito"),
        Err(e) => eprintln!("Error al iniciar: {}", e),
    }
}
```

---

## Autenticación y Gestión de Cuentas

CLaunch implementa un módulo completo de autenticación que soporta cuentas **Cracked** y cuentas de **Microsoft** mediante el flujo de dispositivos de OAuth2.

### 1. Tipos de Cuenta
El sistema utiliza el enum `AccountType` para distinguir entre los dos métodos de acceso:
- **Cracked**: Solo requiere un nombre de usuario. Ideal para desarrollo o servidores offline.
- **Microsoft**: Requiere un flujo de autenticación oficial para obtener el `access_token` y `uuid` real del jugador.

### 2. Autenticación con Microsoft (Device Flow)
Para las cuentas de Microsoft, CLaunch utiliza el **Device Code Flow**, lo que permite una autenticación segura sin que el launcher maneje las credenciales del usuario directamente.

```rust
use claunch::auth::microsoft::MicrosoftAuth;

async fn login_microsoft() {
    let auth = MicrosoftAuth::new("CLIENT_ID_AQUÍ");
    
    // 1. Obtener código de dispositivo
    let device_code = auth.get_device_code().await.unwrap();
    println!("Por favor, ve a {} e ingresa el código: {}", 
        device_code.verification_uri, 
        device_code.user_code
    );

    // 2. Esperar a que el usuario complete el login
    let user = auth.poll_for_token(device_code).await.unwrap();
    println!("Bienvenido, {}!", user.username);
}
```

### 3. Almacenamiento Seguro
CLaunch incluye soporte para persistencia de sesiones utilizando cifrado **AES-GCM**. Los tokens de Microsoft se almacenan cifrados en disco, permitiendo que el usuario no tenga que volver a iniciar sesión cada vez que abre el launcher.

```rust
// Ejemplo de guardado cifrado
user.save_tokens("mi_clave_maestra").unwrap();

// Carga de usuario existente
let user = MinecraftUser::load_tokens("mi_clave_maestra").unwrap();
```


---

## Lógica de Procesamiento

CLaunch procesa dinámicamente los siguientes elementos:

### 1. Construcción del Classpath
Genera la cadena completa de librerías requeridas por la versión, verificando la existencia de cada archivo en el disco y aplicando las reglas de sistema operativo definidas en el JSON.

### 2. Argumentos de la JVM
- **Variables de Entorno**: Configura `natives_directory`, `launcher_name` y `launcher_version`.
- **Reglas Condicionales**: Evalúa si un argumento debe incluirse según la plataforma o las características habilitadas (ej: `has_custom_resolution`).

### 3. Argumentos del Juego
- **Tokens**: Reemplaza variables como `${auth_player_name}`, `${version_name}`, `${game_directory}`, etc.
- **Versiones Legacy**: Soporte para el formato antiguo de argumentos de línea de comandos.

---

## Soporte de Modloaders

Al igual que su predecesora en Java, la versión Rust de CLaunch detecta y maneja:
- **Fabric**: Resolución de puntos de entrada y librerías del loader.
- **Forge / NeoForge**: Soporte para el sistema de herencia de versiones y argumentos específicos del modloader.

---

## Resolución de Problemas (FAQ)

### ¿CLaunch busca Java automáticamente?
No. CLaunch requiere que se le proporcione la ruta al ejecutable de Java. Esto permite que el usuario elija qué versión de Java usar para cada instancia.

### ¿CLaunch descarga archivos?
No. CLaunch asume que todos los archivos (JARs, JSONs, Assets) ya han sido descargados por **Proton**. Su única responsabilidad es el lanzamiento.

---

<div class="alert alert-note">
    <strong>Dato Técnico:</strong>
    <p>CLaunch en Rust utiliza el crate <code>serde_json</code> para el parseo de archivos de versión, lo que garantiza una velocidad de carga de perfiles casi instantánea.</p>
</div>

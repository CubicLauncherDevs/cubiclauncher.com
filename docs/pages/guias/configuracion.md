# Configuración de CubicLauncher

CubicLauncher permite una gran flexibilidad para ajustar el rendimiento y comportamiento del juego. Puedes acceder a estos ajustes desde el panel de **Configuración** en la interfaz principal.

## Ajustes del Launcher

- **Idioma**: Cambia el idioma de la interfaz (por defecto: Español).
- **Actualización automática**: Mantén el launcher siempre al día con las últimas correcciones.
- **Consola de errores**: Útil para depurar si el juego o el launcher se cierran inesperadamente.
- **Cerrar al iniciar juego**: Opción para cerrar el launcher automáticamente una vez que Minecraft ha arrancado.

## Cuentas de Microsoft (Nuevo)

CubicLauncher ahora soporta la autenticación oficial de Microsoft:
- **Inicio de Sesión Nativo**: Usa el flujo de Device Code para conectar tu cuenta de forma segura.
- **Perfiles Oficiales**: Al iniciar sesión, el launcher cargará automáticamente tu nombre, skin y capa oficial.
- **Servidores Premium**: Juega en cualquier servidor que requiera una cuenta oficial de Minecraft.

## Ajustes de Minecraft

### Versiones
Puedes habilitar la visibilidad de versiones en desarrollo:
- **Mostrar versiones Alpha**: Acceso a las versiones más antiguas de desarrollo.
- **Mostrar versiones Beta**: Acceso a las primeras betas del juego.

### Rendimiento
- **Forzar GPU dedicada**: En equipos con gráficos integrados y dedicados (como laptops), intenta forzar el uso de la tarjeta más potente.

## Java y Memoria

Esta es la sección más importante para garantizar un juego fluido.

- **Memoria Mínima / Máxima**: Ajusta cuánta RAM destinar a Minecraft. 
  - *Recomendación*: Para versiones modernas con mods, se sugieren al menos 4GB (si tu equipo lo permite).
- **Rutas de Java (JRE)**: CubicLauncher te permite definir rutas específicas para diferentes versiones de Java:
  - JRE 8 (para versiones antiguas).
  - JRE 17.
  - JRE 21 (recomendado para versiones actuales).
- **Argumentos JVM**: Añade parámetros adicionales para optimizar el recolector de basura o el rendimiento del procesador.

## Archivo settings.cub

Si prefieres editar la configuración manualmente (para usuarios avanzados), puedes encontrar el archivo `settings.cub` en la carpeta raíz de CubicLauncher.

```json
{
  "username": "steve",
  "user": null,
  "min_memory": 1,
  "max_memory": 2,
  "jre8_path": "/usr/lib/jvm/java-8-openjdk/bin/java",
  "jre17_path": "/usr/lib/jvm/java-17-openjdk/bin/java",
  "jre21_path": "/usr/lib/jvm/java-21-openjdk/bin/java",
  "language": "es",
  "auto_updates": false,
  "show_error_console": false,
  "close_launcher_on_play": true,
  "show_snapshots": false,  
  "show_alpha": false,
  "force_gpu": false,
  "jvm_args": ""
}
```

<div class="alert alert-warning">
    <strong>¡Cuidado!</strong>
    <p>Si vas a modificar el archivo manualmente, asegúrate de guardar una copia de seguridad <br> para no perder tus configuraciones.</p>
</div>

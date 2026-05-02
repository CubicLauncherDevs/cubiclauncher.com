# Guía de Contribución

¡Gracias por tu interés en contribuir a CubicLauncher! Somos un proyecto de código abierto y agradecemos cualquier ayuda, ya sea reportando errores, sugiriendo características o escribiendo código.

## Tecnologías Utilizadas

CubicLauncher ha evolucionado hacia un stack tecnológico moderno y eficiente:
- **Backend**: Rust con [Tauri](https://tauri.app/).
- **Frontend**: [TypeScript](https://www.typescriptlang.org/) con [Svelte](https://svelte.dev/).
- **Gestor de Paquetes**: [Bun](https://bun.sh/).
- **Estilos**: CSS.

## Cómo empezar

### 1. Preparar el entorno
Consulta la [Guía de Compilación](#desarrollo/compilacion) para configurar Rust, Bun y las dependencias de Tauri en tu sistema.

### 2. Fork y Clonación
1. Haz un Fork del repositorio en GitHub.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/CubicLauncher.git
   ```

### 3. Crear una rama
Siempre crea una rama descriptiva para tus cambios:
```bash
git checkout -b feature/nueva-caracteristica
# o
git checkout -b fix/error-especifico
```

## Estándares de Código

### Rust
- Usa `cargo fmt` antes de enviar tus cambios.
- Sigue las recomendaciones de `clippy`: `cargo clippy`.
- Documenta las funciones públicas en el backend.

### Frontend
- Mantén los componentes pequeños y reutilizables.
- Usa TypeScript para mayor seguridad en los tipos.
- Asegúrate de que la interfaz sea responsiva.

## Enviar un Pull Request (PR)

1. Sube tus cambios a tu fork: `git push origin mi-rama`.
2. Abre un Pull Request hacia la rama `main` (o la rama de desarrollo activa) del repositorio oficial.
3. Describe detalladamente qué cambios has realizado y por qué.
4. Si tu PR corrige un issue existente, menciónalo (ej: `Fixes #123`).

## Reportar Errores

Si encuentras un error, por favor abre un **Issue** en GitHub incluyendo:
- Pasos para reproducir el error.
- Comportamiento esperado vs. Comportamiento actual.
- Capturas de pantalla si es un error visual.
- Logs de la consola si es un error técnico.

---

<div class="alert alert-note">
    <strong>Comunidad:</strong>
    <p>Si tienes dudas sobre cómo implementar algo, no dudes en preguntar en nuestro canal de desarrollo en <a href="https://discord.gg/7VaqSrPukm">Discord</a>.</p>
</div>

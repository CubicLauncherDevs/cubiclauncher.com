---
title: "De Java a Rust: Por qué estamos migrando CubicLauncher"
date: 2026-04-12
author: CubicLauncher Team
tags: [Desarrollo, Rust, Java]
---

Durante los últimos meses, el desarrollo de CubicLauncher ha avanzado bastante. Logramos armar una interfaz funcional en Java, pero mientras el proyecto crecía, nos topamos con un problema que no podíamos pasar por alto: **fugas de memoria constantes en la JVM**.

## El problema: un consumo de RAM que se nos fue de las manos

Haciendo pruebas internas, medimos cuánta RAM usaba el launcher en diferentes momentos. Los resultados fueron bastante preocupantes:

| Escenario | Consumo de RAM |
|---|---|
| En reposo (Idle) | 186 – 253 MB |
| Viendo las versiones | ~300 MB |
| Descargando archivos | ~573 MB |
| Después de descargar (tras limpieza manual) | ~400 MB |

![Consumo en reposo](../img/image.png)
*Lo que consume el launcher sin hacer nada.*

![Consumo en vista de versiones](../img/image2.png)
*El consumo sube al navegar por las versiones disponibles.*

Lo peor no fue el pico de memoria durante las descargas, sino lo que pasaba después: **Java no soltaba la memoria** aunque ya no la estuviera usando.

![Consumo durante descarga](../img/image3.png)
*Pico registrado durante una descarga.*

Si descargas varias versiones seguidas, el problema empeora. Para una herramienta que tiene que estar abierta de fondo mientras juegas, este consumo es simplemente inaceptable.

## La decisión: Nos pasamos a Rust + Tauri

Por todo esto, hace dos meses decidimos **empezar a reescribir CubicLauncher usando Rust y Tauri**. Es un trabajo grande porque hay que rehacer casi todo, pero merece la pena por varias razones:

- **Adiós a los problemas de memoria**: Con Rust tenemos el control total. Ya no dependemos de que Java decida cuándo limpiar la RAM, lo que elimina las fugas de memoria de raíz.
- **Interfaz más ligera con Svelte**: Al usar Tauri con Svelte, la interfaz es muchísimo más rápida y consume una fracción de lo que usaba la versión anterior en Java.
- **Mejor rendimiento**: El programa ocupa menos espacio, abre más rápido y consume tan pocos recursos que ni notarás que está abierto.
- **Una base sólida**: Rust es bueno para este tipo de aplicaciones y nos da la seguridad de que el proyecto podrá crecer sin problemas a largo plazo.

También estamos aprovechando para rediseñar la interfaz desde cero, buscando algo que se sienta más moderno, limpio y fácil de usar.

## ¿Qué sigue?

Ya estamos avanzando con la nueva versión. Pronto contaremos más sobre cómo está quedando por dentro, enseñaremos el nuevo diseño y publicaremos comparativas reales de rendimiento entre la versión antigua y la nueva.
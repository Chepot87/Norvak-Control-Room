# Norvak Control Room

Espacio creativo para avanzar proyectos de Norvak Web, aprender, organizar la semana y registrar tus entrenamientos.

**Página:** https://chepot87.github.io/Norvak-Control-Room/

## Qué incluye

- **Hoy:** una tarea sugerida según tengas 15, 45 o 90 minutos.
- **Proyectos:** objetivos, enlaces y tareas con pasos, estados y resultados.
- **Mi semana:** plantilla semanal, trabajo, tiempo familiar y tres sesiones de ejercicio de al menos 45 minutos.
- **Ideas:** notas que puedes convertir en tareas.
- **Mi ritmo:** horarios editables de trabajo, recogido escolar y ejercicio.
- **Mis copias:** exportación e importación de tu espacio como JSON.

## Guardado

Esta versión funciona directamente en GitHub Pages. Los cambios se guardan en `localStorage` del navegador. No necesita iniciar sesión con ChatGPT ni envía las tareas a GitHub.

Los datos de cada dispositivo son independientes. Usa **Mis copias → Exportar mi espacio** para respaldarlos o llevarlos a otro equipo, y **Importar una copia** para recuperarlos. También acepta archivos JSON exportados desde la versión de Sites. Los cambios que ya tengas guardados en Sites no se trasladan automáticamente.

La página y el código son públicos. Tus cambios posteriores permanecen en el navegador en que los escribes. Evita borrar los datos del navegador sin exportar una copia.

## Trabajar desde VS Code

Requiere Node.js 22.13 o posterior.

```sh
git clone https://github.com/Chepot87/Norvak-Control-Room.git
cd Norvak-Control-Room
npm ci
npm run dev
```

La terminal muestra la dirección local. Edita `src/App.tsx`, `src/styles.css` y los archivos de `src/lib/`.

```sh
npm test
npm run build
```

`npm run build` actualiza la carpeta `docs/`, que es la que publica GitHub Pages. Después de editar, incluye los cambios de código y de `docs/` en el mismo commit y súbelos a `main`.

## Publicación

GitHub → Settings → Pages → Deploy from a branch → `main` → `/docs`.

Los recursos usan rutas relativas para funcionar bajo `/Norvak-Control-Room/`. `docs/.nojekyll` evita que Jekyll modifique los archivos compilados. No se necesita una base de datos ni claves de API para esta versión.

## Pruebas

Las pruebas verifican conflictos de horario, tres sesiones de 45 minutos, conservación de notas antiguas, recomendaciones por tiempo, semanas de Florida, guardado local, importación y detección de cambios en otra pestaña.

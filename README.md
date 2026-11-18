# Dot. Estudio de Software

Sitio estático basado en el diseño del [portfolio de Juan Pablo Libares de Lamadrid](https://juanlibares.web.app/).
El código y los recursos están en `public/`. El sitio se sirve sin paso de compilación.

## Vista local

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000 --directory public
```

Abrí [http://localhost:8000](http://localhost:8000).

## Firebase Hosting

Para intentar usar `dot.web.app`, creá el sitio de Hosting con ID `dot` dentro de un proyecto de Firebase dedicado al estudio. El ID del sitio es global y su disponibilidad se confirma al crearlo. El ID del proyecto de Firebase tiene un mínimo de seis caracteres y es independiente del ID de Hosting. Si `dot` no está disponible, usá otro ID de sitio.

Ejecutá los siguientes comandos desde la raíz, reemplazando `TU_PROYECTO` por el ID del proyecto y `dot` por el ID elegido si corresponde:

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest hosting:sites:create dot --project TU_PROYECTO
npx -y firebase-tools@latest target:apply hosting estudio dot --project TU_PROYECTO
```

Agregá `"target": "estudio"` dentro del objeto `hosting` de `firebase.json`. El comando anterior registra el sitio de destino en `.firebaserc`. Luego ejecutá:

```bash
npx -y firebase-tools@latest deploy --only hosting:estudio --project TU_PROYECTO
```

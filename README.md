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

La web está publicada en [dotx.web.app](https://dotx.web.app/).
El destino `estudio` apunta al sitio `dotx` dentro del proyecto `dot-estudio-software`.

Desde la raíz del repositorio, con una sesión de Firebase autorizada:

```bash
npx -y firebase-tools@latest deploy --only hosting:estudio --project dot-estudio-software
```

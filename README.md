# Red Social — Prueba Técnica (Frontend Angular)

Frontend en Angular 20 (NgModules, sin componentes standalone) para una red social, con
autenticación, perfil, publicaciones y likes en tiempo real. Apunta al backend real
(`backend-red-social-auth` + `backend-red-social-service`, Spring Boot); incluye además un
mock en Node.js (`mock-server/`) como alternativa legacy para trabajar sin backend real.

## Stack

- Angular 20 (NgModules, lazy loading por feature)
- Estado: `@ngrx/signals` (`signalStore`, singleton `providedIn: 'root'`)
- Estilos: Bootstrap 5 + SCSS
- Realtime de likes: WebSocket nativo (API `WebSocket` del navegador, sin librerías)

## Instalación

### Opción A: Docker, con el backend real (recomendada)

Este repo se construye como parte del `docker-compose.yml` de `backend-red-social-auth`, así
que debe estar clonado como carpeta hermana de ese repo. Ver la sección "Instalación" de
[su README](../backend-red-social-auth/README.md):

```bash
cd ../backend-red-social-auth
docker compose up -d --build
```

Levanta el frontend ya compilado (nginx) en http://localhost:4200, junto con Postgres,
auth-service (`:3000`) y post-service (`:3001`).

### Opción B: `npm start`, contra el backend real corriendo aparte

Requiere Node 18+. `environment.ts`/`environment.development.ts` ya apuntan al backend real
(`apiAuthUrl: localhost:3000`, `apiUrl`/`wsUrl: localhost:3001`), así que solo hace falta que
esos dos servicios estén arriba (Docker o `./mvnw spring-boot:run` en cada repo):

```bash
npm install
npm start   # http://localhost:4200
```

### Opción C: mock-server (legacy, sin backend real)

`mock-server/` sirve auth + posts + WebSocket todo en un solo puerto (`:3000`), heredado del
diseño original antes de dividir en microservicios. **Ya no coincide con `environment.ts`**
(que espera posts/WS en `:3001`) — para usarlo hay que apuntar `environment.ts` de vuelta a
un solo host, o servir temporalmente todo desde `:3000`. Útil solo como referencia de
contrato o si necesitas trabajar sin Postgres/Java instalados:

```bash
npm run mock-server:install
npm run mock-server   # http://localhost:3000
```

## Usuarios de prueba

Usuarios semilla (mismos en el backend real — sembrados por `DataSeeder` de `auth-service` —
y en `mock-server/data/seed.js`):

| Usuario  | Clave  | Alias      |
|----------|--------|------------|
| jperez   | 123456 | jp_dev     |
| mgomez   | 123456 | maggo      |
| clopez   | 123456 | carlitos   |

## Probar el realtime de likes

Abrir dos pestañas del navegador, iniciar sesión con un usuario distinto en cada una,
entrar a "Publicaciones" en ambas y dar like desde una pestaña: el contador se actualiza
en la otra sin recargar (vía WebSocket).

## Estructura

```
src/app/
  core/       servicios HTTP, stores (signalStore), guard, interceptor, modelos
  shared/     navbar y componentes reutilizables
  features/   auth (login), posts (listar/crear/dar like), profile
mock-server/  backend mock en memoria (Express + WebSocket nativo)
```

## Endpoints del mock

- `POST /api/auth/login` `{ username, password }`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts` `{ message }`
- `POST /api/posts/:id/like`
- WebSocket `GET /ws?token=<jwt>` → mensajes `{ "type": "post:like", "payload": { postId, likesCount, likedBy } }`

## Realtime contra el backend real

El cliente (`src/app/core/services/realtime.service.ts`) usa la API `WebSocket` nativa del
navegador (no Socket.IO), por lo que habla directo con el endpoint WebSocket real de
`post-service` (`spring-boot-starter-websocket`, ver su README) sin cambios en el cliente —
mismo mensaje JSON `{ type: 'post:like', payload: {...} }` que ya emitía el mock.

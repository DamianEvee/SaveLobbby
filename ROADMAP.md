# ROADMAP - SaveLobby

**Lema:** "Una comunidad por gamers, para gamers, y sobre gaming."
**Visión General:** Plan de desarrollo por fases para SaveLobby, plataforma web/PWA exclusiva de videojuegos con economía integrada, soporte multimedia y categorización dinámica.

## Fase 1: Arquitectura Base y Entorno (Q1)
- [ ] Inicialización del repositorio (LICENSE.md, CONTRIBUTORS.md, README.md).
- [ ] Estructuración del sistema de directorios (Frontend, Backend, Base de Datos).
- [ ] Configuración PWA (Progressive Web App): Service Workers y `manifest.json` para permitir descarga/instalación en Móvil y PC.
- [ ] Diseño de UI/UX de la página principal (Secciones populares).

## Fase 2: Sistema de Usuarios y Publicaciones (Q2)
- [ ] Autenticación de usuarios (Nombres de usuario únicos e irrepetibles).
- [ ] Motor de creación de posts:
  - [ ] Desplegable de selección de videojuegos.
  - [ ] Función de autocompletado e inserción dinámica de nuevos títulos a la base de datos si no existen.
  - [ ] Soporte para subida y alojamiento de imágenes y vídeos.
- [ ] Sistema de etiquetas y filtros globales obligatorios (`MODS`, `GUIA`, `DUDAS`, `AYUDA`).

## Fase 3: Monetización y Economía Interna (Q3)
- [ ] Integración de pasarela de pago segura (ej. Stripe).
- [ ] Desarrollo de función de cambio de nombre de usuario (Bloqueado exclusivamente mediante micropago de dinero real).
- [ ] Sistema de donaciones Peer-to-Peer (P2P): Botón para donar a usuarios por comentarios útiles o ayuda.
- [ ] Sistema de Secciones Privadas / Paywalls: Espacios exclusivos creados por usuarios famosos/creadores de contenido (suscripción de pago con retención de comisión para el administrador).

## Fase 4: Publicidad y Despliegue (Q4)
- [ ] Integración de banners y espacios de anuncios dinámicos para mantener el acceso gratuito al foro.
- [ ] Pruebas de estrés en servidores para la subida de contenido multimedia.
- [ ] Auditoría de seguridad para transacciones monetarias.
- [ ] Despliegue en producción y lanzamiento oficial.
# 🏆 Sport Calendar

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange?logo=firebase)
![Firestore](https://img.shields.io/badge/Firestore-NoSQL-FFCA28?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

Una aplicación web **responsive** para registrar entrenamientos, partidos y hábitos deportivos, con autenticación mediante Google, sincronización en la nube y estadísticas en tiempo real.

El proyecto fue desarrollado utilizando **React**, **Firebase Authentication**, **Cloud Firestore** y **Tailwind CSS**, priorizando una arquitectura simple, escalable y fácil de mantener.

---

# 🌐 Demo

> **Demo online:** *(https://sport-calendar-two.vercel.app/)*

---

# 📸 Capturas de Pantalla

## Calendario Principal

<img width="597" height="837" alt="image" src="https://github.com/user-attachments/assets/9a30e3a8-239d-423c-877c-bcc7f4dbc35a" />


## Panel de Estadísticas

<img width="597" height="1263" alt="image" src="https://github.com/user-attachments/assets/88e22388-6c9b-4f1b-84c5-2efe28f46c56" />


## Gestión de Actividades

<img width="597" height="1263" alt="image" src="https://github.com/user-attachments/assets/bd3212ed-327f-4a14-954f-a0b9de86182b" />


---

# ✨ Funcionalidades

### 🔐 Autenticación

- Inicio de sesión con Google.
- Gestión de sesión mediante Firebase Authentication.

### 📅 Calendario Deportivo

- Registro diario de actividades.
- Colores personalizados.
- Emojis para cada deporte.
- Navegación mensual.

### 🔥 Sistema de Rachas

- Cálculo automático de días consecutivos.
- Actualización en tiempo real.
- Reinicio automático cuando corresponde.

### 📊 Estadísticas

- Total de actividades.
- Distribución porcentual por deporte.
- Historial de entrenamientos.

### ⚙️ Gestión Personalizada

- Crear deportes personalizados.
- Editar actividades.
- Eliminar actividades.
- Persistencia local.

### ☁️ Sincronización

- Todos los eventos se almacenan en Cloud Firestore.
- Sincronización entre dispositivos.
- Datos separados por usuario autenticado.

---

# 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| React 18 | Frontend |
| JSX | Componentes |
| Tailwind CSS | Estilos |
| Firebase Authentication | Login con Google |
| Cloud Firestore | Base de datos |
| Lucide React | Iconografía |
| Vite | Bundler |

---

# 🏗️ Arquitectura

```text
src/
├── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

## Arquitectura lógica

```text
Usuario
      │
      ▼
React UI
      │
      ▼
Firebase Authentication
      │
      ▼
Cloud Firestore
```

---

# 🔒 Seguridad

Las reglas de Firestore garantizan que cada usuario únicamente pueda acceder a su propia información.

```javascript
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    match /events/{eventId} {

      allow read, write:
        if request.auth != null &&
           request.auth.uid == resource.data.userId;

      allow create:
        if request.auth != null &&
           request.auth.uid == request.resource.data.userId;

    }

  }

}
```

---

# 🚀 Instalación

## Clonar el proyecto

```bash
git clone https://github.com/Santi-Furman/sport-calendar.git
```

```bash
cd sport-calendar
```

## Instalar dependencias

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env.local`

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Ejecutar

```bash
npm run dev
```

---

# 📈 Roadmap

- [ ] Refactorizar la arquitectura en Components + Hooks + Utils.
- [ ] Exportación a Google Calendar (.ics).
- [ ] Progressive Web App (PWA).
- [ ] Notificaciones Push.
- [ ] Recordatorios de entrenamiento.
- [ ] Dashboard con gráficos.
- [ ] Tests unitarios.
- [ ] Tests E2E con Cypress.

---

# 🎯 Objetivos Técnicos

Este proyecto fue desarrollado con el objetivo de practicar:

- Arquitectura de aplicaciones React.
- Gestión de estado.
- Integración con Firebase.
- Autenticación OAuth.
- Bases de datos NoSQL.
- Responsive Design.
- Persistencia de datos.
- Buenas prácticas de desarrollo Frontend.

---

# 👨‍💻 Autor

**Santiago Furman**

QA Automation Engineer | Frontend Developer

GitHub:
https://github.com/Santi-Furman

LinkedIn:
*(https://www.linkedin.com/in/santiago-furman-868660259/)*

# 📄 Licencia

MIT License

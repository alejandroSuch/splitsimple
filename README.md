# 💰 SplitSimple

Una aplicación web simple y moderna para compartir y dividir gastos entre amigos.

## ✨ Características

- 🔐 Autenticación con Google (Firebase Auth)
- 👥 Un grupo de gastos activo por usuario registrado
- 🔗 Compartir grupos mediante link único
- ✍️ Cualquiera con el link puede agregar/editar/eliminar gastos
- 💶 Cálculo automático de balances (quién debe a quién)
- 🧹 Auto-eliminación de grupos después de 90 días sin actividad
- 📱 Diseño responsive y moderno

## 🚀 Stack Tecnológico

- **Frontend**: React 19 + Vite
- **Router**: React Router (HashRouter para compatibilidad con GitHub Pages)
- **Backend**: Firebase (Firestore + Authentication)
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions (CI/CD automático)

> **Nota sobre URLs**: La app usa HashRouter (`/#/route`) para compatibilidad con GitHub Pages. Esto garantiza que los links compartidos y el refresh funcionen correctamente. Ver [ROUTING_SOLUTION.md](./ROUTING_SOLUTION.md) para más detalles.

## 📋 Estructura del Proyecto

```
splitsimple/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Auth/        # Login, ProtectedRoute
│   │   ├── Dashboard/   # Dashboard, CreateGroup
│   │   ├── Group/       # GroupView, ExpenseForm, ExpenseList, Balance
│   │   └── Layout/      # Header, ShareLink
│   ├── services/        # Servicios de Firebase
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── utils/           # Utilidades
│   │   └── balanceCalculator.js
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.js
│   │   └── useExpenses.js
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Entry point
├── .github/workflows/   # GitHub Actions
├── firestore.rules      # Reglas de seguridad de Firestore
├── FIREBASE_SETUP.md    # Guía de configuración de Firebase
└── IMPLEMENTATION_PLAN.md # Plan de implementación detallado
```

## 🛠️ Instalación y Desarrollo Local

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Firebase (gratuita)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/splitsimple.git
   cd splitsimple
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Sigue la guía completa en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Crea un archivo `.env.local` con tus credenciales de Firebase

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   - Visita `http://localhost:5173`

## 🚢 Deployment a GitHub Pages

### Configuración Inicial

1. **Configurar secretos en GitHub**
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega todas las variables de Firebase (ver [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

2. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - Source: GitHub Actions

3. **Hacer push a main**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

GitHub Actions automáticamente construirá y desplegará la aplicación.

## 📖 Cómo Usar

### Para Usuarios Registrados

1. **Login con Google**
   - Haz clic en "Continuar con Google"
   - Autoriza la aplicación

2. **Crear un grupo**
   - En el Dashboard, haz clic en "Crear Grupo"
   - Ingresa un nombre (opcional)

3. **Compartir el grupo**
   - Copia el link generado
   - Compártelo con tus amigos

4. **Agregar gastos**
   - Descripción del gasto
   - Monto
   - Quién pagó

5. **Ver balances**
   - La app calcula automáticamente quién debe a quién
   - Muestra las transacciones mínimas necesarias

### Para Usuarios Anónimos (con link)

1. **Abrir el link compartido**
   - `https://tu-usuario.github.io/splitsimple/group/abc123xyz`

2. **Agregar/editar/eliminar gastos**
   - No necesitas cuenta para participar
   - Solo necesitas el link del grupo

## 🔧 Algoritmo de Cálculo de Balances

La aplicación usa un algoritmo greedy optimizado que:

1. Calcula cuánto pagó cada persona
2. Calcula cuánto debe pagar cada persona (total / número de personas)
3. Determina el balance neto de cada uno
4. Minimiza el número de transacciones necesarias

Ejemplo:
- Juan pagó €60
- María pagó €20
- Pedro pagó €40
- Total: €120 → €40 por persona

Resultado:
- Juan: +€20 (le deben)
- María: -€20 (debe)
- Pedro: €0 (está en paz)

Transacción óptima: María → Juan: €20

## 🔐 Seguridad

- Las API keys de Firebase son públicas por diseño
- La seguridad se maneja mediante reglas de Firestore
- Solo usuarios autenticados pueden crear grupos
- Cualquiera con el link puede editar gastos (requisito de diseño)
- Los grupos se auto-eliminan después de 90 días sin actividad

## 📝 Reglas de Firestore

```javascript
// Grupos: cualquiera con el link puede leer/escribir
// Solo usuarios autenticados pueden crear
match /groups/{groupId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update, delete: if true;
}

// Gastos: cualquiera puede leer/escribir
match /groups/{groupId}/expenses/{expenseId} {
  allow read, write: if true;
}

// Usuarios: solo el propio usuario
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework
- [React Router](https://reactrouter.com/) - Routing

## 📧 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

---

Hecho con ❤️ usando React + Firebase

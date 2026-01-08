# Guía de Configuración de Firebase

## 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Add project" o "Agregar proyecto"
3. Nombre del proyecto: `splitsimple` (o el que prefieras)
4. Puedes habilitar Google Analytics (opcional)
5. Espera a que se cree el proyecto

## 2. Configurar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Get started"
3. Ve a la pestaña **Sign-in method**
4. Haz clic en **Google**
5. Habilita el proveedor
6. Selecciona un email de soporte del proyecto
7. Haz clic en **Save**

## 3. Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona modo **Production** (empezaremos con reglas seguras)
4. Elige una ubicación (recomendado: `us-central1` o la más cercana a tus usuarios)
5. Haz clic en "Enable"

## 4. Configurar Reglas de Firestore

1. Ve a **Firestore Database** → **Rules**
2. Copia y pega el contenido del archivo `firestore.rules` de este proyecto
3. Haz clic en **Publish**

## 5. Obtener Credenciales de Firebase

1. Ve a **Project Settings** (⚙️ ícono en el menú lateral)
2. Desplázate a la sección "Your apps"
3. Haz clic en el ícono **Web** (`</>`)
4. Registra la app con el nombre: `splitsimple`
5. **NO** necesitas configurar Firebase Hosting (usaremos GitHub Pages)
6. Copia el objeto `firebaseConfig`

## 6. Configurar Variables de Entorno en GitHub

### Para GitHub Actions (deployment automático):

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret** para cada una de estas variables:

   - `VITE_FIREBASE_API_KEY` → El valor de `apiKey`
   - `VITE_FIREBASE_AUTH_DOMAIN` → El valor de `authDomain`
   - `VITE_FIREBASE_PROJECT_ID` → El valor de `projectId`
   - `VITE_FIREBASE_STORAGE_BUCKET` → El valor de `storageBucket`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` → El valor de `messagingSenderId`
   - `VITE_FIREBASE_APP_ID` → El valor de `appId`

### Para desarrollo local:

1. Crea un archivo `.env.local` en la raíz del proyecto (este archivo NO se sube a git)
2. Copia el contenido del archivo `.env.local.example`
3. Reemplaza los valores con tus credenciales de Firebase

Ejemplo:
```env
VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
VITE_FIREBASE_AUTH_DOMAIN=splitsimple-abc12.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=splitsimple-abc12
VITE_FIREBASE_STORAGE_BUCKET=splitsimple-abc12.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## 7. Configurar Dominios Autorizados

1. Ve a **Authentication** → **Settings** → **Authorized domains**
2. Agrega tu dominio de GitHub Pages:
   - `tu-usuario.github.io`

Por defecto, `localhost` ya está autorizado para desarrollo local.

## 8. (Opcional) Configurar Índices en Firestore

Si Firestore te muestra un error sobre índices faltantes al hacer queries, sigue el enlace que proporciona el error. Firebase te llevará a una página donde puedes crear el índice automáticamente.

## 9. Probar en Local

```bash
npm install
npm run dev
```

Visita `http://localhost:5173` y prueba:
- Login con Google
- Crear un grupo
- Agregar gastos
- Ver balances

## 10. Deployment a GitHub Pages

1. Asegúrate de que todas las variables de entorno estén configuradas en GitHub Secrets
2. Haz push a la rama `main`:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
3. GitHub Actions automáticamente construirá y desplegará la app
4. Ve a **Settings** → **Pages** y verifica que la fuente sea "GitHub Actions"

## Notas Importantes

⚠️ **Seguridad**:
- NUNCA subas el archivo `.env.local` a git (ya está en `.gitignore`)
- Las API keys de Firebase son públicas por diseño - la seguridad viene de las reglas de Firestore
- Revisa las reglas de Firestore antes de producción

💡 **Límites de Firebase (plan gratuito)**:
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB de almacenamiento
- Suficiente para uso personal y grupos pequeños

🔧 **Troubleshooting**:
- Si el login no funciona, verifica que el dominio esté autorizado en Firebase
- Si hay errores de permisos, revisa las reglas de Firestore
- Si las variables de entorno no funcionan, asegúrate de que tengan el prefijo `VITE_`

## Recursos

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

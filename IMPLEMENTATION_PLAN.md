# SplitSimple - Plan de Implementación

## Resumen del Proyecto

**SplitSimple** es una aplicación web para compartir y dividir gastos entre personas.

### Características Principales
- ✅ Autenticación con Google (Firebase Auth)
- ✅ 1 grupo de gastos activo por usuario registrado
- ✅ Compartir grupos mediante link único
- ✅ Cualquiera con el link puede agregar/editar/eliminar gastos
- ✅ Cada gasto incluye: descripción, monto, quién pagó
- ✅ Cálculo automático de balances (quién debe a quién)
- ✅ Auto-eliminación de grupos con más de 90 días
- ✅ Hosting: GitHub Pages
- ✅ Backend: Firebase (Firestore + Auth)
- ✅ Frontend: React + Vite

---

## Paso 1: Configuración Inicial del Proyecto

### 1.1 Crear Proyecto React con Vite
```bash
npm create vite@latest . -- --template react
npm install
```

### 1.2 Instalar Dependencias
```bash
npm install firebase react-router-dom
npm install -D gh-pages
```

### 1.3 Estructura de Carpetas
```
splitsimple/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── CreateGroup.jsx
│   │   ├── Group/
│   │   │   ├── GroupView.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── Balance.jsx
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       └── ShareLink.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── utils/
│   │   └── balanceCalculator.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useExpenses.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env.local (no subir a git)
├── .gitignore
├── firebase.json
├── firestore.rules
├── FIREBASE_SETUP.md
└── package.json
```

---

## Paso 2: Configuración de Firebase

### 2.1 Crear Proyecto Firebase
1. Ir a https://console.firebase.google.com/
2. Crear nuevo proyecto "splitsimple"
3. Habilitar Google Analytics (opcional)
4. Esperar a que se cree el proyecto

### 2.2 Configurar Authentication
1. En Firebase Console → Authentication → Get Started
2. Sign-in method → Google → Enable → Save

### 2.3 Configurar Firestore Database
1. En Firebase Console → Firestore Database → Create Database
2. Seleccionar modo "production"
3. Elegir región (us-central1 recomendado)

### 2.4 Obtener Credenciales
1. Project Settings → General → Your apps
2. Click "Web app" (</> icon)
3. Registrar app "splitsimple"
4. Copiar firebaseConfig

### 2.5 Crear archivo `.env.local` (NO subir a git)
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## Paso 3: Estructura de Datos en Firestore

### Colección: `groups`
```javascript
{
  id: "abc123xyz", // auto-generated
  creatorId: "user_uid",
  createdAt: Timestamp,
  lastActivity: Timestamp, // para auto-delete después de 90 días
  name: "Viaje a Barcelona" // opcional
}
```

### Colección: `groups/{groupId}/expenses`
```javascript
{
  id: "expense_id", // auto-generated
  description: "Cena restaurante",
  amount: 45.50,
  paidBy: "Juan",
  createdAt: Timestamp,
  createdBy: "user_uid o 'anonymous'"
}
```

### Colección: `users`
```javascript
{
  uid: "user_uid",
  email: "user@example.com",
  displayName: "Usuario",
  activeGroupId: "abc123xyz" // null si no tiene grupo activo
}
```

---

## Paso 4: Reglas de Seguridad de Firestore

Archivo: `firestore.rules`
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Grupos: solo el creador puede crear, todos con el ID pueden leer/escribir
    match /groups/{groupId} {
      allow read: if true; // cualquiera con el link puede leer
      allow create: if request.auth != null; // solo usuarios autenticados crean
      allow update, delete: if true; // cualquiera puede modificar (requisito)

      // Gastos dentro de un grupo
      match /expenses/{expenseId} {
        allow read, write: if true; // cualquiera con el link puede editar
      }
    }

    // Usuarios: solo el propio usuario puede leer/escribir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Paso 5: Lógica de Negocio Principal

### 5.1 Algoritmo de Cálculo de Balances

```javascript
// utils/balanceCalculator.js

/**
 * Calcula quién debe dinero a quién
 * @param {Array} expenses - Array de gastos
 * @returns {Object} { balances, transactions }
 */
export function calculateBalances(expenses) {
  // 1. Calcular balance neto por persona
  const netBalances = {};

  expenses.forEach(expense => {
    const { paidBy, amount } = expense;

    // Quien pagó tiene saldo positivo
    if (!netBalances[paidBy]) netBalances[paidBy] = 0;
    netBalances[paidBy] += amount;
  });

  // 2. Calcular cuánto debe cada uno (dividir total entre todos)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const people = Object.keys(netBalances);
  const sharePerPerson = totalExpenses / people.length;

  // 3. Calcular balance final (cuánto pagaron - cuánto deben)
  const finalBalances = {};
  people.forEach(person => {
    finalBalances[person] = netBalances[person] - sharePerPerson;
  });

  // 4. Generar transacciones óptimas
  const transactions = minimizeTransactions(finalBalances);

  return {
    balances: finalBalances,
    transactions,
    totalExpenses,
    sharePerPerson
  };
}

/**
 * Minimiza el número de transacciones necesarias
 */
function minimizeTransactions(balances) {
  const transactions = [];

  // Separar deudores y acreedores
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance < -0.01) {
      debtors.push({ person, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ person, amount: balance });
    }
  });

  // Algoritmo greedy para minimizar transacciones
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.person,
      to: creditor.person,
      amount: parseFloat(amount.toFixed(2))
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return transactions;
}
```

### 5.2 Auto-eliminación de Grupos (90 días)

```javascript
// Firebase Cloud Function (opcional) o cliente
// Verificar en cada carga si lastActivity > 90 días
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

async function cleanupOldGroups() {
  const cutoffDate = new Date(Date.now() - NINETY_DAYS_MS);
  const oldGroups = await getDocs(
    query(
      collection(db, 'groups'),
      where('lastActivity', '<', cutoffDate)
    )
  );

  // Eliminar grupos antiguos
  oldGroups.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}
```

---

## Paso 6: Componentes React Principales

### 6.1 App.jsx - Router Principal
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import GroupView from './components/Group/GroupView';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/group/:groupId" element={<GroupView />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 6.2 Flujo de Usuario

**Usuario Registrado:**
1. Login con Google → Dashboard
2. Si no tiene grupo activo → Botón "Crear Grupo"
3. Si tiene grupo activo → Ver grupo con opción "Cerrar grupo"
4. Compartir link: `https://yourusername.github.io/splitsimple/group/abc123xyz`

**Usuario Anónimo (con link):**
1. Accede a `/group/abc123xyz` directamente
2. Puede ver y agregar/editar/eliminar gastos
3. No puede crear grupos nuevos

---

## Paso 7: Deployment a GitHub Pages

### 7.1 Configurar vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/splitsimple/', // nombre del repositorio
})
```

### 7.2 Configurar package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://tu-usuario.github.io/splitsimple"
}
```

### 7.3 Actualizar .gitignore
```
node_modules
dist
.env.local
.DS_Store
```

### 7.4 Deploy
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/splitsimple.git
git push -u origin main

npm run deploy
```

### 7.5 Configurar GitHub Pages
1. Ir a Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages / root
4. Save

### 7.6 Actualizar Firebase Auth Domain
En Firebase Console → Authentication → Settings → Authorized domains
Agregar: `tu-usuario.github.io`

---

## Paso 8: Testing Manual

### Checklist de Funcionalidades
- [ ] Login con Google funciona
- [ ] Usuario puede crear un grupo
- [ ] Se genera ID único para el grupo
- [ ] Link compartible funciona
- [ ] Usuarios anónimos pueden agregar gastos
- [ ] Cálculo de balances es correcto
- [ ] Solo 1 grupo activo por usuario
- [ ] Grupos viejos se eliminan (verificar manualmente después de 90 días)

---

## Próximos Pasos

1. **Sesión 1**: Crear proyecto base y configurar Firebase
2. **Sesión 2**: Implementar autenticación y servicios
3. **Sesión 3**: Crear componentes UI
4. **Sesión 4**: Implementar lógica de balances
5. **Sesión 5**: Testing y deployment

---

## Recursos Útiles

- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [GitHub Pages](https://pages.github.com/)

---

## Notas Importantes

⚠️ **Seguridad:**
- Nunca subir `.env.local` a git
- Revisar reglas de Firestore antes de producción
- Configurar CORS en Firebase si es necesario

💡 **Mejoras Futuras:**
- Agregar categorías a gastos
- Exportar a PDF/CSV
- Notificaciones por email
- Multi-moneda
- Modo oscuro

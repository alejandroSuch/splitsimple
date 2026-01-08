# 🎯 Próximos Pasos - SplitSimple

## ✅ Completado

La aplicación SplitSimple está completamente implementada con todas las características principales:

- ✅ Configuración del proyecto React con Vite
- ✅ Integración con Firebase (Auth + Firestore)
- ✅ Componentes de autenticación (Login con Google)
- ✅ Dashboard para gestión de grupos
- ✅ Vista de grupo con gastos y balances
- ✅ Algoritmo de cálculo de balances optimizado
- ✅ Sistema de compartir mediante links
- ✅ Diseño responsive y moderno
- ✅ GitHub Actions para deployment automático
- ✅ Documentación completa

## 🔧 Configuración Necesaria (Hacer Ahora)

### 1. Configurar Firebase (Obligatorio)

Sigue la guía paso a paso en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md):

1. Crear proyecto en Firebase Console
2. Habilitar Google Authentication
3. Crear Firestore Database
4. Configurar reglas de seguridad
5. Obtener credenciales

### 2. Variables de Entorno

**Para desarrollo local:**
```bash
# Crea .env.local con tus credenciales de Firebase
cp .env.local.example .env.local
# Edita .env.local con tus valores reales
```

**Para GitHub Pages (deployment):**
- Ve a GitHub → Settings → Secrets and variables → Actions
- Agrega todos los secretos de Firebase (ver FIREBASE_SETUP.md)

### 3. Actualizar vite.config.js (Importante)

Actualiza la ruta base en `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/splitsimple/', // ← Cambia "splitsimple" por el nombre de tu repo
})
```

### 4. Actualizar package.json

Actualiza el homepage en `package.json`:

```json
{
  "homepage": "https://TU-USUARIO.github.io/TU-REPO"
}
```

## 🚀 Deployment

### Opción 1: GitHub Pages con Actions (Recomendado)

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SplitSimple app"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/splitsimple.git
   git push -u origin main
   ```

2. **Configurar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: GitHub Actions (se detectará automáticamente)

3. **Verificar deployment:**
   - Ve a la pestaña Actions
   - Espera a que el workflow termine
   - Visita `https://TU-USUARIO.github.io/splitsimple`

### Opción 2: Deployment Manual

```bash
npm run build
npm run deploy
```

## 🧪 Testing Local

Antes de hacer deployment, prueba localmente:

```bash
npm run dev
```

Verifica:
- [ ] Login con Google funciona
- [ ] Puedes crear un grupo
- [ ] Puedes agregar gastos
- [ ] Los balances se calculan correctamente
- [ ] El link de compartir se copia correctamente
- [ ] Puedes cerrar un grupo (si eres el creador)

## 📝 Configuración Post-Deployment

### 1. Autorizar Dominio en Firebase

1. Ve a Firebase Console → Authentication → Settings
2. Ve a "Authorized domains"
3. Agrega: `TU-USUARIO.github.io`

### 2. Probar con Link Compartido

1. Abre el navegador en modo incógnito
2. Pega el link de un grupo compartido (formato: `https://TU-USUARIO.github.io/splitsimple/#/group/abc123`)
3. Verifica que puedas agregar gastos sin login

> **Nota**: Los links usan HashRouter (`/#/`) para funcionar correctamente en GitHub Pages. Ver [ROUTING_SOLUTION.md](./ROUTING_SOLUTION.md)

## 🎨 Personalización (Opcional)

### Cambiar Colores

Edita los colores principales en los archivos CSS:
- Primario: `#667eea` → Cambiar en todos los archivos CSS
- Secundario: `#27ae60` (verde)
- Error: `#e74c3c` (rojo)

### Cambiar Moneda

Edita `src/utils/balanceCalculator.js`:

```javascript
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR' // ← Cambia a 'USD', 'MXN', etc.
  }).format(amount);
}
```

### Cambiar Icono y Título

1. Reemplaza `/public/vite.svg` con tu favicon
2. Edita `index.html` para cambiar el título

## 🐛 Troubleshooting

### El build falla en GitHub Actions

- Verifica que todos los secretos estén configurados en GitHub
- Verifica que los nombres de los secretos coincidan exactamente

### Login con Google no funciona

- Verifica que el dominio esté autorizado en Firebase
- Verifica que las credenciales en `.env.local` sean correctas

### Los gastos no se guardan

- Verifica las reglas de Firestore en Firebase Console
- Copia las reglas de `firestore.rules`

### Los links compartidos no funcionan / 404 al hacer refresh

✅ **Ya solucionado**: La app usa `HashRouter` que funciona perfectamente en GitHub Pages.
- Los links tienen el formato: `/#/group/abc123`
- El refresh funciona correctamente
- Ver [ROUTING_SOLUTION.md](./ROUTING_SOLUTION.md) para detalles técnicos

## 💡 Mejoras Futuras (Ideas)

### Funcionalidades
- [ ] Editar gastos existentes
- [ ] Categorías de gastos
- [ ] Exportar gastos a PDF/CSV
- [ ] Histórico de grupos cerrados
- [ ] Notificaciones por email
- [ ] Múltiples monedas
- [ ] Subir fotos de recibos
- [ ] Gastos divididos de forma desigual
- [ ] Modo oscuro

### Técnicas
- [ ] Tests unitarios con Vitest
- [ ] Tests E2E con Playwright
- [ ] PWA (Progressive Web App)
- [ ] Optimización de bundle size
- [ ] Caché de datos con React Query
- [ ] Internacionalización (i18n)

## 📊 Límites del Plan Gratuito de Firebase

- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB de almacenamiento
- 10 GB/mes de transferencia

Suficiente para:
- ~500 grupos activos
- Miles de gastos
- Uso personal y grupos pequeños

## 📚 Recursos

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React Router](https://reactrouter.com/)
- [GitHub Pages Documentation](https://docs.github.com/pages)

## 🎉 ¡Listo!

Tu aplicación SplitSimple está lista para usar. Solo necesitas:
1. Configurar Firebase (20 minutos)
2. Configurar GitHub Secrets (5 minutos)
3. Hacer push a GitHub (1 minuto)

¡Empieza a dividir gastos con tus amigos! 🚀

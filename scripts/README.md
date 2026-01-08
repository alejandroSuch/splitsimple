# Scripts de Mantenimiento

## cleanup-groups.js

Script automatizado para eliminar grupos de Firestore que han estado inactivos por más de 30 días.

### Características

- ✅ Elimina grupos con `lastActivity` > 30 días
- ✅ Elimina también todos los gastos asociados (subcollección `expenses`)
- ✅ Logging detallado del proceso
- ✅ Manejo de errores robusto
- ✅ Continúa procesando aunque falle un grupo individual

### Ejecución Automática

El script se ejecuta automáticamente cada domingo a las 2 AM UTC mediante GitHub Actions.

**Workflow:** `.github/workflows/cleanup-old-groups.yml`

### Ejecución Manual

#### Desde GitHub Actions

1. Ve a la pestaña **Actions** del repositorio
2. Selecciona el workflow "Cleanup Old Groups"
3. Haz clic en "Run workflow"
4. Espera a que complete y revisa los logs

#### Desde Local (Desarrollo/Testing)

**Prerrequisitos:**
- Node.js 20 o superior
- Variables de entorno de Firebase configuradas

**Pasos:**

1. Crear archivo `.env.local` con credenciales:
   ```bash
   # Opción A: Service Account (recomendado)
   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...",...}'

   # Opción B: Credenciales individuales
   VITE_FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. Cargar variables de entorno y ejecutar:
   ```bash
   # macOS/Linux
   export $(cat .env.local | xargs) && npm run cleanup

   # Windows (PowerShell)
   Get-Content .env.local | ForEach-Object { $var = $_.Split('='); [System.Environment]::SetEnvironmentVariable($var[0], $var[1]) }
   npm run cleanup
   ```

### Configuración de Secretos en GitHub

Para que el workflow automático funcione, necesitas configurar secretos en GitHub:

#### Secretos para Notificaciones por Telegram

El workflow envía notificaciones a Telegram al finalizar (éxito o fallo). Configura estos secretos:

**1. Crear un Bot de Telegram**

1. Abre Telegram y busca **@BotFather**
2. Envía el comando: `/newbot`
3. Sigue las instrucciones:
   - Nombre del bot: `SplitSimple Notifications` (o el que quieras)
   - Username del bot: `splitsimple_notif_bot` (debe terminar en `_bot`)
4. @BotFather te dará un **token** como: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. **Guarda este token** - lo necesitarás para GitHub Secrets

**2. Obtener tu Chat ID**

Opción A - Usando @userinfobot (más fácil):
1. Busca **@userinfobot** en Telegram
2. Envía cualquier mensaje
3. Te responderá con tu Chat ID (es un número)

Opción B - Usando la API:
1. Envía un mensaje cualquiera a tu nuevo bot
2. Abre esta URL en tu navegador (reemplaza `<TU_TOKEN>` con el token que te dio @BotFather):
   ```
   https://api.telegram.org/bot<TU_TOKEN>/getUpdates
   ```
3. Busca en la respuesta JSON: `"chat":{"id":123456789`
4. Ese número es tu Chat ID

**3. Configurar Secretos en GitHub**

Ve a tu repositorio: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Crea estos dos secretos:

- **`TELEGRAM_BOT_TOKEN`**: El token completo que te dio @BotFather
  - Ejemplo: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

- **`TELEGRAM_CHAT_ID`**: Tu Chat ID (número)
  - Ejemplo: `123456789`

**4. Probar las Notificaciones**

Ejecuta el workflow manualmente desde GitHub Actions para probar que recibes las notificaciones en Telegram.

**Ventajas de Telegram:**
- ✅ Sin credenciales personales (email/password)
- ✅ Notificaciones push instantáneas en móvil
- ✅ Completamente gratuito
- ✅ Muy fácil de configurar
- ✅ Puedes silenciar el bot si es necesario

#### Secretos para Firebase

#### Opción A: Service Account (Recomendada)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** → **Service Accounts**
4. Haz clic en "Generate new private key"
5. Descarga el archivo JSON
6. En GitHub:
   - Ve a **Settings** → **Secrets and variables** → **Actions**
   - Crea un nuevo secret llamado `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Pega todo el contenido del archivo JSON (incluyendo las llaves `{}`)

#### Opción B: Credenciales Individuales

Crea estos secretos en GitHub Actions:

- `VITE_FIREBASE_PROJECT_ID` - Ya debería existir
- `FIREBASE_CLIENT_EMAIL` - Email del service account
- `FIREBASE_PRIVATE_KEY` - Private key del service account

### Modificar la Frecuencia

Edita `.github/workflows/cleanup-old-groups.yml`:

```yaml
on:
  schedule:
    # Formato cron: minuto hora día-del-mes mes día-de-la-semana
    - cron: '0 2 * * 0'  # Domingos 2 AM UTC
```

**Ejemplos de schedules:**

- Diario a las 3 AM: `0 3 * * *`
- Cada lunes y viernes a las 1 AM: `0 1 * * 1,5`
- Primer día de cada mes: `0 2 1 * *`
- Cada 6 horas: `0 */6 * * *`

Herramienta útil: [crontab.guru](https://crontab.guru/)

### Modificar el Período de Inactividad

Edita `scripts/cleanup-groups.js`:

```javascript
// Cambiar de 30 a 60 días, por ejemplo
const THIRTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
```

### Logs y Monitoreo

#### Ver logs de ejecución

1. Ve a **Actions** en GitHub
2. Selecciona el workflow "Cleanup Old Groups"
3. Haz clic en la ejecución específica
4. Revisa los logs del job "Delete groups inactive for 30+ days"

#### Ejemplo de output esperado

```
🧹 Starting cleanup of old groups...

📅 Cutoff date: 2025-12-08T02:00:00.000Z
   (Groups inactive since before this date will be deleted)

📦 Found 3 group(s) to delete

🗑️  Deleting group: "Viaje a Barcelona" (ID: abc123)
   Last activity: 2025-11-15T10:30:00.000Z
   ✓ Deleted 25 expense(s)
   ✓ Group deleted successfully

🗑️  Deleting group: "Cena de empresa" (ID: def456)
   Last activity: 2025-11-20T18:45:00.000Z
   ✓ Deleted 8 expense(s)
   ✓ Group deleted successfully

──────────────────────────────────────────────────
✅ Cleanup completed successfully!
   Groups deleted: 3
   Expenses deleted: 33
──────────────────────────────────────────────────

⏱️  Total execution time: 2.45s
```

### Troubleshooting

#### Error: "No Firebase credentials found"

**Causa:** Variables de entorno no configuradas correctamente

**Solución:**
- Verifica que los secretos estén configurados en GitHub
- Para local, verifica que `.env.local` exista y tenga las credenciales correctas

#### Error: "Permission denied"

**Causa:** El service account no tiene permisos suficientes en Firestore

**Solución:**
1. Ve a Firebase Console → Firestore Database → Rules
2. Verifica que las reglas permitan delete en `groups` y `expenses`
3. O ve a IAM & Admin en Google Cloud Console
4. Asegúrate de que el service account tenga el rol "Cloud Datastore User" o "Firebase Admin"

#### El workflow no se ejecuta automáticamente

**Posibles causas:**
- El repositorio no tiene actividad reciente (GitHub desactiva workflows inactivos)
- El workflow está deshabilitado
- Error en la sintaxis del cron

**Solución:**
- Ve a Actions → Selecciona el workflow → Habilita si está deshabilitado
- Ejecuta manualmente una vez para reactivar
- Verifica la sintaxis del cron en [crontab.guru](https://crontab.guru/)

#### No se eliminan grupos aunque deberían

**Verifica:**
1. El campo `lastActivity` existe en los documentos
2. El formato de fecha es correcto (Firestore Timestamp)
3. Los logs del script para ver qué encontró

### Costos

- **GitHub Actions:** GRATIS (2000 minutos/mes en plan gratuito)
- **Firebase:** GRATIS (dentro de cuotas del plan Spark)
- **Ejecución semanal:** ~1 minuto/semana = 4 minutos/mes

**Costo total: $0**

### Seguridad

- ✅ Las credenciales se almacenan como secretos encriptados en GitHub
- ✅ Los logs NO muestran credenciales sensibles
- ✅ El script solo tiene acceso a Firestore (no a otros servicios)
- ✅ Solo se ejecuta en el repositorio autorizado

### Recursos

- [GitHub Actions Cron Syntax](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Delete Data](https://firebase.google.com/docs/firestore/manage-data/delete-data)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

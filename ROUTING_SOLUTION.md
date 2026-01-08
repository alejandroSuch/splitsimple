# Solución de Routing en GitHub Pages

## Problema

GitHub Pages es un servidor estático que no soporta "server-side routing". Cuando un usuario:
- Hace refresh en `/group/abc123`
- Accede directamente a un link compartido como `https://tu-usuario.github.io/splitsimple/group/abc123`

GitHub Pages busca un archivo físico en esa ruta, no lo encuentra, y devuelve **404**.

## ✅ Solución Implementada: Hash Router

**Estado actual:** Ya implementado en el código.

### Cómo funciona

Usamos `HashRouter` en lugar de `BrowserRouter`. Las URLs ahora tienen este formato:
- `https://tu-usuario.github.io/splitsimple/#/`
- `https://tu-usuario.github.io/splitsimple/#/dashboard`
- `https://tu-usuario.github.io/splitsimple/#/group/abc123`

**Todo lo que está después del `#` no se envía al servidor**, es manejado por JavaScript en el navegador.

### Ventajas
- ✅ Funciona perfectamente en GitHub Pages sin configuración adicional
- ✅ Refresh funciona correctamente
- ✅ Links compartidos funcionan directamente
- ✅ No requiere archivos adicionales
- ✅ Compatible con todos los navegadores

### Desventajas
- ❌ URLs tienen `#` (menos "elegantes")
- ❌ URLs ligeramente más largas

### Cambios realizados

1. **App.jsx**: `BrowserRouter` → `HashRouter`
2. **ShareLink.jsx**: URLs generadas incluyen `/#/`

## 🔄 Solución Alternativa: SPA Fallback

Si prefieres URLs sin `#`, puedes usar esta solución (más compleja):

### Opción A: 404.html Trick

Crear `public/404.html` que redirija al `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Convierte la ruta en un parámetro de query
    const path = window.location.pathname.slice(1);
    if (path) {
      window.location.replace(
        window.location.origin + '/splitsimple/#/' +
        path.replace(/&/g, '~and~')
      );
    }
  </script>
</head>
<body></body>
</html>
```

Luego en `index.html` leer el parámetro y restaurar la ruta.

**Desventaja:** Complejidad adicional, posibles problemas de SEO.

### Opción B: Usar Netlify/Vercel en lugar de GitHub Pages

Estos servicios soportan routing de SPA nativamente con un archivo de configuración:

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 📊 Comparación de Soluciones

| Solución | Complejidad | URLs | Compatibilidad GitHub Pages |
|----------|-------------|------|------------------------------|
| **HashRouter** ✅ | Muy simple | `/#/route` | ✅ Perfecta |
| 404.html trick | Media | `/route` | ⚠️ Funciona pero con hacks |
| Netlify/Vercel | Simple | `/route` | ❌ Requiere otro servicio |

## 🎯 Recomendación

**Mantener HashRouter** (ya implementado) porque:

1. Es la solución más simple y confiable para GitHub Pages
2. El `#` en las URLs es un trade-off aceptable
3. No requiere configuración adicional
4. Es el estándar para SPAs en servidores estáticos
5. Funciona perfectamente con links compartidos

## 🔧 Si quieres cambiar a BrowserRouter + 404 trick

<details>
<summary>Expandir instrucciones (no recomendado)</summary>

1. Revertir App.jsx:
```jsx
import { BrowserRouter } from 'react-router-dom';
// ...
<BrowserRouter basename="/splitsimple">
```

2. Crear `public/404.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/splitsimple'">
</head>
<body></body>
</html>
```

3. Modificar `index.html` para leer el redirect:
```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

4. Actualizar ShareLink.jsx para quitar el `#`.

</details>

## 📝 Conclusión

La solución con **HashRouter ya está implementada y funcionando**. Es la mejor opción para GitHub Pages.

Las URLs serán:
- Login: `https://tu-usuario.github.io/splitsimple/#/`
- Dashboard: `https://tu-usuario.github.io/splitsimple/#/dashboard`
- Grupos: `https://tu-usuario.github.io/splitsimple/#/group/abc123`

✅ **No requiere configuración adicional**
✅ **Funciona perfectamente con refresh y links compartidos**
✅ **Listo para deployment**

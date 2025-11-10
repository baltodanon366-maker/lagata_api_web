# 🔧 Solución Definitiva: Error "nest: not found" en Render

## ❌ Problema

Render está ejecutando `npm install; npm run build` pero `nest` no se encuentra porque `@nestjs/cli` está en `devDependencies` y no se instala por defecto.

## ✅ Soluciones Aplicadas

### Solución 1: Script de Build Mejorado (Ya aplicado)

Se actualizó el script `build` en `package.json` para intentar usar `npx nest build` primero, y si falla, instalar devDependencies automáticamente:

```json
"build": "npx nest build || (npm install --include=dev && nest build)"
```

### Solución 2: Configurar Build Command en Render Dashboard

**IMPORTANTE:** Render puede tener un build command configurado manualmente en el dashboard que sobrescribe el `render.yaml`. Necesitas verificar y actualizar esto:

1. Ve a tu proyecto en Render
2. Ve a **Settings** → **Build & Deploy**
3. Busca la sección **"Build Command"**
4. Cambia de:
   ```
   npm install; npm run build
   ```
   A:
   ```
   npm install --include=dev && npm run build
   ```
5. Guarda los cambios

### Solución 3: Usar render.yaml (Alternativa)

Si Render está leyendo el `render.yaml`, asegúrate de que:
1. El archivo `render.yaml` esté en la raíz del repositorio
2. El build command sea:
   ```yaml
   buildCommand: npm install --include=dev && npm run build
   ```

## 🚀 Pasos para Resolver

### Opción A: Actualizar Build Command en Render Dashboard (Recomendado)

1. Ve a [render.com](https://render.com) → Tu proyecto
2. Ve a **Settings** → **Build & Deploy**
3. En **"Build Command"**, cambia a:
   ```
   npm install --include=dev && npm run build
   ```
4. Guarda los cambios
5. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**

### Opción B: Verificar que render.yaml esté en la raíz

1. Verifica que `render.yaml` esté en la raíz del repositorio (no en una subcarpeta)
2. Haz commit y push:
   ```bash
   git add render.yaml package.json
   git commit -m "Fix: Build command para Render con devDependencies"
   git push origin main
   ```
3. Render debería detectar el cambio automáticamente

## 🔍 Verificación

Después de aplicar los cambios, el log de build debería mostrar:
```
==> Running build command 'npm install --include=dev && npm run build'...
```

En lugar de:
```
==> Running build command 'npm install; npm run build'...
```

## 📝 Nota sobre Variables de Entorno

El archivo `env-para-render.txt` ya está listo con:
- `DIRECT_URL` para la base de datos operacional
- `SUPABASE_DW_URL` para el DataWarehouse
- `JWT_SECRET` (necesitas generar uno seguro)

Recuerda importar estas variables en Render usando "Add from .env".

## 🆘 Si Aún Falla

Si después de estos cambios sigue fallando:

1. **Verifica el log completo de Render:**
   - Ve a tu proyecto → **Logs**
   - Busca la línea que dice `==> Running build command`
   - Esto te dirá qué comando está ejecutando realmente

2. **Prueba mover @nestjs/cli a dependencies temporalmente:**
   ```bash
   npm install --save @nestjs/cli
   ```
   (No es ideal, pero funciona como solución temporal)

3. **Usa TypeScript directamente:**
   Cambia el script de build a:
   ```json
   "build": "tsc -p tsconfig.build.json"
   ```
   Y asegúrate de que `typescript` esté en `dependencies` (no solo en devDependencies)


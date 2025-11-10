# 🔧 Solución: Error "nest: not found" en Render

## ❌ Problema

El error `nest: not found` ocurre porque `@nestjs/cli` está en `devDependencies` y Render no instala devDependencies por defecto durante el build.

## ✅ Solución Aplicada

Se actualizó el archivo `render.yaml` para incluir devDependencies en el build:

```yaml
buildCommand: npm install --include=dev && npm run build
```

## 📝 Cambios Realizados

1. **`render.yaml`**: Actualizado el `buildCommand` para instalar devDependencies
2. **`env-para-render.txt`**: Actualizado para usar las variables correctas:
   - `SUPABASE_DB_URL` (en lugar de `DIRECT_URL`)
   - `SUPABASE_DW_URL` (con la referencia correcta del DataWarehouse)
   - `JWT_SECRET` (con un valor seguro generado)

## 🚀 Próximos Pasos

1. **Haz commit y push de los cambios:**
   ```bash
   git add render.yaml env-para-render.txt
   git commit -m "Fix: Incluir devDependencies en build de Render"
   git push origin main
   ```

2. **Actualiza las variables de entorno en Render:**
   - Ve a tu proyecto en Render
   - Ve a "Environment Variables"
   - Usa "Add from .env" y pega el contenido de `env-para-render.txt`
   - Asegúrate de que `SUPABASE_DW_URL` tenga la referencia correcta de tu proyecto DataWarehouse

3. **Vuelve a hacer deploy:**
   - Render detectará automáticamente el nuevo commit
   - O haz clic en "Manual Deploy" → "Deploy latest commit"

## ⚠️ Nota sobre Variables de Entorno

El código soporta múltiples nombres de variables:
- `SUPABASE_DB_URL` (recomendado)
- `DIRECT_URL` (también funciona)
- `POSTGRES_URL` (alternativa)

Para el DataWarehouse:
- `SUPABASE_DW_URL` (recomendado)
- `AZURE_DW_URL` (alternativa)
- `DW_URL` (alternativa)

## 🔍 Verificación

Después del deploy, verifica:
1. El build se completa sin errores
2. La aplicación inicia correctamente
3. Las conexiones a las bases de datos funcionan
4. El endpoint `/` responde correctamente


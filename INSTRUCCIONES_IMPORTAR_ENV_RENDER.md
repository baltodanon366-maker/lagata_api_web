# 📋 Instrucciones para Importar Variables de Entorno en Render

## 🎯 Método Rápido: Importar desde .env

Render permite importar todas las variables de entorno desde un archivo `.env` de una sola vez.

## 📝 Paso 1: Preparar el Archivo .env

Tienes dos opciones:

### Opción A: Usar el archivo `env-para-render.txt` (ya tiene algunos valores)

1. Abre el archivo `env-para-render.txt` en tu proyecto
2. Reemplaza los placeholders restantes:
   - `[PROJECT-REF-DW]` → Referencia de tu proyecto DataWarehouse de Supabase
   - `JWT_SECRET` → Genera uno seguro (ver abajo)
3. Copia el contenido completo (sin los comentarios si los hay)

### Opción B: Crear desde el template

1. Abre el archivo `.env.template`
2. Reemplaza TODOS los placeholders:
   - `[PASSWORD]` → Tu contraseña de Supabase (ya está en `.env.render`)
   - `[PROJECT-REF-DW]` → Referencia de tu proyecto DataWarehouse
   - `JWT_SECRET` → Genera uno seguro (ver abajo)
3. Copia el contenido completo

## 🔐 Paso 2: Generar JWT_SECRET Seguro

Ejecuta este comando para generar un secret seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y reemplázalo en `JWT_SECRET`.

## 📤 Paso 3: Importar en Render

1. Ve a tu proyecto en Render
2. En la sección **"Environment Variables"** (antes de hacer deploy)
3. Haz clic en el botón **"Add from .env"** (botón con icono de documento)
4. **Pega el contenido completo** de tu archivo `env-para-render.txt` (o el que preparaste)
5. Render detectará automáticamente todas las variables y las mostrará en la lista
6. **Revisa que todas estén correctas:**
   - Verifica que `[PROJECT-REF-DW]` esté reemplazado
   - Verifica que `JWT_SECRET` tenga un valor seguro
   - Verifica que las contraseñas estén correctas
7. Haz clic en **"Save Changes"** o **"Deploy Web Service"**

## ⚠️ Importante

### Antes de Importar:

1. **Reemplaza TODOS los placeholders:**
   - `[PASSWORD]` → Tu contraseña real
   - `[PROJECT-REF-DW]` → Tu referencia de proyecto
   - `JWT_SECRET` → Un secret seguro generado

2. **Codifica caracteres especiales en URLs:**
   - Si tu contraseña tiene `@`, reemplázalo con `%40`
   - Si tiene `#`, reemplázalo con `%23`
   - Si tiene espacios, reemplázalos con `%20`

3. **Verifica el formato:**
   ```
   VARIABLE_NAME=valor_sin_espacios
   ```
   - Sin comillas
   - Sin espacios alrededor del `=`
   - Una variable por línea

## 📋 Ejemplo de Archivo .env Listo

```env
SUPABASE_DB_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:MiPassword123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_DW_URL=postgresql://postgres.abc123xyz:MiPassword123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600
NODE_ENV=production
PORT=10000
CORS_ORIGIN=*
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## ✅ Verificación

Después de importar, verifica que:

1. Todas las variables estén en la lista
2. Los valores sean correctos (sin placeholders)
3. No haya espacios extra
4. Las URLs estén completas

## 🔒 Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` con valores reales a GitHub
- ✅ Usa `.env.render` como template (con placeholders)
- ✅ Agrega `.env` a `.gitignore`
- ✅ Solo importa el `.env` en Render (no lo subas al repo)

## 🆘 Si hay Problemas

### Error: "Invalid format"
- Verifica que no haya comillas alrededor de los valores
- Verifica que no haya espacios alrededor del `=`
- Verifica que cada variable esté en una línea separada

### Error: "Variable not found"
- Asegúrate de que todas las variables necesarias estén en el archivo
- Verifica que los nombres de las variables sean correctos

### Variables no se importan
- Verifica el formato del archivo
- Asegúrate de que no haya líneas vacías problemáticas
- Intenta importar de una en una manualmente


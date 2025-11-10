# 🔧 Solución: Problema IPv4 con Supabase

## ❌ Problema Detectado

El error `ETIMEDOUT` se debe a que **la conexión directa de Supabase no es compatible con IPv4**.

Supabase muestra esta advertencia:
> **"Not IPv4 compatible. Use Session Pooler if on a IPv4 network"**

## ✅ Solución: Usar Session Pooler

Debes cambiar de **"Direct connection"** a **"Session Pooler"** en Supabase.

### Paso 1: Obtener Connection String del Session Pooler

1. Ve a tu proyecto Supabase Dashboard
2. **Settings** → **Database**
3. En **"Connection string"**, cambia:
   - **Method**: De `Direct connection` a `Session Pooler` (o `Connection Pooling`)
4. Copia la nueva URL

La URL debería verse así:
```
postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Diferencias importantes:**
- **Host**: `aws-1-us-east-1.pooler.supabase.com` (no `db.xxx.supabase.co`)
- **Puerto**: `6543` (no `5432`)
- **Usuario**: `postgres.nkwzqgnsvzqnbnpvzbrc` (incluye el project ref)
- **Parámetro**: `?pgbouncer=true`

### Paso 2: Actualizar tu `.env`

```env
# PostgreSQL Operacional - Session Pooler (IPv4 compatible)
DATABASE_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Para migraciones y scripts SQL, usa Direct connection (si tienes IPv6)
# O también puedes usar Session Pooler
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# O si prefieres usar SUPABASE_DB_URL:
SUPABASE_DB_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Paso 3: Para DataWarehouse

Haz lo mismo para el DataWarehouse:

1. Ve al proyecto del DataWarehouse en Supabase
2. Obtén la connection string del **Session Pooler**
3. Actualiza en `.env`:

```env
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD-DW]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 🔍 Verificar la Configuración

### Opción 1: Usar el script mejorado

```bash
npx ts-node scripts/test-conexion-simple.ts
```

Este script ahora detecta automáticamente si usas connection strings completas o variables individuales.

### Opción 2: Verificar variables

```bash
npx ts-node scripts/mostrar-env.ts
```

### Opción 3: Verificar conexiones

```bash
npx ts-node scripts/verificar-conexiones.ts
```

## 📝 Resumen de Cambios Necesarios

| Antes (Direct - IPv4 incompatible) | Después (Session Pooler - IPv4 compatible) |
|-------------------------------------|----------------------------------------------|
| `db.nkwzqgnsvzqnbnpvzbrc.supabase.co` | `aws-1-us-east-1.pooler.supabase.com` |
| Puerto `5432` | Puerto `6543` |
| Sin parámetros | `?pgbouncer=true` |
| Usuario: `postgres` | Usuario: `postgres.nkwzqgnsvzqnbnpvzbrc` |

## ⚠️ Notas Importantes

1. **Session Pooler es compatible con IPv4** ✅
2. **Direct connection requiere IPv6 o IPv4 add-on** ❌
3. **Session Pooler funciona para la aplicación y migraciones** ✅
4. **El puerto 6543 es para pooling, 5432 es directo**

## 🚀 Después de Actualizar

Una vez que actualices el `.env` con las URLs del Session Pooler:

1. Ejecuta: `npx ts-node scripts/test-conexion-simple.ts`
2. Deberías ver: `✅ Conexión exitosa!`
3. Luego ejecuta: `npx ts-node scripts/verificar-conexiones.ts`
4. Deberías ver conexiones exitosas a ambas bases de datos

## 📞 Si Aún Tienes Problemas

1. Verifica que copiaste la URL completa del **Session Pooler** (no Direct)
2. Verifica que el puerto sea `6543` (no `5432`)
3. Verifica que el host sea `aws-1-us-east-1.pooler.supabase.com` (o similar)
4. Verifica que incluya `?pgbouncer=true`
5. Verifica que reemplazaste `[YOUR-PASSWORD]` con tu contraseña real


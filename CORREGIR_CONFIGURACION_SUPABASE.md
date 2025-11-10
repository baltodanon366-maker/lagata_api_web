# 🔧 Corregir Configuración de Supabase

## ❌ Problema Detectado

El error `ETIMEDOUT` indica que el host configurado no es correcto.

## ✅ Solución

### Formato Correcto de URLs de Supabase

Supabase proporciona dos tipos de conexiones:

#### 1. **Connection Pooling** (Puerto 6543)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### 2. **Direct Connection** (Puerto 5432)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### ⚠️ Formato Incorrecto (lo que probablemente tienes)

```
postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

**Problema**: El host `[PROJECT-REF].supabase.co` no es correcto para conexiones directas.

## 📝 Configuración Correcta del `.env`

### Opción 1: Usar Connection Strings Completas (RECOMENDADO)

```env
# PostgreSQL Operacional
# Connection Pooling (para la aplicación)
DATABASE_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Connection (para migraciones y scripts SQL)
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# PostgreSQL DataWarehouse
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD-DW]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### Opción 2: Usar Variables Individuales (si prefieres)

```env
# PostgreSQL Operacional
SUPABASE_DB_HOST=aws-1-us-east-1.pooler.supabase.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.nkwzqgnsvzqnbnpvzbrc
SUPABASE_DB_PASSWORD=licoreria_la_gataFG45
SUPABASE_DB_SSL=true

# PostgreSQL DataWarehouse
SUPABASE_DW_HOST=aws-1-us-east-1.pooler.supabase.com
SUPABASE_DW_PORT=5432
SUPABASE_DW_NAME=postgres
SUPABASE_DW_USER=postgres.[PROJECT-REF-DW]
SUPABASE_DW_PASSWORD=[PASSWORD-DW]
SUPABASE_DW_SSL=true
```

## 🔍 Cómo Obtener las URLs Correctas en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **Settings** → **Database**
3. Busca la sección **Connection string**
4. Selecciona **URI** (no Transaction mode)
5. Copia la URL completa

Debería verse así:
```
postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

## ⚠️ Notas Importantes

1. **Usuario**: Debe ser `postgres.[PROJECT-REF]`, no solo `postgres`
2. **Host**: Debe ser `aws-1-us-east-1.pooler.supabase.com` (o similar según tu región)
3. **Puerto**: 
   - `5432` para conexiones directas
   - `6543` para connection pooling
4. **Contraseña**: Si tiene caracteres especiales, debe estar URL-encoded

## 🔧 URL-Encoding de Contraseñas

Si tu contraseña tiene caracteres especiales, debes codificarla:

Ejemplo: `licoreria_la_gataFG45` → No necesita encoding (solo tiene letras, números y guión bajo)

Si tuviera `licoreria@123`, debería ser `licoreria%40123` en la URL.

## ✅ Verificar Después de Corregir

1. Actualiza tu `.env` con las URLs correctas
2. Ejecuta:
   ```bash
   npx ts-node scripts/test-conexion-simple.ts
   ```
3. Deberías ver: `✅ Conexión exitosa!`

## 📞 Si Aún Tienes Problemas

1. Verifica que copiaste la URL completa desde Supabase
2. Verifica que reemplazaste `[YOUR-PASSWORD]` con tu contraseña real
3. Verifica que no hay espacios extra en las URLs
4. Verifica que el proyecto Supabase esté activo (no pausado)


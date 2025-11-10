# 🔧 Solución de Problemas de Conexión

## Problemas Detectados

### ✅ Problema 1: PostgreSQL Operacional - RESUELTO

**Situación**: Tienes `SUPABASE_DB_URL` configurada, pero el script buscaba primero `DIRECT_URL`.

**Solución**: El script ahora busca en este orden:
1. `DIRECT_URL`
2. `POSTGRES_URL`
3. `SUPABASE_DB_URL` ✅ (tienes esta)
4. `AZURE_DB_URL`
5. Si no hay connection string, construye desde variables individuales

**Estado**: ✅ **RESUELTO** - El script ahora detectará tu `SUPABASE_DB_URL`

### ❌ Problema 2: MongoDB - REQUIERE ACCIÓN

**Situación**: Tu `MONGODB_URI` contiene placeholders sin reemplazar:
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority
```

**Solución**: Tienes dos opciones:

#### Opción A: Reemplazar placeholders (si tienes MongoDB Atlas)

1. Ve a tu proyecto en MongoDB Atlas
2. Obtén la cadena de conexión real
3. Reemplaza en tu `.env`:
```env
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@tu-cluster.mongodb.net/?retryWrites=true&w=majority
```

#### Opción B: Comentar MongoDB (si no lo necesitas ahora)

Si no tienes MongoDB configurado aún, simplemente comenta la línea en tu `.env`:
```env
# MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority
```

O usa MongoDB local:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=LicoreriaMongoDB
```

### ✅ Problema 3: PostgreSQL DataWarehouse - OK

**Estado**: ✅ **CONFIGURADO CORRECTAMENTE** - Tienes `SUPABASE_DW_URL` configurada

## 📝 Configuración Recomendada del `.env`

Basado en lo que tienes, aquí está la configuración recomendada:

```env
# App Configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Operacional - Supabase
# Opción 1: Connection String (ya la tienes)
SUPABASE_DB_URL=postgresql://postgres:[TU-PASSWORD]@nkwzqgnsvzqnbnpvzbrc.supabase.co:5432/postgres?sslmode=require

# Opción 2: Direct URL (recomendado para migraciones)
DIRECT_URL=postgresql://postgres:[TU-PASSWORD]@nkwzqgnsvzqnbnpvzbrc.supabase.co:5432/postgres

# Opción 3: Variables individuales (ya las tienes)
SUPABASE_DB_HOST=nkwzqgnsvzqnbnpvzbrc.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=[TU-PASSWORD]

# PostgreSQL DataWarehouse - Supabase (ya configurado)
SUPABASE_DW_URL=postgresql://postgres:[TU-PASSWORD-DW]@uzjryopokdguuoiniakd.supabase.co:5432/postgres?sslmode=require

# MongoDB - Opción A: Local (recomendado para desarrollo)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=LicoreriaMongoDB

# MongoDB - Opción B: Atlas (si tienes cuenta)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
# MONGODB_DATABASE=LicoreriaMongoDB

# JWT (ya configurado)
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600

# CORS (ya configurado)
CORS_ORIGIN=*
```

## 🔍 Verificar Configuración

### Paso 1: Ver variables configuradas

```bash
npx ts-node scripts/mostrar-env.ts
```

Este script te mostrará todas las variables sin exponer contraseñas completas.

### Paso 2: Verificar conexiones

```bash
npx ts-node scripts/verificar-conexiones.ts
```

Este script intentará conectar a cada base de datos y te dirá si hay problemas.

## ⚠️ Notas Importantes

1. **Reemplaza `[TU-PASSWORD]`** con tu contraseña real de Supabase
2. **Reemplaza `[TU-PASSWORD-DW]`** con tu contraseña del DataWarehouse
3. **MongoDB es opcional** - Si no lo necesitas ahora, puedes comentarlo o usar local
4. **Las contraseñas en URLs** deben estar URL-encoded si contienen caracteres especiales

## 🚀 Próximos Pasos

1. ✅ Corrige el problema de MongoDB (reemplaza placeholders o comenta)
2. ✅ Ejecuta `npx ts-node scripts/verificar-conexiones.ts` de nuevo
3. ✅ Si todo está bien, ejecuta el script de inserts: `InsertTestData_PostgreSQL.sql`

## 📞 Si Aún Tienes Problemas

Si después de corregir MongoDB sigues teniendo problemas:

1. Verifica que las contraseñas sean correctas
2. Verifica que los proyectos Supabase estén activos
3. Verifica que no haya espacios extra en las URLs del `.env`
4. Verifica que las URLs no tengan saltos de línea

Ejecuta estos comandos para diagnosticar:

```bash
# Ver configuración
npx ts-node scripts/mostrar-env.ts

# Verificar conexiones
npx ts-node scripts/verificar-conexiones.ts
```


# ⚡ Resumen Rápido: Setup de Bases de Datos

## 🎯 Tu Situación Actual

✅ **Base de datos operacional creada en Supabase**
- Connection strings recibidos
- Password: `licoreria_la_gataFG45`

⏭️ **Pendiente:**
- Crear tablas en la base de datos operacional
- Crear segundo proyecto para DataWarehouse
- Crear tablas del DataWarehouse

---

## 📝 Paso 1: Configurar `.env`

Crea un archivo `.env` en la raíz del proyecto con:

```env
# App
NODE_ENV=development
PORT=3000

# Supabase Operacional (Direct connection para TypeORM)
POSTGRES_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

# Supabase DataWarehouse (se configurará después)
# SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST]:5432/postgres?sslmode=require

# MongoDB
MONGODB_URI=mongodb+srv://[USER]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=LicoreriaMongoDB

# JWT
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600

# CORS
CORS_ORIGIN=*
```

---

## 🗄️ Paso 2: Crear Tablas Operacionales

### Opción Recomendada: SQL Directo en Supabase ✅

1. **Ir a Supabase SQL Editor:**
   - https://supabase.com/dashboard
   - Tu proyecto → **"SQL Editor"** → **"New query"**

2. **Ejecutar Script:**
   - Abre: `scripts/database/CreateTables_PostgreSQL.sql`
   - Copia TODO el contenido
   - Pégalo en el SQL Editor
   - Haz clic en **"Run"**

3. **Verificar:**
   - Ve a **"Table Editor"**
   - Deberías ver todas las tablas creadas

**¿Por qué SQL directo?**
- ✅ Más rápido para empezar
- ✅ Puedes ver el SQL completo
- ✅ Fácil de depurar
- ✅ Ideal para estructura inicial

**Migraciones después:**
- ⏭️ Usarás migraciones TypeORM para cambios futuros
- ⏭️ Pero para la estructura inicial, SQL directo es mejor

---

## 📊 Paso 3: Crear DataWarehouse

### 3.1. Crear Segundo Proyecto

1. En Supabase Dashboard → **"New Project"**
2. **Name**: `licoreria-datawarehouse`
3. **Password**: Diferente a la operacional (ej: `licoreria_dw_FG45`)
4. **Region**: Misma que el operacional
5. Esperar 1-2 minutos

### 3.2. Obtener Connection String

1. Proyecto DataWarehouse → **"Settings"** → **"Database"**
2. Copiar **"Connection string"** → **"URI"** (puerto 5432)
3. Agregar `?sslmode=require` al final

### 3.3. Actualizar `.env`

```env
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

### 3.4. Crear Tablas DataWarehouse

1. SQL Editor del proyecto DataWarehouse
2. Ejecutar: `scripts/database/CreateDataWarehouse_PostgreSQL.sql`

**Guía completa**: Ver `GUIA_CREAR_DATAWAREHOUSE_SUPABASE.md`

---

## ✅ Checklist

### Base de Datos Operacional
- [ ] Archivo `.env` creado con `POSTGRES_URL`
- [ ] Script `CreateTables_PostgreSQL.sql` ejecutado en Supabase
- [ ] Tablas verificadas en Table Editor

### Base de Datos DataWarehouse
- [ ] Segundo proyecto creado en Supabase
- [ ] Connection string obtenido
- [ ] `SUPABASE_DW_URL` agregado al `.env`
- [ ] Script `CreateDataWarehouse_PostgreSQL.sql` ejecutado
- [ ] Tablas verificadas

### Verificación Final
- [ ] Proyecto compila: `npm run build`
- [ ] Aplicación inicia: `npm run start:dev`
- [ ] Sin errores de conexión en los logs

---

## 📚 Guías Detalladas

- **Crear Tablas**: `GUIA_CREAR_TABLAS_SUPABASE.md`
- **Crear DataWarehouse**: `GUIA_CREAR_DATAWAREHOUSE_SUPABASE.md`
- **Azure (alternativa)**: `GUIA_AZURE_POSTGRESQL.md`

---

## 🆘 Problemas Comunes

### Error: "Connection refused"
- Verifica que uses puerto **5432** (no 6543)
- Agrega `?sslmode=require` al connection string

### Error: "Authentication failed"
- Verifica que el usuario incluya Project Reference: `postgres.[PROJECT-REF]`
- Verifica la password

### Error: "SSL required"
- Agrega `?sslmode=require` al final del connection string

---

**Última actualización**: 2025-01-15


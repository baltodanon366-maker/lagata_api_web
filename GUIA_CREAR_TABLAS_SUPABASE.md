# 📋 Guía: Crear Tablas y DataWarehouse en Supabase

## 🎯 Resumen

Esta guía te explica cómo crear las tablas y el DataWarehouse en Supabase, y cuándo usar migraciones vs SQL directo.

---

## 📝 Paso 1: Configurar Variables de Entorno

### 1.1. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
# App Configuration
NODE_ENV=development
PORT=3000

# Supabase PostgreSQL (Operacional)
# Connection pooling (para la aplicación)
SUPABASE_DB_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection (para migraciones)
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Para TypeORM, usa la direct connection
POSTGRES_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

# Supabase PostgreSQL (DataWarehouse) - Se configurará después
# SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST]:5432/postgres?sslmode=require

# MongoDB
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=LicoreriaMongoDB

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600

# CORS
CORS_ORIGIN=*
```

**⚠️ IMPORTANTE**: 
- Usa `DIRECT_URL` o `POSTGRES_URL` para TypeORM (puerto 5432)
- Usa `SUPABASE_DB_URL` (puerto 6543) solo para connection pooling en la aplicación
- TypeORM necesita conexión directa para migraciones

---

## 🗄️ Paso 2: Crear Tablas - Dos Opciones

### ⭐ Opción A: SQL Directo en Supabase (RECOMENDADO para empezar) ✅

**Ventajas:**
- ✅ Más rápido para empezar
- ✅ Puedes ver y ejecutar el SQL directamente
- ✅ Fácil de depurar
- ✅ Ideal para crear la estructura inicial
- ✅ Puedes ejecutar todo de una vez

**Cuándo usar:**
- ✅ Para crear la estructura inicial de tablas (AHORA)
- ✅ Para crear funciones/triggers
- ✅ Para datos de prueba
- ✅ Para stored procedures (funciones en PostgreSQL)

**Cómo hacerlo:**

1. **Ir al SQL Editor de Supabase:**
   - Ve a tu proyecto en Supabase: https://supabase.com/dashboard
   - En el menú lateral izquierdo, haz clic en **"SQL Editor"**
   - Haz clic en **"New query"** (botón verde arriba a la derecha)

2. **Ejecutar el script SQL:**
   - Abre el archivo: `scripts/database/CreateTables_PostgreSQL.sql`
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pégalo en el editor SQL de Supabase (Ctrl+V)
   - Haz clic en **"Run"** (botón verde) o presiona `Ctrl+Enter`

3. **Verificar que se crearon:**
   - Ve a **"Table Editor"** en el menú lateral
   - Deberías ver todas las tablas creadas:
     - Roles, Permisos, Usuarios
     - Categorias, Marcas, Modelos, Productos, DetalleProducto
     - Clientes, Proveedores, Empleados
     - Compras, Ventas, DevolucionesVenta
     - MovimientosStock
     - Y más...

4. **Verificar triggers:**
   - Ve a **"Database"** → **"Triggers"** en el menú lateral
   - Deberías ver el trigger: `TR_MovimientosStock_ActualizarStock`

### Opción B: Migraciones con TypeORM (Para después) ✅

**Ventajas:**
- ✅ Versionado de cambios
- ✅ Control de cambios en el código
- ✅ Fácil de revertir
- ✅ Ideal para cambios incrementales

**Cuándo usar:**
- ⏭️ Para cambios incrementales DESPUÉS de la estructura inicial
- ⏭️ Para mantener historial de cambios
- ⏭️ Para trabajar en equipo

**Cómo hacerlo (más adelante):**

1. **Crear migración:**
   ```bash
   npm run typeorm migration:generate -- -n CreateNewTable
   ```

2. **Ejecutar migración:**
   ```bash
   npm run typeorm migration:run
   ```

---

## 🎯 Recomendación: Proceso Híbrido

### ✅ Fase Inicial (AHORA): SQL Directo
1. Ejecutar `CreateTables_PostgreSQL.sql` en Supabase SQL Editor
2. Verificar que todas las tablas se crearon
3. Listo para empezar a desarrollar

### ⏭️ Fase de Desarrollo (Después): Migraciones
1. Cambios incrementales con migraciones
2. Nuevas tablas con migraciones
3. Modificaciones de estructura con migraciones

**Resumen**: 
- **AHORA**: SQL directo para crear estructura inicial ✅
- **DESPUÉS**: Migraciones para cambios futuros ⏭️

---

## 📊 Paso 3: Crear DataWarehouse en Supabase

Para crear el DataWarehouse, sigue la guía completa en:
**👉 `GUIA_CREAR_DATAWAREHOUSE_SUPABASE.md`**

**Resumen rápido:**
1. Crear segundo proyecto en Supabase: `licoreria-datawarehouse`
2. Obtener connection string (puerto 5432)
3. Actualizar `.env` con `SUPABASE_DW_URL`
4. Ejecutar `CreateDataWarehouse_PostgreSQL.sql` en el SQL Editor del proyecto DataWarehouse

---

## 📁 Estructura de Scripts SQL

Los scripts están en `scripts/database/`:

1. **`CreateTables_PostgreSQL.sql`** - Tablas operacionales
2. **`CreateStoredProcedures_PostgreSQL.sql`** - Stored procedures
3. **`CreateDataWarehouse_PostgreSQL.sql`** - Tablas del DataWarehouse
4. **`InsertTestData_PostgreSQL.sql`** - Datos de prueba (opcional)

---

## ⚠️ Notas Importantes

### Sobre Connection Pooling

- **Puerto 6543**: Connection pooling (PgBouncer) - Para la aplicación
- **Puerto 5432**: Conexión directa - Para migraciones y administración

### Sobre Stored Procedures

- PostgreSQL usa **Functions** en lugar de Stored Procedures
- Los scripts están adaptados para PostgreSQL
- Algunas funciones de SQL Server no existen en PostgreSQL

### Sobre Migraciones

- TypeORM necesita conexión directa (puerto 5432)
- No uses connection pooling para migraciones
- Las migraciones se ejecutan en orden cronológico

---

## 🚀 Próximos Pasos

1. ✅ Configurar `.env` con tus credenciales
2. ✅ Ejecutar `CreateTables_PostgreSQL.sql` en Supabase SQL Editor
3. ✅ Crear segundo proyecto para DataWarehouse
4. ✅ Ejecutar `CreateDataWarehouse_PostgreSQL.sql` en el DataWarehouse
5. ✅ Probar conexión desde la aplicación

---

**Última actualización**: 2025-01-15


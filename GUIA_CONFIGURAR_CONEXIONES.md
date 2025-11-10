# Guía: Configurar Cadenas de Conexión

Esta guía te ayudará a configurar correctamente las cadenas de conexión para ambas bases de datos (Operacional y DataWarehouse) en Supabase.

## 📋 Requisitos Previos

- ✅ Tienes ambas bases de datos creadas en Supabase
- ✅ Tienes las tablas creadas en ambas bases de datos
- ✅ Tienes las cadenas de conexión de Supabase

## 🔗 Cadenas de Conexión de Supabase

Supabase proporciona dos tipos de cadenas de conexión:

### 1. **Connection Pooling (Recomendado para aplicaciones)**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
- **Puerto**: `6543` (con pooling)
- **Uso**: Para aplicaciones con muchas conexiones simultáneas
- **Ventaja**: Mejor rendimiento y gestión de conexiones

### 2. **Direct Connection (Para migraciones y scripts SQL)**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```
- **Puerto**: `5432` (conexión directa)
- **Uso**: Para migraciones, scripts SQL y operaciones administrativas
- **Ventaja**: Acceso completo a todas las funciones de PostgreSQL

## 📝 Configuración del Archivo `.env`

Crea o actualiza el archivo `.env` en la raíz del proyecto con las siguientes variables:

### Base de Datos Operacional (Supabase)

```env
# Opción 1: Connection String completa (RECOMENDADO)
# Usa DIRECT_URL para migraciones y scripts SQL
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Opción 2: Connection Pooling para la aplicación
DATABASE_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Opción 3: Variables individuales (alternativa)
SUPABASE_DB_HOST=aws-1-us-east-1.pooler.supabase.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.nkwzqgnsvzqnbnpvzbrc
SUPABASE_DB_PASSWORD=licoreria_la_gataFG45
SUPABASE_DB_SSL=true
```

### Base de Datos DataWarehouse (Supabase)

**⚠️ IMPORTANTE**: Necesitas proporcionar la cadena de conexión del DataWarehouse. Debe ser de un proyecto Supabase diferente.

```env
# Opción 1: Connection String completa (RECOMENDADO)
# Reemplaza [PROJECT-REF-DW] y [PASSWORD-DW] con tus valores reales
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD-DW]@aws-1-us-east-1.pooler.supabase.com:5432/postgres

# Opción 2: Variables individuales
SUPABASE_DW_HOST=[PROJECT-REF-DW].supabase.co
SUPABASE_DW_PORT=5432
SUPABASE_DW_NAME=postgres
SUPABASE_DW_USER=postgres.[PROJECT-REF-DW]
SUPABASE_DW_PASSWORD=[PASSWORD-DW]
SUPABASE_DW_SSL=true
```

### MongoDB (Opcional - para desarrollo local)

```env
# MongoDB Local
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=LicoreriaMongoDB

# MongoDB Atlas (para producción)
# MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/?retryWrites=true&w=majority
# MONGODB_DATABASE=LicoreriaMongoDB
```

### Configuración de la Aplicación

```env
# App Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600

# CORS
CORS_ORIGIN=*
```

## 🔍 Verificar Configuración

### 1. Verificar que el archivo `.env` existe

```bash
# En la raíz del proyecto
ls -la .env
# o en Windows
dir .env
```

### 2. Verificar que las variables están cargadas

Puedes crear un script temporal para verificar:

```typescript
// test-env.ts
import * as dotenv from 'dotenv';
dotenv.config();

console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ Configurado' : '❌ No configurado');
console.log('SUPABASE_DW_URL:', process.env.SUPABASE_DW_URL ? '✅ Configurado' : '❌ No configurado');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ No configurado');
```

Ejecutar:
```bash
npx ts-node test-env.ts
```

## 🚀 Próximos Pasos

1. **Actualizar `.env`** con tus cadenas de conexión reales
2. **Ejecutar el script de inserts** para poblar la base de datos operacional:
   ```bash
   # Conectarte a Supabase y ejecutar:
   # scripts/database/InsertTestData_PostgreSQL.sql
   ```
3. **Verificar la conexión** ejecutando la aplicación:
   ```bash
   npm run start:dev
   ```

## 📌 Notas Importantes

### Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a Git
- ✅ El archivo `.env` ya está en `.gitignore`
- ✅ Usa variables de entorno en producción (Vercel, etc.)

### Prioridad de Variables de Entorno

El sistema busca las variables en este orden:

1. `DIRECT_URL` o `POSTGRES_URL` (para operacional)
2. `SUPABASE_DB_URL` o `AZURE_DB_URL`
3. Variables individuales (`SUPABASE_DB_HOST`, etc.)

### Para DataWarehouse

1. `SUPABASE_DW_URL` o `AZURE_DW_URL`
2. Variables individuales (`SUPABASE_DW_HOST`, etc.)

## 🔧 Solución de Problemas

### Error: "Connection refused"

- Verifica que el puerto sea correcto (`5432` para directo, `6543` para pooling)
- Verifica que la contraseña sea correcta
- Verifica que el proyecto Supabase esté activo

### Error: "SSL required"

- Asegúrate de que `sslmode=require` esté en la cadena de conexión
- O configura `SUPABASE_DB_SSL=true` si usas variables individuales

### Error: "Database does not exist"

- Verifica que el nombre de la base de datos sea `postgres` (default de Supabase)
- Verifica que el proyecto Supabase esté correctamente configurado

## 📞 Soporte

Si tienes problemas con la configuración:

1. Verifica que las cadenas de conexión sean correctas en el dashboard de Supabase
2. Prueba conectarte con un cliente PostgreSQL (pgAdmin, DBeaver, etc.)
3. Revisa los logs de la aplicación para más detalles del error


# 📋 Resumen: Configuración de Conexiones y Datos de Prueba

## ✅ Estado Actual

- ✅ Base de datos operacional creada en Supabase
- ✅ Base de datos DataWarehouse creada en Supabase
- ✅ Tablas creadas en ambas bases de datos
- ✅ Script de inserts adaptado a PostgreSQL
- ✅ Hashes BCrypt generados para usuarios de prueba

## 🔗 Cadenas de Conexión Configuradas

### Base de Datos Operacional

Ya tienes configurada:
```
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres
DATABASE_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Base de Datos DataWarehouse

**⚠️ NECESITAS PROPORCIONAR**: La cadena de conexión del DataWarehouse.

Una vez que la tengas, agrega al `.env`:
```env
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD-DW]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

## 📝 Pasos para Completar la Configuración

### 1. Crear archivo `.env`

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 2. Actualizar `.env` con tus valores

Edita el archivo `.env` y actualiza:

```env
# Base de datos operacional (ya configurada)
DIRECT_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres
DATABASE_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Base de datos DataWarehouse (REEMPLAZA con tus valores)
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD-DW]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

### 3. Insertar Datos de Prueba

#### Opción A: Usando el Editor SQL de Supabase (Recomendado)

1. Ve a tu proyecto Supabase → **SQL Editor**
2. Copia el contenido del archivo:
   ```
   scripts/database/InsertTestData_PostgreSQL.sql
   ```
3. Pega y ejecuta el script completo
4. Verifica que los datos se insertaron correctamente

#### Opción B: Usando psql desde la terminal

```bash
# Conectarte a Supabase
psql "postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:licoreria_la_gataFG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Ejecutar el script
\i scripts/database/InsertTestData_PostgreSQL.sql
```

#### Opción C: Usando un cliente PostgreSQL (pgAdmin, DBeaver, etc.)

1. Conéctate a tu base de datos Supabase
2. Abre el archivo `scripts/database/InsertTestData_PostgreSQL.sql`
3. Ejecuta el script completo

## 👤 Usuarios de Prueba Creados

El script crea 3 usuarios con contraseñas hasheadas con BCrypt:

| Usuario | Contraseña | Rol | Hash BCrypt |
|---------|------------|-----|-------------|
| `admin` | `Admin123!` | Administrador | `$2b$12$z6UUE3BPND/PybbYC4/62usNRUJ07CDjkkQGWLSF8W8BmVI9hnVm.` |
| `vendedor1` | `Vendedor123!` | Vendedor | `$2b$12$sNYm50lWYdS2T1D3jACkPOMR64Dyp6e9EVsFlFWvHVG.uAkqlq.CS` |
| `supervisor1` | `Supervisor123!` | Supervisor | `$2b$12$nqOE0.TP6BECZBWlGeFK5ecTk/sswkK0UQObvwtSbIzYsHum4.p8W` |

## 📊 Datos de Prueba Incluidos

El script `InsertTestData_PostgreSQL.sql` inserta:

- ✅ **3 Roles**: Administrador, Vendedor, Supervisor
- ✅ **23 Permisos**: Todos los permisos del sistema
- ✅ **3 Usuarios**: Con contraseñas hasheadas
- ✅ **20 Categorías**: Ron, Vodka, Whisky, Tequila, etc.
- ✅ **30 Marcas**: Bacardi, Havana Club, Smirnoff, etc.
- ✅ **25 Modelos**: 750ml, 1L, 375ml, etc.
- ✅ **30 Productos**: Productos variados de licorería
- ✅ **50 DetalleProducto**: Combinaciones de productos con precios y stock
- ✅ **5 Empleados**: 3 vinculados a usuarios, 2 sin usuario
- ✅ **5 Clientes**: Clientes de prueba
- ✅ **5 Proveedores**: Proveedores de prueba
- ✅ **Configuración del Sistema**: IVA, tasa de cambio, etc.

## 🔍 Verificar que Todo Funciona

### 1. Verificar conexión a la base de datos operacional

```bash
npm run start:dev
```

Deberías ver en la consola:
```
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api
```

### 2. Verificar datos insertados

Puedes ejecutar estas consultas en el SQL Editor de Supabase:

```sql
-- Verificar usuarios
SELECT "Id", "NombreUsuario", "Email", "Rol", "Activo" FROM "Usuarios";

-- Verificar productos
SELECT COUNT(*) as total_productos FROM "Productos";

-- Verificar detalle de productos
SELECT COUNT(*) as total_detalle_productos FROM "DetalleProducto";

-- Verificar categorías
SELECT COUNT(*) as total_categorias FROM "Categorias";

-- Verificar marcas
SELECT COUNT(*) as total_marcas FROM "Marcas";
```

## 🚨 Solución de Problemas

### Error: "Cannot connect to database"

1. Verifica que las cadenas de conexión sean correctas
2. Verifica que el proyecto Supabase esté activo
3. Verifica que la contraseña sea correcta

### Error: "Table does not exist"

1. Verifica que hayas ejecutado el script `CreateTables_PostgreSQL.sql` primero
2. Verifica que estés conectado a la base de datos correcta

### Error: "Duplicate key violation"

- El script usa `ON CONFLICT DO NOTHING`, así que es seguro ejecutarlo múltiples veces
- Si hay errores, verifica que las tablas tengan las restricciones correctas

## 📚 Archivos de Referencia

- `GUIA_CONFIGURAR_CONEXIONES.md` - Guía detallada de configuración
- `scripts/database/InsertTestData_PostgreSQL.sql` - Script de inserts
- `scripts/database/CreateTables_PostgreSQL.sql` - Script de creación de tablas
- `.env.example` - Ejemplo de variables de entorno

## ✅ Checklist Final

- [ ] Archivo `.env` creado y configurado
- [ ] Cadena de conexión del DataWarehouse agregada
- [ ] Script `InsertTestData_PostgreSQL.sql` ejecutado
- [ ] Usuarios de prueba verificados
- [ ] Datos de prueba verificados
- [ ] Aplicación inicia correctamente
- [ ] Conexión a base de datos operacional funciona
- [ ] Conexión a base de datos DataWarehouse funciona (cuando la configures)

## 🎯 Próximos Pasos

Una vez completada la configuración:

1. **Fase 2**: Implementar módulo de Autenticación JWT
2. **Fase 3**: Implementar módulos de Catálogos
3. **Fase 4**: Implementar módulos de Transacciones
4. **Fase 5**: Implementar módulo de Analytics (DataWarehouse)
5. **Fase 6**: Implementar módulo MongoDB

---

**¿Necesitas ayuda?** Revisa la guía detallada en `GUIA_CONFIGURAR_CONEXIONES.md`


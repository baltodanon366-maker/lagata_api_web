# 📊 Guía: Crear DataWarehouse en Supabase

## 🎯 Objetivo

Crear un segundo proyecto en Supabase para el DataWarehouse (base de datos analítica).

---

## 🚀 Paso 1: Crear Segundo Proyecto en Supabase

### 1.1. Acceder a Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta

### 1.2. Crear Nuevo Proyecto

1. En el dashboard, haz clic en **"New Project"** o **"Crear Proyecto"**
2. Completa el formulario:
   - **Name**: `licoreria-datawarehouse` (o el nombre que prefieras)
   - **Database Password**: 
     - Usa una contraseña diferente a la del proyecto operacional
     - **⚠️ IMPORTANTE**: Guárdala en un lugar seguro
     - Ejemplo: `licoreria_dw_FG45` (diferente a la operacional)
   - **Region**: 
     - **Recomendado**: Misma región que el proyecto operacional
     - Esto reduce la latencia entre bases de datos
   - **Pricing Plan**: 
     - El mismo que el proyecto operacional
     - Si usas Free tier, ambos proyectos pueden estar en Free tier

3. Haz clic en **"Create new project"**

### 1.3. Esperar la Creación

- El proceso toma **1-2 minutos**
- Verás el progreso en la pantalla
- Cuando termine, serás redirigido al dashboard del nuevo proyecto

---

## 🔐 Paso 2: Obtener Connection String del DataWarehouse

### 2.1. Acceder a Settings

1. En el dashboard del proyecto DataWarehouse
2. Ve a **"Settings"** (Configuración) en el menú lateral
3. Haz clic en **"Database"**

### 2.2. Obtener Connection Strings

Encontrarás dos connection strings:

#### Connection Pooling (Puerto 6543)
```
postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### Direct Connection (Puerto 5432) - Para TypeORM
```
postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST].pooler.supabase.com:5432/postgres
```

**⚠️ IMPORTANTE**: 
- Para TypeORM y migraciones, usa la **Direct Connection** (puerto 5432)
- Agrega `?sslmode=require` al final

### 2.3. Ejemplo de Connection String Final

Si tu Project Reference es `abc123xyz` y tu password es `licoreria_dw_FG45`:

```
postgresql://postgres.abc123xyz:licoreria_dw_FG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

---

## 📝 Paso 3: Actualizar Variables de Entorno

### 3.1. Actualizar `.env`

Edita tu archivo `.env` y agrega:

```env
# Supabase PostgreSQL (DataWarehouse)
# Direct connection para TypeORM
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@[HOST]:5432/postgres?sslmode=require

# O usando variables individuales
SUPABASE_DW_HOST=[HOST]
SUPABASE_DW_PORT=5432
SUPABASE_DW_NAME=postgres
SUPABASE_DW_USER=postgres.[PROJECT-REF-DW]
SUPABASE_DW_PASSWORD=[PASSWORD]
SUPABASE_DW_SSL=true
```

**Ejemplo real** (reemplaza con tus valores):
```env
SUPABASE_DW_URL=postgresql://postgres.abc123xyz:licoreria_dw_FG45@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

---

## 🗄️ Paso 4: Crear Tablas del DataWarehouse

### 4.1. Ir al SQL Editor

1. En el dashboard del proyecto DataWarehouse
2. Ve a **"SQL Editor"** en el menú lateral
3. Haz clic en **"New query"**

### 4.2. Ejecutar Script SQL

1. Abre el archivo `scripts/database/CreateDataWarehouse_PostgreSQL.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **"Run"** o presiona `Ctrl+Enter`

### 4.3. Verificar Creación

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver las tablas:
   - `DimTiempo`
   - `DimCategoria`
   - `DimMarca`
   - `DimModelo`
   - `DimProducto`
   - `DimCliente`
   - `DimProveedor`
   - `DimEmpleado`
   - `HechoVenta`
   - `HechoCompra`
   - `HechoInventario`

---

## ✅ Paso 5: Verificar Configuración

### 5.1. Probar Conexión desde la Aplicación

Una vez que tengas las tablas creadas y el `.env` configurado, puedes probar la conexión:

```bash
# Compilar el proyecto
npm run build

# Iniciar la aplicación (intentará conectar a ambas bases de datos)
npm run start:dev
```

### 5.2. Verificar Logs

Si todo está bien configurado, deberías ver:
- ✅ Conexión exitosa a PostgreSQL operacional
- ✅ Conexión exitosa a PostgreSQL DataWarehouse
- ✅ Conexión exitosa a MongoDB (si está configurado)

---

## 📊 Estructura del DataWarehouse

### Tablas de Dimensiones (Dim*)
- `DimTiempo` - Dimensión temporal
- `DimCategoria` - Categorías de productos
- `DimMarca` - Marcas
- `DimModelo` - Modelos
- `DimProducto` - Productos
- `DimCliente` - Clientes
- `DimProveedor` - Proveedores
- `DimEmpleado` - Empleados

### Tablas de Hechos (Hecho*)
- `HechoVenta` - Hechos de ventas agregados
- `HechoCompra` - Hechos de compras agregados
- `HechoInventario` - Hechos de inventario

---

## 🔄 Proceso de Alimentación del DataWarehouse

El DataWarehouse se alimenta mediante un proceso ETL (Extract, Transform, Load):

1. **Extract**: Extraer datos de la base de datos operacional
2. **Transform**: Transformar y agregar datos
3. **Load**: Cargar datos en el DataWarehouse

**Nota**: Este proceso ETL se implementará más adelante. Por ahora, las tablas están listas para recibir datos.

---

## 💡 Recomendaciones

### Misma Región
- Crea ambos proyectos en la misma región para mejor latencia

### Nombres Claros
- Usa nombres descriptivos: `licoreria-operacional` y `licoreria-datawarehouse`

### Passwords Diferentes
- Usa passwords diferentes para cada proyecto
- Guárdalas en un gestor de contraseñas

### Connection Strings
- Guarda ambos connection strings en un lugar seguro
- Usa variables de entorno, nunca hardcodees passwords

---

## 🆘 Solución de Problemas

### Error: "Connection refused"
- Verifica que el connection string sea correcto
- Verifica que uses el puerto correcto (5432 para direct, 6543 para pooling)

### Error: "SSL required"
- Agrega `?sslmode=require` al connection string

### Error: "Authentication failed"
- Verifica usuario y password
- El usuario debe incluir el Project Reference: `postgres.[PROJECT-REF]`

---

## 📚 Próximos Pasos

1. ✅ Crear segundo proyecto en Supabase
2. ✅ Obtener connection strings
3. ✅ Actualizar `.env`
4. ✅ Ejecutar script de creación de tablas
5. ⏭️ Implementar proceso ETL (más adelante)
6. ⏭️ Crear endpoints de Analytics

---

**Última actualización**: 2025-01-15


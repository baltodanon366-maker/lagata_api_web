# Guía para Crear Funciones PostgreSQL en Supabase

Esta guía te ayudará a ejecutar los scripts de funciones PostgreSQL adaptadas desde los stored procedures de SQL Server.

## 📋 Contenido

1. [Funciones de Base de Datos Operacional](#funciones-operacional)
2. [Funciones de Data Warehouse](#funciones-datawarehouse)
3. [Cómo Ejecutar los Scripts](#ejecutar-scripts)
4. [Verificar Funciones Creadas](#verificar-funciones)

---

## 🗄️ Funciones de Base de Datos Operacional

**Archivo:** `scripts/database/CreateFunctions_Operacional_PostgreSQL.sql`

### Funciones Incluidas:

#### 1. Seguridad (5 funciones)
- `fn_Usuario_Login` - Autenticar usuario
- `fn_Usuario_Registrar` - Crear nuevo usuario
- `fn_Usuario_ActualizarPassword` - Actualizar contraseña
- `fn_Usuario_AsignarRol` - Asignar rol a usuario
- `fn_Usuario_ObtenerPermisos` - Obtener permisos de un usuario

#### 2. Catálogos - Proveedores (4 funciones)
- `fn_Proveedor_Crear` - Crear proveedor
- `fn_Proveedor_Editar` - Editar proveedor
- `fn_Proveedor_MostrarActivos` - Listar proveedores activos
- `fn_Proveedor_MostrarActivosPorNombre` - Buscar proveedores por nombre

#### 3. Catálogos - Clientes (3 funciones)
- `fn_Cliente_Crear` - Crear cliente
- `fn_Cliente_Editar` - Editar cliente
- `fn_Cliente_MostrarActivos` - Listar clientes activos

#### 4. Catálogos - Productos (2 funciones)
- `fn_Producto_MostrarActivos` - Listar productos activos
- `fn_DetalleProducto_MostrarActivos` - Listar detalles de productos activos

#### 5. Transacciones - Compras (2 funciones)
- `fn_Compra_ObtenerPorId` - Obtener compra con detalles
- `fn_Compra_MostrarPorRangoFechas` - Listar compras por rango de fechas

#### 6. Transacciones - Ventas (2 funciones)
- `fn_Venta_ObtenerPorId` - Obtener venta con detalles
- `fn_Venta_MostrarPorRangoFechas` - Listar ventas por rango de fechas

#### 7. MovimientosStock (1 función)
- `fn_MovimientoStock_MostrarPorProducto` - Listar movimientos de stock por producto

**Total: ~20 funciones**

---

## 📊 Funciones de Data Warehouse

**Archivo:** `scripts/database/CreateFunctions_DataWarehouse_PostgreSQL.sql`

### Funciones Incluidas:

#### 1. Hecho Ventas (4 funciones)
- `fn_DW_Ventas_PorRangoFechas` - Ventas agregadas por rango de fechas (Día, Semana, Mes, Año)
- `fn_DW_Ventas_PorProducto` - Ventas agregadas por producto
- `fn_DW_Ventas_PorCategoria` - Ventas agregadas por categoría
- `fn_DW_Ventas_PorCliente` - Ventas agregadas por cliente

#### 2. Hecho Compras (3 funciones)
- `fn_DW_Compras_PorRangoFechas` - Compras agregadas por rango de fechas
- `fn_DW_Compras_PorProveedor` - Compras agregadas por proveedor
- `fn_DW_Compras_PorProducto` - Compras agregadas por producto

#### 3. Hecho Inventario (3 funciones)
- `fn_DW_Inventario_StockActual` - Stock actual de todos los productos
- `fn_DW_Inventario_ProductosStockBajo` - Productos con stock bajo
- `fn_DW_Inventario_ValorInventario` - Valor total del inventario

**Total: ~10 funciones**

---

## 🚀 Cómo Ejecutar los Scripts

### Opción 1: SQL Editor de Supabase (Recomendado)

1. **Abrir Supabase Dashboard**
   - Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
   - Navega a **SQL Editor** en el menú lateral

2. **Ejecutar Script de Base de Datos Operacional**
   - Abre el archivo `scripts/database/CreateFunctions_Operacional_PostgreSQL.sql`
   - Copia todo el contenido
   - Pega en el SQL Editor de Supabase
   - Asegúrate de estar conectado a la base de datos **operacional**
   - Haz clic en **Run** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Verifica que no haya errores en la consola

3. **Ejecutar Script de Data Warehouse**
   - Abre el archivo `scripts/database/CreateFunctions_DataWarehouse_PostgreSQL.sql`
   - Copia todo el contenido
   - Pega en el SQL Editor de Supabase
   - **IMPORTANTE:** Asegúrate de estar conectado a la base de datos del **DataWarehouse** (proyecto separado)
   - Haz clic en **Run**
   - Verifica que no haya errores

### Opción 2: psql (Línea de Comandos)

Si prefieres usar `psql` desde la terminal:

```bash
# Para base de datos operacional
psql "postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true" -f scripts/database/CreateFunctions_Operacional_PostgreSQL.sql

# Para DataWarehouse (reemplaza con tu connection string del DW)
psql "postgresql://postgres.[PROJECT-REF-DW]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true" -f scripts/database/CreateFunctions_DataWarehouse_PostgreSQL.sql
```

---

## ✅ Verificar Funciones Creadas

### En Supabase SQL Editor

Ejecuta estas consultas para verificar que las funciones se crearon correctamente:

#### Base de Datos Operacional

```sql
-- Listar todas las funciones creadas
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'fn_%'
ORDER BY routine_name;

-- Verificar función específica
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'fn_Usuario_Login';
```

#### Data Warehouse

```sql
-- Listar todas las funciones del Data Warehouse
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'fn_DW_%'
ORDER BY routine_name;
```

### Probar una Función

```sql
-- Ejemplo: Probar función de login
SELECT * FROM fn_Usuario_Login('admin', '$2b$12$z6UUE3BPND/PybbYC4/62usNRUJ07CDjkkQGWLSF8W8BmVI9hnVm.');

-- Ejemplo: Listar proveedores activos
SELECT * FROM fn_Proveedor_MostrarActivos(10);

-- Ejemplo: Ventas por rango de fechas (DataWarehouse)
SELECT * FROM fn_DW_Ventas_PorRangoFechas(
    '2024-01-01'::DATE,
    '2024-12-31'::DATE,
    'Mes'
);
```

---

## 🔧 Diferencias Clave: SQL Server vs PostgreSQL

### 1. Sintaxis de Funciones

**SQL Server:**
```sql
CREATE PROCEDURE sp_Usuario_Login
    @NombreUsuario NVARCHAR(100),
    @PasswordHash NVARCHAR(500)
AS
BEGIN
    -- código
END
```

**PostgreSQL:**
```sql
CREATE OR REPLACE FUNCTION fn_Usuario_Login(
    p_nombre_usuario VARCHAR(100),
    p_password_hash VARCHAR(500)
)
RETURNS TABLE (...) AS $$
BEGIN
    -- código
END;
$$ LANGUAGE plpgsql;
```

### 2. Retorno de Resultados

**SQL Server:** Usa `SELECT` directamente
**PostgreSQL:** Usa `RETURN QUERY SELECT ...`

### 3. Parámetros OUTPUT

**SQL Server:** `@Resultado BIT OUTPUT`
**PostgreSQL:** `OUT p_resultado BOOLEAN`

### 4. Variables

**SQL Server:** `DECLARE @Variable INT`
**PostgreSQL:** `DECLARE v_variable INTEGER`

### 5. Tipos de Datos

- `NVARCHAR` → `VARCHAR`
- `BIT` → `BOOLEAN`
- `DATETIME2` → `TIMESTAMP`
- `DECIMAL(18,2)` → `NUMERIC(18,2)`
- `INT` → `INTEGER`

### 6. Funciones de Fecha

- `GETDATE()` → `CURRENT_TIMESTAMP`
- `GETUTCDATE()` → `CURRENT_TIMESTAMP`
- `DATEADD(MONTH, -1, GETDATE())` → `CURRENT_DATE - INTERVAL '1 month'`

### 7. Operadores de Concatenación

- `'%' + @Nombre + '%'` → `'%' || p_nombre || '%'`

### 8. LIKE Case-Insensitive

- `LIKE '%nombre%'` → `ILIKE '%nombre%'`

---

## ⚠️ Notas Importantes

1. **Nombres de Funciones:** En PostgreSQL, los nombres de funciones son case-sensitive cuando se usan comillas. Las funciones creadas usan nombres en minúsculas con guiones bajos (snake_case).

2. **Esquema:** Todas las funciones se crean en el esquema `public` por defecto.

3. **Permisos:** Asegúrate de tener permisos para crear funciones en la base de datos.

4. **Reemplazar Funciones:** El script usa `CREATE OR REPLACE FUNCTION`, por lo que si una función ya existe, será reemplazada.

5. **Transacciones:** Las funciones en PostgreSQL no pueden ejecutar transacciones directamente. Si necesitas transacciones, deberás manejarlas desde la aplicación (NestJS).

---

## 📝 Próximos Pasos

Una vez que hayas creado las funciones:

1. ✅ Verificar que todas las funciones se crearon correctamente
2. ✅ Probar algunas funciones manualmente
3. ✅ Continuar con el desarrollo de los módulos de la API en NestJS
4. ✅ Integrar las funciones en los servicios de NestJS usando TypeORM

---

## 🆘 Solución de Problemas

### Error: "function already exists"
- Esto es normal si ejecutas el script varias veces
- El script usa `CREATE OR REPLACE`, así que debería funcionar
- Si persiste, elimina la función manualmente: `DROP FUNCTION IF EXISTS fn_NombreFuncion(...);`

### Error: "permission denied"
- Verifica que tengas permisos de administrador en la base de datos
- En Supabase, asegúrate de estar usando la cuenta correcta

### Error: "syntax error"
- Verifica que copiaste todo el script completo
- Asegúrate de que no haya caracteres especiales o codificación incorrecta
- Revisa los logs de error en Supabase para más detalles

---

¿Necesitas ayuda? Revisa la documentación de PostgreSQL o contacta al equipo de desarrollo.


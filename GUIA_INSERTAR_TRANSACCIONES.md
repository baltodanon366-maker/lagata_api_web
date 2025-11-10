# 📋 Guía: Insertar Transacciones de Prueba

Esta guía te ayudará a insertar datos de prueba para las transacciones (Compras, Ventas, Devoluciones y MovimientosStock).

## ✅ Requisitos Previos

Antes de ejecutar este script, asegúrate de tener:

- ✅ Tablas creadas (ejecutado `CreateTables_PostgreSQL.sql`)
- ✅ Datos base insertados (ejecutado `InsertTestData_PostgreSQL.sql`):
  - Usuarios (admin, vendedor1, supervisor1)
  - Empleados
  - Clientes
  - Proveedores
  - Productos y DetalleProducto

## 🚀 Ejecutar el Script

### Opción 1: Usando el SQL Editor de Supabase (Recomendado)

1. Ve a tu proyecto Supabase → **SQL Editor**
2. Crea una nueva query
3. Copia el contenido completo del archivo:
   ```
   scripts/database/InsertTransacciones_PostgreSQL.sql
   ```
4. Pega el script en el editor
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Espera a que termine la ejecución (puede tardar unos minutos)

### Opción 2: Usando psql desde la terminal

```bash
# Conectarte a Supabase y ejecutar el script
psql "TU_CONNECTION_STRING" -f scripts/database/InsertTransacciones_PostgreSQL.sql
```

### Opción 3: Usando un cliente PostgreSQL (pgAdmin, DBeaver, etc.)

1. Conéctate a tu base de datos Supabase
2. Abre el archivo `scripts/database/InsertTransacciones_PostgreSQL.sql`
3. Ejecuta el script completo

## 📊 Datos que se Insertarán

El script crea:

### 1. Compras (100 registros)
- **Rango de fechas**: Últimos 6 meses
- **Detalles**: 1 a 5 productos por compra
- **Cantidades**: 10 a 50 unidades por producto
- **Totales**: Calculados automáticamente (subtotal + 15% IVA)

### 2. Ventas (100 registros)
- **Rango de fechas**: Últimos 6 meses
- **Detalles**: 1 a 4 productos por venta
- **Cantidades**: 1 a 10 unidades por producto
- **Descuentos**: 10% cada 10 ventas
- **Métodos de pago**: Efectivo, Tarjeta, Transferencia (distribuidos)
- **Totales**: Calculados automáticamente (subtotal + 15% IVA)

### 3. Devoluciones (hasta 12 registros)
- **Rango de fechas**: Últimos 3 meses
- **Basadas en**: Ventas existentes
- **Cantidad a devolver**: Proporcional a la cantidad original

### 4. MovimientosStock (generados automáticamente)
- **Desde Compras**: Entradas de stock
- **Desde Ventas**: Salidas de stock
- **Desde Devoluciones**: Entradas de stock
- **Cálculo**: Stock anterior y nuevo calculado automáticamente

## 🔍 Verificar Datos Insertados

Después de ejecutar el script, puedes verificar con estas consultas:

```sql
-- Verificar compras
SELECT COUNT(*) as total_compras FROM "Compras";
SELECT COUNT(*) as total_compras_detalle FROM "ComprasDetalle";

-- Verificar ventas
SELECT COUNT(*) as total_ventas FROM "Ventas";
SELECT COUNT(*) as total_ventas_detalle FROM "VentasDetalle";

-- Verificar devoluciones
SELECT COUNT(*) as total_devoluciones FROM "DevolucionesVenta";
SELECT COUNT(*) as total_devoluciones_detalle FROM "DevolucionesVentaDetalle";

-- Verificar movimientos de stock
SELECT COUNT(*) as total_movimientos FROM "MovimientosStock";
SELECT "TipoMovimiento", COUNT(*) as cantidad 
FROM "MovimientosStock" 
GROUP BY "TipoMovimiento";

-- Ver resumen de transacciones
SELECT 
    'Compras' as tipo,
    COUNT(*) as total,
    SUM("Total") as monto_total
FROM "Compras"
UNION ALL
SELECT 
    'Ventas' as tipo,
    COUNT(*) as total,
    SUM("Total") as monto_total
FROM "Ventas"
UNION ALL
SELECT 
    'Devoluciones' as tipo,
    COUNT(*) as total,
    SUM("TotalDevolucion") as monto_total
FROM "DevolucionesVenta";
```

## ⚠️ Notas Importantes

1. **Tiempo de ejecución**: El script puede tardar 2-5 minutos dependiendo de la velocidad de tu conexión
2. **Datos aleatorios**: Las fechas, cantidades y productos son aleatorios para simular datos reales
3. **MovimientosStock**: Se generan automáticamente después de crear las transacciones
4. **Stock actualizado**: Los movimientos de stock calculan el stock anterior y nuevo basándose en el orden cronológico

## 🔄 Re-ejecutar el Script

Si necesitas re-ejecutar el script:

1. **Opción A**: Eliminar datos existentes primero
   ```sql
   DELETE FROM "MovimientosStock";
   DELETE FROM "DevolucionesVentaDetalle";
   DELETE FROM "DevolucionesVenta";
   DELETE FROM "VentasDetalle";
   DELETE FROM "Ventas";
   DELETE FROM "ComprasDetalle";
   DELETE FROM "Compras";
   ```
   Luego ejecuta el script nuevamente.

2. **Opción B**: El script está diseñado para insertar datos nuevos, pero puede generar duplicados si se ejecuta múltiples veces.

## 📝 Próximos Pasos

Una vez que tengas los datos de transacciones:

1. ✅ Verifica que los datos se insertaron correctamente
2. ✅ Revisa los movimientos de stock
3. ✅ Continúa con el desarrollo de los módulos de transacciones en NestJS

## 🐛 Solución de Problemas

### Error: "Faltan datos base"

**Causa**: No has ejecutado `InsertTestData_PostgreSQL.sql` primero.

**Solución**: Ejecuta primero el script de datos base.

### Error: "No se pueden crear devoluciones porque no hay ventas"

**Causa**: Las ventas no se crearon correctamente.

**Solución**: Verifica que las ventas se insertaron antes de crear devoluciones.

### Error: Timeout

**Causa**: El script es largo y puede tardar.

**Solución**: Espera unos minutos o ejecuta el script en partes (comentando secciones).

---

**¿Listo para continuar?** Una vez que tengas los datos de transacciones, podemos continuar con el desarrollo de los módulos de la API. 🚀


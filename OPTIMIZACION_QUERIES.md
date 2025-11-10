# ⚡ Optimización de Queries

Este documento describe las optimizaciones implementadas y recomendaciones para mejorar el rendimiento de las queries.

## 📊 Índices en PostgreSQL

### Base de Datos Operacional

Los siguientes índices ya están creados en las tablas principales:

#### Tabla `Usuarios`
- `PK_Usuarios` (Id) - Clave primaria
- `IX_Usuarios_NombreUsuario` - Búsqueda por nombre de usuario
- `IX_Usuarios_Email` - Búsqueda por email

#### Tabla `Categorias`
- `PK_Categorias` (Id) - Clave primaria
- `IX_Categorias_Nombre` - Búsqueda por nombre (único)

#### Tabla `Productos`
- `PK_Productos` (Id) - Clave primaria
- `IX_Productos_Nombre` - Búsqueda por nombre

#### Tabla `DetalleProducto`
- `PK_DetalleProducto` (Id) - Clave primaria
- `IX_DetalleProducto_ProductoId` - Relación con Productos
- `IX_DetalleProducto_Codigo` - Búsqueda por código (único)

#### Tabla `Compras`
- `PK_Compras` (Id) - Clave primaria
- `IX_Compras_FechaCompra` - Búsqueda por fecha
- `IX_Compras_ProveedorId` - Relación con Proveedores

#### Tabla `Ventas`
- `PK_Ventas` (Id) - Clave primaria
- `IX_Ventas_FechaVenta` - Búsqueda por fecha
- `IX_Ventas_ClienteId` - Relación con Clientes
- `IX_Ventas_EmpleadoId` - Relación con Empleados

### DataWarehouse

#### Tabla `HechoVenta`
- `PK_HechoVenta` (Id) - Clave primaria
- `IX_HechoVenta_FechaId` - Relación con DimTiempo
- `IX_HechoVenta_ProductoId` - Relación con DimProducto
- `IX_HechoVenta_ClienteId` - Relación con DimCliente
- `IX_HechoVenta_EmpleadoId` - Relación con DimEmpleado

## 🔧 Optimizaciones Implementadas

### 1. Uso de Funciones PostgreSQL

Todas las operaciones CRUD usan funciones PostgreSQL (`fn_*`) que:
- Ejecutan queries optimizadas
- Validan datos en la base de datos
- Reducen round-trips entre aplicación y BD
- Aprovechan índices automáticamente

### 2. Paginación y Límites

Los endpoints de listado incluyen límites por defecto:
- Catálogos: 100 registros por defecto
- Transacciones: Sin límite (pero con filtros de fecha)
- Analytics: Sin límite (pero con filtros de fecha)

**Recomendación**: Agregar paginación en futuras versiones.

### 3. Queries Selectivas

Los endpoints solo retornan los campos necesarios:
- No se usa `SELECT *` en funciones críticas
- Se especifican campos explícitamente en funciones PostgreSQL

### 4. Índices en MongoDB

Los schemas de MongoDB incluyen índices:

#### Notificaciones
- `{ UsuarioId: 1, Leida: 1 }` - Búsqueda por usuario y estado
- `{ FechaCreacion: -1 }` - Ordenamiento por fecha
- `{ Tipo: 1 }` - Búsqueda por tipo

#### Logs
- `{ FechaCreacion: -1 }` - Ordenamiento por fecha
- `{ Nivel: 1, FechaCreacion: -1 }` - Búsqueda por nivel
- `{ Modulo: 1, FechaCreacion: -1 }` - Búsqueda por módulo
- `{ UsuarioId: 1, FechaCreacion: -1 }` - Búsqueda por usuario
- `{ Endpoint: 1, FechaCreacion: -1 }` - Búsqueda por endpoint

## 📈 Recomendaciones Futuras

### 1. Agregar Paginación

```typescript
// Ejemplo de paginación
GET /categorias?page=1&limit=20
```

### 2. Implementar Caché

Para datos que no cambian frecuentemente:
- Catálogos (Categorias, Marcas, Modelos)
- Roles y Permisos
- Configuración del sistema

**Opciones**:
- Redis para caché en memoria
- Caché HTTP con headers `Cache-Control`

### 3. Optimizar Queries de Analytics

Para reportes complejos:
- Usar vistas materializadas en PostgreSQL
- Pre-calcular métricas en horarios de bajo tráfico
- Implementar caché para reportes frecuentes

### 4. Monitoreo de Performance

Implementar:
- Logging de queries lentas (> 1s)
- Métricas de tiempo de respuesta
- Alertas para queries que excedan umbrales

### 5. Connection Pooling

Ya configurado en Supabase:
- Session Pooler: Hasta 200 conexiones
- Connection Pooling: Gestión automática

## 🔍 Queries a Monitorear

### Queries Potencialmente Lentas

1. **Analytics - Tendencias**
   - Compara múltiples períodos
   - Puede ser lenta con muchos datos
   - **Solución**: Agregar límites de fecha

2. **Inventario - Valor Total**
   - Suma todos los productos
   - Puede ser lenta con muchos productos
   - **Solución**: Caché o cálculo incremental

3. **Logs - Búsqueda por Módulo**
   - Sin límite de fecha puede ser lenta
   - **Solución**: Agregar filtro de fecha obligatorio

## ✅ Checklist de Optimización

- [x] Índices en tablas principales
- [x] Índices en MongoDB schemas
- [x] Límites en endpoints de listado
- [x] Uso de funciones PostgreSQL optimizadas
- [ ] Paginación implementada
- [ ] Caché para catálogos
- [ ] Monitoreo de performance
- [ ] Alertas para queries lentas

## 📊 Métricas de Performance Objetivo

- **Endpoints de Catálogos**: < 100ms
- **Endpoints de Transacciones**: < 500ms
- **Endpoints de Analytics**: < 2s
- **Endpoints de MongoDB**: < 200ms

## 🛠️ Herramientas de Análisis

### PostgreSQL

```sql
-- Ver queries lentas
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Ver índices no usados
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### MongoDB

```javascript
// Ver queries lentas
db.system.profile.find({ millis: { $gt: 1000 } }).sort({ ts: -1 });

// Analizar uso de índices
db.collection.explain("executionStats").find({ ... });
```


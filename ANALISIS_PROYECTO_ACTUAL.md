# 📊 Análisis del Proyecto Actual: proyecto_api

## 🎯 Resumen Ejecutivo

**Proyecto**: Licoreria API - Sistema de Facturación  
**Tecnología**: ASP.NET Core 8 (C#)  
**Arquitectura**: Clean Architecture (4 capas)  
**Total Endpoints**: 122  
**Bases de Datos**: 3 (SQL Server Operacional, SQL Server DataWarehouse, MongoDB)

---

## 🏗️ Arquitectura

### Estructura de Capas
```
LicoreriaAPI/
├── Presentation (LicoreriaAPI)
│   └── Controllers/          # 14 controladores REST
│
├── Application (LicoreriaAPI.Application)
│   ├── Interfaces/Services/  # 16 interfaces
│   └── Services/             # 16 servicios (lógica de negocio)
│
├── Domain (LicoreriaAPI.Domain)
│   └── Models/               # 37 entidades de dominio
│
├── Infrastructure (LicoreriaAPI.Infrastructure)
│   ├── Configuration/        # Configuraciones
│   └── Data/
│       ├── SqlServer/        # DbContext EF Core
│       ├── MongoDB/          # MongoDbContext
│       └── DataWarehouse/    # DbContext EF Core
│
└── DTOs (LicoreriaAPI.DTOs)
    └── [Módulos]/            # 25+ DTOs
```

### Patrones Implementados
- ✅ **Repository Pattern**: Implícito con EF Core
- ✅ **Service Pattern**: Lógica de negocio en servicios
- ✅ **DTO Pattern**: Separación de modelos de dominio y transferencia
- ✅ **Dependency Injection**: Nativo de .NET

---

## 🗄️ Bases de Datos

### 1. SQL Server (Operacional)
**Propósito**: Operaciones transaccionales críticas

**Tablas Principales**:
- `Usuarios` (autenticación)
- `Categorias`, `Marcas`, `Modelos`, `Productos`
- `Proveedores`, `Clientes`, `Empleados`
- `DetalleProducto` (inventario)
- `Compras`, `ComprasDetalle`
- `Ventas`, `VentasDetalle`
- `DevolucionesVenta`, `DevolucionesVentaDetalle`

**Características**:
- Transacciones ACID
- Stored Procedures para lógica de negocio
- Actualización automática de stock
- Validaciones de integridad

**Endpoints que usan esta BD**:
- 🔐 Auth (5 endpoints)
- 📦 Catálogos (80 endpoints)
- 🛒 Transacciones (9 endpoints)

### 2. SQL Server DataWarehouse
**Propósito**: Consultas analíticas y reportes

**Tablas Principales**:
- `DimTiempo`, `DimProducto`, `DimCliente`, `DimProveedor`
- `HechoVenta`, `HechoCompra`, `HechoInventario`

**Características**:
- Datos agregados optimizados
- Solo lectura (alimentado por ETL)
- Respuestas rápidas para gráficos
- Agrupaciones flexibles (día, semana, mes, año)

**Endpoints que usan esta BD**:
- 📊 Analytics (18 endpoints)

### 3. MongoDB
**Propósito**: Funcionalidades flexibles y de alto volumen

**Colecciones**:
- `notifications` (notificaciones)
- `logs` (logs de auditoría)
- `documents` (metadatos de documentos)

**Características**:
- Esquema flexible
- Escalabilidad horizontal
- Alto rendimiento para escritura

**Endpoints que usan esta BD**:
- 🍃 Funcionalidades (10 endpoints)

---

## 🔐 Autenticación y Seguridad

### Sistema JWT
- **Algoritmo**: HS256 (HMAC SHA-256)
- **Secret Key**: Configurable (mínimo 32 caracteres)
- **Issuer**: LicoreriaAPI
- **Audience**: LicoreriaAPIUsers
- **Expiración**: 60 minutos (configurable)

### Claims del Token
```json
{
  "sub": "nombreUsuario",
  "nameid": "usuarioId",
  "name": "nombreUsuario",
  "role": "rol",
  "jti": "guid"
}
```

### Hash de Passwords
- **Algoritmo**: BCrypt
- **Salt Rounds**: 12

### Endpoints de Autenticación
1. `POST /api/auth/login` - Iniciar sesión
2. `POST /api/auth/registro` - Registrar usuario
3. `PUT /api/auth/cambiar-password` - Cambiar contraseña (requiere auth)
4. `GET /api/auth/mi-informacion` - Obtener info del usuario (requiere auth)
5. `GET /api/auth/permisos` - Obtener permisos (requiere auth)

### Seguridad Adicional
- ✅ CORS configurado (AllowAll en desarrollo)
- ✅ Validación de modelos con Data Annotations
- ✅ Autorización basada en roles
- ✅ Protección de endpoints con `[Authorize]`

---

## 📋 Endpoints por Módulo

### 🔐 Autenticación (5 endpoints)
- `POST /api/auth/login`
- `POST /api/auth/registro`
- `PUT /api/auth/cambiar-password`
- `GET /api/auth/mi-informacion`
- `GET /api/auth/permisos`

### 📦 Catálogos (80 endpoints - 8 módulos × 10 operaciones)

#### Categorias (10 endpoints)
- `GET /api/categorias` - Listar (con paginación)
- `GET /api/categorias/{id}` - Obtener por ID
- `POST /api/categorias` - Crear
- `PUT /api/categorias/{id}` - Actualizar
- `DELETE /api/categorias/{id}` - Eliminar
- `GET /api/categorias/buscar?termino=...` - Buscar
- `GET /api/categorias/activas` - Listar activas
- `GET /api/categorias/{id}/productos` - Productos de categoría
- `PATCH /api/categorias/{id}/activar` - Activar
- `PATCH /api/categorias/{id}/desactivar` - Desactivar

**Mismos patrones para**:
- Marcas (10 endpoints)
- Modelos (10 endpoints)
- Productos (10 endpoints)
- Proveedores (10 endpoints)
- Clientes (10 endpoints)
- Empleados (10 endpoints)
- DetalleProductos (10 endpoints)

### 🛒 Transacciones (9 endpoints)

#### Compras (3 endpoints)
- `POST /api/compras` - Crear compra
- `GET /api/compras` - Listar compras
- `GET /api/compras/{id}` - Obtener compra por ID

#### Ventas (3 endpoints)
- `POST /api/ventas` - Crear venta
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/{id}` - Obtener venta por ID

#### Devoluciones (3 endpoints)
- `POST /api/devoluciones-venta` - Crear devolución
- `GET /api/devoluciones-venta` - Listar devoluciones
- `GET /api/devoluciones-venta/{id}` - Obtener devolución por ID

### 📊 Analytics (18 endpoints)

#### Ventas
- `GET /api/analytics/ventas/rango-fechas` - Ventas por rango
- `GET /api/analytics/ventas/por-producto` - Ventas por producto
- `GET /api/analytics/ventas/por-cliente` - Ventas por cliente
- `GET /api/analytics/ventas/por-empleado` - Ventas por empleado

#### Compras
- `GET /api/analytics/compras/rango-fechas` - Compras por rango
- `GET /api/analytics/compras/por-proveedor` - Compras por proveedor
- `GET /api/analytics/compras/por-producto` - Compras por producto

#### Inventario
- `GET /api/analytics/inventario/stock-bajo` - Productos con stock bajo
- `GET /api/analytics/inventario/valor-total` - Valor total del inventario
- `GET /api/analytics/inventario/movimientos` - Movimientos de stock

#### Dashboard
- `GET /api/analytics/metricas/dashboard` - Métricas generales
- `GET /api/analytics/metricas/ventas-hoy` - Ventas del día
- `GET /api/analytics/metricas/compras-hoy` - Compras del día
- `GET /api/analytics/metricas/productos-mas-vendidos` - Top productos
- `GET /api/analytics/metricas/clientes-mas-frecuentes` - Top clientes
- `GET /api/analytics/metricas/ventas-por-metodo-pago` - Por método de pago
- `GET /api/analytics/metricas/tendencias` - Tendencias de ventas

### 🍃 MongoDB (10 endpoints)

#### Notificaciones (5 endpoints)
- `POST /api/mongodb/notificaciones` - Crear notificación
- `GET /api/mongodb/notificaciones` - Listar notificaciones
- `GET /api/mongodb/notificaciones/{id}` - Obtener notificación
- `PUT /api/mongodb/notificaciones/{id}/leer` - Marcar como leída
- `DELETE /api/mongodb/notificaciones/{id}` - Eliminar notificación

#### Logs (5 endpoints)
- `POST /api/mongodb/logs` - Crear log
- `GET /api/mongodb/logs` - Listar logs
- `GET /api/mongodb/logs/{id}` - Obtener log
- `GET /api/mongodb/logs/usuario/{usuarioId}` - Logs por usuario
- `GET /api/mongodb/logs/tipo/{tipo}` - Logs por tipo

---

## 🔧 Tecnologías y Dependencias

### Core Framework
- ASP.NET Core 8
- Entity Framework Core 8
- MongoDB.Driver

### Autenticación
- Microsoft.AspNetCore.Authentication.JwtBearer
- BCrypt.Net-Next

### Documentación
- Swashbuckle.AspNetCore (Swagger/OpenAPI)

### Validación
- Data Annotations (built-in)
- FluentValidation (opcional)

---

## 📝 Características Especiales

### Actualización Automática de Stock
- Al crear una **Compra**: Aumenta stock
- Al crear una **Venta**: Disminuye stock
- Al crear una **Devolución**: Aumenta stock

### Generación Automática de Folios
- **Ventas**: `VTA-YYYYMMDDHHMMSS-XXXX`
- **Compras**: `CMP-YYYYMMDDHHMMSS-XXXX`
- **Devoluciones**: `DEV-YYYYMMDDHHMMSS-XXXX`

### Cálculo Automático de Totales
- Subtotal = Suma de (cantidad × precioUnitario - descuento)
- Impuestos = Subtotal × 0.15 (15%)
- Total = Subtotal + Impuestos

### Validaciones de Negocio
- Stock suficiente antes de crear venta
- Precios positivos
- Cantidades mayores a 0
- Cliente/Proveedor/Empleado existente
- Producto activo

---

## 🎯 Puntos Clave para Migración

### 1. Mantener la Misma Estructura de Respuestas
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### 2. Mantener los Mismos Endpoints
- Mismas rutas
- Mismos métodos HTTP
- Mismos parámetros
- Mismas respuestas

### 3. Mantener la Misma Lógica de Negocio
- Actualización automática de stock
- Generación de folios
- Cálculo de totales
- Validaciones de negocio

### 4. Mantener la Misma Seguridad
- JWT con misma configuración
- BCrypt para passwords
- Mismos roles y permisos

---

## 📊 Estadísticas del Proyecto

- **Total de Archivos C#**: ~150+
- **Total de Controladores**: 14
- **Total de Servicios**: 16
- **Total de Entidades**: 37
- **Total de DTOs**: 25+
- **Total de Endpoints**: 122
- **Stored Procedures**: 30+

---

**Fecha de análisis**: 2025-01-15  
**Versión del proyecto**: 1.0.0


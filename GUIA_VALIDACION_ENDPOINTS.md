# ✅ Guía de Validación de Endpoints

Esta guía te ayudará a validar que todos los endpoints de la API funcionen correctamente.

## 📋 Checklist de Validación

### 🔐 Autenticación (7 endpoints)

- [ ] `POST /auth/login` - Login con credenciales válidas
- [ ] `POST /auth/login` - Error con credenciales inválidas
- [ ] `POST /auth/register` - Registrar nuevo usuario
- [ ] `POST /auth/change-password` - Cambiar contraseña (requiere token)
- [ ] `GET /auth/profile` - Obtener perfil (requiere token)
- [ ] `GET /auth/permisos` - Obtener permisos (requiere token)
- [ ] `GET /auth/roles` - Listar roles (requiere token)
- [ ] `POST /auth/asignar-rol` - Asignar rol (solo admin)

### 📦 Catálogos (80 endpoints - 8 módulos × 10 endpoints)

#### Categorias (10 endpoints)
- [ ] `POST /categorias` - Crear categoría
- [ ] `GET /categorias` - Listar categorías activas
- [ ] `GET /categorias/buscar?nombre=...` - Buscar por nombre
- [ ] `GET /categorias/:id` - Obtener por ID
- [ ] `PATCH /categorias/:id` - Actualizar categoría
- [ ] `PATCH /categorias/:id/activar` - Activar categoría
- [ ] `PATCH /categorias/:id/desactivar` - Desactivar categoría
- [ ] `GET /categorias/inactivas` - Listar inactivas
- [ ] `GET /categorias/inactivas/buscar?nombre=...` - Buscar inactivas
- [ ] `GET /categorias/inactivas/:id` - Obtener inactiva por ID

**Repetir para: Marcas, Modelos, Productos, Proveedores, Clientes, Empleados, DetalleProducto**

### 🛒 Transacciones (13 endpoints)

#### Compras (4 endpoints)
- [ ] `POST /compras` - Crear compra con detalles
- [ ] `GET /compras/:id` - Obtener compra por ID
- [ ] `GET /compras/:id/detalles` - Obtener detalles de compra
- [ ] `GET /compras?fechaInicio=...&fechaFin=...` - Obtener por rango de fechas

#### Ventas (4 endpoints)
- [ ] `POST /ventas` - Crear venta con detalles
- [ ] `GET /ventas/:id` - Obtener venta por ID
- [ ] `GET /ventas/:id/detalles` - Obtener detalles de venta
- [ ] `GET /ventas?fechaInicio=...&fechaFin=...` - Obtener por rango de fechas

#### Devoluciones (3 endpoints)
- [ ] `POST /devoluciones` - Crear devolución con detalles
- [ ] `GET /devoluciones/:id` - Obtener devolución por ID
- [ ] `GET /devoluciones/:id/detalles` - Obtener detalles de devolución

#### MovimientosStock (2 endpoints)
- [ ] `POST /movimientos-stock/ajuste` - Realizar ajuste manual
- [ ] `GET /movimientos-stock/producto/:detalleProductoId` - Obtener movimientos por producto

### 📊 Analytics (18 endpoints)

#### Ventas (6 endpoints)
- [ ] `GET /analytics/ventas/por-rango-fechas` - Ventas por rango de fechas
- [ ] `GET /analytics/ventas/por-producto` - Ventas por producto
- [ ] `GET /analytics/ventas/por-categoria` - Ventas por categoría
- [ ] `GET /analytics/ventas/por-cliente` - Ventas por cliente
- [ ] `GET /analytics/ventas/por-empleado` - Ventas por empleado
- [ ] `GET /analytics/ventas/por-metodo-pago` - Ventas por método de pago

#### Compras (3 endpoints)
- [ ] `GET /analytics/compras/por-rango-fechas` - Compras por rango de fechas
- [ ] `GET /analytics/compras/por-proveedor` - Compras por proveedor
- [ ] `GET /analytics/compras/por-producto` - Compras por producto

#### Inventario (3 endpoints)
- [ ] `GET /analytics/inventario/stock-actual` - Stock actual
- [ ] `GET /analytics/inventario/productos-stock-bajo` - Productos con stock bajo
- [ ] `GET /analytics/inventario/valor-inventario` - Valor total del inventario

#### Métricas (4 endpoints)
- [ ] `GET /analytics/metricas/dashboard` - Métricas principales
- [ ] `GET /analytics/metricas/tendencias` - Tendencias de ventas
- [ ] `GET /analytics/metricas/productos-mas-vendidos` - Top productos
- [ ] `GET /analytics/metricas/clientes-mas-frecuentes` - Top clientes

#### Reportes (2 endpoints)
- [ ] `GET /analytics/reportes/ventas-vs-compras` - Reporte comparativo
- [ ] `GET /analytics/reportes/rotacion-inventario` - Rotación de inventario

### 🍃 MongoDB (12 endpoints)

#### Notificaciones (6 endpoints)
- [ ] `POST /mongodb/notificaciones` - Crear notificación
- [ ] `GET /mongodb/notificaciones` - Listar notificaciones
- [ ] `GET /mongodb/notificaciones/contar-no-leidas` - Contar no leídas
- [ ] `GET /mongodb/notificaciones/:id` - Obtener por ID
- [ ] `PATCH /mongodb/notificaciones/:id/leer` - Marcar como leída
- [ ] `DELETE /mongodb/notificaciones/:id` - Eliminar notificación

#### Logs (6 endpoints)
- [ ] `POST /mongodb/logs` - Crear log
- [ ] `GET /mongodb/logs` - Listar logs
- [ ] `GET /mongodb/logs/:id` - Obtener log por ID
- [ ] `GET /mongodb/logs/usuario/:usuarioId` - Logs por usuario
- [ ] `GET /mongodb/logs/nivel/:nivel` - Logs por nivel
- [ ] `GET /mongodb/logs/modulo/:modulo` - Logs por módulo

## 🧪 Cómo Validar

### Opción 1: Usando Swagger UI

1. Inicia el servidor: `npm run start:dev`
2. Abre Swagger: `http://localhost:3000/api`
3. Haz login usando `POST /auth/login`
4. Copia el token JWT
5. Haz clic en "Authorize" y pega el token
6. Prueba cada endpoint desde Swagger

### Opción 2: Usando Postman/Insomnia

1. Crea una colección con todos los endpoints
2. Configura variables de entorno:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (se actualiza después del login)
3. Crea un script de pre-request para el login automático
4. Ejecuta la colección completa

### Opción 3: Usando Tests E2E

```bash
# Ejecutar todos los tests e2e
npm run test:e2e

# Ejecutar con cobertura
npm run test:cov
```

## 📝 Casos de Prueba Importantes

### Validación de Datos
- [ ] Campos requeridos retornan error 400
- [ ] Campos con formato inválido retornan error 400
- [ ] Campos opcionales funcionan correctamente

### Autenticación
- [ ] Endpoints protegidos requieren token JWT
- [ ] Token inválido retorna 401
- [ ] Token expirado retorna 401
- [ ] Endpoints públicos funcionan sin token

### Autorización
- [ ] Solo admin puede asignar roles
- [ ] Usuarios solo ven sus propias notificaciones
- [ ] Permisos se validan correctamente

### Rate Limiting
- [ ] Más de 100 requests por minuto retorna 429
- [ ] Rate limit se resetea después del TTL

### Errores
- [ ] Errores retornan formato JSON consistente
- [ ] Mensajes de error son claros y útiles
- [ ] Códigos de estado HTTP son correctos

## 🔍 Validación de Performance

### Queries Optimizadas
- [ ] Las queries usan índices correctamente
- [ ] No hay N+1 queries
- [ ] Las funciones PostgreSQL se ejecutan correctamente

### Respuestas Rápidas
- [ ] Endpoints responden en < 500ms (local)
- [ ] Endpoints de Analytics responden en < 2s (local)
- [ ] No hay timeouts en operaciones normales

## ✅ Checklist Final

- [ ] Todos los endpoints responden correctamente
- [ ] Validación de datos funciona
- [ ] Autenticación y autorización funcionan
- [ ] Rate limiting funciona
- [ ] Swagger está completo y actualizado
- [ ] Tests unitarios pasan
- [ ] Tests e2e pasan
- [ ] No hay errores en consola
- [ ] Performance es aceptable

## 📊 Métricas de Éxito

- **Cobertura de Tests**: > 70%
- **Tiempo de Respuesta Promedio**: < 500ms
- **Tasa de Errores**: < 1%
- **Uptime**: > 99.9%


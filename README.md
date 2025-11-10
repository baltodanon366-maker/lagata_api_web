# 🍷 Licoreria API - Sistema de Facturación

API transaccional de facturación para una licorería desarrollada en NestJS con PostgreSQL (Supabase) y MongoDB.

## 🚀 Características

- **130 endpoints** implementados (118 activos, 12 MongoDB deshabilitados temporalmente)
- **Autenticación JWT** con roles y permisos
- **3 Bases de Datos:**
  - PostgreSQL Operacional (Supabase)
  - PostgreSQL DataWarehouse (Supabase)
  - MongoDB (Atlas) - Deshabilitado temporalmente
- **Documentación Swagger** completa
- **Rate Limiting** configurado
- **Seguridad:** Helmet, CORS, Validación de DTOs

## 📋 Endpoints Disponibles

### Autenticación (7 endpoints)
- Login, Register, Cambio de contraseña
- Perfil, Permisos, Roles
- Asignar rol (solo Admin)

### Catálogos (80 endpoints)
- Categorias, Marcas, Modelos, Productos
- Proveedores, Clientes, Empleados
- Detalle Producto (Inventario)
- 10 endpoints por cada módulo

### Transacciones (13 endpoints)
- Compras (4 endpoints)
- Ventas (4 endpoints)
- Devoluciones (3 endpoints)
- Movimientos Stock (2 endpoints)

### Analytics (18 endpoints)
- Ventas (6 endpoints)
- Compras (3 endpoints)
- Inventario (3 endpoints)
- Métricas/KPIs (4 endpoints)
- Reportes (2 endpoints)

### MongoDB (12 endpoints - Deshabilitado)
- Notificaciones (6 endpoints)
- Logs (6 endpoints)

## 🛠️ Tecnologías

- **Framework:** NestJS 10.x
- **Base de Datos:** PostgreSQL (Supabase), MongoDB (Atlas)
- **ORM:** TypeORM, Mongoose
- **Autenticación:** JWT, Passport
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Deployment:** Vercel (Serverless)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example.txt .env
# Editar .env con tus credenciales

# Compilar
npm run build

# Ejecutar en desarrollo
npm run start:dev
```

## 🔐 Variables de Entorno

Ver `VARIABLES_ENTORNO_VERCEL.md` para la lista completa de variables necesarias.

### Requeridas
- `SUPABASE_DB_URL` - PostgreSQL Operacional
- `SUPABASE_DW_URL` - PostgreSQL DataWarehouse
- `JWT_SECRET` - Secret para JWT tokens
- `JWT_ISSUER` - Issuer del JWT
- `JWT_AUDIENCE` - Audience del JWT

### Opcionales
- `MONGODB_URI` - MongoDB Atlas (deshabilitado temporalmente)
- `MONGODB_DATABASE` - Nombre de la base de datos MongoDB
- `CORS_ORIGIN` - Orígenes permitidos (default: *)
- `THROTTLE_TTL` - TTL para rate limiting (default: 60000)
- `THROTTLE_LIMIT` - Límite de requests (default: 100)

## 📚 Documentación

- **Swagger UI:** `http://localhost:3000/api` (desarrollo)
- **Guía de Deployment:** `GUIA_DEPLOY_VERCEL.md`
- **Guía de Configuración:** `GUIA_CONFIGURAR_CONEXIONES.md`
- **Plan de Migración:** `PLAN_MIGRACION.md`

## 🚀 Deployment en Vercel

Ver `GUIA_DEPLOY_VERCEL.md` para instrucciones detalladas.

### Pasos Rápidos

1. Sube el proyecto a GitHub
2. Conecta con Vercel
3. Configura variables de entorno
4. Deploy automático

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Scripts Disponibles

```bash
npm run build          # Compilar proyecto
npm run start:dev      # Desarrollo con watch
npm run start:prod     # Producción
npm test               # Tests unitarios
npm run test:e2e       # Tests end-to-end
npm run verify:mongodb # Verificar conexión MongoDB
```

## 🔒 Seguridad

- ✅ JWT Authentication
- ✅ Rate Limiting (100 req/min)
- ✅ Helmet (Security Headers)
- ✅ CORS configurado
- ✅ Validación de DTOs
- ✅ Guards y Decoradores

## 📊 Estado del Proyecto

- ✅ Fase 1: Configuración inicial
- ✅ Fase 2: Bases de datos
- ✅ Fase 3: Autenticación y seguridad
- ✅ Fase 4: Módulos de catálogos (80 endpoints)
- ✅ Fase 5: Módulos de transacciones (13 endpoints)
- ✅ Fase 6: Analytics/DataWarehouse (18 endpoints)
- ⏸️ Fase 7: MongoDB (12 endpoints - deshabilitado)
- ✅ Fase 8: Seguridad y documentación
- ✅ Fase 9: Testing y optimización

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Autor

Licoreria La Gata

---

**Versión:** 1.0.0  
**Última actualización:** 2025

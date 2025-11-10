# 🗄️ Decisión: Arquitectura de DataWarehouse

## 📊 Análisis de Opciones

### ✅ Opción 1: Supabase PostgreSQL para DataWarehouse (RECOMENDADA) ☁️

**Configuración**: Dos proyectos Supabase (o dos bases de datos en Supabase)
- **Proyecto 1**: `licoreria-operacional` → Base de datos operacional
- **Proyecto 2**: `licoreria-datawarehouse` → Base de datos DataWarehouse

#### Ventajas
- ✅ **Supabase Managed**: Sin administración de servidor
- ✅ **Misma tecnología**: Menos complejidad, mismo conocimiento
- ✅ **Connection Pooling**: Automático en Supabase
- ✅ **SSL/TLS**: Incluido y configurado automáticamente
- ✅ **Backups automáticos**: Configurables según plan
- ✅ **Dashboard**: Interfaz web para administración
- ✅ **PostgreSQL es excelente para analytics**:
  - Common Table Expressions (CTEs) para queries complejas
  - Window Functions para análisis avanzado
  - Índices avanzados (GIN, GiST, BRIN)
  - Particionamiento de tablas
  - Materialized Views para optimización
- ✅ **TypeORM**: Maneja múltiples conexiones fácilmente
- ✅ **Escalabilidad**: Supabase escala automáticamente
- ✅ **Mantenimiento**: Mínimo (todo managed)

#### Desventajas
- ⚠️ Si ambas están en el mismo servidor, pueden competir por recursos
- ⚠️ Para cargas muy altas, mejor separar físicamente

#### Implementación
```typescript
// Dos DataSources en TypeORM con Supabase
const operationalDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DB_URL, // Connection string completo de Supabase
  ssl: {
    rejectUnauthorized: false, // Supabase requiere SSL
  },
  extra: {
    max: 20, // Connection pool
  },
});

const datawarehouseDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DW_URL, // Connection string del segundo proyecto
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    max: 20,
  },
});
```

---

### 🔄 Opción 2: TimescaleDB (Extensión de PostgreSQL)

**Configuración**: PostgreSQL con extensión TimescaleDB para el DataWarehouse

#### Ventajas
- ✅ **Optimizado para time-series**: Mejor rendimiento en análisis temporal
- ✅ **Compatible con PostgreSQL**: Todas las funciones de PostgreSQL + extensiones
- ✅ **Automatic data retention**: Gestión automática de datos históricos
- ✅ **Continuous aggregates**: Vistas materializadas automáticas
- ✅ **Compression**: Compresión automática de datos antiguos

#### Desventajas
- ⚠️ Requiere instalación de extensión
- ⚠️ Puede ser overkill si no necesitas análisis temporal avanzado
- ⚠️ Ligeramente más complejo de configurar

#### Cuándo usar
- Si necesitas análisis de series de tiempo (ventas por hora/día/semana)
- Si manejas grandes volúmenes de datos históricos
- Si necesitas compresión automática de datos antiguos

---

### 🚀 Opción 3: Servidor PostgreSQL Separado para DataWarehouse

**Configuración**: Dos servidores PostgreSQL físicamente separados

#### Ventajas
- ✅ **Aislamiento de recursos**: No compiten por CPU/RAM
- ✅ **Escalabilidad independiente**: Puedes escalar cada uno según necesidad
- ✅ **Backup independiente**: Estrategias de backup separadas
- ✅ **Mejor para producción**: Ideal para cargas altas

#### Desventajas
- ⚠️ Más infraestructura (2 servidores)
- ⚠️ Mayor costo
- ⚠️ Más complejidad de administración

#### Cuándo usar
- Producción con alta carga
- Necesitas escalar independientemente
- Presupuesto permite múltiples servidores

---

## 🎯 Recomendación Final

### ✅ RECOMENDADO: Supabase para ambas bases de datos
**Usar dos proyectos Supabase (o dos bases de datos en Supabase)**
- **Proyecto 1**: Base de datos operacional
- **Proyecto 2**: Base de datos DataWarehouse
- **Ventajas**:
  - ✅ Managed (sin administración de servidor)
  - ✅ Connection pooling automático
  - ✅ SSL/TLS incluido
  - ✅ Backups automáticos
  - ✅ Dashboard de administración
  - ✅ Escalable automáticamente
  - ✅ PostgreSQL tiene excelentes capacidades analíticas nativas

### Alternativa: Un proyecto Supabase con dos bases de datos
- Más económico (un solo proyecto)
- Misma funcionalidad
- Recomendado para empezar

---

## 📝 Implementación Recomendada (Inicial)

**Comenzar con**: Dos proyectos Supabase (o dos bases de datos en un proyecto)

```env
# Supabase Operacional
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres?sslmode=require

# Supabase DataWarehouse
SUPABASE_DW_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF-DW].supabase.co:5432/postgres?sslmode=require
```

**Ventajas de empezar así**:
- ✅ Más simple de configurar (managed)
- ✅ Sin administración de servidor
- ✅ Connection pooling automático
- ✅ SSL/TLS incluido
- ✅ Backups automáticos
- ✅ Escalable automáticamente
- ✅ PostgreSQL es más que suficiente para analytics

---

## 🔄 Migración Futura

Si en el futuro necesitas más rendimiento:
1. **Upgrade de plan Supabase**: Más recursos automáticamente
2. **Separar proyectos**: Ya están separados, solo escalar
3. **Fácil agregar TimescaleDB**: Supabase soporta extensiones (si está disponible)
4. **TypeORM soporta ambos**: Sin cambios en código

---

## ☁️ Integración con Vercel

- **Variables de entorno**: Configurar en Vercel Dashboard
- **Connection strings**: Usar los de Supabase directamente
- **SSL**: Automático (Supabase siempre requiere SSL)
- **Connection pooling**: Incluido en Supabase

---

**Decisión**: ✅ **Supabase PostgreSQL para ambas bases de datos (dos proyectos o dos bases de datos)**


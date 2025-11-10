# 🗄️ Guía: Crear Bases de Datos PostgreSQL en Azure

Esta guía te ayudará a crear las bases de datos PostgreSQL en Azure para el proyecto Licoreria API.

---

## 📋 Requisitos Previos

1. **Cuenta de Azure**: Tener una cuenta de Azure activa
2. **Suscripción de Azure**: Tener una suscripción activa (puedes usar la capa gratuita)
3. **Acceso al Portal de Azure**: https://portal.azure.com

---

## 🎯 Objetivo

Crear **dos bases de datos PostgreSQL** en Azure:
1. **Base de datos operacional** (`licoreria-db`)
2. **Base de datos DataWarehouse** (`licoreria-dw`)

---

## 🚀 Paso 1: Crear el Servidor PostgreSQL (Operacional)

### 1.1. Acceder al Portal de Azure

1. Ve a [portal.azure.com](https://portal.azure.com)
2. Inicia sesión con tu cuenta

### 1.2. Crear Recurso de Azure Database for PostgreSQL

1. En el portal, haz clic en **"Crear un recurso"** (Create a resource)
2. Busca **"Azure Database for PostgreSQL"**
3. Selecciona **"Azure Database for PostgreSQL flexible server"** (recomendado)
4. Haz clic en **"Crear"**

### 1.3. Configurar el Servidor Flexible

#### Pestaña "Básico"
- **Suscripción**: Selecciona tu suscripción
- **Grupo de recursos**: 
  - Crear nuevo: `licoreria-rg` (o usar existente)
- **Nombre del servidor**: `licoreria-postgres-server` (debe ser único globalmente)
- **Región**: Selecciona la región más cercana (ej: `East US`, `West Europe`)
- **Versión de PostgreSQL**: `15` o `16` (recomendado)
- **Tipo de carga de trabajo**: 
  - **Desarrollo** (para empezar, más económico)
  - **Producción** (para producción)
- **Tamaño de proceso**: 
  - **Burstable B1ms** (1 vCore, 2GB RAM) - Para desarrollo/pruebas
  - **General Purpose** - Para producción
- **Almacenamiento**: 
  - **32 GB** (mínimo, suficiente para empezar)
  - Habilita **"Auto-growth"** (crecimiento automático)

#### Pestaña "Redes"
- **Método de conectividad**: 
  - **Acceso público (direcciones IP permitidas)** (más fácil para empezar)
  - O **Acceso privado (integración de red virtual)** (más seguro para producción)
- **Reglas de firewall**:
  - Habilita **"Permitir acceso público desde cualquier servicio de Azure"** (para Vercel)
  - Agrega tu IP actual: Haz clic en **"+ Agregar dirección IP del cliente actual"**
  - O agrega `0.0.0.0 - 255.255.255.255` temporalmente para desarrollo (⚠️ NO recomendado para producción)

#### Pestaña "Seguridad"
- **Nombre de usuario del administrador**: `postgres` (o el que prefieras)
- **Contraseña**: 
  - Genera una contraseña segura (mínimo 8 caracteres, mayúsculas, minúsculas, números, símbolos)
  - **⚠️ IMPORTANTE**: Guarda esta contraseña, la necesitarás para la connection string
- **Habilitar SSL**: **Sí** (recomendado)

#### Pestaña "Etiquetas" (Opcional
- Agrega etiquetas si lo deseas (ej: `Environment: Development`, `Project: Licoreria`)

#### Revisar y Crear
1. Revisa la configuración
2. Haz clic en **"Revisar + crear"**
3. Espera la validación (puede tardar 1-2 minutos)
4. Haz clic en **"Crear"**

### 1.4. Esperar la Creación

- El proceso puede tardar **5-10 minutos**
- Verás el progreso en las notificaciones
- Cuando termine, haz clic en **"Ir al recurso"**

---

## 🗄️ Paso 2: Crear la Base de Datos Operacional

### 2.1. Acceder al Servidor Creado

1. En el portal, ve a tu servidor PostgreSQL
2. En el menú lateral, busca **"Bases de datos"** (Databases)

### 2.2. Crear Nueva Base de Datos

1. Haz clic en **"+ Agregar"** o **"Crear base de datos"**
2. **Nombre de la base de datos**: `licoreria_db`
3. **Collation**: `en_US.utf8` (o el que prefieras)
4. **Character set**: `UTF8`
5. Haz clic en **"Aceptar"** o **"Crear"**

---

## 🚀 Paso 3: Crear el Segundo Servidor (DataWarehouse)

Repite los pasos 1.2 a 1.4, pero con estas diferencias:

### 3.1. Configuración del Segundo Servidor

- **Nombre del servidor**: `licoreria-dw-postgres-server` (debe ser único)
- **Mismo grupo de recursos**: `licoreria-rg`
- **Misma región**: (para mejor latencia)
- **Mismo tipo de carga de trabajo**: Desarrollo o Producción
- **Mismo tamaño**: Puede ser más pequeño si solo es para analytics
- **Misma contraseña**: O diferente (guarda ambas)

### 3.2. Crear Base de Datos DataWarehouse

1. Ve al segundo servidor
2. Crea la base de datos: `licoreria_dw`

---

## 🔐 Paso 4: Obtener Connection Strings

### 4.1. Para el Servidor Operacional

1. Ve a tu servidor PostgreSQL (`licoreria-postgres-server`)
2. En el menú lateral, busca **"Cadenas de conexión"** (Connection strings)
3. Selecciona **"PostgreSQL"**
4. Copia la connection string, se verá así:
   ```
   postgresql://postgres:[PASSWORD]@licoreria-postgres-server.postgres.database.azure.com:5432/licoreria_db?sslmode=require
   ```
5. Reemplaza `[PASSWORD]` con tu contraseña real

### 4.2. Para el Servidor DataWarehouse

Repite el proceso para el segundo servidor:
```
postgresql://postgres:[PASSWORD]@licoreria-dw-postgres-server.postgres.database.azure.com:5432/licoreria_dw?sslmode=require
```

---

## ⚙️ Paso 5: Configurar Firewall para Vercel

Para que Vercel pueda conectarse, necesitas permitir conexiones desde cualquier IP (o específicas):

### 5.1. Agregar Regla de Firewall

1. En cada servidor, ve a **"Seguridad de red"** (Networking) o **"Firewall rules"**
2. Haz clic en **"+ Agregar dirección IP del cliente actual"** (para tu IP)
3. Para Vercel, agrega una regla:
   - **Nombre**: `Vercel`
   - **IP inicial**: `0.0.0.0`
   - **IP final**: `255.255.255.255`
   - ⚠️ **Nota**: Esto permite acceso desde cualquier IP. Para producción, considera usar IPs específicas de Vercel.

### 5.2. Alternativa: Usar Private Endpoint (Más Seguro)

Para producción, considera usar **Private Endpoint** con **Azure Private Link**:
- Más seguro
- Requiere configuración adicional de red virtual

---

## 📝 Paso 6: Configurar en el Proyecto

### 6.1. Actualizar Variables de Entorno

Edita tu archivo `.env`:

```env
# Azure PostgreSQL (Operacional)
AZURE_DB_URL=postgresql://postgres:[TU_PASSWORD]@licoreria-postgres-server.postgres.database.azure.com:5432/licoreria_db?sslmode=require

# Azure PostgreSQL (DataWarehouse)
AZURE_DW_URL=postgresql://postgres:[TU_PASSWORD]@licoreria-dw-postgres-server.postgres.database.azure.com:5432/licoreria_dw?sslmode=require
```

O usando variables individuales:

```env
# Azure PostgreSQL (Operacional)
AZURE_DB_HOST=licoreria-postgres-server.postgres.database.azure.com
AZURE_DB_PORT=5432
AZURE_DB_NAME=licoreria_db
AZURE_DB_USER=postgres
AZURE_DB_PASSWORD=[TU_PASSWORD]
AZURE_DB_SSL=true

# Azure PostgreSQL (DataWarehouse)
AZURE_DW_HOST=licoreria-dw-postgres-server.postgres.database.azure.com
AZURE_DW_PORT=5432
AZURE_DW_NAME=licoreria_dw
AZURE_DW_USER=postgres
AZURE_DW_PASSWORD=[TU_PASSWORD]
AZURE_DW_SSL=true
```

---

## 💰 Costos Estimados

### Opción Desarrollo (Burstable B1ms)
- **Servidor**: ~$12-15 USD/mes por servidor
- **Almacenamiento**: ~$0.10 USD/GB/mes
- **Total para 2 servidores**: ~$25-30 USD/mes

### Opción Producción (General Purpose)
- **Servidor**: ~$50-100 USD/mes por servidor (depende del tamaño)
- **Almacenamiento**: ~$0.10 USD/GB/mes
- **Total para 2 servidores**: ~$100-200 USD/mes

### 💡 Recomendación
- **Desarrollo**: Usa Burstable B1ms
- **Producción**: Usa General Purpose según tu carga

---

## 🔒 Seguridad Recomendada

1. **Contraseñas fuertes**: Mínimo 16 caracteres, complejas
2. **SSL siempre habilitado**: Azure lo requiere por defecto
3. **Firewall restrictivo**: Solo permitir IPs necesarias
4. **Backups automáticos**: Azure los incluye (configura la retención)
5. **Private Endpoints**: Para producción (más seguro)

---

## 📊 Monitoreo

Azure proporciona:
- **Métricas**: CPU, memoria, conexiones, almacenamiento
- **Logs**: Query logs, error logs
- **Alertas**: Configura alertas para uso de recursos

Accede desde el portal → Tu servidor → **"Métricas"** o **"Logs"**

---

## 🆘 Solución de Problemas

### Error: "No se puede conectar al servidor"
- Verifica las reglas de firewall
- Verifica que SSL esté habilitado
- Verifica la connection string

### Error: "Authentication failed"
- Verifica usuario y contraseña
- Verifica que el usuario tenga permisos

### Error: "Database does not exist"
- Verifica que la base de datos esté creada
- Verifica el nombre en la connection string

---

## 📚 Recursos Adicionales

- [Documentación Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/)
- [Precios de Azure Database for PostgreSQL](https://azure.microsoft.com/pricing/details/postgresql/)
- [Mejores prácticas de seguridad](https://docs.microsoft.com/azure/postgresql/flexible-server/concepts-security)

---

**Última actualización**: 2025-01-15



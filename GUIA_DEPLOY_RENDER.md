# 🚀 Guía de Deployment en Render

Esta guía te ayudará a desplegar tu API NestJS en Render paso a paso.

## 📋 Prerrequisitos

1. ✅ Cuenta en [Render](https://render.com)
2. ✅ Proyecto en [GitHub](https://github.com)
3. ✅ Variables de entorno configuradas localmente
4. ✅ Proyecto compilando correctamente (`npm run build`)

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Verificar Archivos de Configuración

Asegúrate de que estos archivos existan:

- ✅ `render.yaml` - Configuración de Render (opcional pero recomendado)
- ✅ `package.json` con script `start:prod`
- ✅ `.env` con todas las variables necesarias

### 1.2 Verificar que Compila

```bash
npm run build
npm run start:prod
```

Si hay errores, corrígelos antes de continuar.

## 📦 Paso 2: Subir a GitHub

### 2.1 Inicializar Git (si no está inicializado)

```bash
git init
git add .
git commit -m "API lista para Render"
```

### 2.2 Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (ej: `wep-api-la-gata`)
3. **NO** inicialices con README, .gitignore o licencia

### 2.3 Conectar y Subir

```bash
git remote add origin https://github.com/TU_USUARIO/wep-api-la-gata.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 3: Crear Servicio en Render

### 3.1 Crear Cuenta y Nuevo Servicio

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `wep-api-la-gata`

### 3.2 Configurar el Servicio

**Name:** `licoreria-api` (o el nombre que prefieras)

**Environment:** `Node`

**Region:** Selecciona la más cercana (ej: `Oregon (US West)`)

**Branch:** `main`

**Root Directory:** (deja vacío - raíz del proyecto)

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Plan:** 
- **Free** - Para desarrollo/pruebas (se duerme después de 15 min de inactividad)
- **Starter ($7/mes)** - Para producción (siempre activo)

### 3.3 Configurar Variables de Entorno

En la sección **"Environment Variables"**, haz clic en **"Add Environment Variable"** y agrega:

#### PostgreSQL Operacional (Supabase)
```
SUPABASE_DB_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:TU_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### PostgreSQL DataWarehouse (Supabase)
```
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:TU_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### JWT Configuration
```
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600
```

#### App Configuration
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=*
```

#### Rate Limiting
```
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

#### MongoDB (Opcional - cuando lo configures)
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

**⚠️ IMPORTANTE:**
- Reemplaza `TU_PASSWORD` con tus contraseñas reales
- Reemplaza `[PROJECT-REF-DW]` con la referencia de tu proyecto DataWarehouse
- **NO uses comillas** al agregar las variables
- Codifica caracteres especiales en las URLs (ej: `@` → `%40`)

### 3.4 Configurar Health Check (Opcional)

**Health Check Path:** `/`

Render verificará automáticamente que tu aplicación esté funcionando.

### 3.5 Crear el Servicio

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. Esto puede tardar 5-10 minutos la primera vez

## ✅ Paso 4: Verificar el Deployment

### 4.1 Verificar Build

1. Ve a la pestaña **"Logs"** en Render
2. Verifica que el build sea exitoso
3. Busca: `Application is running on: http://0.0.0.0:10000`

### 4.2 Verificar Health Check

Render te dará una URL como:
```
https://licoreria-api.onrender.com
```

Prueba:
```
https://licoreria-api.onrender.com/
```

Deberías ver: `Hello World!`

### 4.3 Verificar Swagger

```
https://licoreria-api.onrender.com/api
```

Deberías ver la documentación de Swagger.

### 4.4 Probar Login

```bash
curl -X POST https://licoreria-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombreUsuario":"admin","password":"admin123"}'
```

## 🔄 Paso 5: Configurar Auto-Deploy

Render está configurado para hacer auto-deploy por defecto:

- ✅ Cada push a `main` desplegará automáticamente
- ✅ Puedes desactivarlo en Settings → Auto-Deploy

## 🔄 Paso 6: Configurar Dominio Personalizado (Opcional)

1. Ve a tu servicio en Render
2. Settings → Custom Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## 🛠️ Solución de Problemas

### Error: "Build failed"

**Causa común:** Variables de entorno faltantes o errores de compilación

**Solución:**
1. Verifica que todas las variables estén en Render
2. Revisa los logs de build en Render
3. Asegúrate de que `npm run build` funcione localmente
4. Verifica que `npm run start:prod` funcione localmente

### Error: "Application failed to start"

**Causa común:** Puerto incorrecto o variables de entorno faltantes

**Solución:**
1. Verifica que `PORT=10000` esté configurado (Render usa el puerto 10000)
2. Verifica que todas las variables de entorno estén configuradas
3. Revisa los logs de runtime en Render

### Error: "Cannot connect to database"

**Causa común:** IP no está en la whitelist de Supabase

**Solución:**
1. Ve a Supabase → Settings → Database
2. Agrega `0.0.0.0/0` temporalmente para pruebas
3. O agrega las IPs de Render (mejor usar `0.0.0.0/0` con autenticación fuerte)

### Aplicación se "duerme" (Plan Free)

**Causa:** Plan Free de Render duerme las aplicaciones después de 15 min de inactividad

**Solución:**
1. La primera petición después de dormir puede tardar 30-60 segundos
2. Considera actualizar al plan Starter ($7/mes) para producción
3. O usa un servicio de "ping" para mantener la app activa

### Error: "Module not found"

**Causa común:** Dependencias faltantes o problemas de build

**Solución:**
1. Verifica que `package.json` tenga todas las dependencias
2. Ejecuta `npm install` localmente y verifica que no haya errores
3. Revisa los logs de build en Render

## 📊 Monitoreo

### Ver Logs en Render

1. Ve a tu servicio en Render
2. Haz clic en la pestaña **"Logs"**
3. Verás los logs en tiempo real

### Métricas

Render proporciona métricas de:
- CPU Usage
- Memory Usage
- Request Count
- Response Time

## 🔒 Seguridad en Producción

### 1. Variables de Entorno

- ✅ Nunca subas `.env` a Git
- ✅ Usa variables de entorno de Render
- ✅ Rota las contraseñas regularmente

### 2. CORS

Actualiza `CORS_ORIGIN` en Render con tu dominio de producción:
```
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```

### 3. Rate Limiting

Ajusta según tus necesidades:
```
THROTTLE_LIMIT=200  # Aumentar para producción
```

### 4. JWT Secret

Usa un secret fuerte y único:
```bash
# Generar secret aleatorio
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📝 Checklist de Deployment

- [ ] Proyecto subido a GitHub
- [ ] Repositorio conectado con Render
- [ ] Variables de entorno configuradas en Render
- [ ] Build exitoso en Render
- [ ] Health check funcionando
- [ ] Swagger accesible
- [ ] Login funcionando
- [ ] Endpoints de catálogos funcionando
- [ ] Endpoints de transacciones funcionando
- [ ] Endpoints de Analytics funcionando
- [ ] Dominio personalizado configurado (opcional)
- [ ] CORS configurado para producción
- [ ] Monitoreo configurado

## 💰 Planes de Render

### Free Plan
- ✅ Gratis
- ⚠️ Se duerme después de 15 min de inactividad
- ✅ 750 horas/mes
- ✅ Ideal para desarrollo/pruebas

### Starter Plan ($7/mes)
- ✅ Siempre activo
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Ideal para producción pequeña

### Standard Plan ($25/mes)
- ✅ Siempre activo
- ✅ 2 GB RAM
- ✅ 1 CPU
- ✅ Ideal para producción media

## 🎯 Próximos Pasos

1. **Configurar Auto-Deploy:** Ya está activo por defecto
2. **Configurar Alertas:** Recibe notificaciones de errores
3. **Optimizar Performance:** Revisa métricas y optimiza queries lentas
4. **Configurar Backup:** Configura backups de base de datos

## 📚 Recursos

- [Documentación de Render](https://render.com/docs)
- [Node.js en Render](https://render.com/docs/node-version)
- [Variables de Entorno en Render](https://render.com/docs/environment-variables)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica las variables de entorno
3. Prueba localmente con las mismas configuraciones
4. Consulta la [documentación de Render](https://render.com/docs)


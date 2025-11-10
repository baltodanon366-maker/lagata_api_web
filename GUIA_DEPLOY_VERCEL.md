# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar tu API NestJS en Vercel paso a paso.

## 📋 Prerrequisitos

1. ✅ Cuenta en [Vercel](https://vercel.com)
2. ✅ Proyecto en [GitHub](https://github.com)
3. ✅ Variables de entorno configuradas localmente
4. ✅ Proyecto compilando correctamente (`npm run build`)

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Verificar Archivos de Configuración

Asegúrate de que estos archivos existan:

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `api/index.ts` - Entry point para serverless functions
- ✅ `.vercelignore` - Archivos a ignorar en el deployment
- ✅ `package.json` con script `vercel-build`

### 1.2 Verificar que Compila

```bash
npm run build
```

Si hay errores, corrígelos antes de continuar.

## 📦 Paso 2: Subir a GitHub

### 2.1 Inicializar Git (si no está inicializado)

```bash
git init
git add .
git commit -m "Initial commit - API lista para Vercel"
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

## 🌐 Paso 3: Conectar con Vercel

### 3.1 Crear Proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Node.js

### 3.2 Configurar el Proyecto

**Framework Preset:** Otro (o deja en blanco)

**Root Directory:** `./` (raíz del proyecto)

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

### 3.3 Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega todas las variables de tu `.env`:

#### PostgreSQL Operacional
```
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### PostgreSQL DataWarehouse
```
SUPABASE_DW_URL=postgresql://postgres:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### JWT Configuration
```
JWT_SECRET=tu-secret-key-super-segura-aqui
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600
```

#### App Configuration
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

#### Rate Limiting
```
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

#### MongoDB (Opcional - cuando lo configures)
```
MONGODB_URI=mongodb+srv://...
MONGODB_DATABASE=licoreria_db
```

**⚠️ IMPORTANTE:**
- Reemplaza `[PASSWORD]` con tus contraseñas reales
- No uses comillas en las variables de entorno de Vercel
- Asegúrate de codificar caracteres especiales en las URLs

### 3.4 Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (puede tardar 2-5 minutos)
3. Si hay errores, revisa los logs en Vercel

## ✅ Paso 4: Verificar el Deployment

### 4.1 Verificar Health Check

Una vez desplegado, Vercel te dará una URL como:
```
https://wep-api-la-gata.vercel.app
```

Prueba:
```
https://wep-api-la-gata.vercel.app/
```

Deberías ver: `Hello World!`

### 4.2 Verificar Swagger

```
https://wep-api-la-gata.vercel.app/api
```

Deberías ver la documentación de Swagger.

### 4.3 Probar Login

```bash
curl -X POST https://wep-api-la-gata.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombreUsuario":"admin","password":"admin123"}'
```

## 🔄 Paso 5: Configurar Dominio Personalizado (Opcional)

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## 🛠️ Solución de Problemas

### Error: "Build failed"

**Causa común:** Variables de entorno faltantes

**Solución:**
1. Verifica que todas las variables estén en Vercel
2. Revisa los logs de build en Vercel
3. Asegúrate de que `npm run build` funcione localmente

### Error: "Function timeout"

**Causa común:** Queries lentas o conexiones de base de datos

**Solución:**
1. Verifica que las conexiones a Supabase usen el Session Pooler
2. Optimiza las queries lentas
3. Considera aumentar `maxDuration` en `vercel.json`

### Error: "Cannot connect to database"

**Causa común:** IP no está en la whitelist de Supabase

**Solución:**
1. Ve a Supabase → Settings → Database
2. Agrega `0.0.0.0/0` temporalmente para pruebas (no recomendado para producción)
3. O agrega las IPs de Vercel (Vercel usa IPs dinámicas, mejor usar `0.0.0.0/0` con autenticación fuerte)

### Error: "Module not found"

**Causa común:** Dependencias faltantes o problemas de build

**Solución:**
1. Verifica que `package.json` tenga todas las dependencias
2. Ejecuta `npm install` localmente y verifica que no haya errores
3. Revisa que `.vercelignore` no esté excluyendo archivos necesarios

## 📊 Monitoreo

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Haz clic en **"Functions"** → Selecciona una función
3. Verás los logs en tiempo real

### Métricas

Vercel proporciona métricas de:
- Requests por segundo
- Tiempo de respuesta
- Errores
- Ancho de banda

## 🔒 Seguridad en Producción

### 1. Variables de Entorno

- ✅ Nunca subas `.env` a Git
- ✅ Usa variables de entorno de Vercel
- ✅ Rota las contraseñas regularmente

### 2. CORS

Actualiza `CORS_ORIGIN` en Vercel con tu dominio de producción:
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
- [ ] Repositorio conectado con Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Build exitoso en Vercel
- [ ] Health check funcionando
- [ ] Swagger accesible
- [ ] Login funcionando
- [ ] Endpoints de catálogos funcionando
- [ ] Endpoints de transacciones funcionando
- [ ] Endpoints de Analytics funcionando
- [ ] Dominio personalizado configurado (opcional)
- [ ] CORS configurado para producción
- [ ] Monitoreo configurado

## 🎯 Próximos Pasos

1. **Configurar CI/CD:** Cada push a `main` desplegará automáticamente
2. **Configurar Preview Deployments:** Cada PR creará un preview deployment
3. **Configurar Alertas:** Recibe notificaciones de errores
4. **Optimizar Performance:** Revisa métricas y optimiza queries lentas

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [NestJS en Vercel](https://vercel.com/guides/deploying-nestjs-with-vercel)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)


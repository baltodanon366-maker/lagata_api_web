# ☁️ Configuración: Supabase + Vercel

## 📋 Resumen

- **Base de Datos**: Supabase (PostgreSQL managed)
- **Deployment**: Vercel (serverless)
- **CI/CD**: GitHub → Vercel (automático)

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear Proyectos en Supabase

#### Proyecto 1: Base de Datos Operacional
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto: `licoreria-operacional`
3. Anotar:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **Project Reference**: `[PROJECT-REF]`
   - **Database Password**: (la que configuraste)

#### Proyecto 2: Base de Datos DataWarehouse
1. Crear segundo proyecto: `licoreria-datawarehouse`
2. O usar segunda base de datos en el mismo proyecto (más económico)
3. Anotar las mismas credenciales

### Paso 2: Obtener Connection Strings

#### Para Base de Datos Operacional
1. En Supabase Dashboard → Settings → Database
2. Buscar "Connection string" → "URI"
3. Copiar connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```
4. Reemplazar `[YOUR-PASSWORD]` con tu password real

#### Para DataWarehouse
Mismo proceso con el segundo proyecto.

### Paso 3: Configurar Variables de Entorno

#### Desarrollo Local (.env)
```env
# Supabase Operacional
SUPABASE_DB_URL=postgresql://postgres:TU_PASSWORD@TU_PROJECT_REF.supabase.co:5432/postgres?sslmode=require

# Supabase DataWarehouse
SUPABASE_DW_URL=postgresql://postgres:TU_PASSWORD@TU_PROJECT_REF_DW.supabase.co:5432/postgres?sslmode=require

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=LicoreriaMongoDB

# JWT
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600
```

#### Producción (Vercel)
Configurar en Vercel Dashboard → Settings → Environment Variables

---

## 🚀 Configuración de Vercel

### Paso 1: Preparar Proyecto para Vercel

#### 1. Crear `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 2. Crear `api/index.ts` (Entry point para serverless)
```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import * as serverless from 'serverless-http';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    app.enableCors();
    await app.init();
    
    cachedServer = serverless(expressApp);
  }
  
  return cachedServer;
}

export const handler = async (event: any, context: any) => {
  const server = await bootstrap();
  return server(event, context);
};
```

#### 3. Actualizar `package.json`
```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "vercel-build": "npm run build"
  }
}
```

### Paso 2: Conectar con GitHub

1. Ir a [vercel.com](https://vercel.com)
2. Login con GitHub
3. Click en "Add New Project"
4. Seleccionar el repositorio de GitHub
5. Configurar:
   - **Framework Preset**: Other
   - **Root Directory**: `./wep_api_la_gata`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Paso 3: Configurar Variables de Entorno en Vercel

1. En Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agregar todas las variables:
   - `SUPABASE_DB_URL`
   - `SUPABASE_DW_URL`
   - `MONGODB_URI`
   - `MONGODB_DATABASE`
   - `JWT_SECRET`
   - `JWT_ISSUER`
   - `JWT_AUDIENCE`
   - `JWT_EXPIRATION`
   - `NODE_ENV=production`

3. Configurar para:
   - **Production**: ✅
   - **Preview**: ✅ (opcional)
   - **Development**: ❌ (usar .env local)

### Paso 4: Configurar Build Settings

En Vercel Dashboard → Settings → General:
- **Node.js Version**: 18.x o 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 🔧 Configuración de TypeORM para Supabase

### Connection Pooling
Supabase incluye connection pooling automático. Usar el connection string directo:

```typescript
// src/database/postgresql/data-source.ts
import { DataSource } from 'typeorm';

export const operationalDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DB_URL, // Connection string completo
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Nunca true en producción
  ssl: {
    rejectUnauthorized: false, // Supabase requiere SSL
  },
  extra: {
    max: 20, // Máximo de conexiones en pool
    connectionTimeoutMillis: 2000,
  },
});

export const datawarehouseDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DW_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    max: 20,
    connectionTimeoutMillis: 2000,
  },
});
```

---

## 📝 Consideraciones Importantes

### Supabase
- ✅ **SSL requerido**: Siempre usar `sslmode=require`
- ✅ **Connection pooling**: Incluido automáticamente
- ✅ **Límites**: Revisar plan de Supabase (conexiones, storage, etc.)
- ✅ **Backups**: Automáticos (configurar frecuencia según plan)

### Vercel
- ✅ **Serverless**: Cada request es una función serverless
- ✅ **Cold starts**: Primera request puede ser más lenta
- ✅ **Timeout**: 10 segundos (Hobby), 60 segundos (Pro)
- ✅ **Memory**: 1024 MB por defecto
- ✅ **Environment Variables**: Configurar en dashboard

### NestJS en Vercel
- ✅ **Caching**: Cachear la aplicación NestJS para evitar cold starts
- ✅ **Express Adapter**: Usar ExpressAdapter para mejor compatibilidad
- ✅ **Build**: Compilar a JavaScript antes de deploy

---

## 🧪 Testing Local con Supabase

### 1. Instalar Supabase CLI (opcional)
```bash
npm install -g supabase
```

### 2. Conectar a Supabase localmente
```bash
supabase link --project-ref [PROJECT-REF]
```

### 3. Probar conexión
```typescript
// test-connection.ts
import { operationalDataSource } from './src/database/postgresql/data-source';

async function test() {
  try {
    await operationalDataSource.initialize();
    console.log('✅ Connected to Supabase!');
    await operationalDataSource.destroy();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

test();
```

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/recipes/serverless)
- [TypeORM PostgreSQL](https://typeorm.io/data-source-options#postgres--cockroachdb-data-source-options)

---

**Última actualización**: 2025-01-15


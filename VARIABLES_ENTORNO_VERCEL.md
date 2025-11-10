# 🔐 Variables de Entorno para Vercel

Copia y pega estas variables en Vercel → Settings → Environment Variables

## 📋 Lista Completa de Variables

### PostgreSQL Operacional (Supabase)
```
SUPABASE_DB_URL=postgresql://postgres.nkwzqgnsvzqnbnpvzbrc:TU_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### PostgreSQL DataWarehouse (Supabase)
```
SUPABASE_DW_URL=postgresql://postgres.[PROJECT-REF-DW]:TU_PASSWORD@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### JWT Configuration
```
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong
JWT_ISSUER=LicoreriaAPI
JWT_AUDIENCE=LicoreriaAPIUsers
JWT_EXPIRATION=3600
```

### App Configuration
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

### Rate Limiting
```
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

### MongoDB (Opcional - cuando lo configures)
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

## ⚠️ Instrucciones

1. **Reemplaza `TU_PASSWORD`** con tus contraseñas reales de Supabase
2. **Reemplaza `[PROJECT-REF-DW]`** con la referencia de tu proyecto DataWarehouse
3. **Genera un JWT_SECRET seguro:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
4. **No uses comillas** al agregar las variables en Vercel
5. **Codifica caracteres especiales** en las URLs (ej: `@` → `%40`)

## 🔒 Seguridad

- ✅ Nunca subas estas variables a Git
- ✅ Usa diferentes secrets para producción
- ✅ Rota las contraseñas regularmente
- ✅ Limita `CORS_ORIGIN` a tus dominios específicos en producción

## 📝 Para Producción

Actualiza `CORS_ORIGIN` con tus dominios:
```
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```


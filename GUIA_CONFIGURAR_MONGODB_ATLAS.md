# 🍃 Guía para Configurar MongoDB Atlas

Esta guía te ayudará a configurar MongoDB Atlas y conectarlo con tu API.

## 📋 Pasos para Configurar

### 1. Obtener la Cadena de Conexión

1. Ve a tu proyecto en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Selecciona **"Node.js"** como driver
5. Selecciona la versión **"5.5 or later"**
6. Copia la cadena de conexión que aparece (algo como):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Configurar Variables de Entorno

Abre tu archivo `.env` y agrega las siguientes variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

**Reemplaza:**
- `TU_USUARIO` con el nombre de usuario de tu base de datos MongoDB
- `TU_PASSWORD` con la contraseña del usuario (si tiene caracteres especiales, codifícalos en URL)
- `cluster0.xxxxx` con el nombre real de tu cluster
- `licoreria_db` con el nombre que quieras para tu base de datos (MongoDB la creará automáticamente)

**Ejemplo:**
```env
MONGODB_URI=mongodb+srv://licoreria_user:MiPassword123%21@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

### 3. Codificar Caracteres Especiales en la Contraseña

Si tu contraseña tiene caracteres especiales, debes codificarlos en URL:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (espacio) → `%20`

**Ejemplo:**
- Contraseña: `Mi@Pass#123`
- Codificada: `Mi%40Pass%23123`

### 4. Verificar la Conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```

2. Deberías ver en la consola:
   ```
   ✅ Connected to MongoDB
   ```

3. Si ves un error, verifica:
   - Que la contraseña esté correcta (y codificada si tiene caracteres especiales)
   - Que tu IP esté en la whitelist de MongoDB Atlas
   - Que la cadena de conexión esté completa

## 📊 Colecciones (No necesitas crearlas manualmente)

En MongoDB, las "tablas" se llaman **"colecciones"** y se crean automáticamente cuando insertas el primer documento. Tu API creará automáticamente estas colecciones:

### 1. `notifications` (Notificaciones)
- Se crea automáticamente al crear la primera notificación
- Índices:
  - `{ UsuarioId: 1, Leida: 1 }` - Para búsquedas por usuario y estado
  - `{ FechaCreacion: -1 }` - Para ordenamiento por fecha
  - `{ Tipo: 1 }` - Para búsquedas por tipo

### 2. `logs` (Logs del Sistema)
- Se crea automáticamente al crear el primer log
- Índices:
  - `{ FechaCreacion: -1 }` - Para ordenamiento por fecha
  - `{ Nivel: 1, FechaCreacion: -1 }` - Para búsquedas por nivel
  - `{ Modulo: 1, FechaCreacion: -1 }` - Para búsquedas por módulo
  - `{ UsuarioId: 1, FechaCreacion: -1 }` - Para búsquedas por usuario
  - `{ Endpoint: 1, FechaCreacion: -1 }` - Para búsquedas por endpoint

## 🔍 Verificar que Todo Funcione

### Opción 1: Usando Swagger

1. Inicia el servidor: `npm run start:dev`
2. Abre Swagger: `http://localhost:3000/api`
3. Haz login para obtener un token JWT
4. Prueba crear una notificación:
   - `POST /mongodb/notificaciones`
   - Debería crear la colección automáticamente

### Opción 2: Usando MongoDB Atlas UI

1. Ve a tu proyecto en MongoDB Atlas
2. Haz clic en **"Browse Collections"**
3. Después de usar la API, deberías ver las colecciones `notifications` y `logs`

### Opción 3: Script de Verificación

Puedes usar este script para verificar la conexión:

```bash
npm run start:dev
```

Luego prueba estos endpoints en Swagger:
- `POST /mongodb/notificaciones` - Crear notificación (crea la colección)
- `POST /mongodb/logs` - Crear log (crea la colección)

## 🛠️ Crear Colecciones Manualmente (Opcional)

Si quieres crear las colecciones manualmente antes de usarlas:

1. Ve a MongoDB Atlas → **"Browse Collections"**
2. Haz clic en **"Create Database"**
3. Nombre de la base de datos: `licoreria_db` (o el que configuraste)
4. Nombre de la colección: `notifications`
5. Haz clic en **"Create"**
6. Repite para la colección `logs`

**Nota**: Esto es opcional, ya que las colecciones se crean automáticamente.

## 📝 Ejemplo de Uso

Una vez configurado, puedes usar los endpoints:

### Crear Notificación
```bash
POST /mongodb/notificaciones
{
  "usuarioId": 1,
  "tipo": "Sistema",
  "titulo": "Bienvenido",
  "mensaje": "Bienvenido al sistema",
  "nivel": "info"
}
```

### Crear Log
```bash
POST /mongodb/logs
{
  "nivel": "info",
  "mensaje": "Usuario inició sesión",
  "modulo": "Auth",
  "accion": "Login",
  "usuarioId": 1
}
```

## ✅ Checklist

- [ ] Cadena de conexión obtenida de MongoDB Atlas
- [ ] Variables `MONGODB_URI` y `MONGODB_DATABASE` agregadas al `.env`
- [ ] Contraseña codificada si tiene caracteres especiales
- [ ] IP agregada a la whitelist de MongoDB Atlas
- [ ] Servidor reiniciado
- [ ] Mensaje "✅ Connected to MongoDB" en la consola
- [ ] Endpoints de MongoDB funcionando en Swagger

## 🔒 Seguridad

- **Nunca** subas el archivo `.env` a Git
- Usa contraseñas seguras para el usuario de MongoDB
- Restringe el acceso de IP solo a los servidores necesarios
- En producción, usa variables de entorno del servidor (Vercel, etc.)

## 🆘 Solución de Problemas

### Error: "MongooseServerSelectionError"
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Verifica que la contraseña esté correcta
- Verifica que la cadena de conexión esté completa

### Error: "Authentication failed"
- Verifica que el usuario y contraseña sean correctos
- Asegúrate de codificar caracteres especiales en la contraseña

### Error: "Connection timeout"
- Verifica que tu IP esté en la whitelist
- Verifica tu conexión a internet
- Intenta usar la IP `0.0.0.0/0` temporalmente para pruebas (no recomendado para producción)


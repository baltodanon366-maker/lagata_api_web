# 🍃 Guía para Configurar MongoDB Atlas

Esta guía te ayudará a crear un proyecto en MongoDB Atlas y obtener la cadena de conexión para agregarla al archivo `.env`.

## 📋 Pasos para Configurar MongoDB Atlas

### 1. Crear cuenta en MongoDB Atlas

1. Ve a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Haz clic en **"Try Free"** o **"Sign Up"**
3. Completa el registro con tu email

### 2. Crear un Cluster

1. Una vez dentro del dashboard, haz clic en **"Build a Database"**
2. Selecciona el plan **FREE (M0)** - es suficiente para desarrollo
3. Selecciona tu proveedor de nube (AWS, Google Cloud, o Azure)
4. Selecciona la región más cercana a tu ubicación
5. Deja el nombre del cluster como está (o cámbialo si quieres)
6. Haz clic en **"Create"**

### 3. Configurar Acceso a la Base de Datos

#### 3.1. Crear Usuario de Base de Datos

1. En el dashboard, ve a **"Database Access"** (en el menú lateral)
2. Haz clic en **"Add New Database User"**
3. Selecciona **"Password"** como método de autenticación
4. Ingresa un **Username** (ejemplo: `licoreria_user`)
5. Genera una contraseña segura o crea una propia
6. **IMPORTANTE**: Guarda la contraseña, la necesitarás después
7. En **"Database User Privileges"**, selecciona **"Read and write to any database"**
8. Haz clic en **"Add User"**

#### 3.2. Configurar Acceso de Red (IP Whitelist)

1. En el dashboard, ve a **"Network Access"** (en el menú lateral)
2. Haz clic en **"Add IP Address"**
3. Para desarrollo local, haz clic en **"Add Current IP Address"**
4. Para permitir acceso desde cualquier lugar (solo para desarrollo), puedes usar `0.0.0.0/0` ⚠️ **No recomendado para producción**
5. Haz clic en **"Confirm"**

### 4. Obtener la Cadena de Conexión

1. En el dashboard, ve a **"Database"** (en el menú lateral)
2. Haz clic en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Selecciona **"Node.js"** como driver
5. Selecciona la versión **"5.5 or later"**
5. Copia la cadena de conexión que aparece (algo como):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Configurar en el Proyecto

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://licoreria_user:TU_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

**Reemplaza:**
- `TU_PASSWORD` con la contraseña del usuario que creaste
- `cluster0.xxxxx` con el nombre real de tu cluster
- `licoreria_db` con el nombre que quieras para tu base de datos (MongoDB la creará automáticamente)

### 6. Verificar la Conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```

2. Deberías ver en la consola:
   ```
   ✅ Connected to MongoDB
   ```

3. Si ves un error, verifica:
   - Que la contraseña esté correcta (sin caracteres especiales codificados)
   - Que tu IP esté en la whitelist
   - Que la cadena de conexión esté completa

## 🔒 Seguridad

- **Nunca** subas el archivo `.env` a Git
- **Nunca** uses `0.0.0.0/0` en producción
- Usa contraseñas seguras para el usuario de base de datos
- En producción, restringe el acceso de IP solo a los servidores que necesiten acceso

## 📝 Ejemplo de Cadena de Conexión Completa

```env
MONGODB_URI=mongodb+srv://licoreria_user:MiPassword123!@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=licoreria_db
```

## ✅ Verificación

Una vez configurado, puedes probar los endpoints de MongoDB en Swagger:

- `POST /mongodb/notificaciones` - Crear notificación
- `GET /mongodb/notificaciones` - Listar notificaciones
- `POST /mongodb/logs` - Crear log
- `GET /mongodb/logs` - Listar logs

Si MongoDB no está configurado, estos endpoints retornarán un error 503 con un mensaje claro.


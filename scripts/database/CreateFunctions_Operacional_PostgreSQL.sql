-- =============================================
-- FUNCIONES PostgreSQL - Base de Datos Operacional
-- Adaptado de SQL Server Stored Procedures
-- Base de Datos: PostgreSQL (Supabase)
-- =============================================

-- =============================================
-- 1. FUNCIONES DE SEGURIDAD
-- =============================================

-- fn_Usuario_Login: Autenticar usuario
CREATE OR REPLACE FUNCTION fn_Usuario_Login(
    p_nombre_usuario VARCHAR(100),
    p_password_hash VARCHAR(500)
)
RETURNS TABLE (
    "Id" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "Email" VARCHAR(200),
    "NombreCompleto" VARCHAR(200),
    "Rol" VARCHAR(50),
    "Activo" BOOLEAN,
    "UltimoAcceso" TIMESTAMP
) AS $$
BEGIN
    -- Actualizar último acceso
    UPDATE "Usuarios"
    SET "UltimoAcceso" = CURRENT_TIMESTAMP
    WHERE "NombreUsuario" = p_nombre_usuario;
    
    -- Retornar usuario
    RETURN QUERY
    SELECT 
        u."Id",
        u."NombreUsuario",
        u."Email",
        u."NombreCompleto",
        u."Rol",
        u."Activo",
        u."UltimoAcceso"
    FROM "Usuarios" u
    WHERE u."NombreUsuario" = p_nombre_usuario
      AND u."PasswordHash" = p_password_hash
      AND u."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Usuario_Registrar: Crear nuevo usuario
CREATE OR REPLACE FUNCTION fn_Usuario_Registrar(
    p_nombre_usuario VARCHAR(100),
    p_email VARCHAR(200),
    p_password_hash VARCHAR(500),
    p_nombre_completo VARCHAR(200),
    p_rol VARCHAR(50) DEFAULT 'Vendedor',
    OUT p_usuario_id INTEGER
) AS $$
BEGIN
    -- Verificar si el usuario ya existe
    IF EXISTS (SELECT 1 FROM "Usuarios" WHERE "NombreUsuario" = p_nombre_usuario OR "Email" = p_email) THEN
        p_usuario_id := -1; -- Error: Usuario ya existe
        RETURN;
    END IF;
    
    -- Insertar usuario
    INSERT INTO "Usuarios" ("NombreUsuario", "Email", "PasswordHash", "NombreCompleto", "Rol", "Activo")
    VALUES (p_nombre_usuario, p_email, p_password_hash, p_nombre_completo, p_rol, true)
    RETURNING "Id" INTO p_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Usuario_ActualizarPassword: Actualizar contraseña
CREATE OR REPLACE FUNCTION fn_Usuario_ActualizarPassword(
    p_usuario_id INTEGER,
    p_password_hash_anterior VARCHAR(500),
    p_password_hash_nuevo VARCHAR(500),
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    -- Verificar contraseña anterior
    IF EXISTS (SELECT 1 FROM "Usuarios" WHERE "Id" = p_usuario_id AND "PasswordHash" = p_password_hash_anterior) THEN
        UPDATE "Usuarios"
        SET "PasswordHash" = p_password_hash_nuevo,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_usuario_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Usuario_AsignarRol: Asignar rol a usuario
CREATE OR REPLACE FUNCTION fn_Usuario_AsignarRol(
    p_usuario_id INTEGER,
    p_rol_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    p_resultado := false;
    
    -- Verificar que el usuario y rol existen
    IF EXISTS (SELECT 1 FROM "Usuarios" WHERE "Id" = p_usuario_id)
       AND EXISTS (SELECT 1 FROM "Roles" WHERE "Id" = p_rol_id) THEN
        
        -- Obtener nombre del rol
        SELECT "Nombre" INTO v_rol_nombre FROM "Roles" WHERE "Id" = p_rol_id;
        
        -- Eliminar roles anteriores
        DELETE FROM "UsuariosRoles" WHERE "UsuarioId" = p_usuario_id;
        
        -- Asignar nuevo rol
        INSERT INTO "UsuariosRoles" ("UsuarioId", "RolId")
        VALUES (p_usuario_id, p_rol_id);
        
        -- Actualizar rol en Usuarios
        UPDATE "Usuarios"
        SET "Rol" = v_rol_nombre,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_usuario_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Usuario_ObtenerPermisos: Obtener permisos de un usuario
CREATE OR REPLACE FUNCTION fn_Usuario_ObtenerPermisos(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Modulo" VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Modulo"
    FROM "Permisos" p
    INNER JOIN "RolesPermisos" rp ON p."Id" = rp."PermisoId"
    INNER JOIN "UsuariosRoles" ur ON rp."RolId" = ur."RolId"
    WHERE ur."UsuarioId" = p_usuario_id
      AND p."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. FUNCIONES PARA CATÁLOGOS - PROVEEDORES
-- =============================================

-- fn_Proveedor_Crear
CREATE OR REPLACE FUNCTION fn_Proveedor_Crear(
    p_codigo_proveedor VARCHAR(50),
    p_nombre VARCHAR(200),
    p_razon_social VARCHAR(300) DEFAULT NULL,
    p_rfc VARCHAR(50) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_telefono VARCHAR(50) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    OUT p_proveedor_id INTEGER
) AS $$
BEGIN
    -- Verificar si el código ya existe
    IF EXISTS (SELECT 1 FROM "Proveedores" WHERE "CodigoProveedor" = p_codigo_proveedor) THEN
        p_proveedor_id := -1; -- Error: Código ya existe
        RETURN;
    END IF;
    
    INSERT INTO "Proveedores" ("CodigoProveedor", "Nombre", "RazonSocial", "RFC", "Direccion", "Telefono", "Email", "Activo")
    VALUES (p_codigo_proveedor, p_nombre, p_razon_social, p_rfc, p_direccion, p_telefono, p_email, true)
    RETURNING "Id" INTO p_proveedor_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_Editar
CREATE OR REPLACE FUNCTION fn_Proveedor_Editar(
    p_proveedor_id INTEGER,
    p_nombre VARCHAR(200),
    p_razon_social VARCHAR(300) DEFAULT NULL,
    p_rfc VARCHAR(50) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_telefono VARCHAR(50) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = p_proveedor_id) THEN
        UPDATE "Proveedores"
        SET "Nombre" = p_nombre,
            "RazonSocial" = p_razon_social,
            "RFC" = p_rfc,
            "Direccion" = p_direccion,
            "Telefono" = p_telefono,
            "Email" = p_email,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_proveedor_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Activo" = true
    ORDER BY p."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_Activar
CREATE OR REPLACE FUNCTION fn_Proveedor_Activar(
    p_proveedor_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = p_proveedor_id) THEN
        UPDATE "Proveedores"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_proveedor_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_Desactivar
CREATE OR REPLACE FUNCTION fn_Proveedor_Desactivar(
    p_proveedor_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = p_proveedor_id) THEN
        UPDATE "Proveedores"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_proveedor_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Activo" = true
    ORDER BY p."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarActivosPorId(
    p_proveedor_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Id" = p_proveedor_id
      AND p."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarActivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Activo" = true
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Activo" = false
    ORDER BY p."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarInactivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Activo" = false
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Proveedor_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Proveedor_MostrarInactivosPorId(
    p_proveedor_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoProveedor" VARCHAR(50),
    "Nombre" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."CodigoProveedor",
        p."Nombre",
        p."RazonSocial",
        p."RFC",
        p."Direccion",
        p."Telefono",
        p."Email",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Proveedores" p
    WHERE p."Id" = p_proveedor_id
      AND p."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 3. FUNCIONES PARA CATÁLOGOS - CLIENTES
-- =============================================

-- fn_Cliente_Crear
CREATE OR REPLACE FUNCTION fn_Cliente_Crear(
    p_codigo_cliente VARCHAR(50),
    p_nombre_completo VARCHAR(200),
    p_razon_social VARCHAR(300) DEFAULT NULL,
    p_rfc VARCHAR(50) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_telefono VARCHAR(50) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    OUT p_cliente_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Clientes" WHERE "CodigoCliente" = p_codigo_cliente) THEN
        p_cliente_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "Clientes" ("CodigoCliente", "NombreCompleto", "RazonSocial", "RFC", "Direccion", "Telefono", "Email", "Activo")
    VALUES (p_codigo_cliente, p_nombre_completo, p_razon_social, p_rfc, p_direccion, p_telefono, p_email, true)
    RETURNING "Id" INTO p_cliente_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_Editar
CREATE OR REPLACE FUNCTION fn_Cliente_Editar(
    p_cliente_id INTEGER,
    p_nombre_completo VARCHAR(200),
    p_razon_social VARCHAR(300) DEFAULT NULL,
    p_rfc VARCHAR(50) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_telefono VARCHAR(50) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Clientes" WHERE "Id" = p_cliente_id) THEN
        UPDATE "Clientes"
        SET "NombreCompleto" = p_nombre_completo,
            "RazonSocial" = p_razon_social,
            "RFC" = p_rfc,
            "Direccion" = p_direccion,
            "Telefono" = p_telefono,
            "Email" = p_email,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_cliente_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_Activar
CREATE OR REPLACE FUNCTION fn_Cliente_Activar(
    p_cliente_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Clientes" WHERE "Id" = p_cliente_id) THEN
        UPDATE "Clientes"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_cliente_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_Desactivar
CREATE OR REPLACE FUNCTION fn_Cliente_Desactivar(
    p_cliente_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Clientes" WHERE "Id" = p_cliente_id) THEN
        UPDATE "Clientes"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_cliente_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Activo" = true
    ORDER BY c."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarActivosPorId(
    p_cliente_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Id" = p_cliente_id
      AND c."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarActivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Activo" = true
      AND c."NombreCompleto" ILIKE '%' || p_nombre || '%'
    ORDER BY c."NombreCompleto"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Activo" = false
    ORDER BY c."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarInactivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Activo" = false
      AND c."NombreCompleto" ILIKE '%' || p_nombre || '%'
    ORDER BY c."NombreCompleto"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Cliente_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Cliente_MostrarInactivosPorId(
    p_cliente_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "CodigoCliente" VARCHAR(50),
    "NombreCompleto" VARCHAR(200),
    "RazonSocial" VARCHAR(300),
    "RFC" VARCHAR(50),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(50),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."CodigoCliente",
        c."NombreCompleto",
        c."RazonSocial",
        c."RFC",
        c."Direccion",
        c."Telefono",
        c."Email",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Clientes" c
    WHERE c."Id" = p_cliente_id
      AND c."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. FUNCIONES PARA CATÁLOGOS - EMPLEADOS
-- =============================================

-- fn_Empleado_Crear
CREATE OR REPLACE FUNCTION fn_Empleado_Crear(
    p_codigo_empleado VARCHAR(20),
    p_nombre_completo VARCHAR(200),
    p_fecha_ingreso DATE,
    p_usuario_id INTEGER DEFAULT NULL,
    p_telefono VARCHAR(20) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_fecha_nacimiento DATE DEFAULT NULL,
    p_salario NUMERIC(18,2) DEFAULT NULL,
    p_departamento VARCHAR(100) DEFAULT NULL,
    p_puesto VARCHAR(100) DEFAULT NULL,
    OUT p_empleado_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Empleados" WHERE "CodigoEmpleado" = p_codigo_empleado) THEN
        p_empleado_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "Empleados" ("UsuarioId", "CodigoEmpleado", "NombreCompleto", "Telefono", "Email", "Direccion", "FechaNacimiento", "FechaIngreso", "Salario", "Departamento", "Puesto", "Activo")
    VALUES (p_usuario_id, p_codigo_empleado, p_nombre_completo, p_telefono, p_email, p_direccion, p_fecha_nacimiento, p_fecha_ingreso, p_salario, p_departamento, p_puesto, true)
    RETURNING "Id" INTO p_empleado_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_Editar
CREATE OR REPLACE FUNCTION fn_Empleado_Editar(
    p_empleado_id INTEGER,
    p_nombre_completo VARCHAR(200),
    p_telefono VARCHAR(20) DEFAULT NULL,
    p_email VARCHAR(200) DEFAULT NULL,
    p_direccion VARCHAR(500) DEFAULT NULL,
    p_fecha_nacimiento DATE DEFAULT NULL,
    p_salario NUMERIC(18,2) DEFAULT NULL,
    p_departamento VARCHAR(100) DEFAULT NULL,
    p_puesto VARCHAR(100) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Empleados" WHERE "Id" = p_empleado_id) THEN
        UPDATE "Empleados"
        SET "NombreCompleto" = p_nombre_completo,
            "Telefono" = p_telefono,
            "Email" = p_email,
            "Direccion" = p_direccion,
            "FechaNacimiento" = p_fecha_nacimiento,
            "Salario" = p_salario,
            "Departamento" = p_departamento,
            "Puesto" = p_puesto,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_empleado_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_Activar
CREATE OR REPLACE FUNCTION fn_Empleado_Activar(
    p_empleado_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Empleados" WHERE "Id" = p_empleado_id) THEN
        UPDATE "Empleados"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_empleado_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_Desactivar
CREATE OR REPLACE FUNCTION fn_Empleado_Desactivar(
    p_empleado_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Empleados" WHERE "Id" = p_empleado_id) THEN
        UPDATE "Empleados"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_empleado_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Activo" = true
    ORDER BY e."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarActivosPorId(
    p_empleado_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Id" = p_empleado_id
      AND e."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarActivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Activo" = true
      AND e."NombreCompleto" ILIKE '%' || p_nombre || '%'
    ORDER BY e."NombreCompleto"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Activo" = false
    ORDER BY e."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarInactivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Activo" = false
      AND e."NombreCompleto" ILIKE '%' || p_nombre || '%'
    ORDER BY e."NombreCompleto"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Empleado_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Empleado_MostrarInactivosPorId(
    p_empleado_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "UsuarioId" INTEGER,
    "CodigoEmpleado" VARCHAR(20),
    "NombreCompleto" VARCHAR(200),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e."Id",
        e."UsuarioId",
        e."CodigoEmpleado",
        e."NombreCompleto",
        e."Telefono",
        e."Email",
        e."Direccion",
        e."FechaNacimiento",
        e."FechaIngreso",
        e."Salario",
        e."Departamento",
        e."Puesto",
        e."Activo",
        e."FechaCreacion",
        e."FechaModificacion"
    FROM "Empleados" e
    WHERE e."Id" = p_empleado_id
      AND e."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. FUNCIONES PARA CATÁLOGOS - CATEGORIAS
-- =============================================

-- fn_Categoria_Crear
CREATE OR REPLACE FUNCTION fn_Categoria_Crear(
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_categoria_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Categorias" WHERE "Nombre" = p_nombre) THEN
        p_categoria_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "Categorias" ("Nombre", "Descripcion", "Activo")
    VALUES (p_nombre, p_descripcion, true)
    RETURNING "Id" INTO p_categoria_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_Editar
CREATE OR REPLACE FUNCTION fn_Categoria_Editar(
    p_categoria_id INTEGER,
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Categorias" WHERE "Id" = p_categoria_id) THEN
        UPDATE "Categorias"
        SET "Nombre" = p_nombre,
            "Descripcion" = p_descripcion,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_categoria_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_Activar
CREATE OR REPLACE FUNCTION fn_Categoria_Activar(
    p_categoria_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Categorias" WHERE "Id" = p_categoria_id) THEN
        UPDATE "Categorias"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_categoria_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_Desactivar
CREATE OR REPLACE FUNCTION fn_Categoria_Desactivar(
    p_categoria_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Categorias" WHERE "Id" = p_categoria_id) THEN
        UPDATE "Categorias"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_categoria_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Activo" = true
    ORDER BY c."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarActivosPorId(
    p_categoria_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Id" = p_categoria_id
      AND c."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarActivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Activo" = true
      AND c."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY c."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Activo" = false
    ORDER BY c."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarInactivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Activo" = false
      AND c."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY c."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Categoria_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Categoria_MostrarInactivosPorId(
    p_categoria_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Nombre",
        c."Descripcion",
        c."Activo",
        c."FechaCreacion",
        c."FechaModificacion"
    FROM "Categorias" c
    WHERE c."Id" = p_categoria_id
      AND c."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. FUNCIONES PARA CATÁLOGOS - MARCAS
-- =============================================

-- fn_Marca_Crear
CREATE OR REPLACE FUNCTION fn_Marca_Crear(
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_marca_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Marcas" WHERE "Nombre" = p_nombre) THEN
        p_marca_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "Marcas" ("Nombre", "Descripcion", "Activo")
    VALUES (p_nombre, p_descripcion, true)
    RETURNING "Id" INTO p_marca_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_Editar
CREATE OR REPLACE FUNCTION fn_Marca_Editar(
    p_marca_id INTEGER,
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Marcas" WHERE "Id" = p_marca_id) THEN
        UPDATE "Marcas"
        SET "Nombre" = p_nombre,
            "Descripcion" = p_descripcion,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_marca_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_Activar
CREATE OR REPLACE FUNCTION fn_Marca_Activar(
    p_marca_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Marcas" WHERE "Id" = p_marca_id) THEN
        UPDATE "Marcas"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_marca_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_Desactivar
CREATE OR REPLACE FUNCTION fn_Marca_Desactivar(
    p_marca_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Marcas" WHERE "Id" = p_marca_id) THEN
        UPDATE "Marcas"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_marca_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Marca_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Activo" = true
    ORDER BY m."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Marca_MostrarActivosPorId(
    p_marca_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Id" = p_marca_id
      AND m."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Marca_MostrarActivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Activo" = true
      AND m."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY m."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Marca_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Activo" = false
    ORDER BY m."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Marca_MostrarInactivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Activo" = false
      AND m."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY m."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Marca_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Marca_MostrarInactivosPorId(
    p_marca_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m."Id",
        m."Nombre",
        m."Descripcion",
        m."Activo",
        m."FechaCreacion",
        m."FechaModificacion"
    FROM "Marcas" m
    WHERE m."Id" = p_marca_id
      AND m."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. FUNCIONES PARA CATÁLOGOS - MODELOS
-- =============================================

-- fn_Modelo_Crear
CREATE OR REPLACE FUNCTION fn_Modelo_Crear(
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_modelo_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Modelos" WHERE "Nombre" = p_nombre) THEN
        p_modelo_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "Modelos" ("Nombre", "Descripcion", "Activo")
    VALUES (p_nombre, p_descripcion, true)
    RETURNING "Id" INTO p_modelo_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_Editar
CREATE OR REPLACE FUNCTION fn_Modelo_Editar(
    p_modelo_id INTEGER,
    p_nombre VARCHAR(100),
    p_descripcion VARCHAR(500) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Modelos" WHERE "Id" = p_modelo_id) THEN
        UPDATE "Modelos"
        SET "Nombre" = p_nombre,
            "Descripcion" = p_descripcion,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_modelo_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_Activar
CREATE OR REPLACE FUNCTION fn_Modelo_Activar(
    p_modelo_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Modelos" WHERE "Id" = p_modelo_id) THEN
        UPDATE "Modelos"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_modelo_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_Desactivar
CREATE OR REPLACE FUNCTION fn_Modelo_Desactivar(
    p_modelo_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Modelos" WHERE "Id" = p_modelo_id) THEN
        UPDATE "Modelos"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_modelo_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Activo" = true
    ORDER BY mo."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarActivosPorId(
    p_modelo_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Id" = p_modelo_id
      AND mo."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarActivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Activo" = true
      AND mo."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY mo."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Activo" = false
    ORDER BY mo."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarInactivosPorNombre(
    p_nombre VARCHAR(100),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Activo" = false
      AND mo."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY mo."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Modelo_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Modelo_MostrarInactivosPorId(
    p_modelo_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(100),
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mo."Id",
        mo."Nombre",
        mo."Descripcion",
        mo."Activo",
        mo."FechaCreacion",
        mo."FechaModificacion"
    FROM "Modelos" mo
    WHERE mo."Id" = p_modelo_id
      AND mo."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 8. FUNCIONES PARA CATÁLOGOS - PRODUCTOS
-- =============================================

-- fn_Producto_Crear
CREATE OR REPLACE FUNCTION fn_Producto_Crear(
    p_nombre VARCHAR(200),
    p_descripcion VARCHAR(1000) DEFAULT NULL,
    OUT p_producto_id INTEGER
) AS $$
BEGIN
    INSERT INTO "Productos" ("Nombre", "Descripcion", "Activo")
    VALUES (p_nombre, p_descripcion, true)
    RETURNING "Id" INTO p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_Editar
CREATE OR REPLACE FUNCTION fn_Producto_Editar(
    p_producto_id INTEGER,
    p_nombre VARCHAR(200),
    p_descripcion VARCHAR(1000) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Productos" WHERE "Id" = p_producto_id) THEN
        UPDATE "Productos"
        SET "Nombre" = p_nombre,
            "Descripcion" = p_descripcion,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_Activar
CREATE OR REPLACE FUNCTION fn_Producto_Activar(
    p_producto_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Productos" WHERE "Id" = p_producto_id) THEN
        UPDATE "Productos"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_Desactivar
CREATE OR REPLACE FUNCTION fn_Producto_Desactivar(
    p_producto_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "Productos" WHERE "Id" = p_producto_id) THEN
        UPDATE "Productos"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarActivos
CREATE OR REPLACE FUNCTION fn_Producto_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Activo" = true
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_Producto_MostrarActivosPorId(
    p_producto_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Id" = p_producto_id
      AND p."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_Producto_MostrarActivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Activo" = true
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_Producto_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Activo" = false
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_Producto_MostrarInactivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Activo" = false
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Producto_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_Producto_MostrarInactivosPorId(
    p_producto_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Nombre" VARCHAR(200),
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."Id",
        p."Nombre",
        p."Descripcion",
        p."Activo",
        p."FechaCreacion",
        p."FechaModificacion"
    FROM "Productos" p
    WHERE p."Id" = p_producto_id
      AND p."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 9. FUNCIONES PARA CATÁLOGOS - DETALLEPRODUCTO
-- =============================================

-- fn_DetalleProducto_Crear
CREATE OR REPLACE FUNCTION fn_DetalleProducto_Crear(
    p_producto_id INTEGER,
    p_categoria_id INTEGER,
    p_marca_id INTEGER,
    p_modelo_id INTEGER,
    p_codigo VARCHAR(50),
    p_precio_compra NUMERIC(18,2),
    p_precio_venta NUMERIC(18,2),
    p_sku VARCHAR(100) DEFAULT NULL,
    p_observaciones VARCHAR(500) DEFAULT NULL,
    p_stock_minimo INTEGER DEFAULT 0,
    p_unidad_medida VARCHAR(50) DEFAULT NULL,
    OUT p_detalle_producto_id INTEGER
) AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "DetalleProducto" WHERE "Codigo" = p_codigo) THEN
        p_detalle_producto_id := -1;
        RETURN;
    END IF;
    
    INSERT INTO "DetalleProducto" ("ProductoId", "CategoriaId", "MarcaId", "ModeloId", "Codigo", "SKU", "Observaciones", "PrecioCompra", "PrecioVenta", "Stock", "StockMinimo", "UnidadMedida", "Activo")
    VALUES (p_producto_id, p_categoria_id, p_marca_id, p_modelo_id, p_codigo, p_sku, p_observaciones, p_precio_compra, p_precio_venta, 0, p_stock_minimo, p_unidad_medida, true)
    RETURNING "Id" INTO p_detalle_producto_id;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_Editar
CREATE OR REPLACE FUNCTION fn_DetalleProducto_Editar(
    p_detalle_producto_id INTEGER,
    p_categoria_id INTEGER,
    p_marca_id INTEGER,
    p_modelo_id INTEGER,
    p_precio_compra NUMERIC(18,2),
    p_precio_venta NUMERIC(18,2),
    p_sku VARCHAR(100) DEFAULT NULL,
    p_observaciones VARCHAR(500) DEFAULT NULL,
    p_stock_minimo INTEGER DEFAULT 0,
    p_unidad_medida VARCHAR(50) DEFAULT NULL,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "DetalleProducto" WHERE "Id" = p_detalle_producto_id) THEN
        UPDATE "DetalleProducto"
        SET "CategoriaId" = p_categoria_id,
            "MarcaId" = p_marca_id,
            "ModeloId" = p_modelo_id,
            "SKU" = p_sku,
            "Observaciones" = p_observaciones,
            "PrecioCompra" = p_precio_compra,
            "PrecioVenta" = p_precio_venta,
            "StockMinimo" = p_stock_minimo,
            "UnidadMedida" = p_unidad_medida,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_detalle_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_Activar
CREATE OR REPLACE FUNCTION fn_DetalleProducto_Activar(
    p_detalle_producto_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "DetalleProducto" WHERE "Id" = p_detalle_producto_id) THEN
        UPDATE "DetalleProducto"
        SET "Activo" = true,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_detalle_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_Desactivar
CREATE OR REPLACE FUNCTION fn_DetalleProducto_Desactivar(
    p_detalle_producto_id INTEGER,
    OUT p_resultado BOOLEAN
) AS $$
BEGIN
    p_resultado := false;
    
    IF EXISTS (SELECT 1 FROM "DetalleProducto" WHERE "Id" = p_detalle_producto_id) THEN
        UPDATE "DetalleProducto"
        SET "Activo" = false,
            "FechaModificacion" = CURRENT_TIMESTAMP
        WHERE "Id" = p_detalle_producto_id;
        
        p_resultado := true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarActivos
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarActivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "Activo" BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."Activo"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Activo" = true
    ORDER BY dp."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarActivosPorId
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarActivosPorId(
    p_detalle_producto_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."Observaciones",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."FechaUltimoMovimiento",
        dp."Activo",
        dp."FechaCreacion",
        dp."FechaModificacion"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Id" = p_detalle_producto_id
      AND dp."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarActivosPorNombre
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarActivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."Observaciones",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."FechaUltimoMovimiento",
        dp."Activo",
        dp."FechaCreacion",
        dp."FechaModificacion"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Activo" = true
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarInactivos
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarInactivos(
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."Observaciones",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."FechaUltimoMovimiento",
        dp."Activo",
        dp."FechaCreacion",
        dp."FechaModificacion"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Activo" = false
    ORDER BY dp."FechaCreacion" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarInactivosPorNombre
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarInactivosPorNombre(
    p_nombre VARCHAR(200),
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."Observaciones",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."FechaUltimoMovimiento",
        dp."Activo",
        dp."FechaCreacion",
        dp."FechaModificacion"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Activo" = false
      AND p."Nombre" ILIKE '%' || p_nombre || '%'
    ORDER BY p."Nombre"
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DetalleProducto_MostrarInactivosPorId
CREATE OR REPLACE FUNCTION fn_DetalleProducto_MostrarInactivosPorId(
    p_detalle_producto_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "MarcaId" INTEGER,
    "MarcaNombre" VARCHAR(100),
    "ModeloId" INTEGER,
    "ModeloNombre" VARCHAR(100),
    "Codigo" VARCHAR(50),
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "Stock" INTEGER,
    "StockMinimo" INTEGER,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN,
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dp."Id",
        dp."ProductoId",
        p."Nombre" AS "ProductoNombre",
        dp."CategoriaId",
        c."Nombre" AS "CategoriaNombre",
        dp."MarcaId",
        m."Nombre" AS "MarcaNombre",
        dp."ModeloId",
        mo."Nombre" AS "ModeloNombre",
        dp."Codigo",
        dp."SKU",
        dp."Observaciones",
        dp."PrecioCompra",
        dp."PrecioVenta",
        dp."Stock",
        dp."StockMinimo",
        dp."UnidadMedida",
        dp."FechaUltimoMovimiento",
        dp."Activo",
        dp."FechaCreacion",
        dp."FechaModificacion"
    FROM "DetalleProducto" dp
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Modelos" mo ON dp."ModeloId" = mo."Id"
    WHERE dp."Id" = p_detalle_producto_id
      AND dp."Activo" = false;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 10. FUNCIONES PARA TRANSACCIONES - COMPRAS
-- =============================================

-- fn_Compra_ObtenerPorId: Obtener compra con detalles
CREATE OR REPLACE FUNCTION fn_Compra_ObtenerPorId(
    p_compra_id INTEGER
)
RETURNS TABLE (
    -- Encabezado
    "Id" INTEGER,
    "Folio" VARCHAR(50),
    "ProveedorId" INTEGER,
    "ProveedorNombre" VARCHAR(200),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "FechaCompra" TIMESTAMP,
    "Subtotal" NUMERIC(18,2),
    "Impuestos" NUMERIC(18,2),
    "Total" NUMERIC(18,2),
    "Estado" VARCHAR(50),
    "Observaciones" VARCHAR(1000)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Folio",
        c."ProveedorId",
        p."Nombre" AS "ProveedorNombre",
        c."UsuarioId",
        u."NombreUsuario",
        c."FechaCompra",
        c."Subtotal",
        c."Impuestos",
        c."Total",
        c."Estado",
        c."Observaciones"
    FROM "Compras" c
    INNER JOIN "Proveedores" p ON c."ProveedorId" = p."Id"
    INNER JOIN "Usuarios" u ON c."UsuarioId" = u."Id"
    WHERE c."Id" = p_compra_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Compra_ObtenerDetalles: Obtener detalles de una compra
CREATE OR REPLACE FUNCTION fn_Compra_ObtenerDetalles(
    p_compra_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "CompraId" INTEGER,
    "DetalleProductoId" INTEGER,
    "ProductoCodigo" VARCHAR(50),
    "ProductoNombre" VARCHAR(200),
    "MarcaNombre" VARCHAR(100),
    "CategoriaNombre" VARCHAR(100),
    "Cantidad" NUMERIC(18,2),
    "PrecioUnitario" NUMERIC(18,2),
    "Subtotal" NUMERIC(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd."Id",
        cd."CompraId",
        cd."DetalleProductoId",
        dp."Codigo" AS "ProductoCodigo",
        p."Nombre" AS "ProductoNombre",
        m."Nombre" AS "MarcaNombre",
        c."Nombre" AS "CategoriaNombre",
        cd."Cantidad",
        cd."PrecioUnitario",
        cd."Subtotal"
    FROM "ComprasDetalle" cd
    INNER JOIN "DetalleProducto" dp ON cd."DetalleProductoId" = dp."Id"
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Categorias" c ON dp."CategoriaId" = c."Id"
    WHERE cd."CompraId" = p_compra_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Compra_MostrarPorRangoFechas
CREATE OR REPLACE FUNCTION fn_Compra_MostrarPorRangoFechas(
    p_fecha_inicio TIMESTAMP,
    p_fecha_fin TIMESTAMP,
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Folio" VARCHAR(50),
    "ProveedorId" INTEGER,
    "ProveedorNombre" VARCHAR(200),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "FechaCompra" TIMESTAMP,
    "Subtotal" NUMERIC(18,2),
    "Impuestos" NUMERIC(18,2),
    "Total" NUMERIC(18,2),
    "Estado" VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c."Id",
        c."Folio",
        c."ProveedorId",
        p."Nombre" AS "ProveedorNombre",
        c."UsuarioId",
        u."NombreUsuario",
        c."FechaCompra",
        c."Subtotal",
        c."Impuestos",
        c."Total",
        c."Estado"
    FROM "Compras" c
    INNER JOIN "Proveedores" p ON c."ProveedorId" = p."Id"
    INNER JOIN "Usuarios" u ON c."UsuarioId" = u."Id"
    WHERE c."FechaCompra" BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY c."FechaCompra" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. FUNCIONES PARA TRANSACCIONES - VENTAS
-- =============================================

-- fn_Venta_ObtenerPorId: Obtener venta con detalles
CREATE OR REPLACE FUNCTION fn_Venta_ObtenerPorId(
    p_venta_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Folio" VARCHAR(50),
    "ClienteId" INTEGER,
    "ClienteNombre" VARCHAR(200),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "EmpleadoId" INTEGER,
    "EmpleadoNombre" VARCHAR(200),
    "FechaVenta" TIMESTAMP,
    "Subtotal" NUMERIC(18,2),
    "Impuestos" NUMERIC(18,2),
    "Descuento" NUMERIC(18,2),
    "Total" NUMERIC(18,2),
    "MetodoPago" VARCHAR(50),
    "Estado" VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v."Id",
        v."Folio",
        v."ClienteId",
        c."NombreCompleto" AS "ClienteNombre",
        v."UsuarioId",
        u."NombreUsuario",
        v."EmpleadoId",
        e."NombreCompleto" AS "EmpleadoNombre",
        v."FechaVenta",
        v."Subtotal",
        v."Impuestos",
        v."Descuento",
        v."Total",
        v."MetodoPago",
        v."Estado"
    FROM "Ventas" v
    LEFT JOIN "Clientes" c ON v."ClienteId" = c."Id"
    INNER JOIN "Usuarios" u ON v."UsuarioId" = u."Id"
    LEFT JOIN "Empleados" e ON v."EmpleadoId" = e."Id"
    WHERE v."Id" = p_venta_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Venta_ObtenerDetalles: Obtener detalles de una venta
CREATE OR REPLACE FUNCTION fn_Venta_ObtenerDetalles(
    p_venta_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "VentaId" INTEGER,
    "DetalleProductoId" INTEGER,
    "ProductoCodigo" VARCHAR(50),
    "ProductoNombre" VARCHAR(200),
    "MarcaNombre" VARCHAR(100),
    "CategoriaNombre" VARCHAR(100),
    "Cantidad" NUMERIC(18,2),
    "PrecioUnitario" NUMERIC(18,2),
    "Descuento" NUMERIC(18,2),
    "Subtotal" NUMERIC(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vd."Id",
        vd."VentaId",
        vd."DetalleProductoId",
        dp."Codigo" AS "ProductoCodigo",
        p."Nombre" AS "ProductoNombre",
        m."Nombre" AS "MarcaNombre",
        cat."Nombre" AS "CategoriaNombre",
        vd."Cantidad",
        vd."PrecioUnitario",
        vd."Descuento",
        vd."Subtotal"
    FROM "VentasDetalle" vd
    INNER JOIN "DetalleProducto" dp ON vd."DetalleProductoId" = dp."Id"
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    INNER JOIN "Categorias" cat ON dp."CategoriaId" = cat."Id"
    WHERE vd."VentaId" = p_venta_id;
END;
$$ LANGUAGE plpgsql;

-- fn_Venta_MostrarPorRangoFechas
CREATE OR REPLACE FUNCTION fn_Venta_MostrarPorRangoFechas(
    p_fecha_inicio TIMESTAMP,
    p_fecha_fin TIMESTAMP,
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "Folio" VARCHAR(50),
    "ClienteId" INTEGER,
    "ClienteNombre" VARCHAR(200),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "EmpleadoId" INTEGER,
    "EmpleadoNombre" VARCHAR(200),
    "FechaVenta" TIMESTAMP,
    "Subtotal" NUMERIC(18,2),
    "Impuestos" NUMERIC(18,2),
    "Descuento" NUMERIC(18,2),
    "Total" NUMERIC(18,2),
    "MetodoPago" VARCHAR(50),
    "Estado" VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v."Id",
        v."Folio",
        v."ClienteId",
        c."NombreCompleto" AS "ClienteNombre",
        v."UsuarioId",
        u."NombreUsuario",
        v."EmpleadoId",
        e."NombreCompleto" AS "EmpleadoNombre",
        v."FechaVenta",
        v."Subtotal",
        v."Impuestos",
        v."Descuento",
        v."Total",
        v."MetodoPago",
        v."Estado"
    FROM "Ventas" v
    LEFT JOIN "Clientes" c ON v."ClienteId" = c."Id"
    INNER JOIN "Usuarios" u ON v."UsuarioId" = u."Id"
    LEFT JOIN "Empleados" e ON v."EmpleadoId" = e."Id"
    WHERE v."FechaVenta" BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY v."FechaVenta" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_Compra_Crear: Crear nueva compra con detalles y movimiento de stock
CREATE OR REPLACE FUNCTION fn_Compra_Crear(
    p_folio VARCHAR(50),
    p_proveedor_id INTEGER,
    p_usuario_id INTEGER,
    p_detalles_compra JSONB, -- JSON con array de detalles: [{"DetalleProductoId":1,"Cantidad":10,"PrecioUnitario":100.00}]
    p_fecha_compra TIMESTAMP DEFAULT NULL,
    p_observaciones VARCHAR(1000) DEFAULT NULL,
    OUT p_compra_id INTEGER,
    OUT p_mensaje_error VARCHAR(500)
) AS $$
DECLARE
    v_subtotal_total NUMERIC(18,2) := 0;
    v_detalle JSONB;
    v_detalle_producto_id INTEGER;
    v_cantidad NUMERIC(18,2);
    v_precio_unitario NUMERIC(18,2);
    v_subtotal NUMERIC(18,2);
    v_stock_anterior NUMERIC(18,2);
    v_stock_nuevo NUMERIC(18,2);
    v_impuestos NUMERIC(18,2);
    v_total NUMERIC(18,2);
    v_fecha_compra TIMESTAMP;
BEGIN
    p_compra_id := -1;
    p_mensaje_error := '';
    
    BEGIN
        -- Validar que el folio no exista
        IF EXISTS (SELECT 1 FROM "Compras" WHERE "Folio" = p_folio) THEN
            p_mensaje_error := 'El folio de compra ya existe';
            RETURN;
        END IF;
        
        -- Establecer fecha si no se proporciona
        IF p_fecha_compra IS NULL THEN
            v_fecha_compra := CURRENT_TIMESTAMP;
        ELSE
            v_fecha_compra := p_fecha_compra;
        END IF;
        
        -- Crear encabezado de compra
        INSERT INTO "Compras" ("Folio", "ProveedorId", "UsuarioId", "FechaCompra", "Subtotal", "Impuestos", "Total", "Estado", "Observaciones")
        VALUES (p_folio, p_proveedor_id, p_usuario_id, v_fecha_compra, 0, 0, 0, 'Completada', p_observaciones)
        RETURNING "Id" INTO p_compra_id;
        
        -- Procesar detalles desde JSON
        FOR v_detalle IN SELECT * FROM jsonb_array_elements(p_detalles_compra)
        LOOP
            v_detalle_producto_id := (v_detalle->>'DetalleProductoId')::INTEGER;
            v_cantidad := (v_detalle->>'Cantidad')::NUMERIC(18,2);
            v_precio_unitario := (v_detalle->>'PrecioUnitario')::NUMERIC(18,2);
            v_subtotal := v_cantidad * v_precio_unitario;
            v_subtotal_total := v_subtotal_total + v_subtotal;
            
            -- Insertar detalle
            INSERT INTO "ComprasDetalle" ("CompraId", "DetalleProductoId", "Cantidad", "PrecioUnitario", "Subtotal")
            VALUES (p_compra_id, v_detalle_producto_id, v_cantidad, v_precio_unitario, v_subtotal);
            
            -- Obtener stock actual antes del movimiento
            SELECT "Stock" INTO v_stock_anterior FROM "DetalleProducto" WHERE "Id" = v_detalle_producto_id;
            v_stock_nuevo := v_stock_anterior + v_cantidad;
            
            -- Crear movimiento de stock (Entrada)
            INSERT INTO "MovimientosStock" ("DetalleProductoId", "TipoMovimiento", "Cantidad", "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", "UsuarioId", "Motivo", "FechaMovimiento")
            VALUES (v_detalle_producto_id, 'Entrada', v_cantidad, v_stock_anterior, v_stock_nuevo, p_compra_id, 'Compra', p_usuario_id, 'Compra de productos', v_fecha_compra);
            
            -- Actualizar stock en DetalleProducto
            UPDATE "DetalleProducto"
            SET "Stock" = v_stock_nuevo,
                "FechaUltimoMovimiento" = v_fecha_compra
            WHERE "Id" = v_detalle_producto_id;
        END LOOP;
        
        -- Calcular impuestos y total
        v_impuestos := v_subtotal_total * 0.15;
        v_total := v_subtotal_total + v_impuestos;
        
        -- Actualizar totales de la compra
        UPDATE "Compras"
        SET "Subtotal" = v_subtotal_total,
            "Impuestos" = v_impuestos,
            "Total" = v_total
        WHERE "Id" = p_compra_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            p_compra_id := -1;
            p_mensaje_error := SQLERRM;
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 11. FUNCIONES PARA TRANSACCIONES - VENTAS (CREAR)
-- =============================================

-- fn_Venta_Crear: Crear nueva venta con detalles y movimiento de stock (salida)
CREATE OR REPLACE FUNCTION fn_Venta_Crear(
    p_folio VARCHAR(50),
    p_usuario_id INTEGER,
    p_metodo_pago VARCHAR(50),
    p_detalles_venta JSONB, -- JSON con array de detalles
    p_cliente_id INTEGER DEFAULT NULL,
    p_empleado_id INTEGER DEFAULT NULL,
    p_fecha_venta TIMESTAMP DEFAULT NULL,
    p_observaciones VARCHAR(1000) DEFAULT NULL,
    OUT p_venta_id INTEGER,
    OUT p_mensaje_error VARCHAR(500)
) AS $$
DECLARE
    v_subtotal_total NUMERIC(18,2) := 0;
    v_descuento_total NUMERIC(18,2) := 0;
    v_detalle JSONB;
    v_detalle_producto_id INTEGER;
    v_cantidad NUMERIC(18,2);
    v_precio_unitario NUMERIC(18,2);
    v_descuento NUMERIC(18,2);
    v_subtotal NUMERIC(18,2);
    v_stock_disponible NUMERIC(18,2);
    v_stock_anterior NUMERIC(18,2);
    v_stock_nuevo NUMERIC(18,2);
    v_impuestos NUMERIC(18,2);
    v_total NUMERIC(18,2);
    v_fecha_venta TIMESTAMP;
BEGIN
    p_venta_id := -1;
    p_mensaje_error := '';
    
    BEGIN
        -- Validar que el folio no exista
        IF EXISTS (SELECT 1 FROM "Ventas" WHERE "Folio" = p_folio) THEN
            p_mensaje_error := 'El folio de venta ya existe';
            RETURN;
        END IF;
        
        -- Establecer fecha si no se proporciona
        IF p_fecha_venta IS NULL THEN
            v_fecha_venta := CURRENT_TIMESTAMP;
        ELSE
            v_fecha_venta := p_fecha_venta;
        END IF;
        
        -- Crear encabezado de venta
        INSERT INTO "Ventas" ("Folio", "ClienteId", "UsuarioId", "EmpleadoId", "FechaVenta", "Subtotal", "Impuestos", "Descuento", "Total", "MetodoPago", "Estado", "Observaciones")
        VALUES (p_folio, p_cliente_id, p_usuario_id, p_empleado_id, v_fecha_venta, 0, 0, 0, 0, p_metodo_pago, 'Completada', p_observaciones)
        RETURNING "Id" INTO p_venta_id;
        
        -- Procesar detalles desde JSON
        FOR v_detalle IN SELECT * FROM jsonb_array_elements(p_detalles_venta)
        LOOP
            v_detalle_producto_id := (v_detalle->>'DetalleProductoId')::INTEGER;
            v_cantidad := (v_detalle->>'Cantidad')::NUMERIC(18,2);
            v_precio_unitario := (v_detalle->>'PrecioUnitario')::NUMERIC(18,2);
            v_descuento := COALESCE((v_detalle->>'Descuento')::NUMERIC(18,2), 0);
            
            -- Validar stock disponible
            SELECT "Stock" INTO v_stock_disponible FROM "DetalleProducto" WHERE "Id" = v_detalle_producto_id;
            
            IF v_stock_disponible < v_cantidad THEN
                p_mensaje_error := 'Stock insuficiente para el producto con ID: ' || v_detalle_producto_id::VARCHAR;
                RAISE EXCEPTION '%', p_mensaje_error;
            END IF;
            
            v_subtotal := (v_precio_unitario * v_cantidad) - v_descuento;
            v_subtotal_total := v_subtotal_total + v_subtotal;
            v_descuento_total := v_descuento_total + v_descuento;
            
            -- Insertar detalle
            INSERT INTO "VentasDetalle" ("VentaId", "DetalleProductoId", "Cantidad", "PrecioUnitario", "Descuento", "Subtotal")
            VALUES (p_venta_id, v_detalle_producto_id, v_cantidad, v_precio_unitario, v_descuento, v_subtotal);
            
            -- Obtener stock actual antes del movimiento
            v_stock_anterior := v_stock_disponible;
            v_stock_nuevo := v_stock_anterior - v_cantidad;
            
            -- Crear movimiento de stock (Salida)
            INSERT INTO "MovimientosStock" ("DetalleProductoId", "TipoMovimiento", "Cantidad", "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", "UsuarioId", "Motivo", "FechaMovimiento")
            VALUES (v_detalle_producto_id, 'Salida', v_cantidad, v_stock_anterior, v_stock_nuevo, p_venta_id, 'Venta', p_usuario_id, 'Venta de productos', v_fecha_venta);
            
            -- Actualizar stock en DetalleProducto
            UPDATE "DetalleProducto"
            SET "Stock" = v_stock_nuevo,
                "FechaUltimoMovimiento" = v_fecha_venta
            WHERE "Id" = v_detalle_producto_id;
        END LOOP;
        
        -- Calcular impuestos y total
        v_impuestos := v_subtotal_total * 0.15;
        v_total := v_subtotal_total + v_impuestos;
        
        -- Actualizar totales de la venta
        UPDATE "Ventas"
        SET "Subtotal" = v_subtotal_total,
            "Impuestos" = v_impuestos,
            "Descuento" = v_descuento_total,
            "Total" = v_total
        WHERE "Id" = p_venta_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            p_venta_id := -1;
            p_mensaje_error := SQLERRM;
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 12. FUNCIONES PARA TRANSACCIONES - DEVOLUCIONES
-- =============================================

-- fn_DevolucionVenta_Crear: Crear devolución con movimiento de stock (entrada)
CREATE OR REPLACE FUNCTION fn_DevolucionVenta_Crear(
    p_folio VARCHAR(50),
    p_venta_id INTEGER,
    p_usuario_id INTEGER,
    p_motivo VARCHAR(500),
    p_detalles_devolucion JSONB, -- JSON: [{"VentaDetalleId":1,"DetalleProductoId":1,"CantidadDevolver":2,"Motivo":"Defectuoso"}]
    p_fecha_devolucion TIMESTAMP DEFAULT NULL,
    p_observaciones VARCHAR(1000) DEFAULT NULL,
    OUT p_devolucion_venta_id INTEGER,
    OUT p_mensaje_error VARCHAR(500)
) AS $$
DECLARE
    v_total_devolucion NUMERIC(18,2) := 0;
    v_detalle JSONB;
    v_venta_detalle_id INTEGER;
    v_detalle_producto_id INTEGER;
    v_cantidad_devolver NUMERIC(18,2);
    v_motivo_detalle VARCHAR(500);
    v_cantidad_vendida NUMERIC(18,2);
    v_subtotal_original NUMERIC(18,2);
    v_subtotal_devolucion NUMERIC(18,2);
    v_stock_anterior NUMERIC(18,2);
    v_stock_nuevo NUMERIC(18,2);
    v_fecha_devolucion TIMESTAMP;
BEGIN
    p_devolucion_venta_id := -1;
    p_mensaje_error := '';
    
    BEGIN
        -- Validar que el folio no exista
        IF EXISTS (SELECT 1 FROM "DevolucionesVenta" WHERE "Folio" = p_folio) THEN
            p_mensaje_error := 'El folio de devolución ya existe';
            RETURN;
        END IF;
        
        -- Validar que la venta exista
        IF NOT EXISTS (SELECT 1 FROM "Ventas" WHERE "Id" = p_venta_id) THEN
            p_mensaje_error := 'La venta no existe';
            RETURN;
        END IF;
        
        -- Establecer fecha si no se proporciona
        IF p_fecha_devolucion IS NULL THEN
            v_fecha_devolucion := CURRENT_TIMESTAMP;
        ELSE
            v_fecha_devolucion := p_fecha_devolucion;
        END IF;
        
        -- Crear encabezado de devolución
        INSERT INTO "DevolucionesVenta" ("Folio", "VentaId", "UsuarioId", "FechaDevolucion", "Motivo", "TotalDevolucion", "Estado", "Observaciones")
        VALUES (p_folio, p_venta_id, p_usuario_id, v_fecha_devolucion, p_motivo, 0, 'Completada', p_observaciones)
        RETURNING "Id" INTO p_devolucion_venta_id;
        
        -- Procesar detalles desde JSON
        FOR v_detalle IN SELECT * FROM jsonb_array_elements(p_detalles_devolucion)
        LOOP
            v_venta_detalle_id := (v_detalle->>'VentaDetalleId')::INTEGER;
            v_detalle_producto_id := (v_detalle->>'DetalleProductoId')::INTEGER;
            v_cantidad_devolver := (v_detalle->>'CantidadDevolver')::NUMERIC(18,2);
            v_motivo_detalle := v_detalle->>'Motivo';
            
            -- Validar que la cantidad a devolver no exceda la cantidad vendida
            SELECT "Cantidad", "Subtotal" INTO v_cantidad_vendida, v_subtotal_original
            FROM "VentasDetalle" WHERE "Id" = v_venta_detalle_id;
            
            IF v_cantidad_devolver > v_cantidad_vendida THEN
                p_mensaje_error := 'La cantidad a devolver excede la cantidad vendida';
                RAISE EXCEPTION '%', p_mensaje_error;
            END IF;
            
            -- Calcular subtotal de devolución (proporcional)
            v_subtotal_devolucion := (v_subtotal_original / v_cantidad_vendida) * v_cantidad_devolver;
            v_total_devolucion := v_total_devolucion + v_subtotal_devolucion;
            
            -- Insertar detalle de devolución
            INSERT INTO "DevolucionesVentaDetalle" ("DevolucionVentaId", "VentaDetalleId", "DetalleProductoId", "CantidadDevolver", "Motivo", "Subtotal")
            VALUES (p_devolucion_venta_id, v_venta_detalle_id, v_detalle_producto_id, v_cantidad_devolver, v_motivo_detalle, v_subtotal_devolucion);
            
            -- Obtener stock actual antes del movimiento
            SELECT "Stock" INTO v_stock_anterior FROM "DetalleProducto" WHERE "Id" = v_detalle_producto_id;
            v_stock_nuevo := v_stock_anterior + v_cantidad_devolver;
            
            -- Crear movimiento de stock (Entrada)
            INSERT INTO "MovimientosStock" ("DetalleProductoId", "TipoMovimiento", "Cantidad", "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", "UsuarioId", "Motivo", "FechaMovimiento")
            VALUES (v_detalle_producto_id, 'Entrada', v_cantidad_devolver, v_stock_anterior, v_stock_nuevo, p_devolucion_venta_id, 'Devolucion', p_usuario_id, v_motivo_detalle, v_fecha_devolucion);
            
            -- Actualizar stock en DetalleProducto
            UPDATE "DetalleProducto"
            SET "Stock" = v_stock_nuevo,
                "FechaUltimoMovimiento" = v_fecha_devolucion
            WHERE "Id" = v_detalle_producto_id;
        END LOOP;
        
        -- Actualizar total de la devolución
        UPDATE "DevolucionesVenta"
        SET "TotalDevolucion" = v_total_devolucion
        WHERE "Id" = p_devolucion_venta_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            p_devolucion_venta_id := -1;
            p_mensaje_error := SQLERRM;
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- fn_DevolucionVenta_ObtenerDetalles: Obtener detalles de una devolución
CREATE OR REPLACE FUNCTION fn_DevolucionVenta_ObtenerDetalles(
    p_devolucion_venta_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "DevolucionVentaId" INTEGER,
    "VentaDetalleId" INTEGER,
    "DetalleProductoId" INTEGER,
    "ProductoCodigo" VARCHAR(50),
    "ProductoNombre" VARCHAR(200),
    "MarcaNombre" VARCHAR(100),
    "CantidadDevolver" NUMERIC(18,2),
    "Motivo" VARCHAR(500),
    "Subtotal" NUMERIC(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dvd."Id",
        dvd."DevolucionVentaId",
        dvd."VentaDetalleId",
        dvd."DetalleProductoId",
        dp."Codigo" AS "ProductoCodigo",
        p."Nombre" AS "ProductoNombre",
        m."Nombre" AS "MarcaNombre",
        dvd."CantidadDevolver",
        dvd."Motivo",
        dvd."Subtotal"
    FROM "DevolucionesVentaDetalle" dvd
    INNER JOIN "DetalleProducto" dp ON dvd."DetalleProductoId" = dp."Id"
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Marcas" m ON dp."MarcaId" = m."Id"
    WHERE dvd."DevolucionVentaId" = p_devolucion_venta_id;
END;
$$ LANGUAGE plpgsql;

-- fn_DevolucionVenta_ObtenerPorId
CREATE OR REPLACE FUNCTION fn_DevolucionVenta_ObtenerPorId(
    p_devolucion_venta_id INTEGER
)
RETURNS TABLE (
    "Id" INTEGER,
    "Folio" VARCHAR(50),
    "VentaId" INTEGER,
    "VentaFolio" VARCHAR(50),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "FechaDevolucion" TIMESTAMP,
    "Motivo" VARCHAR(500),
    "TotalDevolucion" NUMERIC(18,2),
    "Estado" VARCHAR(50),
    "Observaciones" VARCHAR(1000),
    "FechaCreacion" TIMESTAMP,
    "FechaModificacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dv."Id",
        dv."Folio",
        dv."VentaId",
        v."Folio" AS "VentaFolio",
        dv."UsuarioId",
        u."NombreUsuario",
        dv."FechaDevolucion",
        dv."Motivo",
        dv."TotalDevolucion",
        dv."Estado",
        dv."Observaciones",
        dv."FechaCreacion",
        dv."FechaModificacion"
    FROM "DevolucionesVenta" dv
    INNER JOIN "Ventas" v ON dv."VentaId" = v."Id"
    INNER JOIN "Usuarios" u ON dv."UsuarioId" = u."Id"
    WHERE dv."Id" = p_devolucion_venta_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 13. FUNCIONES PARA MOVIMIENTOSSTOCK
-- =============================================

-- fn_MovimientoStock_Ajuste: Ajuste manual de stock
CREATE OR REPLACE FUNCTION fn_MovimientoStock_Ajuste(
    p_detalle_producto_id INTEGER,
    p_cantidad NUMERIC(18,2), -- Positivo para aumentar, negativo para disminuir
    p_usuario_id INTEGER,
    p_motivo VARCHAR(500),
    OUT p_movimiento_stock_id INTEGER,
    OUT p_mensaje_error VARCHAR(500)
) AS $$
DECLARE
    v_stock_anterior NUMERIC(18,2);
    v_stock_nuevo NUMERIC(18,2);
    v_tipo_movimiento VARCHAR(50);
BEGIN
    p_movimiento_stock_id := -1;
    p_mensaje_error := '';
    
    BEGIN
        -- Validar que el producto exista
        IF NOT EXISTS (SELECT 1 FROM "DetalleProducto" WHERE "Id" = p_detalle_producto_id) THEN
            p_mensaje_error := 'El producto no existe';
            RETURN;
        END IF;
        
        -- Obtener stock actual
        SELECT "Stock" INTO v_stock_anterior FROM "DetalleProducto" WHERE "Id" = p_detalle_producto_id;
        v_stock_nuevo := v_stock_anterior + p_cantidad;
        
        -- Validar que el stock no sea negativo
        IF v_stock_nuevo < 0 THEN
            p_mensaje_error := 'El ajuste resultaría en stock negativo';
            RETURN;
        END IF;
        
        -- Determinar tipo de movimiento
        IF p_cantidad > 0 THEN
            v_tipo_movimiento := 'Entrada';
        ELSIF p_cantidad < 0 THEN
            v_tipo_movimiento := 'Salida';
        ELSE
            v_tipo_movimiento := 'Ajuste';
        END IF;
        
        -- Crear movimiento de stock
        INSERT INTO "MovimientosStock" ("DetalleProductoId", "TipoMovimiento", "Cantidad", "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", "UsuarioId", "Motivo", "FechaMovimiento")
        VALUES (p_detalle_producto_id, v_tipo_movimiento, ABS(p_cantidad), v_stock_anterior, v_stock_nuevo, NULL, 'Ajuste', p_usuario_id, p_motivo, CURRENT_TIMESTAMP)
        RETURNING "Id" INTO p_movimiento_stock_id;
        
        -- Actualizar stock en DetalleProducto
        UPDATE "DetalleProducto"
        SET "Stock" = v_stock_nuevo,
            "FechaUltimoMovimiento" = CURRENT_TIMESTAMP
        WHERE "Id" = p_detalle_producto_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            p_movimiento_stock_id := -1;
            p_mensaje_error := SQLERRM;
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- fn_MovimientoStock_MostrarPorProducto
CREATE OR REPLACE FUNCTION fn_MovimientoStock_MostrarPorProducto(
    p_detalle_producto_id INTEGER,
    p_fecha_inicio TIMESTAMP DEFAULT NULL,
    p_fecha_fin TIMESTAMP DEFAULT NULL,
    p_top INTEGER DEFAULT 100
)
RETURNS TABLE (
    "Id" INTEGER,
    "DetalleProductoId" INTEGER,
    "ProductoCodigo" VARCHAR(50),
    "ProductoNombre" VARCHAR(200),
    "TipoMovimiento" VARCHAR(50),
    "Cantidad" NUMERIC(18,2),
    "StockAnterior" NUMERIC(18,2),
    "StockNuevo" NUMERIC(18,2),
    "ReferenciaId" INTEGER,
    "ReferenciaTipo" VARCHAR(50),
    "UsuarioId" INTEGER,
    "NombreUsuario" VARCHAR(100),
    "Motivo" VARCHAR(500),
    "FechaMovimiento" TIMESTAMP
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_TIMESTAMP - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN QUERY
    SELECT 
        ms."Id",
        ms."DetalleProductoId",
        dp."Codigo" AS "ProductoCodigo",
        p."Nombre" AS "ProductoNombre",
        ms."TipoMovimiento",
        ms."Cantidad",
        ms."StockAnterior",
        ms."StockNuevo",
        ms."ReferenciaId",
        ms."ReferenciaTipo",
        ms."UsuarioId",
        u."NombreUsuario",
        ms."Motivo",
        ms."FechaMovimiento"
    FROM "MovimientosStock" ms
    INNER JOIN "DetalleProducto" dp ON ms."DetalleProductoId" = dp."Id"
    INNER JOIN "Productos" p ON dp."ProductoId" = p."Id"
    INNER JOIN "Usuarios" u ON ms."UsuarioId" = u."Id"
    WHERE ms."DetalleProductoId" = p_detalle_producto_id
      AND ms."FechaMovimiento" BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY ms."FechaMovimiento" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Resumen
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Funciones de base de datos operacional creadas exitosamente';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Total de funciones: 99';
    RAISE NOTICE '- Seguridad: 5 funciones';
    RAISE NOTICE '- Catálogos: 80 funciones (10 por catálogo x 8 catálogos)';
    RAISE NOTICE '  * Proveedores: 10 funciones';
    RAISE NOTICE '  * Clientes: 10 funciones';
    RAISE NOTICE '  * Empleados: 10 funciones';
    RAISE NOTICE '  * Categorias: 10 funciones';
    RAISE NOTICE '  * Marcas: 10 funciones';
    RAISE NOTICE '  * Modelos: 10 funciones';
    RAISE NOTICE '  * Productos: 10 funciones';
    RAISE NOTICE '  * DetalleProducto: 10 funciones';
    RAISE NOTICE '- Transacciones: 11 funciones';
    RAISE NOTICE '  * Compras: 4 funciones (Crear, ObtenerPorId, ObtenerDetalles, MostrarPorRangoFechas)';
    RAISE NOTICE '  * Ventas: 4 funciones (Crear, ObtenerPorId, ObtenerDetalles, MostrarPorRangoFechas)';
    RAISE NOTICE '  * Devoluciones: 3 funciones (Crear, ObtenerPorId, ObtenerDetalles)';
    RAISE NOTICE '- MovimientosStock: 2 funciones (Ajuste, MostrarPorProducto)';
    RAISE NOTICE '=============================================';
END $$;


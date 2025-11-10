-- =============================================
-- Script de Creación de Tablas - Licoreria API
-- Base de Datos: PostgreSQL (Supabase)
-- Adaptado de SQL Server a PostgreSQL
-- =============================================

-- =============================================
-- 1. TABLAS DE SEGURIDAD Y AUTENTICACIÓN
-- =============================================

-- Tabla: Roles
CREATE TABLE IF NOT EXISTS "Roles" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Permisos
CREATE TABLE IF NOT EXISTS "Permisos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Modulo" VARCHAR(100), -- Ventas, Compras, Inventario, etc.
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: RolesPermisos (Relación)
CREATE TABLE IF NOT EXISTS "RolesPermisos" (
    "Id" SERIAL PRIMARY KEY,
    "RolId" INTEGER NOT NULL,
    "PermisoId" INTEGER NOT NULL,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("RolId") REFERENCES "Roles"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("PermisoId") REFERENCES "Permisos"("Id") ON DELETE CASCADE,
    UNIQUE ("RolId", "PermisoId")
);

-- Tabla: Usuarios
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "NombreUsuario" VARCHAR(100) NOT NULL UNIQUE,
    "Email" VARCHAR(200) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "NombreCompleto" VARCHAR(200),
    "Rol" VARCHAR(50), -- Mantener por compatibilidad, pero usar RolesPermisos
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "UltimoAcceso" TIMESTAMP
);

-- Tabla: UsuariosRoles (Relación)
CREATE TABLE IF NOT EXISTS "UsuariosRoles" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER NOT NULL,
    "RolId" INTEGER NOT NULL,
    "FechaAsignacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("RolId") REFERENCES "Roles"("Id") ON DELETE CASCADE,
    UNIQUE ("UsuarioId", "RolId")
);

-- Tabla: SesionesUsuario
CREATE TABLE IF NOT EXISTS "SesionesUsuario" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER NOT NULL,
    "Token" TEXT,
    "FechaInicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaExpiracion" TIMESTAMP,
    "IpAddress" VARCHAR(50),
    "UserAgent" VARCHAR(500),
    "Activa" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id") ON DELETE CASCADE
);

-- =============================================
-- 2. TABLAS DE CATÁLOGOS
-- =============================================

-- Tabla: Categorias
CREATE TABLE IF NOT EXISTS "Categorias" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Marcas
CREATE TABLE IF NOT EXISTS "Marcas" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Modelos
CREATE TABLE IF NOT EXISTS "Modelos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Productos (Sin relaciones - solo información básica)
CREATE TABLE IF NOT EXISTS "Productos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(200) NOT NULL,
    "Descripcion" VARCHAR(1000),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: DetalleProducto (Con todas las relaciones y campos de negocio)
CREATE TABLE IF NOT EXISTS "DetalleProducto" (
    "Id" SERIAL PRIMARY KEY,
    "ProductoId" INTEGER NOT NULL,
    "CategoriaId" INTEGER NOT NULL,
    "MarcaId" INTEGER NOT NULL,
    "ModeloId" INTEGER NOT NULL,
    "Codigo" VARCHAR(50) NOT NULL UNIQUE,
    "SKU" VARCHAR(100),
    "Observaciones" VARCHAR(500),
    "PrecioCompra" NUMERIC(18,2) NOT NULL,
    "PrecioVenta" NUMERIC(18,2) NOT NULL,
    "Stock" INTEGER NOT NULL DEFAULT 0,
    "StockMinimo" INTEGER NOT NULL DEFAULT 0,
    "UnidadMedida" VARCHAR(50),
    "FechaUltimoMovimiento" TIMESTAMP,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    FOREIGN KEY ("ProductoId") REFERENCES "Productos"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("CategoriaId") REFERENCES "Categorias"("Id"),
    FOREIGN KEY ("MarcaId") REFERENCES "Marcas"("Id"),
    FOREIGN KEY ("ModeloId") REFERENCES "Modelos"("Id")
);

-- Tabla: Clientes
CREATE TABLE IF NOT EXISTS "Clientes" (
    "Id" SERIAL PRIMARY KEY,
    "CodigoCliente" VARCHAR(50) NOT NULL UNIQUE,
    "NombreCompleto" VARCHAR(200) NOT NULL,
    "RazonSocial" VARCHAR(200),
    "RFC" VARCHAR(20),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Proveedores
CREATE TABLE IF NOT EXISTS "Proveedores" (
    "Id" SERIAL PRIMARY KEY,
    "CodigoProveedor" VARCHAR(50) NOT NULL UNIQUE,
    "Nombre" VARCHAR(200) NOT NULL,
    "RazonSocial" VARCHAR(200),
    "RFC" VARCHAR(20),
    "Direccion" VARCHAR(500),
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP
);

-- Tabla: Empleados
CREATE TABLE IF NOT EXISTS "Empleados" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER NULL,
    "CodigoEmpleado" VARCHAR(20) NOT NULL UNIQUE,
    "NombreCompleto" VARCHAR(200) NOT NULL,
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(200),
    "Direccion" VARCHAR(500),
    "FechaNacimiento" DATE,
    "FechaIngreso" DATE NOT NULL,
    "Salario" NUMERIC(18,2),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id")
);

-- =============================================
-- 3. TABLAS DE TRANSACCIONES
-- =============================================

-- Tabla: Compras
CREATE TABLE IF NOT EXISTS "Compras" (
    "Id" SERIAL PRIMARY KEY,
    "Folio" VARCHAR(50) NOT NULL UNIQUE,
    "ProveedorId" INTEGER NOT NULL,
    "UsuarioId" INTEGER NOT NULL,
    "FechaCompra" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Subtotal" NUMERIC(18,2) NOT NULL,
    "Impuestos" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "Total" NUMERIC(18,2) NOT NULL,
    "Estado" VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    "Observaciones" VARCHAR(1000),
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    FOREIGN KEY ("ProveedorId") REFERENCES "Proveedores"("Id"),
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id")
);

-- Tabla: ComprasDetalle
CREATE TABLE IF NOT EXISTS "ComprasDetalle" (
    "Id" SERIAL PRIMARY KEY,
    "CompraId" INTEGER NOT NULL,
    "DetalleProductoId" INTEGER NOT NULL,
    "Cantidad" NUMERIC(18,2) NOT NULL,
    "PrecioUnitario" NUMERIC(18,2) NOT NULL,
    "Subtotal" NUMERIC(18,2) NOT NULL,
    FOREIGN KEY ("CompraId") REFERENCES "Compras"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id")
);

-- Tabla: Ventas
CREATE TABLE IF NOT EXISTS "Ventas" (
    "Id" SERIAL PRIMARY KEY,
    "Folio" VARCHAR(50) NOT NULL UNIQUE,
    "ClienteId" INTEGER NULL,
    "UsuarioId" INTEGER NOT NULL,
    "EmpleadoId" INTEGER NULL,
    "FechaVenta" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Subtotal" NUMERIC(18,2) NOT NULL,
    "Impuestos" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "Descuento" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "Total" NUMERIC(18,2) NOT NULL,
    "MetodoPago" VARCHAR(50),
    "Estado" VARCHAR(50) NOT NULL DEFAULT 'Completada',
    "Observaciones" VARCHAR(1000),
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    FOREIGN KEY ("ClienteId") REFERENCES "Clientes"("Id"),
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id"),
    FOREIGN KEY ("EmpleadoId") REFERENCES "Empleados"("Id")
);

-- Tabla: VentasDetalle
CREATE TABLE IF NOT EXISTS "VentasDetalle" (
    "Id" SERIAL PRIMARY KEY,
    "VentaId" INTEGER NOT NULL,
    "DetalleProductoId" INTEGER NOT NULL,
    "Cantidad" NUMERIC(18,2) NOT NULL,
    "PrecioUnitario" NUMERIC(18,2) NOT NULL,
    "Descuento" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "Subtotal" NUMERIC(18,2) NOT NULL,
    FOREIGN KEY ("VentaId") REFERENCES "Ventas"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id")
);

-- Tabla: DevolucionesVenta
CREATE TABLE IF NOT EXISTS "DevolucionesVenta" (
    "Id" SERIAL PRIMARY KEY,
    "Folio" VARCHAR(50) NOT NULL UNIQUE,
    "VentaId" INTEGER NOT NULL,
    "UsuarioId" INTEGER NOT NULL,
    "FechaDevolucion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Motivo" VARCHAR(500),
    "TotalDevolucion" NUMERIC(18,2) NOT NULL,
    "Estado" VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    "Observaciones" VARCHAR(1000),
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    FOREIGN KEY ("VentaId") REFERENCES "Ventas"("Id"),
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id")
);

-- Tabla: DevolucionesVentaDetalle
CREATE TABLE IF NOT EXISTS "DevolucionesVentaDetalle" (
    "Id" SERIAL PRIMARY KEY,
    "DevolucionVentaId" INTEGER NOT NULL,
    "VentaDetalleId" INTEGER NOT NULL,
    "DetalleProductoId" INTEGER NOT NULL,
    "CantidadDevolver" NUMERIC(18,2) NOT NULL,
    "Motivo" VARCHAR(500),
    "Subtotal" NUMERIC(18,2) NOT NULL,
    FOREIGN KEY ("DevolucionVentaId") REFERENCES "DevolucionesVenta"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("VentaDetalleId") REFERENCES "VentasDetalle"("Id"),
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id")
);

-- =============================================
-- 4. TABLAS DE INVENTARIO
-- =============================================

-- Tabla: MovimientosStock
CREATE TABLE IF NOT EXISTS "MovimientosStock" (
    "Id" SERIAL PRIMARY KEY,
    "DetalleProductoId" INTEGER NOT NULL,
    "TipoMovimiento" VARCHAR(50) NOT NULL,
    "Cantidad" NUMERIC(18,2) NOT NULL,
    "StockAnterior" NUMERIC(18,2) NOT NULL,
    "StockNuevo" NUMERIC(18,2) NOT NULL,
    "ReferenciaId" INTEGER NULL,
    "ReferenciaTipo" VARCHAR(50) NULL,
    "UsuarioId" INTEGER NOT NULL,
    "Motivo" VARCHAR(500),
    "FechaMovimiento" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id"),
    FOREIGN KEY ("UsuarioId") REFERENCES "Usuarios"("Id")
);

-- =============================================
-- 5. TABLAS ADICIONALES
-- =============================================

-- Tabla: Precios
CREATE TABLE IF NOT EXISTS "Precios" (
    "Id" SERIAL PRIMARY KEY,
    "DetalleProductoId" INTEGER NOT NULL,
    "PrecioCompra" NUMERIC(18,2) NOT NULL,
    "PrecioVenta" NUMERIC(18,2) NOT NULL,
    "PrecioVentaMinimo" NUMERIC(18,2),
    "FechaInicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaFin" TIMESTAMP NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id")
);

-- Tabla: Descuentos
CREATE TABLE IF NOT EXISTS "Descuentos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL,
    "Tipo" VARCHAR(50) NOT NULL,
    "Valor" NUMERIC(18,2) NOT NULL,
    "DetalleProductoId" INTEGER NULL,
    "CategoriaId" INTEGER NULL,
    "FechaInicio" TIMESTAMP NOT NULL,
    "FechaFin" TIMESTAMP NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("DetalleProductoId") REFERENCES "DetalleProducto"("Id"),
    FOREIGN KEY ("CategoriaId") REFERENCES "Categorias"("Id")
);

-- Tabla: ConfiguracionSistema
CREATE TABLE IF NOT EXISTS "ConfiguracionSistema" (
    "Id" SERIAL PRIMARY KEY,
    "Clave" VARCHAR(100) NOT NULL UNIQUE,
    "Valor" TEXT,
    "Tipo" VARCHAR(50),
    "Descripcion" VARCHAR(500),
    "FechaModificacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. ÍNDICES PARA MEJOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS "IX_DetalleProducto_Codigo" ON "DetalleProducto"("Codigo");
CREATE INDEX IF NOT EXISTS "IX_DetalleProducto_ProductoId" ON "DetalleProducto"("ProductoId");
CREATE INDEX IF NOT EXISTS "IX_DetalleProducto_CategoriaId" ON "DetalleProducto"("CategoriaId");
CREATE INDEX IF NOT EXISTS "IX_DetalleProducto_MarcaId" ON "DetalleProducto"("MarcaId");
CREATE INDEX IF NOT EXISTS "IX_DetalleProducto_ModeloId" ON "DetalleProducto"("ModeloId");
CREATE INDEX IF NOT EXISTS "IX_Ventas_UsuarioId" ON "Ventas"("UsuarioId");
CREATE INDEX IF NOT EXISTS "IX_Ventas_FechaVenta" ON "Ventas"("FechaVenta");
CREATE INDEX IF NOT EXISTS "IX_Ventas_ClienteId" ON "Ventas"("ClienteId");
CREATE INDEX IF NOT EXISTS "IX_Compras_ProveedorId" ON "Compras"("ProveedorId");
CREATE INDEX IF NOT EXISTS "IX_Compras_FechaCompra" ON "Compras"("FechaCompra");
CREATE INDEX IF NOT EXISTS "IX_MovimientosStock_DetalleProductoId" ON "MovimientosStock"("DetalleProductoId");
CREATE INDEX IF NOT EXISTS "IX_MovimientosStock_FechaMovimiento" ON "MovimientosStock"("FechaMovimiento");

-- =============================================
-- 7. FUNCIÓN Y TRIGGER PARA ACTUALIZAR STOCK
-- =============================================

-- Función para actualizar stock
CREATE OR REPLACE FUNCTION actualizar_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "DetalleProducto"
    SET 
        "Stock" = CAST(NEW."StockNuevo" AS INTEGER),
        "FechaUltimoMovimiento" = NEW."FechaMovimiento",
        "FechaModificacion" = CURRENT_TIMESTAMP
    WHERE "Id" = NEW."DetalleProductoId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stock automáticamente
DROP TRIGGER IF EXISTS "TR_MovimientosStock_ActualizarStock" ON "MovimientosStock";
CREATE TRIGGER "TR_MovimientosStock_ActualizarStock"
AFTER INSERT ON "MovimientosStock"
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock();

-- =============================================
-- Script completado
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Script de creación de tablas completado';
    RAISE NOTICE '=============================================';
END $$;


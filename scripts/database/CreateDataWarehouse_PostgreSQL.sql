-- =============================================
-- Script de Creación de Data Warehouse
-- Base de Datos: PostgreSQL (Supabase)
-- Esquema: Estrella (Star Schema)
-- Adaptado de SQL Server a PostgreSQL
-- =============================================

-- =============================================
-- 1. TABLAS DE DIMENSIONES
-- =============================================

-- Tabla: DimTiempo (Dimensión de Tiempo)
CREATE TABLE IF NOT EXISTS "DimTiempo" (
    "Id" SERIAL PRIMARY KEY,
    "Fecha" DATE NOT NULL UNIQUE,
    "Anio" INTEGER NOT NULL,
    "Trimestre" INTEGER NOT NULL,
    "Mes" INTEGER NOT NULL,
    "Semana" INTEGER NOT NULL,
    "Dia" INTEGER NOT NULL,
    "DiaSemana" INTEGER NOT NULL,
    "NombreMes" VARCHAR(20),
    "NombreDiaSemana" VARCHAR(20),
    "EsFinDeSemana" BOOLEAN NOT NULL,
    "EsFestivo" BOOLEAN NOT NULL DEFAULT false
);

-- Tabla: DimCategoria
CREATE TABLE IF NOT EXISTS "DimCategoria" (
    "Id" SERIAL PRIMARY KEY,
    "CategoriaNombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabla: DimMarca
CREATE TABLE IF NOT EXISTS "DimMarca" (
    "Id" SERIAL PRIMARY KEY,
    "MarcaNombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabla: DimModelo
CREATE TABLE IF NOT EXISTS "DimModelo" (
    "Id" SERIAL PRIMARY KEY,
    "ModeloNombre" VARCHAR(100) NOT NULL UNIQUE,
    "Descripcion" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabla: DimProducto
CREATE TABLE IF NOT EXISTS "DimProducto" (
    "Id" SERIAL PRIMARY KEY,
    "ProductoCodigo" VARCHAR(50) NOT NULL UNIQUE,
    "ProductoNombre" VARCHAR(200) NOT NULL,
    "CategoriaId" INTEGER NULL,
    "MarcaId" INTEGER NULL,
    "ModeloId" INTEGER NULL,
    "PrecioCompraPromedio" NUMERIC(18,2),
    "PrecioVentaPromedio" NUMERIC(18,2),
    "UnidadMedida" VARCHAR(50),
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaInicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaFin" TIMESTAMP NULL,
    FOREIGN KEY ("CategoriaId") REFERENCES "DimCategoria"("Id"),
    FOREIGN KEY ("MarcaId") REFERENCES "DimMarca"("Id"),
    FOREIGN KEY ("ModeloId") REFERENCES "DimModelo"("Id")
);

-- Tabla: DimCliente
CREATE TABLE IF NOT EXISTS "DimCliente" (
    "Id" SERIAL PRIMARY KEY,
    "ClienteCodigo" VARCHAR(50) NOT NULL UNIQUE,
    "ClienteNombre" VARCHAR(200) NOT NULL,
    "RFC" VARCHAR(20),
    "TipoCliente" VARCHAR(50),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabla: DimProveedor
CREATE TABLE IF NOT EXISTS "DimProveedor" (
    "Id" SERIAL PRIMARY KEY,
    "ProveedorCodigo" VARCHAR(50) NOT NULL UNIQUE,
    "ProveedorNombre" VARCHAR(200) NOT NULL,
    "RFC" VARCHAR(20),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- Tabla: DimEmpleado
CREATE TABLE IF NOT EXISTS "DimEmpleado" (
    "Id" SERIAL PRIMARY KEY,
    "EmpleadoCodigo" VARCHAR(20) NOT NULL UNIQUE,
    "EmpleadoNombre" VARCHAR(200) NOT NULL,
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "Activo" BOOLEAN NOT NULL DEFAULT true
);

-- =============================================
-- 2. TABLAS DE HECHOS (FACT TABLES)
-- =============================================

-- Tabla: HechoVenta
CREATE TABLE IF NOT EXISTS "HechoVenta" (
    "Id" SERIAL PRIMARY KEY,
    "FechaId" INTEGER NOT NULL,
    "ProductoId" INTEGER NOT NULL,
    "ClienteId" INTEGER NULL,
    "EmpleadoId" INTEGER NULL,
    "CategoriaId" INTEGER NULL,
    "TotalVentas" NUMERIC(18,2) NOT NULL,
    "CantidadVendida" NUMERIC(18,2) NOT NULL,
    "CantidadTransacciones" INTEGER NOT NULL,
    "PromedioTicket" NUMERIC(18,2),
    "DescuentoTotal" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "ImpuestosTotal" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "FechaProcesamiento" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("FechaId") REFERENCES "DimTiempo"("Id"),
    FOREIGN KEY ("ProductoId") REFERENCES "DimProducto"("Id"),
    FOREIGN KEY ("ClienteId") REFERENCES "DimCliente"("Id"),
    FOREIGN KEY ("EmpleadoId") REFERENCES "DimEmpleado"("Id"),
    FOREIGN KEY ("CategoriaId") REFERENCES "DimCategoria"("Id")
);

-- Tabla: HechoCompra
CREATE TABLE IF NOT EXISTS "HechoCompra" (
    "Id" SERIAL PRIMARY KEY,
    "FechaId" INTEGER NOT NULL,
    "ProductoId" INTEGER NOT NULL,
    "ProveedorId" INTEGER NOT NULL,
    "CategoriaId" INTEGER NULL,
    "TotalCompras" NUMERIC(18,2) NOT NULL,
    "CantidadComprada" NUMERIC(18,2) NOT NULL,
    "CantidadTransacciones" INTEGER NOT NULL,
    "PromedioCompra" NUMERIC(18,2),
    "ImpuestosTotal" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "FechaProcesamiento" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("FechaId") REFERENCES "DimTiempo"("Id"),
    FOREIGN KEY ("ProductoId") REFERENCES "DimProducto"("Id"),
    FOREIGN KEY ("ProveedorId") REFERENCES "DimProveedor"("Id"),
    FOREIGN KEY ("CategoriaId") REFERENCES "DimCategoria"("Id")
);

-- Tabla: HechoInventario
CREATE TABLE IF NOT EXISTS "HechoInventario" (
    "Id" SERIAL PRIMARY KEY,
    "FechaId" INTEGER NOT NULL,
    "ProductoId" INTEGER NOT NULL,
    "CategoriaId" INTEGER NULL,
    "StockActual" INTEGER NOT NULL,
    "StockMinimo" INTEGER NOT NULL,
    "ValorInventario" NUMERIC(18,2) NOT NULL,
    "ProductosConStockBajo" INTEGER NOT NULL DEFAULT 0,
    "FechaProcesamiento" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("FechaId") REFERENCES "DimTiempo"("Id"),
    FOREIGN KEY ("ProductoId") REFERENCES "DimProducto"("Id"),
    FOREIGN KEY ("CategoriaId") REFERENCES "DimCategoria"("Id")
);

-- =============================================
-- 3. ÍNDICES PARA MEJOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS "IX_HechoVenta_FechaId" ON "HechoVenta"("FechaId");
CREATE INDEX IF NOT EXISTS "IX_HechoVenta_ProductoId" ON "HechoVenta"("ProductoId");
CREATE INDEX IF NOT EXISTS "IX_HechoVenta_CategoriaId" ON "HechoVenta"("CategoriaId");
CREATE INDEX IF NOT EXISTS "IX_HechoCompra_FechaId" ON "HechoCompra"("FechaId");
CREATE INDEX IF NOT EXISTS "IX_HechoCompra_ProductoId" ON "HechoCompra"("ProductoId");
CREATE INDEX IF NOT EXISTS "IX_HechoInventario_FechaId" ON "HechoInventario"("FechaId");
CREATE INDEX IF NOT EXISTS "IX_HechoInventario_ProductoId" ON "HechoInventario"("ProductoId");

-- =============================================
-- 4. FUNCIÓN PARA POBLAR DIMENSIÓN DE TIEMPO
-- =============================================

-- Función para poblar DimTiempo
CREATE OR REPLACE FUNCTION poblar_dim_tiempo(fecha_inicio DATE, fecha_fin DATE)
RETURNS void AS $$
DECLARE
    fecha_actual DATE := fecha_inicio;
    anio_val INTEGER;
    trimestre_val INTEGER;
    mes_val INTEGER;
    semana_val INTEGER;
    dia_val INTEGER;
    dia_semana_val INTEGER;
    nombre_mes_val VARCHAR(20);
    nombre_dia_semana_val VARCHAR(20);
    es_fin_semana_val BOOLEAN;
BEGIN
    WHILE fecha_actual <= fecha_fin LOOP
        -- Verificar si ya existe
        IF NOT EXISTS (SELECT 1 FROM "DimTiempo" WHERE "Fecha" = fecha_actual) THEN
            anio_val := EXTRACT(YEAR FROM fecha_actual);
            trimestre_val := EXTRACT(QUARTER FROM fecha_actual);
            mes_val := EXTRACT(MONTH FROM fecha_actual);
            semana_val := EXTRACT(WEEK FROM fecha_actual);
            dia_val := EXTRACT(DAY FROM fecha_actual);
            dia_semana_val := EXTRACT(DOW FROM fecha_actual); -- 0=Domingo, 6=Sábado
            nombre_mes_val := TO_CHAR(fecha_actual, 'Month');
            nombre_dia_semana_val := TO_CHAR(fecha_actual, 'Day');
            es_fin_semana_val := (dia_semana_val = 0 OR dia_semana_val = 6);
            
            INSERT INTO "DimTiempo" (
                "Fecha", "Anio", "Trimestre", "Mes", "Semana", "Dia", "DiaSemana",
                "NombreMes", "NombreDiaSemana", "EsFinDeSemana", "EsFestivo"
            )
            VALUES (
                fecha_actual,
                anio_val,
                trimestre_val,
                mes_val,
                semana_val,
                dia_val,
                dia_semana_val,
                TRIM(nombre_mes_val),
                TRIM(nombre_dia_semana_val),
                es_fin_semana_val,
                false
            );
        END IF;
        
        fecha_actual := fecha_actual + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar para poblar últimos 5 años y próximos 2 años
SELECT poblar_dim_tiempo('2020-01-01'::DATE, '2027-12-31'::DATE);

-- =============================================
-- Script completado
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Script de creación de Data Warehouse completado';
    RAISE NOTICE '=============================================';
END $$;


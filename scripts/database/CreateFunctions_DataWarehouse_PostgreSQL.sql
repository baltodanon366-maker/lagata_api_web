-- =============================================
-- FUNCIONES PostgreSQL - Data Warehouse
-- Adaptado de SQL Server Stored Procedures
-- Base de Datos: PostgreSQL (Supabase) - DataWarehouse
-- =============================================

-- =============================================
-- 1. FUNCIONES PARA HECHO VENTAS
-- =============================================

-- fn_DW_Ventas_PorRangoFechas: Ventas agregadas por rango de fechas
CREATE OR REPLACE FUNCTION fn_DW_Ventas_PorRangoFechas(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_agrupar_por VARCHAR(50) DEFAULT 'Dia' -- Dia, Semana, Mes, Año
)
RETURNS TABLE (
    "Fecha" DATE,
    "Anio" INTEGER,
    "Semana" INTEGER,
    "Mes" INTEGER,
    "NombreMes" VARCHAR(20),
    "TotalCantidad" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "TotalDescuento" NUMERIC(18,2),
    "TotalImpuestos" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "PromedioTicket" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_agrupar_por = 'Dia' THEN
        RETURN QUERY
        SELECT 
            t."Fecha",
            NULL::INTEGER AS "Anio",
            NULL::INTEGER AS "Semana",
            NULL::INTEGER AS "Mes",
            NULL::VARCHAR(20) AS "NombreMes",
            SUM(hv."CantidadVendida") AS "TotalCantidad",
            SUM(hv."TotalVentas") AS "TotalVentas",
            SUM(hv."DescuentoTotal") AS "TotalDescuento",
            SUM(hv."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
            AVG(hv."PromedioTicket") AS "PromedioTicket"
        FROM "HechoVenta" hv
        INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Fecha"
        ORDER BY t."Fecha";
    ELSIF p_agrupar_por = 'Semana' THEN
        RETURN QUERY
        SELECT 
            NULL::DATE AS "Fecha",
            t."Anio",
            t."Semana",
            NULL::INTEGER AS "Mes",
            NULL::VARCHAR(20) AS "NombreMes",
            SUM(hv."CantidadVendida") AS "TotalCantidad",
            SUM(hv."TotalVentas") AS "TotalVentas",
            SUM(hv."DescuentoTotal") AS "TotalDescuento",
            SUM(hv."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
            AVG(hv."PromedioTicket") AS "PromedioTicket"
        FROM "HechoVenta" hv
        INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Anio", t."Semana"
        ORDER BY t."Anio", t."Semana";
    ELSIF p_agrupar_por = 'Mes' THEN
        RETURN QUERY
        SELECT 
            NULL::DATE AS "Fecha",
            t."Anio",
            NULL::INTEGER AS "Semana",
            t."Mes",
            t."NombreMes",
            SUM(hv."CantidadVendida") AS "TotalCantidad",
            SUM(hv."TotalVentas") AS "TotalVentas",
            SUM(hv."DescuentoTotal") AS "TotalDescuento",
            SUM(hv."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
            AVG(hv."PromedioTicket") AS "PromedioTicket"
        FROM "HechoVenta" hv
        INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Anio", t."Mes", t."NombreMes"
        ORDER BY t."Anio", t."Mes";
    ELSIF p_agrupar_por = 'Año' THEN
        RETURN QUERY
        SELECT 
            NULL::DATE AS "Fecha",
            t."Anio",
            NULL::INTEGER AS "Semana",
            NULL::INTEGER AS "Mes",
            NULL::VARCHAR(20) AS "NombreMes",
            SUM(hv."CantidadVendida") AS "TotalCantidad",
            SUM(hv."TotalVentas") AS "TotalVentas",
            SUM(hv."DescuentoTotal") AS "TotalDescuento",
            SUM(hv."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
            AVG(hv."PromedioTicket") AS "PromedioTicket"
        FROM "HechoVenta" hv
        INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Anio"
        ORDER BY t."Anio";
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Ventas_PorProducto: Ventas agregadas por producto
CREATE OR REPLACE FUNCTION fn_DW_Ventas_PorProducto(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 20
)
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "MarcaNombre" VARCHAR(100),
    "TotalCantidadVendida" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "PromedioTicket" NUMERIC(18,2),
    "NumeroVentas" INTEGER
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        dp."Id" AS "ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        m."MarcaNombre",
        SUM(hv."CantidadVendida") AS "TotalCantidadVendida",
        SUM(hv."TotalVentas") AS "TotalVentas",
        AVG(hv."PromedioTicket") AS "PromedioTicket",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas"
    FROM "HechoVenta" hv
    INNER JOIN "DimProducto" dp ON hv."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimMarca" m ON dp."MarcaId" = m."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY dp."Id", dp."ProductoNombre", dp."ProductoCodigo", cat."CategoriaNombre", m."MarcaNombre"
    ORDER BY SUM(hv."TotalVentas") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Ventas_PorCategoria: Ventas agregadas por categoría
CREATE OR REPLACE FUNCTION fn_DW_Ventas_PorCategoria(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE (
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "TotalCantidad" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "NumeroProductos" INTEGER,
    "NumeroVentas" INTEGER,
    "PorcentajeTotal" NUMERIC(5,2)
) AS $$
DECLARE
    v_total_ventas NUMERIC(18,2);
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    -- Calcular total de ventas para porcentaje
    SELECT SUM(hv."TotalVentas") INTO v_total_ventas
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin;
    
    RETURN QUERY
    SELECT 
        cat."Id" AS "CategoriaId",
        cat."CategoriaNombre",
        SUM(hv."CantidadVendida") AS "TotalCantidad",
        SUM(hv."TotalVentas") AS "TotalVentas",
        COUNT(DISTINCT hv."ProductoId")::INTEGER AS "NumeroProductos",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        CASE 
            WHEN v_total_ventas > 0 THEN (SUM(hv."TotalVentas") * 100.0 / v_total_ventas)
            ELSE 0
        END AS "PorcentajeTotal"
    FROM "HechoVenta" hv
    INNER JOIN "DimProducto" dp ON hv."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY cat."Id", cat."CategoriaNombre"
    ORDER BY SUM(hv."TotalVentas") DESC;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Ventas_PorCliente: Ventas agregadas por cliente
CREATE OR REPLACE FUNCTION fn_DW_Ventas_PorCliente(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 20
)
RETURNS TABLE (
    "ClienteId" INTEGER,
    "ClienteNombre" VARCHAR(200),
    "ClienteCodigo" VARCHAR(50),
    "TotalCantidadComprada" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "NumeroCompras" INTEGER,
    "PromedioCompra" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        c."Id" AS "ClienteId",
        c."ClienteNombre",
        c."ClienteCodigo",
        SUM(hv."CantidadVendida") AS "TotalCantidadComprada",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroCompras",
        AVG(hv."PromedioTicket") AS "PromedioCompra"
    FROM "HechoVenta" hv
    INNER JOIN "DimCliente" c ON hv."ClienteId" = c."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
      AND c."Id" IS NOT NULL -- Solo clientes registrados
    GROUP BY c."Id", c."ClienteNombre", c."ClienteCodigo"
    ORDER BY SUM(hv."TotalVentas") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Ventas_PorEmpleado: Ventas agregadas por empleado
CREATE OR REPLACE FUNCTION fn_DW_Ventas_PorEmpleado(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE (
    "EmpleadoId" INTEGER,
    "EmpleadoNombre" VARCHAR(200),
    "EmpleadoCodigo" VARCHAR(20),
    "Departamento" VARCHAR(100),
    "Puesto" VARCHAR(100),
    "TotalCantidadVendida" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "PromedioVenta" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        e."Id" AS "EmpleadoId",
        e."EmpleadoNombre",
        e."EmpleadoCodigo",
        e."Departamento",
        e."Puesto",
        SUM(hv."CantidadVendida") AS "TotalCantidadVendida",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        AVG(hv."PromedioTicket") AS "PromedioVenta"
    FROM "HechoVenta" hv
    INNER JOIN "DimEmpleado" e ON hv."EmpleadoId" = e."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
      AND e."Id" IS NOT NULL
    GROUP BY e."Id", e."EmpleadoNombre", e."EmpleadoCodigo", e."Departamento", e."Puesto"
    ORDER BY SUM(hv."TotalVentas") DESC;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Ventas_MetodoPago: Ventas por método de pago
CREATE OR REPLACE FUNCTION fn_DW_Ventas_MetodoPago(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE (
    "MetodoPago" VARCHAR(50),
    "TotalCantidad" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "PorcentajeTotal" NUMERIC(5,2)
) AS $$
DECLARE
    v_total_ventas NUMERIC(18,2);
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    -- Calcular total de ventas para porcentaje
    SELECT SUM(hv."TotalVentas") INTO v_total_ventas
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin;
    
    -- Nota: MetodoPago no está en HechoVenta, se puede agregar como campo calculado o en una dimensión separada
    -- Por ahora retornamos datos básicos
    RETURN QUERY
    SELECT 
        'Todos'::VARCHAR(50) AS "MetodoPago",
        SUM(hv."CantidadVendida") AS "TotalCantidad",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        CASE 
            WHEN v_total_ventas > 0 THEN (SUM(hv."TotalVentas") * 100.0 / v_total_ventas)
            ELSE 0
        END AS "PorcentajeTotal"
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY SUM(hv."TotalVentas") DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. FUNCIONES PARA HECHO COMPRAS
-- =============================================

-- fn_DW_Compras_PorRangoFechas: Compras agregadas por rango de fechas
CREATE OR REPLACE FUNCTION fn_DW_Compras_PorRangoFechas(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_agrupar_por VARCHAR(50) DEFAULT 'Dia'
)
RETURNS TABLE (
    "Fecha" DATE,
    "Anio" INTEGER,
    "Mes" INTEGER,
    "NombreMes" VARCHAR(20),
    "TotalCantidad" NUMERIC(18,2),
    "TotalCompras" NUMERIC(18,2),
    "TotalImpuestos" NUMERIC(18,2),
    "NumeroCompras" INTEGER,
    "PromedioCompra" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_agrupar_por = 'Dia' THEN
        RETURN QUERY
        SELECT 
            t."Fecha",
            NULL::INTEGER AS "Anio",
            NULL::INTEGER AS "Mes",
            NULL::VARCHAR(20) AS "NombreMes",
            SUM(hc."CantidadComprada") AS "TotalCantidad",
            SUM(hc."TotalCompras") AS "TotalCompras",
            SUM(hc."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hc."CantidadTransacciones")::INTEGER AS "NumeroCompras",
            AVG(hc."PromedioCompra") AS "PromedioCompra"
        FROM "HechoCompra" hc
        INNER JOIN "DimTiempo" t ON hc."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Fecha"
        ORDER BY t."Fecha";
    ELSIF p_agrupar_por = 'Mes' THEN
        RETURN QUERY
        SELECT 
            NULL::DATE AS "Fecha",
            t."Anio",
            t."Mes",
            t."NombreMes",
            SUM(hc."CantidadComprada") AS "TotalCantidad",
            SUM(hc."TotalCompras") AS "TotalCompras",
            SUM(hc."ImpuestosTotal") AS "TotalImpuestos",
            SUM(hc."CantidadTransacciones")::INTEGER AS "NumeroCompras",
            AVG(hc."PromedioCompra") AS "PromedioCompra"
        FROM "HechoCompra" hc
        INNER JOIN "DimTiempo" t ON hc."FechaId" = t."Id"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Anio", t."Mes", t."NombreMes"
        ORDER BY t."Anio", t."Mes";
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Compras_PorProveedor: Compras agregadas por proveedor
CREATE OR REPLACE FUNCTION fn_DW_Compras_PorProveedor(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 20
)
RETURNS TABLE (
    "ProveedorId" INTEGER,
    "ProveedorNombre" VARCHAR(200),
    "ProveedorCodigo" VARCHAR(50),
    "TotalCantidadComprada" NUMERIC(18,2),
    "TotalCompras" NUMERIC(18,2),
    "NumeroCompras" INTEGER,
    "PromedioCompra" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        prov."Id" AS "ProveedorId",
        prov."ProveedorNombre",
        prov."ProveedorCodigo",
        SUM(hc."CantidadComprada") AS "TotalCantidadComprada",
        SUM(hc."TotalCompras") AS "TotalCompras",
        SUM(hc."CantidadTransacciones")::INTEGER AS "NumeroCompras",
        AVG(hc."PromedioCompra") AS "PromedioCompra"
    FROM "HechoCompra" hc
    INNER JOIN "DimProveedor" prov ON hc."ProveedorId" = prov."Id"
    INNER JOIN "DimTiempo" t ON hc."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY prov."Id", prov."ProveedorNombre", prov."ProveedorCodigo"
    ORDER BY SUM(hc."TotalCompras") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Compras_PorProducto: Compras agregadas por producto
CREATE OR REPLACE FUNCTION fn_DW_Compras_PorProducto(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 20
)
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "MarcaNombre" VARCHAR(100),
    "TotalCantidadComprada" NUMERIC(18,2),
    "TotalCompras" NUMERIC(18,2),
    "PrecioPromedioCompra" NUMERIC(18,2),
    "NumeroCompras" INTEGER
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        dp."Id" AS "ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        m."MarcaNombre",
        SUM(hc."CantidadComprada") AS "TotalCantidadComprada",
        SUM(hc."TotalCompras") AS "TotalCompras",
        AVG(hc."PromedioCompra") AS "PrecioPromedioCompra",
        SUM(hc."CantidadTransacciones")::INTEGER AS "NumeroCompras"
    FROM "HechoCompra" hc
    INNER JOIN "DimProducto" dp ON hc."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimMarca" m ON dp."MarcaId" = m."Id"
    INNER JOIN "DimTiempo" t ON hc."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY dp."Id", dp."ProductoNombre", dp."ProductoCodigo", cat."CategoriaNombre", m."MarcaNombre"
    ORDER BY SUM(hc."TotalCompras") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 3. FUNCIONES PARA MÉTRICAS Y KPIs
-- =============================================

-- fn_DW_Metricas_Dashboard: Métricas principales para dashboard
CREATE OR REPLACE FUNCTION fn_DW_Metricas_Dashboard(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE (
    "Metrica" VARCHAR(50),
    "NumeroTransacciones" INTEGER,
    "TotalCantidad" NUMERIC(18,2),
    "TotalMonto" NUMERIC(18,2),
    "PromedioTransaccion" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    -- Ventas del período
    RETURN QUERY
    SELECT 
        'Ventas'::VARCHAR(50) AS "Metrica",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroTransacciones",
        SUM(hv."CantidadVendida") AS "TotalCantidad",
        SUM(hv."TotalVentas") AS "TotalMonto",
        AVG(hv."PromedioTicket") AS "PromedioTransaccion"
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    
    UNION ALL
    
    -- Compras del período
    SELECT 
        'Compras'::VARCHAR(50) AS "Metrica",
        SUM(hc."CantidadTransacciones")::INTEGER AS "NumeroTransacciones",
        SUM(hc."CantidadComprada") AS "TotalCantidad",
        SUM(hc."TotalCompras") AS "TotalMonto",
        AVG(hc."PromedioCompra") AS "PromedioTransaccion"
    FROM "HechoCompra" hc
    INNER JOIN "DimTiempo" t ON hc."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    
    UNION ALL
    
    -- Inventario actual
    SELECT 
        'Inventario'::VARCHAR(50) AS "Metrica",
        COUNT(*)::INTEGER AS "NumeroProductos",
        SUM(hi."StockActual")::NUMERIC(18,2) AS "TotalUnidades",
        SUM(hi."ValorInventario") AS "TotalMonto",
        AVG(hi."ValorInventario") AS "PromedioPorProducto"
    FROM "HechoInventario" hi
    INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
    WHERE dp."Activo" = true;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Metricas_Tendencias: Tendencias de ventas (comparación períodos)
CREATE OR REPLACE FUNCTION fn_DW_Metricas_Tendencias(
    p_periodo_actual_inicio DATE,
    p_periodo_actual_fin DATE,
    p_periodo_anterior_inicio DATE,
    p_periodo_anterior_fin DATE
)
RETURNS TABLE (
    "Periodo" VARCHAR(20),
    "TotalVentas" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "PromedioVenta" NUMERIC(18,2),
    "TotalCantidad" NUMERIC(18,2)
) AS $$
BEGIN
    -- Período actual
    RETURN QUERY
    SELECT 
        'Actual'::VARCHAR(20) AS "Periodo",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        AVG(hv."PromedioTicket") AS "PromedioVenta",
        SUM(hv."CantidadVendida") AS "TotalCantidad"
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_periodo_actual_inicio AND p_periodo_actual_fin
    
    UNION ALL
    
    -- Período anterior
    SELECT 
        'Anterior'::VARCHAR(20) AS "Periodo",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        AVG(hv."PromedioTicket") AS "PromedioVenta",
        SUM(hv."CantidadVendida") AS "TotalCantidad"
    FROM "HechoVenta" hv
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_periodo_anterior_inicio AND p_periodo_anterior_fin;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Metricas_ProductosMasVendidos: Top productos más vendidos
CREATE OR REPLACE FUNCTION fn_DW_Metricas_ProductosMasVendidos(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 10
)
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "MarcaNombre" VARCHAR(100),
    "TotalVendido" NUMERIC(18,2),
    "TotalVentas" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "Ranking" BIGINT
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        dp."Id" AS "ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        m."MarcaNombre",
        SUM(hv."CantidadVendida") AS "TotalVendido",
        SUM(hv."TotalVentas") AS "TotalVentas",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroVentas",
        RANK() OVER (ORDER BY SUM(hv."CantidadVendida") DESC) AS "Ranking"
    FROM "HechoVenta" hv
    INNER JOIN "DimProducto" dp ON hv."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimMarca" m ON dp."MarcaId" = m."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY dp."Id", dp."ProductoNombre", dp."ProductoCodigo", cat."CategoriaNombre", m."MarcaNombre"
    ORDER BY SUM(hv."CantidadVendida") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Metricas_ClientesMasFrecuentes: Top clientes más frecuentes
CREATE OR REPLACE FUNCTION fn_DW_Metricas_ClientesMasFrecuentes(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 10
)
RETURNS TABLE (
    "ClienteId" INTEGER,
    "ClienteNombre" VARCHAR(200),
    "ClienteCodigo" VARCHAR(50),
    "NumeroCompras" INTEGER,
    "TotalGastado" NUMERIC(18,2),
    "PromedioCompra" NUMERIC(18,2),
    "UltimaCompra" DATE,
    "Ranking" BIGINT
) AS $$
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '1 month';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    RETURN QUERY
    SELECT 
        c."Id" AS "ClienteId",
        c."ClienteNombre",
        c."ClienteCodigo",
        SUM(hv."CantidadTransacciones")::INTEGER AS "NumeroCompras",
        SUM(hv."TotalVentas") AS "TotalGastado",
        AVG(hv."PromedioTicket") AS "PromedioCompra",
        MAX(t."Fecha") AS "UltimaCompra",
        RANK() OVER (ORDER BY SUM(hv."CantidadTransacciones") DESC) AS "Ranking"
    FROM "HechoVenta" hv
    INNER JOIN "DimCliente" c ON hv."ClienteId" = c."Id"
    INNER JOIN "DimTiempo" t ON hv."FechaId" = t."Id"
    WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
      AND c."Id" IS NOT NULL
    GROUP BY c."Id", c."ClienteNombre", c."ClienteCodigo"
    ORDER BY SUM(hv."CantidadTransacciones") DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. FUNCIONES PARA REPORTES AVANZADOS
-- =============================================

-- fn_DW_Reporte_VentasVsCompras: Comparación ventas vs compras
CREATE OR REPLACE FUNCTION fn_DW_Reporte_VentasVsCompras(
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_agrupar_por VARCHAR(50) DEFAULT 'Mes'
)
RETURNS TABLE (
    "Anio" INTEGER,
    "Mes" INTEGER,
    "NombreMes" VARCHAR(20),
    "TotalVentas" NUMERIC(18,2),
    "CantidadVendida" NUMERIC(18,2),
    "NumeroVentas" INTEGER,
    "TotalCompras" NUMERIC(18,2),
    "CantidadComprada" NUMERIC(18,2),
    "NumeroCompras" INTEGER,
    "GananciaBruta" NUMERIC(18,2)
) AS $$
BEGIN
    IF p_agrupar_por = 'Mes' THEN
        RETURN QUERY
        SELECT 
            t."Anio",
            t."Mes",
            t."NombreMes",
            -- Ventas
            COALESCE(SUM(hv."TotalVentas"), 0) AS "TotalVentas",
            COALESCE(SUM(hv."CantidadVendida"), 0) AS "CantidadVendida",
            COALESCE(SUM(hv."CantidadTransacciones"), 0)::INTEGER AS "NumeroVentas",
            -- Compras
            COALESCE(SUM(hc."TotalCompras"), 0) AS "TotalCompras",
            COALESCE(SUM(hc."CantidadComprada"), 0) AS "CantidadComprada",
            COALESCE(SUM(hc."CantidadTransacciones"), 0)::INTEGER AS "NumeroCompras",
            -- Ganancia (Ventas - Compras)
            COALESCE(SUM(hv."TotalVentas"), 0) - COALESCE(SUM(hc."TotalCompras"), 0) AS "GananciaBruta"
        FROM "DimTiempo" t
        LEFT JOIN "HechoVenta" hv ON t."Id" = hv."FechaId"
        LEFT JOIN "HechoCompra" hc ON t."Id" = hc."FechaId"
        WHERE t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
        GROUP BY t."Anio", t."Mes", t."NombreMes"
        ORDER BY t."Anio", t."Mes";
    END IF;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Reporte_RotacionInventario: Rotación de inventario por producto
CREATE OR REPLACE FUNCTION fn_DW_Reporte_RotacionInventario(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_top INTEGER DEFAULT 20
)
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "StockActual" INTEGER,
    "StockMinimo" INTEGER,
    "CantidadVendida" NUMERIC(18,2),
    "RotacionInventario" NUMERIC(18,4),
    "DiasInventario" NUMERIC(18,2)
) AS $$
DECLARE
    v_dias_periodo INTEGER;
BEGIN
    IF p_fecha_inicio IS NULL THEN
        p_fecha_inicio := CURRENT_DATE - INTERVAL '3 months';
    END IF;
    IF p_fecha_fin IS NULL THEN
        p_fecha_fin := CURRENT_DATE;
    END IF;
    
    v_dias_periodo := (p_fecha_fin - p_fecha_inicio)::INTEGER;
    
    RETURN QUERY
    SELECT 
        dp."Id" AS "ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        -- Stock actual
        hi."StockActual",
        hi."StockMinimo",
        -- Ventas del período
        COALESCE(SUM(hv."CantidadVendida"), 0) AS "CantidadVendida",
        -- Rotación (Ventas / Stock Actual)
        CASE 
            WHEN hi."StockActual" > 0 
            THEN (COALESCE(SUM(hv."CantidadVendida"), 0) * 1.0 / hi."StockActual")
            ELSE 0 
        END AS "RotacionInventario",
        -- Días de inventario
        CASE 
            WHEN COALESCE(SUM(hv."CantidadVendida"), 0) > 0 
            THEN (hi."StockActual" * v_dias_periodo * 1.0 / SUM(hv."CantidadVendida"))
            ELSE NULL 
        END AS "DiasInventario"
    FROM "HechoInventario" hi
    INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    LEFT JOIN "HechoVenta" hv ON dp."Id" = hv."ProductoId"
    LEFT JOIN "DimTiempo" t ON hv."FechaId" = t."Id" AND t."Fecha" BETWEEN p_fecha_inicio AND p_fecha_fin
    WHERE dp."Activo" = true
    GROUP BY dp."Id", dp."ProductoNombre", dp."ProductoCodigo", cat."CategoriaNombre", hi."StockActual", hi."StockMinimo"
    HAVING COALESCE(SUM(hv."CantidadVendida"), 0) > 0
    ORDER BY "RotacionInventario" DESC
    LIMIT p_top;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. FUNCIONES PARA HECHO INVENTARIO
-- =============================================

-- fn_DW_Inventario_StockActual: Stock actual de todos los productos
CREATE OR REPLACE FUNCTION fn_DW_Inventario_StockActual(
    p_incluir_inactivos BOOLEAN DEFAULT false,
    p_top INTEGER DEFAULT NULL
)
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "MarcaNombre" VARCHAR(100),
    "ModeloNombre" VARCHAR(100),
    "StockActual" INTEGER,
    "StockMinimo" INTEGER,
    "StockBajo" BOOLEAN,
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "ValorInventario" NUMERIC(18,2),
    "FechaActualizacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hi."ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        m."MarcaNombre",
        mo."ModeloNombre",
        hi."StockActual",
        hi."StockMinimo",
        CASE 
            WHEN hi."StockActual" <= hi."StockMinimo" THEN true
            ELSE false
        END AS "StockBajo",
        dp."PrecioCompraPromedio" AS "PrecioCompra",
        dp."PrecioVentaPromedio" AS "PrecioVenta",
        hi."ValorInventario",
        hi."FechaProcesamiento" AS "FechaActualizacion"
    FROM "HechoInventario" hi
    INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimMarca" m ON dp."MarcaId" = m."Id"
    INNER JOIN "DimModelo" mo ON dp."ModeloId" = mo."Id"
    WHERE (p_incluir_inactivos = true OR dp."Activo" = true)
    ORDER BY hi."StockActual" ASC
    LIMIT COALESCE(p_top, 1000);
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Inventario_ProductosStockBajo: Productos con stock bajo
CREATE OR REPLACE FUNCTION fn_DW_Inventario_ProductosStockBajo()
RETURNS TABLE (
    "ProductoId" INTEGER,
    "ProductoNombre" VARCHAR(200),
    "ProductoCodigo" VARCHAR(50),
    "CategoriaNombre" VARCHAR(100),
    "MarcaNombre" VARCHAR(100),
    "StockActual" INTEGER,
    "StockMinimo" INTEGER,
    "CantidadFaltante" INTEGER,
    "PrecioCompra" NUMERIC(18,2),
    "PrecioVenta" NUMERIC(18,2),
    "FechaActualizacion" TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hi."ProductoId",
        dp."ProductoNombre",
        dp."ProductoCodigo",
        cat."CategoriaNombre",
        m."MarcaNombre",
        hi."StockActual",
        hi."StockMinimo",
        (hi."StockMinimo" - hi."StockActual") AS "CantidadFaltante",
        dp."PrecioCompraPromedio" AS "PrecioCompra",
        dp."PrecioVentaPromedio" AS "PrecioVenta",
        hi."FechaProcesamiento" AS "FechaActualizacion"
    FROM "HechoInventario" hi
    INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
    INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
    INNER JOIN "DimMarca" m ON dp."MarcaId" = m."Id"
    WHERE hi."StockActual" <= hi."StockMinimo"
      AND dp."Activo" = true
    ORDER BY (hi."StockMinimo" - hi."StockActual") DESC;
END;
$$ LANGUAGE plpgsql;

-- fn_DW_Inventario_ValorInventario: Valor total del inventario
CREATE OR REPLACE FUNCTION fn_DW_Inventario_ValorInventario(
    p_por_categoria BOOLEAN DEFAULT false
)
RETURNS TABLE (
    "CategoriaId" INTEGER,
    "CategoriaNombre" VARCHAR(100),
    "ValorTotal" NUMERIC(18,2),
    "CantidadProductos" INTEGER
) AS $$
BEGIN
    IF p_por_categoria = false THEN
        RETURN QUERY
        SELECT 
            NULL::INTEGER AS "CategoriaId",
            'Total General'::VARCHAR(100) AS "CategoriaNombre",
            SUM(hi."ValorInventario") AS "ValorTotal",
            COUNT(DISTINCT hi."ProductoId")::INTEGER AS "CantidadProductos"
        FROM "HechoInventario" hi
        INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
        WHERE dp."Activo" = true;
    ELSE
        RETURN QUERY
        SELECT 
            cat."Id" AS "CategoriaId",
            cat."CategoriaNombre",
            SUM(hi."ValorInventario") AS "ValorTotal",
            COUNT(DISTINCT hi."ProductoId")::INTEGER AS "CantidadProductos"
        FROM "HechoInventario" hi
        INNER JOIN "DimProducto" dp ON hi."ProductoId" = dp."Id"
        INNER JOIN "DimCategoria" cat ON dp."CategoriaId" = cat."Id"
        WHERE dp."Activo" = true
        GROUP BY cat."Id", cat."CategoriaNombre"
        ORDER BY SUM(hi."ValorInventario") DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Resumen
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Funciones de Data Warehouse creadas exitosamente';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Total de funciones: 15';
    RAISE NOTICE '- Ventas: 6 funciones';
    RAISE NOTICE '  * PorRangoFechas, PorProducto, PorCategoria, PorCliente, PorEmpleado, MetodoPago';
    RAISE NOTICE '- Compras: 3 funciones';
    RAISE NOTICE '  * PorRangoFechas, PorProveedor, PorProducto';
    RAISE NOTICE '- Inventario: 3 funciones';
    RAISE NOTICE '  * StockActual, ProductosStockBajo, ValorInventario';
    RAISE NOTICE '- Métricas/KPIs: 4 funciones';
    RAISE NOTICE '  * Dashboard, Tendencias, ProductosMasVendidos, ClientesMasFrecuentes';
    RAISE NOTICE '- Reportes Avanzados: 2 funciones';
    RAISE NOTICE '  * VentasVsCompras, RotacionInventario';
    RAISE NOTICE '=============================================';
END $$;


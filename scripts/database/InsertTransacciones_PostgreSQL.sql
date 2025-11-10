-- =============================================
-- Script de Inserts de Transacciones - PostgreSQL
-- Compras, Ventas, Devoluciones y MovimientosStock
-- Base de Datos: PostgreSQL (Supabase)
-- =============================================

-- =============================================
-- 1. COMPRAS Y COMPRASDETALLE
-- =============================================

DO $$
DECLARE
    admin_user_id INTEGER;
    vendedor_user_id INTEGER;
    supervisor_user_id INTEGER;
    compras_count INTEGER := 1;
    fecha_inicio DATE := CURRENT_DATE - INTERVAL '6 months';
    fecha_fin DATE := CURRENT_DATE;
    fecha_compra TIMESTAMP;
    proveedor_id INTEGER;
    usuario_id INTEGER;
    compra_id INTEGER;
    folio_compra VARCHAR(50);
    detalles_count INTEGER;
    subtotal_total NUMERIC(18,2);
    detalle_producto_id INTEGER;
    cantidad NUMERIC(18,2);
    precio_unitario NUMERIC(18,2);
    subtotal NUMERIC(18,2);
    impuestos NUMERIC(18,2);
    total NUMERIC(18,2);
    proveedor_ids INTEGER[];
    detalle_producto_ids INTEGER[];
BEGIN
    -- Obtener IDs de usuarios
    SELECT "Id" INTO admin_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'admin';
    SELECT "Id" INTO vendedor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'vendedor1';
    SELECT "Id" INTO supervisor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'supervisor1';

    -- Obtener arrays de IDs
    SELECT ARRAY_AGG("Id") INTO proveedor_ids FROM "Proveedores";
    SELECT ARRAY_AGG("Id") INTO detalle_producto_ids FROM "DetalleProducto";

    -- Verificar que hay datos base
    IF admin_user_id IS NULL OR array_length(proveedor_ids, 1) IS NULL OR array_length(detalle_producto_ids, 1) IS NULL THEN
        RAISE NOTICE '❌ Faltan datos base. Ejecuta primero InsertTestData_PostgreSQL.sql';
        RETURN;
    END IF;

    RAISE NOTICE 'Creando 100 compras...';

    -- Crear 100 Compras
    WHILE compras_count <= 100 LOOP
        -- Fecha aleatoria entre fecha_inicio y fecha_fin
        fecha_compra := fecha_inicio + floor(RANDOM() * (fecha_fin - fecha_inicio)::INTEGER)::INTEGER * INTERVAL '1 day';
        
        -- Proveedor aleatorio
        proveedor_id := proveedor_ids[1 + floor(random() * array_length(proveedor_ids, 1))::INTEGER];
        
        -- Usuario alternado
        usuario_id := CASE WHEN compras_count % 3 = 0 THEN admin_user_id ELSE vendedor_user_id END;
        
        -- Folio
        folio_compra := 'COMP-' || LPAD(compras_count::TEXT, 4, '0');
        
        -- Insertar compra
        INSERT INTO "Compras" ("Folio", "ProveedorId", "UsuarioId", "FechaCompra", "Subtotal", "Impuestos", "Total", "Estado", "Observaciones")
        VALUES (folio_compra, proveedor_id, usuario_id, fecha_compra, 0, 0, 0, 'Completada', 'Compra de prueba')
        RETURNING "Id" INTO compra_id;
        
        -- Detalles (1 a 5 productos por compra)
        detalles_count := 1 + floor(random() * 5)::INTEGER;
        subtotal_total := 0;
        
        WHILE detalles_count > 0 LOOP
            -- Producto aleatorio
            detalle_producto_id := detalle_producto_ids[1 + floor(random() * array_length(detalle_producto_ids, 1))::INTEGER];
            
            -- Cantidad (10 a 50)
            cantidad := 10 + floor(random() * 40)::INTEGER;
            
            -- Precio unitario desde DetalleProducto
            SELECT "PrecioCompra" INTO precio_unitario FROM "DetalleProducto" WHERE "Id" = detalle_producto_id;
            
            subtotal := cantidad * precio_unitario;
            
            -- Insertar detalle
            INSERT INTO "ComprasDetalle" ("CompraId", "DetalleProductoId", "Cantidad", "PrecioUnitario", "Subtotal")
            VALUES (compra_id, detalle_producto_id, cantidad, precio_unitario, subtotal);
            
            subtotal_total := subtotal_total + subtotal;
            detalles_count := detalles_count - 1;
        END LOOP;
        
        -- Calcular totales
        impuestos := subtotal_total * 0.15;
        total := subtotal_total + impuestos;
        
        -- Actualizar compra con totales
        UPDATE "Compras" 
        SET "Subtotal" = subtotal_total, "Impuestos" = impuestos, "Total" = total 
        WHERE "Id" = compra_id;
        
        compras_count := compras_count + 1;
    END LOOP;

    RAISE NOTICE '✅ 100 Compras creadas exitosamente';
END $$;

-- =============================================
-- 2. VENTAS Y VENTASDETALLE
-- =============================================

DO $$
DECLARE
    admin_user_id INTEGER;
    vendedor_user_id INTEGER;
    supervisor_user_id INTEGER;
    ventas_count INTEGER := 1;
    fecha_inicio_venta DATE := CURRENT_DATE - INTERVAL '6 months';
    fecha_fin_venta DATE := CURRENT_DATE;
    fecha_venta TIMESTAMP;
    cliente_id INTEGER;
    empleado_id INTEGER;
    usuario_venta_id INTEGER;
    venta_id INTEGER;
    folio_venta VARCHAR(50);
    detalles_venta_count INTEGER;
    subtotal_venta_total NUMERIC(18,2);
    detalle_producto_venta_id INTEGER;
    cantidad_venta NUMERIC(18,2);
    precio_unitario_venta NUMERIC(18,2);
    descuento NUMERIC(18,2);
    subtotal_venta NUMERIC(18,2);
    impuestos_venta NUMERIC(18,2);
    total_venta NUMERIC(18,2);
    metodo_pago VARCHAR(50);
    empleado_ids INTEGER[];
    cliente_ids INTEGER[];
    detalle_producto_ids INTEGER[];
BEGIN
    -- Obtener IDs de usuarios
    SELECT "Id" INTO admin_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'admin';
    SELECT "Id" INTO vendedor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'vendedor1';
    SELECT "Id" INTO supervisor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'supervisor1';

    -- Obtener arrays de IDs
    SELECT ARRAY_AGG("Id") INTO empleado_ids FROM "Empleados";
    SELECT ARRAY_AGG("Id") INTO cliente_ids FROM "Clientes";
    SELECT ARRAY_AGG("Id") INTO detalle_producto_ids FROM "DetalleProducto";

    -- Verificar que hay datos base
    IF supervisor_user_id IS NULL OR array_length(empleado_ids, 1) IS NULL OR array_length(detalle_producto_ids, 1) IS NULL THEN
        RAISE NOTICE '❌ Faltan datos base. Ejecuta primero InsertTestData_PostgreSQL.sql';
        RETURN;
    END IF;

    RAISE NOTICE 'Creando 100 ventas...';

    -- Crear 100 Ventas
    WHILE ventas_count <= 100 LOOP
        -- Fecha aleatoria
        fecha_venta := fecha_inicio_venta + floor(RANDOM() * (fecha_fin_venta - fecha_inicio_venta)::INTEGER)::INTEGER * INTERVAL '1 day';
        
        -- Cliente (algunas ventas sin cliente)
        IF ventas_count % 4 = 0 THEN
            cliente_id := NULL;
        ELSE
            cliente_id := cliente_ids[1 + floor(random() * array_length(cliente_ids, 1))::INTEGER];
        END IF;
        
        -- Empleado aleatorio
        empleado_id := empleado_ids[1 + floor(random() * array_length(empleado_ids, 1))::INTEGER];
        
        -- Usuario alternado
        usuario_venta_id := CASE WHEN ventas_count % 3 = 0 THEN supervisor_user_id ELSE vendedor_user_id END;
        
        -- Método de pago
        metodo_pago := CASE 
            WHEN ventas_count % 3 = 0 THEN 'Tarjeta'
            WHEN ventas_count % 3 = 1 THEN 'Efectivo'
            ELSE 'Transferencia'
        END;
        
        -- Folio
        folio_venta := 'VENT-' || LPAD(ventas_count::TEXT, 4, '0');
        
        -- Insertar venta
        INSERT INTO "Ventas" ("Folio", "ClienteId", "UsuarioId", "EmpleadoId", "FechaVenta", "Subtotal", "Impuestos", "Descuento", "Total", "MetodoPago", "Estado", "Observaciones")
        VALUES (folio_venta, cliente_id, usuario_venta_id, empleado_id, fecha_venta, 0, 0, 0, 0, metodo_pago, 'Completada', 'Venta de prueba')
        RETURNING "Id" INTO venta_id;
        
        -- Detalles (1 a 4 productos por venta)
        detalles_venta_count := 1 + floor(random() * 4)::INTEGER;
        subtotal_venta_total := 0;
        
        WHILE detalles_venta_count > 0 LOOP
            -- Producto aleatorio
            detalle_producto_venta_id := detalle_producto_ids[1 + floor(random() * array_length(detalle_producto_ids, 1))::INTEGER];
            
            -- Cantidad (1 a 10)
            cantidad_venta := 1 + floor(random() * 10)::INTEGER;
            
            -- Precio unitario desde DetalleProducto
            SELECT "PrecioVenta" INTO precio_unitario_venta FROM "DetalleProducto" WHERE "Id" = detalle_producto_venta_id;
            
            -- Descuento (10% cada 10 ventas)
            descuento := CASE 
                WHEN ventas_count % 10 = 0 THEN precio_unitario_venta * cantidad_venta * 0.1 
                ELSE 0 
            END;
            
            subtotal_venta := (precio_unitario_venta * cantidad_venta) - descuento;
            
            -- Insertar detalle
            INSERT INTO "VentasDetalle" ("VentaId", "DetalleProductoId", "Cantidad", "PrecioUnitario", "Descuento", "Subtotal")
            VALUES (venta_id, detalle_producto_venta_id, cantidad_venta, precio_unitario_venta, descuento, subtotal_venta);
            
            subtotal_venta_total := subtotal_venta_total + subtotal_venta;
            detalles_venta_count := detalles_venta_count - 1;
        END LOOP;
        
        -- Calcular totales
        impuestos_venta := subtotal_venta_total * 0.15;
        total_venta := subtotal_venta_total + impuestos_venta;
        
        -- Actualizar venta con totales
        UPDATE "Ventas" 
        SET "Subtotal" = subtotal_venta_total, "Impuestos" = impuestos_venta, "Total" = total_venta 
        WHERE "Id" = venta_id;
        
        ventas_count := ventas_count + 1;
    END LOOP;

    RAISE NOTICE '✅ 100 Ventas creadas exitosamente';
END $$;

-- =============================================
-- 3. DEVOLUCIONESVENTA Y DEVOLUCIONESVENTADETALLE
-- =============================================

DO $$
DECLARE
    admin_user_id INTEGER;
    vendedor_user_id INTEGER;
    supervisor_user_id INTEGER;
    devoluciones_count INTEGER := 1;
    fecha_inicio_devolucion DATE := CURRENT_DATE - INTERVAL '3 months';
    fecha_fin_devolucion DATE := CURRENT_DATE;
    fecha_devolucion TIMESTAMP;
    venta_devolucion_id INTEGER;
    usuario_devolucion_id INTEGER;
    devolucion_venta_id INTEGER;
    folio_devolucion VARCHAR(50);
    venta_detalle_id INTEGER;
    detalle_producto_devolucion_id INTEGER;
    cantidad_devolver NUMERIC(18,2);
    cantidad_original NUMERIC(18,2);
    subtotal_original NUMERIC(18,2);
    subtotal_devolucion NUMERIC(18,2);
    total_devolucion NUMERIC(18,2);
    ventas_disponibles RECORD;
    venta_detalle_rec RECORD;
BEGIN
    -- Obtener IDs de usuarios
    SELECT "Id" INTO admin_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'admin';
    SELECT "Id" INTO vendedor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'vendedor1';
    SELECT "Id" INTO supervisor_user_id FROM "Usuarios" WHERE "NombreUsuario" = 'supervisor1';

    -- Verificar que hay ventas
    IF NOT EXISTS (SELECT 1 FROM "Ventas") THEN
        RAISE NOTICE '⚠️  No se pueden crear devoluciones porque no hay ventas en el sistema.';
        RETURN;
    END IF;

    RAISE NOTICE 'Creando devoluciones...';

    -- Crear hasta 12 devoluciones
    WHILE devoluciones_count <= 12 LOOP
        -- Buscar una venta que no haya sido devuelta completamente
        SELECT v."Id" INTO venta_devolucion_id
        FROM "Ventas" v
        INNER JOIN "VentasDetalle" vd ON v."Id" = vd."VentaId"
        WHERE NOT EXISTS (
            SELECT 1 FROM "DevolucionesVenta" dv 
            WHERE dv."VentaId" = v."Id" AND dv."Estado" = 'Completada'
        )
        AND NOT EXISTS (
            SELECT 1 FROM "DevolucionesVentaDetalle" dvd
            INNER JOIN "DevolucionesVenta" dv ON dvd."DevolucionVentaId" = dv."Id"
            WHERE dv."VentaId" = v."Id" AND dvd."VentaDetalleId" = vd."Id"
        )
        ORDER BY RANDOM()
        LIMIT 1;

        -- Si no hay ventas disponibles, salir
        IF venta_devolucion_id IS NULL THEN
            EXIT;
        END IF;

        -- Fecha aleatoria
        fecha_devolucion := fecha_inicio_devolucion + floor(RANDOM() * (fecha_fin_devolucion - fecha_inicio_devolucion)::INTEGER)::INTEGER * INTERVAL '1 day';
        
        -- Usuario alternado
        usuario_devolucion_id := CASE 
            WHEN devoluciones_count % 3 = 0 THEN supervisor_user_id
            WHEN devoluciones_count % 2 = 0 THEN vendedor_user_id
            ELSE admin_user_id
        END;
        
        -- Folio
        folio_devolucion := 'DEV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(devoluciones_count::TEXT, 4, '0');
        
        -- Obtener un detalle de la venta que no haya sido devuelto
        SELECT vd."Id", vd."DetalleProductoId", vd."Cantidad", vd."Subtotal"
        INTO venta_detalle_rec
        FROM "VentasDetalle" vd
        WHERE vd."VentaId" = venta_devolucion_id
        AND NOT EXISTS (
            SELECT 1 FROM "DevolucionesVentaDetalle" dvd 
            WHERE dvd."VentaDetalleId" = vd."Id"
        )
        ORDER BY RANDOM()
        LIMIT 1;

        -- Si no hay detalles disponibles, continuar
        IF venta_detalle_rec IS NULL THEN
            devoluciones_count := devoluciones_count + 1;
            CONTINUE;
        END IF;

        venta_detalle_id := venta_detalle_rec."Id";
        detalle_producto_devolucion_id := venta_detalle_rec."DetalleProductoId";
        cantidad_original := venta_detalle_rec."Cantidad";
        subtotal_original := venta_detalle_rec."Subtotal";

        -- Calcular cantidad a devolver
        IF cantidad_original <= 1 THEN
            cantidad_devolver := 1;
        ELSIF cantidad_original <= 3 THEN
            cantidad_devolver := 1 + floor(random() * cantidad_original)::INTEGER;
        ELSE
            cantidad_devolver := 1 + floor(random() * 3)::INTEGER;
        END IF;

        -- Calcular subtotal de devolución
        subtotal_devolucion := (subtotal_original / cantidad_original) * cantidad_devolver;
        total_devolucion := subtotal_devolucion;
        
        -- Insertar devolución
        INSERT INTO "DevolucionesVenta" ("Folio", "VentaId", "UsuarioId", "FechaDevolucion", "Motivo", "TotalDevolucion", "Estado", "Observaciones")
        VALUES (folio_devolucion, venta_devolucion_id, usuario_devolucion_id, fecha_devolucion, 'Devolución de prueba', total_devolucion, 'Completada', 'Devolución de prueba para pruebas del sistema')
        RETURNING "Id" INTO devolucion_venta_id;
        
        -- Insertar detalle de devolución
        INSERT INTO "DevolucionesVentaDetalle" ("DevolucionVentaId", "VentaDetalleId", "DetalleProductoId", "CantidadDevolver", "Motivo", "Subtotal")
        VALUES (devolucion_venta_id, venta_detalle_id, detalle_producto_devolucion_id, cantidad_devolver, 'Producto defectuoso o devolución solicitada por cliente', subtotal_devolucion);
        
        devoluciones_count := devoluciones_count + 1;
    END LOOP;

    RAISE NOTICE '✅ Devoluciones creadas exitosamente: %', devoluciones_count - 1;
END $$;

-- =============================================
-- 4. MOVIMIENTOSSTOCK (Generados desde transacciones)
-- =============================================

-- Crear movimientos de stock desde compras (entradas)
INSERT INTO "MovimientosStock" (
    "DetalleProductoId", "TipoMovimiento", "Cantidad", 
    "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", 
    "UsuarioId", "Motivo", "FechaMovimiento"
)
SELECT 
    cd."DetalleProductoId",
    'Entrada'::VARCHAR,
    cd."Cantidad",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = cd."DetalleProductoId" 
        AND ms."FechaMovimiento" < c."FechaCompra"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") AS "StockAnterior",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = cd."DetalleProductoId" 
        AND ms."FechaMovimiento" < c."FechaCompra"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") + cd."Cantidad" AS "StockNuevo",
    c."Id" AS "ReferenciaId",
    'Compra'::VARCHAR AS "ReferenciaTipo",
    c."UsuarioId",
    'Compra de productos'::VARCHAR AS "Motivo",
    c."FechaCompra" AS "FechaMovimiento"
FROM "ComprasDetalle" cd
INNER JOIN "Compras" c ON cd."CompraId" = c."Id"
INNER JOIN "DetalleProducto" dp ON cd."DetalleProductoId" = dp."Id"
ORDER BY c."FechaCompra", c."Id";

-- Crear movimientos de stock desde ventas (salidas)
INSERT INTO "MovimientosStock" (
    "DetalleProductoId", "TipoMovimiento", "Cantidad", 
    "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", 
    "UsuarioId", "Motivo", "FechaMovimiento"
)
SELECT 
    vd."DetalleProductoId",
    'Salida'::VARCHAR,
    vd."Cantidad",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = vd."DetalleProductoId" 
        AND ms."FechaMovimiento" < v."FechaVenta"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") AS "StockAnterior",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = vd."DetalleProductoId" 
        AND ms."FechaMovimiento" < v."FechaVenta"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") - vd."Cantidad" AS "StockNuevo",
    v."Id" AS "ReferenciaId",
    'Venta'::VARCHAR AS "ReferenciaTipo",
    v."UsuarioId",
    'Venta de productos'::VARCHAR AS "Motivo",
    v."FechaVenta" AS "FechaMovimiento"
FROM "VentasDetalle" vd
INNER JOIN "Ventas" v ON vd."VentaId" = v."Id"
INNER JOIN "DetalleProducto" dp ON vd."DetalleProductoId" = dp."Id"
ORDER BY v."FechaVenta", v."Id";

-- Crear movimientos de stock desde devoluciones (entradas)
INSERT INTO "MovimientosStock" (
    "DetalleProductoId", "TipoMovimiento", "Cantidad", 
    "StockAnterior", "StockNuevo", "ReferenciaId", "ReferenciaTipo", 
    "UsuarioId", "Motivo", "FechaMovimiento"
)
SELECT 
    dvd."DetalleProductoId",
    'Entrada'::VARCHAR,
    dvd."CantidadDevolver",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = dvd."DetalleProductoId" 
        AND ms."FechaMovimiento" < dv."FechaDevolucion"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") AS "StockAnterior",
    COALESCE((
        SELECT ms."StockNuevo" 
        FROM "MovimientosStock" ms
        WHERE ms."DetalleProductoId" = dvd."DetalleProductoId" 
        AND ms."FechaMovimiento" < dv."FechaDevolucion"
        ORDER BY ms."FechaMovimiento" DESC
        LIMIT 1
    ), dp."Stock") + dvd."CantidadDevolver" AS "StockNuevo",
    dv."Id" AS "ReferenciaId",
    'Devolucion'::VARCHAR AS "ReferenciaTipo",
    dv."UsuarioId",
    'Devolución de productos'::VARCHAR AS "Motivo",
    dv."FechaDevolucion" AS "FechaMovimiento"
FROM "DevolucionesVentaDetalle" dvd
INNER JOIN "DevolucionesVenta" dv ON dvd."DevolucionVentaId" = dv."Id"
INNER JOIN "DetalleProducto" dp ON dvd."DetalleProductoId" = dp."Id"
ORDER BY dv."FechaDevolucion", dv."Id";

-- =============================================
-- Resumen
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Transacciones insertadas exitosamente';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Compras: %', (SELECT COUNT(*) FROM "Compras");
    RAISE NOTICE 'ComprasDetalle: %', (SELECT COUNT(*) FROM "ComprasDetalle");
    RAISE NOTICE 'Ventas: %', (SELECT COUNT(*) FROM "Ventas");
    RAISE NOTICE 'VentasDetalle: %', (SELECT COUNT(*) FROM "VentasDetalle");
    RAISE NOTICE 'DevolucionesVenta: %', (SELECT COUNT(*) FROM "DevolucionesVenta");
    RAISE NOTICE 'DevolucionesVentaDetalle: %', (SELECT COUNT(*) FROM "DevolucionesVentaDetalle");
    RAISE NOTICE 'MovimientosStock: %', (SELECT COUNT(*) FROM "MovimientosStock");
    RAISE NOTICE '=============================================';
END $$;


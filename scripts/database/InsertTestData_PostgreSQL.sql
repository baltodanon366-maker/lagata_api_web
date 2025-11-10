-- =============================================
-- Script de Datos de Prueba - Licoreria API
-- Base de Datos: PostgreSQL (Supabase)
-- Adaptado de SQL Server a PostgreSQL
-- =============================================

-- =============================================
-- 1. ROLES Y PERMISOS
-- =============================================

-- Insertar Roles
INSERT INTO "Roles" ("Nombre", "Descripcion", "Activo")
VALUES 
    ('Administrador', 'Acceso completo al sistema. Puede gestionar usuarios, catálogos, transacciones y reportes.', true),
    ('Vendedor', 'Acceso a ventas, compras y devoluciones. Solo lectura en catálogos. Reportes con filtros.', true),
    ('Supervisor', 'Puede gestionar ventas, compras, devoluciones y ver reportes completos. No puede gestionar usuarios.', true)
ON CONFLICT ("Nombre") DO NOTHING;

-- Insertar Permisos
INSERT INTO "Permisos" ("Nombre", "Descripcion", "Modulo", "Activo")
VALUES
    ('Usuarios_Crear', 'Crear nuevos usuarios', 'Seguridad', true),
    ('Usuarios_Editar', 'Editar usuarios existentes', 'Seguridad', true),
    ('Usuarios_Eliminar', 'Eliminar usuarios', 'Seguridad', true),
    ('Usuarios_Ver', 'Ver lista de usuarios', 'Seguridad', true),
    ('Roles_Asignar', 'Asignar roles a usuarios', 'Seguridad', true),
    ('Catálogos_Crear', 'Crear nuevos registros en catálogos', 'Catálogos', true),
    ('Catálogos_Editar', 'Editar registros en catálogos', 'Catálogos', true),
    ('Catálogos_Eliminar', 'Eliminar registros en catálogos', 'Catálogos', true),
    ('Catálogos_Ver', 'Ver catálogos', 'Catálogos', true),
    ('Ventas_Crear', 'Crear nuevas ventas', 'Transacciones', true),
    ('Ventas_Editar', 'Editar ventas', 'Transacciones', true),
    ('Ventas_Cancelar', 'Cancelar ventas', 'Transacciones', true),
    ('Ventas_Ver', 'Ver ventas', 'Transacciones', true),
    ('Compras_Crear', 'Crear nuevas compras', 'Transacciones', true),
    ('Compras_Editar', 'Editar compras', 'Transacciones', true),
    ('Compras_Cancelar', 'Cancelar compras', 'Transacciones', true),
    ('Compras_Ver', 'Ver compras', 'Transacciones', true),
    ('Devoluciones_Crear', 'Crear devoluciones', 'Transacciones', true),
    ('Devoluciones_Ver', 'Ver devoluciones', 'Transacciones', true),
    ('Reportes_Ver', 'Ver reportes', 'Reportes', true),
    ('Reportes_Exportar', 'Exportar reportes', 'Reportes', true),
    ('Inventario_Ver', 'Ver inventario', 'Inventario', true),
    ('Inventario_Ajustar', 'Ajustar inventario', 'Inventario', true)
ON CONFLICT ("Nombre") DO NOTHING;

-- Asignar Permisos a Roles
-- Administrador: Todos los permisos
INSERT INTO "RolesPermisos" ("RolId", "PermisoId")
SELECT r."Id", p."Id"
FROM "Roles" r
CROSS JOIN "Permisos" p
WHERE r."Nombre" = 'Administrador'
AND NOT EXISTS (
    SELECT 1 FROM "RolesPermisos" rp 
    WHERE rp."RolId" = r."Id" AND rp."PermisoId" = p."Id"
);

-- Vendedor: Solo lectura en catálogos, ventas/compras/devoluciones, reportes ver
INSERT INTO "RolesPermisos" ("RolId", "PermisoId")
SELECT r."Id", p."Id"
FROM "Roles" r
CROSS JOIN "Permisos" p
WHERE r."Nombre" = 'Vendedor'
AND p."Nombre" IN (
    'Catálogos_Ver',
    'Ventas_Crear', 'Ventas_Ver',
    'Compras_Crear', 'Compras_Ver',
    'Devoluciones_Crear', 'Devoluciones_Ver',
    'Reportes_Ver',
    'Inventario_Ver'
)
AND NOT EXISTS (
    SELECT 1 FROM "RolesPermisos" rp 
    WHERE rp."RolId" = r."Id" AND rp."PermisoId" = p."Id"
);

-- Supervisor: Catálogos completos, transacciones, reportes, pero no usuarios
INSERT INTO "RolesPermisos" ("RolId", "PermisoId")
SELECT r."Id", p."Id"
FROM "Roles" r
CROSS JOIN "Permisos" p
WHERE r."Nombre" = 'Supervisor'
AND p."Nombre" NOT LIKE 'Usuarios_%'
AND p."Nombre" NOT LIKE 'Roles_%'
AND NOT EXISTS (
    SELECT 1 FROM "RolesPermisos" rp 
    WHERE rp."RolId" = r."Id" AND rp."PermisoId" = p."Id"
);

-- =============================================
-- 2. USUARIOS
-- =============================================

-- NOTA: Los passwords deben ser hasheados con BCrypt antes de insertar
-- Por ahora usamos placeholders. Se actualizarán cuando implementemos el módulo de Auth

-- Usuario Administrador (password: Admin123!)
-- Hash BCrypt generado con bcrypt.hash('Admin123!', 12)
INSERT INTO "Usuarios" ("NombreUsuario", "Email", "PasswordHash", "NombreCompleto", "Rol", "Activo")
VALUES 
    ('admin', 'admin@licoreria.com', '$2b$12$z6UUE3BPND/PybbYC4/62usNRUJ07CDjkkQGWLSF8W8BmVI9hnVm.', 'Administrador del Sistema', 'Administrador', true)
ON CONFLICT ("NombreUsuario") DO NOTHING;

-- Usuario Vendedor (password: Vendedor123!)
-- Hash BCrypt generado con bcrypt.hash('Vendedor123!', 12)
INSERT INTO "Usuarios" ("NombreUsuario", "Email", "PasswordHash", "NombreCompleto", "Rol", "Activo")
VALUES 
    ('vendedor1', 'vendedor1@licoreria.com', '$2b$12$sNYm50lWYdS2T1D3jACkPOMR64Dyp6e9EVsFlFWvHVG.uAkqlq.CS', 'Juan Pérez', 'Vendedor', true)
ON CONFLICT ("NombreUsuario") DO NOTHING;

-- Usuario Supervisor (password: Supervisor123!)
-- Hash BCrypt generado con bcrypt.hash('Supervisor123!', 12)
INSERT INTO "Usuarios" ("NombreUsuario", "Email", "PasswordHash", "NombreCompleto", "Rol", "Activo")
VALUES 
    ('supervisor1', 'supervisor1@licoreria.com', '$2b$12$nqOE0.TP6BECZBWlGeFK5ecTk/sswkK0UQObvwtSbIzYsHum4.p8W', 'María González', 'Supervisor', true)
ON CONFLICT ("NombreUsuario") DO NOTHING;

-- Asignar Roles a Usuarios
INSERT INTO "UsuariosRoles" ("UsuarioId", "RolId")
SELECT u."Id", r."Id"
FROM "Usuarios" u
CROSS JOIN "Roles" r
WHERE (u."NombreUsuario" = 'admin' AND r."Nombre" = 'Administrador')
   OR (u."NombreUsuario" = 'vendedor1' AND r."Nombre" = 'Vendedor')
   OR (u."NombreUsuario" = 'supervisor1' AND r."Nombre" = 'Supervisor')
ON CONFLICT ("UsuarioId", "RolId") DO NOTHING;

-- =============================================
-- 3. CATÁLOGOS: CATEGORÍAS, MARCAS, MODELOS
-- =============================================

-- Categorías (20 categorías realistas para licorería)
INSERT INTO "Categorias" ("Nombre", "Descripcion", "Activo")
VALUES
    ('Ron', 'Bebidas alcohólicas destiladas de caña de azúcar', true),
    ('Vodka', 'Bebida alcohólica destilada sin sabor', true),
    ('Whisky', 'Bebida alcohólica destilada de cereales', true),
    ('Tequila', 'Bebida alcohólica destilada del agave', true),
    ('Ginebra', 'Bebida alcohólica destilada con enebro', true),
    ('Brandy', 'Bebida alcohólica destilada del vino', true),
    ('Coñac', 'Brandy producido en la región de Coñac', true),
    ('Champagne', 'Vino espumoso de la región de Champagne', true),
    ('Vino Tinto', 'Vino elaborado con uvas tintas', true),
    ('Vino Blanco', 'Vino elaborado con uvas blancas', true),
    ('Vino Rosado', 'Vino con color rosado', true),
    ('Cerveza', 'Bebida alcohólica fermentada', true),
    ('Cerveza Artesanal', 'Cerveza producida en pequeñas cantidades', true),
    ('Licor', 'Bebida alcohólica dulce y aromática', true),
    ('Anís', 'Bebida alcohólica con sabor a anís', true),
    ('Aguardiente', 'Bebida alcohólica destilada fuerte', true),
    ('Cocktail', 'Mezcla de bebidas alcohólicas', true),
    ('Sake', 'Bebida alcohólica japonesa de arroz', true),
    ('Soju', 'Bebida alcohólica coreana', true),
    ('Aperitivo', 'Bebida alcohólica para antes de las comidas', true)
ON CONFLICT ("Nombre") DO NOTHING;

-- Marcas (30 marcas realistas)
INSERT INTO "Marcas" ("Nombre", "Descripcion", "Activo")
VALUES
    ('Bacardi', 'Marca líder de ron', true),
    ('Havana Club', 'Ron cubano premium', true),
    ('Flor de Caña', 'Ron nicaragüense', true),
    ('Captain Morgan', 'Ron especiado', true),
    ('Smirnoff', 'Vodka ruso', true),
    ('Absolut', 'Vodka sueco', true),
    ('Grey Goose', 'Vodka premium francés', true),
    ('Johnnie Walker', 'Whisky escocés', true),
    ('Jack Daniels', 'Whisky americano', true),
    ('Chivas Regal', 'Whisky escocés premium', true),
    ('Jose Cuervo', 'Tequila mexicano', true),
    ('Patrón', 'Tequila premium', true),
    ('Don Julio', 'Tequila ultra premium', true),
    ('Bombay Sapphire', 'Ginebra premium', true),
    ('Hennessy', 'Coñac francés', true),
    ('Rémy Martin', 'Coñac francés', true),
    ('Moët & Chandon', 'Champagne francés', true),
    ('Dom Pérignon', 'Champagne premium', true),
    ('Concha y Toro', 'Vino chileno', true),
    ('Santa Rita', 'Vino chileno', true),
    ('Corona', 'Cerveza mexicana', true),
    ('Heineken', 'Cerveza holandesa', true),
    ('Stella Artois', 'Cerveza belga', true),
    ('Baileys', 'Licor irlandés', true),
    ('Kahlúa', 'Licor de café mexicano', true),
    ('Amarula', 'Licor sudafricano', true),
    ('Jägermeister', 'Licor alemán', true),
    ('Grand Marnier', 'Licor francés', true),
    ('Cointreau', 'Licor francés', true),
    ('Fernet Branca', 'Aperitivo italiano', true)
ON CONFLICT ("Nombre") DO NOTHING;

-- Modelos (25 modelos variados)
INSERT INTO "Modelos" ("Nombre", "Descripcion", "Activo")
VALUES
    ('750ml', 'Botella estándar de 750ml', true),
    ('1L', 'Botella de 1 litro', true),
    ('375ml', 'Media botella', true),
    ('1.75L', 'Botella grande de 1.75 litros', true),
    ('200ml', 'Botella pequeña', true),
    ('500ml', 'Botella mediana', true),
    ('6 Pack', 'Pack de 6 unidades', true),
    ('12 Pack', 'Pack de 12 unidades', true),
    ('24 Pack', 'Pack de 24 unidades', true),
    ('Caja', 'Presentación en caja', true),
    ('Lata 355ml', 'Lata estándar', true),
    ('Lata 473ml', 'Lata grande', true),
    ('Botella 330ml', 'Botella de cerveza', true),
    ('Botella 500ml', 'Botella de cerveza grande', true),
    ('Botella 750ml Premium', 'Botella premium', true),
    ('Botella 1L Premium', 'Botella grande premium', true),
    ('Magnum 1.5L', 'Botella magnum', true),
    ('Jeroboam 3L', 'Botella jeroboam', true),
    ('Pack Promocional', 'Pack promocional', true),
    ('Edición Limitada', 'Edición limitada', true),
    ('Añejo', 'Versión añeja', true),
    ('Reserva', 'Versión reserva', true),
    ('Premium', 'Versión premium', true),
    ('Ultra Premium', 'Versión ultra premium', true),
    ('Standard', 'Versión estándar', true)
ON CONFLICT ("Nombre") DO NOTHING;

-- =============================================
-- 4. PRODUCTOS Y DETALLEPRODUCTO
-- =============================================

-- Productos (30 productos variados)
INSERT INTO "Productos" ("Nombre", "Descripcion", "Activo")
VALUES
    ('Ron Bacardi Superior', 'Ron blanco suave y ligero', true),
    ('Ron Havana Club 7 Años', 'Ron añejo cubano', true),
    ('Ron Flor de Caña 12 Años', 'Ron premium nicaragüense', true),
    ('Vodka Smirnoff', 'Vodka ruso suave', true),
    ('Vodka Absolut', 'Vodka sueco premium', true),
    ('Whisky Johnnie Walker Black', 'Whisky escocés 12 años', true),
    ('Whisky Jack Daniels', 'Whisky americano', true),
    ('Tequila Jose Cuervo Tradicional', 'Tequila blanco mexicano', true),
    ('Tequila Patrón Silver', 'Tequila premium', true),
    ('Ginebra Bombay Sapphire', 'Ginebra premium inglesa', true),
    ('Coñac Hennessy VS', 'Coñac francés', true),
    ('Champagne Moët & Chandon', 'Champagne francés', true),
    ('Vino Tinto Concha y Toro', 'Vino tinto chileno', true),
    ('Vino Blanco Santa Rita', 'Vino blanco chileno', true),
    ('Cerveza Corona Extra', 'Cerveza mexicana', true),
    ('Cerveza Heineken', 'Cerveza holandesa', true),
    ('Licor Baileys', 'Licor irlandés cremoso', true),
    ('Licor Kahlúa', 'Licor de café', true),
    ('Ron Captain Morgan', 'Ron especiado', true),
    ('Whisky Chivas Regal 12', 'Whisky escocés premium', true),
    ('Tequila Don Julio 1942', 'Tequila ultra premium', true),
    ('Vodka Grey Goose', 'Vodka premium francés', true),
    ('Coñac Rémy Martin VSOP', 'Coñac francés VSOP', true),
    ('Champagne Dom Pérignon', 'Champagne ultra premium', true),
    ('Vino Rosado Concha y Toro', 'Vino rosado chileno', true),
    ('Cerveza Stella Artois', 'Cerveza belga', true),
    ('Licor Amarula', 'Licor sudafricano', true),
    ('Licor Jägermeister', 'Licor alemán', true),
    ('Aperitivo Fernet Branca', 'Aperitivo italiano', true),
    ('Licor Grand Marnier', 'Licor francés de naranja', true)
ON CONFLICT DO NOTHING;

-- DetalleProducto (50 ejemplos variados)
-- Insertar DetalleProducto con combinaciones específicas
-- Nota: Esto requiere que las tablas Productos, Categorias, Marcas y Modelos ya existan

-- Primero, insertar algunos DetalleProducto con combinaciones específicas conocidas
INSERT INTO "DetalleProducto" (
    "ProductoId", "CategoriaId", "MarcaId", "ModeloId", 
    "Codigo", "SKU", "PrecioCompra", "PrecioVenta", 
    "Stock", "StockMinimo", "UnidadMedida", "Activo"
)
SELECT 
    p."Id",
    c."Id",
    m."Id",
    mod."Id",
    'DP' || LPAD(ROW_NUMBER() OVER (ORDER BY p."Id")::TEXT, 4, '0'),
    'SKU-DP' || LPAD(ROW_NUMBER() OVER (ORDER BY p."Id")::TEXT, 4, '0'),
    CASE 
        WHEN p."Nombre" LIKE '%Premium%' OR p."Nombre" LIKE '%Ultra%' OR p."Nombre" LIKE '%1942%' OR p."Nombre" LIKE '%Dom Pérignon%' THEN 300.00 + (RANDOM() * 700)
        WHEN p."Nombre" LIKE '%Cerveza%' THEN 15.00 + (RANDOM() * 20)
        ELSE 100.00 + (RANDOM() * 200)
    END,
    CASE 
        WHEN p."Nombre" LIKE '%Premium%' OR p."Nombre" LIKE '%Ultra%' OR p."Nombre" LIKE '%1942%' OR p."Nombre" LIKE '%Dom Pérignon%' THEN 450.00 + (RANDOM() * 1050)
        WHEN p."Nombre" LIKE '%Cerveza%' THEN 25.00 + (RANDOM() * 30)
        ELSE 150.00 + (RANDOM() * 300)
    END,
    CASE 
        WHEN p."Nombre" LIKE '%Cerveza%' THEN 50 + (RANDOM() * 150)::INTEGER
        ELSE 10 + (RANDOM() * 90)::INTEGER
    END,
    CASE 
        WHEN p."Nombre" LIKE '%Cerveza%' THEN 20 + (RANDOM() * 30)::INTEGER
        ELSE 5 + (RANDOM() * 15)::INTEGER
    END,
    CASE 
        WHEN p."Nombre" LIKE '%Cerveza%' THEN 'Pack'
        ELSE 'Botella'
    END,
    true
FROM "Productos" p
CROSS JOIN LATERAL (
    SELECT "Id" FROM "Categorias" 
    WHERE "Nombre" IN (
        SELECT "Nombre" FROM "Categorias" 
        WHERE "Nombre" IN ('Ron', 'Vodka', 'Whisky', 'Tequila', 'Cerveza', 'Licor', 'Vino Tinto', 'Vino Blanco', 'Champagne', 'Coñac', 'Ginebra')
    )
    ORDER BY RANDOM() LIMIT 1
) c
CROSS JOIN LATERAL (
    SELECT "Id" FROM "Marcas" ORDER BY RANDOM() LIMIT 1
) m
CROSS JOIN LATERAL (
    SELECT "Id" FROM "Modelos" 
    WHERE "Nombre" IN ('750ml', '1L', '375ml', '500ml', 'Lata 355ml', '6 Pack', '12 Pack')
    ORDER BY RANDOM() LIMIT 1
) mod
WHERE NOT EXISTS (
    SELECT 1 FROM "DetalleProducto" dp 
    WHERE dp."ProductoId" = p."Id" 
    AND dp."CategoriaId" = c."Id"
    AND dp."MarcaId" = m."Id"
    AND dp."ModeloId" = mod."Id"
)
LIMIT 50;

-- =============================================
-- 5. EMPLEADOS, CLIENTES, PROVEEDORES
-- =============================================

-- Empleados (5 empleados)
INSERT INTO "Empleados" (
    "UsuarioId", "CodigoEmpleado", "NombreCompleto", "Telefono", "Email", 
    "Direccion", "FechaNacimiento", "FechaIngreso", "Salario", 
    "Departamento", "Puesto", "Activo"
)
SELECT 
    u."Id",
    'EMP001',
    'Carlos Ramírez',
    '505-2234-5678',
    'carlos.ramirez@licoreria.com',
    'Managua, Nicaragua',
    '1985-05-15'::DATE,
    '2020-01-15'::DATE,
    15000.00,
    'Administración',
    'Gerente',
    true
FROM "Usuarios" u WHERE u."NombreUsuario" = 'admin'
ON CONFLICT ("CodigoEmpleado") DO NOTHING;

INSERT INTO "Empleados" (
    "UsuarioId", "CodigoEmpleado", "NombreCompleto", "Telefono", "Email", 
    "Direccion", "FechaNacimiento", "FechaIngreso", "Salario", 
    "Departamento", "Puesto", "Activo"
)
SELECT 
    u."Id",
    'EMP002',
    'Ana Martínez',
    '505-2234-5679',
    'ana.martinez@licoreria.com',
    'Managua, Nicaragua',
    '1990-08-22'::DATE,
    '2021-03-10'::DATE,
    12000.00,
    'Ventas',
    'Vendedora',
    true
FROM "Usuarios" u WHERE u."NombreUsuario" = 'vendedor1'
ON CONFLICT ("CodigoEmpleado") DO NOTHING;

INSERT INTO "Empleados" (
    "UsuarioId", "CodigoEmpleado", "NombreCompleto", "Telefono", "Email", 
    "Direccion", "FechaNacimiento", "FechaIngreso", "Salario", 
    "Departamento", "Puesto", "Activo"
)
SELECT 
    u."Id",
    'EMP003',
    'Luis Rodríguez',
    '505-2234-5680',
    'luis.rodriguez@licoreria.com',
    'Managua, Nicaragua',
    '1988-11-30'::DATE,
    '2019-06-20'::DATE,
    11000.00,
    'Ventas',
    'Vendedor',
    true
FROM "Usuarios" u WHERE u."NombreUsuario" = 'supervisor1'
ON CONFLICT ("CodigoEmpleado") DO NOTHING;

INSERT INTO "Empleados" (
    "UsuarioId", "CodigoEmpleado", "NombreCompleto", "Telefono", "Email", 
    "Direccion", "FechaNacimiento", "FechaIngreso", "Salario", 
    "Departamento", "Puesto", "Activo"
)
VALUES
    (NULL, 'EMP004', 'Sofía Hernández', '505-2234-5681', 'sofia.hernandez@licoreria.com', 
     'Managua, Nicaragua', '1992-02-14'::DATE, '2022-01-05'::DATE, 10000.00, 
     'Inventario', 'Almacenista', true),
    (NULL, 'EMP005', 'Roberto López', '505-2234-5682', 'roberto.lopez@licoreria.com', 
     'Managua, Nicaragua', '1987-07-18'::DATE, '2020-09-12'::DATE, 11500.00, 
     'Ventas', 'Vendedor', true)
ON CONFLICT ("CodigoEmpleado") DO NOTHING;

-- Clientes (5 clientes)
INSERT INTO "Clientes" (
    "CodigoCliente", "NombreCompleto", "RazonSocial", "RFC", 
    "Direccion", "Telefono", "Email", "Activo"
)
VALUES
    ('CLI001', 'Restaurante El Buen Sabor', 'El Buen Sabor S.A.', 'RBS123456789', 
     'Managua, Zona 1', '505-2255-1234', 'contacto@buensabor.com', true),
    ('CLI002', 'Bar La Rumba', 'La Rumba S.A.', 'LRB987654321', 
     'Managua, Zona 2', '505-2255-2345', 'info@larumba.com', true),
    ('CLI003', 'Hotel Camino Real', 'Hotel Camino Real S.A.', 'HCR456789123', 
     'Managua, Zona 3', '505-2255-3456', 'compras@caminoreal.com', true),
    ('CLI004', 'Supermercado La Colonia', 'La Colonia S.A.', 'LC789123456', 
     'Managua, Zona 4', '505-2255-4567', 'compras@lacolonia.com', true),
    ('CLI005', 'Juan Pérez (Cliente Frecuente)', NULL, NULL, 
     'Managua, Zona 5', '505-8888-9999', 'juan.perez@email.com', true)
ON CONFLICT ("CodigoCliente") DO NOTHING;

-- Proveedores (5 proveedores)
INSERT INTO "Proveedores" (
    "CodigoProveedor", "Nombre", "RazonSocial", "RFC", 
    "Direccion", "Telefono", "Email", "Activo"
)
VALUES
    ('PROV001', 'Distribuidora Internacional', 'Distribuidora Internacional S.A.', 'DIN123456789', 
     'Managua, Zona Industrial', '505-2266-1111', 'ventas@distribuidora.com', true),
    ('PROV002', 'Importadora de Bebidas', 'Importadora de Bebidas S.A.', 'IBE987654321', 
     'Managua, Zona Industrial', '505-2266-2222', 'compras@importadora.com', true),
    ('PROV003', 'Bacardi Nicaragua', 'Bacardi Nicaragua S.A.', 'BAC456789123', 
     'Managua, Zona Industrial', '505-2266-3333', 'ventas@bacardi.com', true),
    ('PROV004', 'Heineken Centroamérica', 'Heineken Centroamérica S.A.', 'HEC789123456', 
     'Managua, Zona Industrial', '505-2266-4444', 'ventas@heineken.com', true),
    ('PROV005', 'Distribuidora Nacional', 'Distribuidora Nacional S.A.', 'DNA321654987', 
     'Managua, Zona Industrial', '505-2266-5555', 'ventas@distribuidoranacional.com', true)
ON CONFLICT ("CodigoProveedor") DO NOTHING;

-- =============================================
-- 6. CONFIGURACIÓN DEL SISTEMA
-- =============================================

INSERT INTO "ConfiguracionSistema" ("Clave", "Valor", "Tipo", "Descripcion")
VALUES
    ('IVA_Porcentaje', '15', 'Decimal', 'Porcentaje de IVA aplicable'),
    ('TasaCambio', '36.50', 'Decimal', 'Tasa de cambio USD a Córdoba'),
    ('DiasVencimientoStock', '30', 'Int', 'Días para considerar stock próximo a vencer'),
    ('EmailNotificaciones', 'admin@licoreria.com', 'String', 'Email para notificaciones del sistema'),
    ('StockMinimoGlobal', '10', 'Int', 'Stock mínimo global para alertas'),
    ('HabilitarDescuentos', 'true', 'Boolean', 'Habilitar o deshabilitar descuentos'),
    ('MetodosPago', 'Efectivo,Tarjeta,Transferencia', 'String', 'Métodos de pago disponibles')
ON CONFLICT ("Clave") DO NOTHING;

-- =============================================
-- Script completado
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Datos de prueba insertados exitosamente';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Resumen:';
    RAISE NOTICE '- 3 Roles creados (Administrador, Vendedor, Supervisor)';
    RAISE NOTICE '- 3 Usuarios creados';
    RAISE NOTICE '- 20 Categorías creadas';
    RAISE NOTICE '- 30 Marcas creadas';
    RAISE NOTICE '- 25 Modelos creados';
    RAISE NOTICE '- 30 Productos creados';
    RAISE NOTICE '- DetalleProducto creados';
    RAISE NOTICE '- 5 Empleados creados';
    RAISE NOTICE '- 5 Clientes creados';
    RAISE NOTICE '- 5 Proveedores creados';
    RAISE NOTICE '- Configuración del sistema creada';
    RAISE NOTICE '=============================================';
END $$;


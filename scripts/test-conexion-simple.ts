/**
 * Script simple para probar la conexión a PostgreSQL
 * Ejecutar: npx ts-node scripts/test-conexion-simple.ts
 */

import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

async function testConnection() {
  console.log('🔍 Probando conexión simple a PostgreSQL...\n');

  // Intentar obtener connection string primero
  let connectionUrl =
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.AZURE_DB_URL ||
    process.env.DATABASE_URL;

  // Si hay connection string, extraer componentes
  let host, port, database, user, password;

  if (connectionUrl) {
    console.log('✅ Usando connection string completa\n');
    try {
      const url = new URL(connectionUrl);
      host = url.hostname;
      port = parseInt(url.port || '5432', 10);
      database = url.pathname.replace('/', '') || 'postgres';
      user = url.username;
      password = url.password;
      
      console.log(`Host: ${host}`);
      console.log(`Port: ${port}`);
      console.log(`Database: ${database}`);
      console.log(`User: ${user}`);
      console.log(`Password: ${password ? '****' : 'no configurada'}\n`);
    } catch (error) {
      console.log('❌ Error al parsear connection string');
      console.log('   Intenta usar variables individuales o verifica el formato\n');
      return;
    }
  } else {
    // Construir desde variables individuales
    host = process.env.SUPABASE_DB_HOST || 'localhost';
    port = parseInt(process.env.SUPABASE_DB_PORT || '5432', 10);
    database = process.env.SUPABASE_DB_NAME || 'postgres';
    user = process.env.SUPABASE_DB_USER || 'postgres';
    password = process.env.SUPABASE_DB_PASSWORD;

    if (!password) {
      console.log('❌ No se encontró contraseña');
      console.log('   Configura SUPABASE_DB_PASSWORD o usa una connection string completa');
      console.log('   Variables disponibles:');
      console.log(`     DIRECT_URL: ${process.env.DIRECT_URL ? '✅' : '❌'}`);
      console.log(`     SUPABASE_DB_URL: ${process.env.SUPABASE_DB_URL ? '✅' : '❌'}`);
      console.log(`     SUPABASE_DB_PASSWORD: ${process.env.SUPABASE_DB_PASSWORD ? '✅' : '❌'}`);
      return;
    }

    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Database: ${database}`);
    console.log(`User: ${user}`);
    console.log(`Password: ${password ? '****' : 'no configurada'}\n`);
  }

  const client = new Client({
    host,
    port,
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Intentando conectar...');
    await client.connect();
    console.log('✅ Conexión exitosa!\n');

    const result = await client.query('SELECT version()');
    console.log('Versión de PostgreSQL:');
    console.log(result.rows[0].version);

    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
      LIMIT 10;
    `);
    console.log(`\n📊 Tablas encontradas: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    await client.end();
  } catch (error: any) {
    console.log('\n❌ Error al conectar:');
    console.log(`   Mensaje: ${error.message}`);
    console.log(`   Código: ${error.code || 'N/A'}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 El host no se puede resolver. Verifica SUPABASE_DB_HOST');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 La conexión fue rechazada. Verifica el puerto y que el servidor esté activo');
    } else if (error.code === '28P01') {
      console.log('\n💡 Error de autenticación. Verifica SUPABASE_DB_USER y SUPABASE_DB_PASSWORD');
    } else if (error.code === '3D000') {
      console.log('\n💡 La base de datos no existe. Verifica SUPABASE_DB_NAME');
    }
  }
}

testConnection();


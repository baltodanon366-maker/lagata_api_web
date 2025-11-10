/**
 * Script para verificar las conexiones a las bases de datos
 * Ejecutar: npx ts-node scripts/verificar-conexiones.ts
 */

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';

// Cargar variables de entorno
dotenv.config();

async function verificarPostgreSQLOperacional() {
  console.log('\n🔍 Verificando conexión a PostgreSQL Operacional...');
  
  // Buscar connection string primero
  let connectionUrl =
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.AZURE_DB_URL;

  // Si no hay connection string, construir desde variables individuales
  if (!connectionUrl) {
    const host = process.env.SUPABASE_DB_HOST || process.env.AZURE_DB_HOST || process.env.POSTGRES_HOST;
    const port = process.env.SUPABASE_DB_PORT || process.env.AZURE_DB_PORT || process.env.POSTGRES_PORT || '5432';
    const database = process.env.SUPABASE_DB_NAME || process.env.AZURE_DB_NAME || process.env.POSTGRES_DATABASE;
    const username = process.env.SUPABASE_DB_USER || process.env.AZURE_DB_USER || process.env.POSTGRES_USER;
    const password = process.env.SUPABASE_DB_PASSWORD || process.env.AZURE_DB_PASSWORD || process.env.POSTGRES_PASSWORD;

    if (host && database && username && password) {
      connectionUrl = `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`;
      console.log(`   Construyendo URL desde variables individuales...`);
    }
  }

  if (!connectionUrl) {
    console.log('❌ No se encontró cadena de conexión para PostgreSQL Operacional');
    console.log('   Variables buscadas: DIRECT_URL, POSTGRES_URL, SUPABASE_DB_URL, AZURE_DB_URL');
    console.log('   O variables individuales: SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD, etc.');
    console.log('   Variables encontradas:');
    console.log(`     DIRECT_URL: ${process.env.DIRECT_URL ? '✅ (configurada)' : '❌ (no configurada)'}`);
    console.log(`     POSTGRES_URL: ${process.env.POSTGRES_URL ? '✅ (configurada)' : '❌ (no configurada)'}`);
    console.log(`     SUPABASE_DB_URL: ${process.env.SUPABASE_DB_URL ? '✅ (configurada)' : '❌ (no configurada)'}`);
    console.log(`     AZURE_DB_URL: ${process.env.AZURE_DB_URL ? '✅ (configurada)' : '❌ (no configurada)'}`);
    console.log(`     SUPABASE_DB_HOST: ${process.env.SUPABASE_DB_HOST || '❌ (no configurada)'}`);
    return false;
  }

  // Verificar que la URL no tenga placeholders
  if (connectionUrl.includes('[PASSWORD]') || connectionUrl.includes('[USERNAME]') || connectionUrl.includes('[PROJECT-REF]')) {
    console.log('❌ La cadena de conexión contiene placeholders sin reemplazar');
    console.log('   Reemplaza [PASSWORD], [USERNAME], [PROJECT-REF] con valores reales');
    const maskedUrl = connectionUrl.replace(/:[^:@]+@/, ':****@').substring(0, 100) + '...';
    console.log(`   URL encontrada: ${maskedUrl}`);
    return false;
  }

  try {
    console.log(`   Intentando conectar... (URL oculta por seguridad)`);
    const dataSource = new DataSource({
      type: 'postgres',
      url: connectionUrl,
      ssl: connectionUrl.includes('sslmode=require') || {
        rejectUnauthorized: false,
      },
    });

    await dataSource.initialize();
    console.log('✅ Conexión a PostgreSQL Operacional exitosa');

    // Verificar tablas
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(`   📊 Tablas encontradas: ${tables.length}`);
    if (tables.length > 0) {
      console.log(`   Primeras 5 tablas: ${tables.slice(0, 5).map((t: any) => t.table_name).join(', ')}`);
    }

    await dataSource.destroy();
    return true;
  } catch (error: any) {
    console.log('❌ Error al conectar a PostgreSQL Operacional:');
    
    // Manejar AggregateError (múltiples errores)
    if (error.name === 'AggregateError' && error.errors && error.errors.length > 0) {
      const firstError = error.errors[0];
      console.log(`   Error principal: ${firstError.message || 'Error desconocido'}`);
      if (firstError.code) {
        console.log(`   Código: ${firstError.code}`);
      }
      if (firstError.errno) {
        console.log(`   Errno: ${firstError.errno}`);
      }
    } else {
      console.log(`   Mensaje: ${error.message || 'Error desconocido'}`);
      if (error.code) {
        console.log(`   Código: ${error.code}`);
      }
      if (error.errno) {
        console.log(`   Errno: ${error.errno}`);
      }
    }
    
    // Mostrar parte de la URL para debugging (sin password)
    const maskedUrl = connectionUrl.replace(/:[^:@]+@/, ':****@').substring(0, 80);
    console.log(`   URL usada: ${maskedUrl}...`);
    
    // Sugerencias comunes
    console.log('\n   💡 Posibles soluciones:');
    console.log('      1. Verifica que la contraseña sea correcta');
    console.log('      2. Verifica que la contraseña esté URL-encoded si tiene caracteres especiales');
    console.log('      3. Verifica que el proyecto Supabase esté activo');
    console.log('      4. Verifica que no haya espacios extra en la URL');
    
    return false;
  }
}

async function verificarPostgreSQLDataWarehouse() {
  console.log('\n🔍 Verificando conexión a PostgreSQL DataWarehouse...');
  
  const connectionUrl =
    process.env.SUPABASE_DW_URL ||
    process.env.AZURE_DW_URL ||
    process.env.DW_URL ||
    process.env.DIRECT_DW_URL;

  if (!connectionUrl) {
    console.log('⚠️  No se encontró cadena de conexión para PostgreSQL DataWarehouse');
    console.log('   Variables buscadas: SUPABASE_DW_URL, AZURE_DW_URL, DW_URL, DIRECT_DW_URL');
    return false;
  }

  // Verificar que la URL no tenga placeholders
  if (connectionUrl.includes('[PASSWORD]') || connectionUrl.includes('[USERNAME]') || connectionUrl.includes('[PROJECT-REF]')) {
    console.log('❌ La cadena de conexión contiene placeholders sin reemplazar');
    console.log('   Reemplaza [PASSWORD], [USERNAME], [PROJECT-REF] con valores reales');
    const maskedUrl = connectionUrl.replace(/:[^:@]+@/, ':****@').substring(0, 100) + '...';
    console.log(`   URL encontrada: ${maskedUrl}`);
    return false;
  }

  try {
    console.log(`   Intentando conectar... (URL oculta por seguridad)`);
    const dataSource = new DataSource({
      type: 'postgres',
      url: connectionUrl,
      ssl: connectionUrl.includes('sslmode=require') || {
        rejectUnauthorized: false,
      },
    });

    await dataSource.initialize();
    console.log('✅ Conexión a PostgreSQL DataWarehouse exitosa');

    // Verificar tablas
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(`   📊 Tablas encontradas: ${tables.length}`);
    if (tables.length > 0) {
      console.log(`   Primeras 5 tablas: ${tables.slice(0, 5).map((t: any) => t.table_name).join(', ')}`);
    }

    await dataSource.destroy();
    return true;
  } catch (error: any) {
    console.log('❌ Error al conectar a PostgreSQL DataWarehouse:');
    
    // Manejar AggregateError (múltiples errores)
    if (error.name === 'AggregateError' && error.errors && error.errors.length > 0) {
      const firstError = error.errors[0];
      console.log(`   Error principal: ${firstError.message || 'Error desconocido'}`);
      if (firstError.code) {
        console.log(`   Código: ${firstError.code}`);
      }
      if (firstError.errno) {
        console.log(`   Errno: ${firstError.errno}`);
      }
    } else {
      console.log(`   Mensaje: ${error.message || 'Error desconocido'}`);
      if (error.code) {
        console.log(`   Código: ${error.code}`);
      }
      if (error.errno) {
        console.log(`   Errno: ${error.errno}`);
      }
    }
    
    // Mostrar parte de la URL para debugging (sin password)
    const maskedUrl = connectionUrl.replace(/:[^:@]+@/, ':****@').substring(0, 80);
    console.log(`   URL usada: ${maskedUrl}...`);
    
    // Sugerencias comunes
    console.log('\n   💡 Posibles soluciones:');
    console.log('      1. Verifica que la contraseña sea correcta');
    console.log('      2. Verifica que la contraseña esté URL-encoded si tiene caracteres especiales');
    console.log('      3. Verifica que el proyecto Supabase esté activo');
    console.log('      4. Verifica que no haya espacios extra en la URL');
    
    return false;
  }
}

async function verificarMongoDB() {
  console.log('\n🔍 Verificando conexión a MongoDB...');
  
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('⚠️  No se encontró URI de conexión para MongoDB');
    console.log('   Variable buscada: MONGODB_URI');
    return false;
  }

  // Verificar que la URI no tenga placeholders
  if (mongoUri.includes('[USERNAME]') || mongoUri.includes('[PASSWORD]') || mongoUri.includes('[CLUSTER]')) {
    console.log('❌ La URI de MongoDB contiene placeholders sin reemplazar');
    console.log('   Reemplaza [USERNAME], [PASSWORD], [CLUSTER] con valores reales');
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@').substring(0, 80) + '...';
    console.log(`   URI encontrada: ${maskedUri}`);
    return false;
  }

  try {
    console.log(`   Intentando conectar... (URI oculta por seguridad)`);
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Conexión a MongoDB exitosa');

    const dbName = process.env.MONGODB_DATABASE || 'LicoreriaMongoDB';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`   📊 Colecciones encontradas: ${collections.length}`);
    if (collections.length > 0) {
      console.log(`   Colecciones: ${collections.map((c) => c.name).join(', ')}`);
    }

    await client.close();
    return true;
  } catch (error: any) {
    console.log('❌ Error al conectar a MongoDB:');
    console.log(`   Mensaje: ${error.message || 'Error desconocido'}`);
    if (error.stack) {
      console.log(`   Stack: ${error.stack.split('\n')[0]}`);
    }
    // Mostrar parte de la URI para debugging (sin password)
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@').substring(0, 80);
    console.log(`   URI usada: ${maskedUri}...`);
    return false;
  }
}

async function main() {
  console.log('========================================');
  console.log('  Verificación de Conexiones');
  console.log('========================================');

  const resultados = {
    postgresOperacional: await verificarPostgreSQLOperacional(),
    postgresDataWarehouse: await verificarPostgreSQLDataWarehouse(),
    mongodb: await verificarMongoDB(),
  };

  console.log('\n========================================');
  console.log('  Resumen');
  console.log('========================================');
  console.log(`PostgreSQL Operacional: ${resultados.postgresOperacional ? '✅' : '❌'}`);
  console.log(`PostgreSQL DataWarehouse: ${resultados.postgresDataWarehouse ? '✅' : '⚠️  No configurado'}`);
  console.log(`MongoDB: ${resultados.mongodb ? '✅' : '⚠️  No configurado'}`);

  const todasOk = resultados.postgresOperacional;
  if (todasOk) {
    console.log('\n✅ La configuración básica está correcta');
  } else {
    console.log('\n❌ Hay problemas con la configuración');
    console.log('   Revisa el archivo .env y la guía GUIA_CONFIGURAR_CONEXIONES.md');
  }

  process.exit(todasOk ? 0 : 1);
}

main().catch((error) => {
  console.error('Error inesperado:', error);
  process.exit(1);
});


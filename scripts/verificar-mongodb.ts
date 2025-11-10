/**
 * Script para verificar la conexión a MongoDB Atlas
 * Ejecutar con: npx ts-node scripts/verificar-mongodb.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function verificarMongoDB() {
  const uri = process.env.MONGODB_URI;
  const database = process.env.MONGODB_DATABASE;

  console.log('🔍 Verificando configuración de MongoDB...\n');

  if (!uri) {
    console.error('❌ Error: MONGODB_URI no está configurado en .env');
    console.log('\n💡 Agrega la siguiente línea a tu archivo .env:');
    console.log('   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority');
    process.exit(1);
  }

  if (!database) {
    console.error('❌ Error: MONGODB_DATABASE no está configurado en .env');
    console.log('\n💡 Agrega la siguiente línea a tu archivo .env:');
    console.log('   MONGODB_DATABASE=licoreria_db');
    process.exit(1);
  }

  // Enmascarar la contraseña en la URI para mostrar
  const uriMasked = uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:***@');

  console.log('📋 Configuración:');
  console.log(`   URI: ${uriMasked}`);
  console.log(`   Database: ${database}\n`);

  console.log('🔌 Intentando conectar a MongoDB Atlas...\n');

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB Atlas!\n');

    // Verificar que la base de datos existe o puede ser creada
    const db = client.db(database);
    const adminDb = client.db().admin();

    // Listar bases de datos
    const dbs = await adminDb.listDatabases();
    const dbExists = dbs.databases.some((db) => db.name === database);

    if (dbExists) {
      console.log(`✅ Base de datos "${database}" existe`);
    } else {
      console.log(`ℹ️  Base de datos "${database}" será creada automáticamente al insertar el primer documento`);
    }

    // Verificar colecciones
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log(`\n📊 Colecciones existentes (${collectionNames.length}):`);
    if (collectionNames.length === 0) {
      console.log('   (Ninguna - se crearán automáticamente)');
    } else {
      collectionNames.forEach((name) => {
        console.log(`   - ${name}`);
      });
    }

    // Verificar colecciones esperadas
    const expectedCollections = ['notifications', 'logs'];
    console.log(`\n📋 Colecciones esperadas:`);
    expectedCollections.forEach((name) => {
      if (collectionNames.includes(name)) {
        console.log(`   ✅ ${name} - existe`);
      } else {
        console.log(`   ⏳ ${name} - se creará automáticamente`);
      }
    });

    // Probar inserción de prueba (opcional)
    console.log('\n🧪 Probando inserción de prueba...');
    try {
      const testCollection = db.collection('_test_connection');
      await testCollection.insertOne({
        test: true,
        timestamp: new Date(),
      });
      await testCollection.deleteOne({ test: true });
      console.log('✅ Inserción y eliminación exitosas');
    } catch (error) {
      console.error('❌ Error en prueba de inserción:', error);
    }

    console.log('\n✅ Verificación completada exitosamente!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Reinicia el servidor: npm run start:dev');
    console.log('   2. Prueba los endpoints de MongoDB en Swagger');
    console.log('   3. Las colecciones se crearán automáticamente al usarlas');
  } catch (error: any) {
    console.error('\n❌ Error al conectar a MongoDB Atlas:');
    console.error(`   ${error.message}\n`);

    if (error.message.includes('authentication')) {
      console.log('💡 Posibles soluciones:');
      console.log('   - Verifica que el usuario y contraseña sean correctos');
      console.log('   - Asegúrate de codificar caracteres especiales en la contraseña');
      console.log('   - Verifica que el usuario tenga permisos de lectura/escritura');
    } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.log('💡 Posibles soluciones:');
      console.log('   - Verifica que tu IP esté en la whitelist de MongoDB Atlas');
      console.log('   - Verifica tu conexión a internet');
      console.log('   - Verifica que la cadena de conexión sea correcta');
    } else if (error.message.includes('IP')) {
      console.log('💡 Posibles soluciones:');
      console.log('   - Agrega tu IP actual a la whitelist de MongoDB Atlas');
      console.log('   - Ve a Network Access → Add IP Address → Add Current IP Address');
    }

    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

verificarMongoDB().catch((error) => {
  console.error('Error inesperado:', error);
  process.exit(1);
});


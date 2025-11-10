/**
 * Script para mostrar las variables de entorno configuradas (sin mostrar contraseñas completas)
 * Ejecutar: npx ts-node scripts/mostrar-env.ts
 */

import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

function maskPassword(value: string): string {
  if (!value) return '(vacío)';
  // Ocultar contraseñas en URLs
  return value.replace(/:([^:@]+)@/g, ':****@');
}

function maskUri(value: string): string {
  if (!value) return '(vacío)';
  // Ocultar usuario y contraseña en URIs de MongoDB
  return value.replace(/\/\/([^:]+):([^@]+)@/g, '//****:****@');
}

console.log('========================================');
console.log('  Variables de Entorno Configuradas');
console.log('========================================\n');

// PostgreSQL Operacional
console.log('📊 PostgreSQL Operacional:');
console.log(`  DIRECT_URL: ${process.env.DIRECT_URL ? maskPassword(process.env.DIRECT_URL) : '❌ No configurada'}`);
console.log(`  POSTGRES_URL: ${process.env.POSTGRES_URL ? maskPassword(process.env.POSTGRES_URL) : '❌ No configurada'}`);
console.log(`  SUPABASE_DB_URL: ${process.env.SUPABASE_DB_URL ? maskPassword(process.env.SUPABASE_DB_URL) : '❌ No configurada'}`);
console.log(`  AZURE_DB_URL: ${process.env.AZURE_DB_URL ? maskPassword(process.env.AZURE_DB_URL) : '❌ No configurada'}`);
console.log(`  SUPABASE_DB_HOST: ${process.env.SUPABASE_DB_HOST || '❌ No configurada'}`);
console.log(`  SUPABASE_DB_PORT: ${process.env.SUPABASE_DB_PORT || '❌ No configurada'}`);
console.log(`  SUPABASE_DB_NAME: ${process.env.SUPABASE_DB_NAME || '❌ No configurada'}`);
console.log(`  SUPABASE_DB_USER: ${process.env.SUPABASE_DB_USER || '❌ No configurada'}`);
console.log(`  SUPABASE_DB_PASSWORD: ${process.env.SUPABASE_DB_PASSWORD ? '****' : '❌ No configurada'}`);
console.log('');

// PostgreSQL DataWarehouse
console.log('📊 PostgreSQL DataWarehouse:');
console.log(`  SUPABASE_DW_URL: ${process.env.SUPABASE_DW_URL ? maskPassword(process.env.SUPABASE_DW_URL) : '❌ No configurada'}`);
console.log(`  AZURE_DW_URL: ${process.env.AZURE_DW_URL ? maskPassword(process.env.AZURE_DW_URL) : '❌ No configurada'}`);
console.log(`  DW_URL: ${process.env.DW_URL ? maskPassword(process.env.DW_URL) : '❌ No configurada'}`);
console.log(`  DIRECT_DW_URL: ${process.env.DIRECT_DW_URL ? maskPassword(process.env.DIRECT_DW_URL) : '❌ No configurada'}`);
console.log(`  SUPABASE_DW_HOST: ${process.env.SUPABASE_DW_HOST || '❌ No configurada'}`);
console.log(`  SUPABASE_DW_PORT: ${process.env.SUPABASE_DW_PORT || '❌ No configurada'}`);
console.log(`  SUPABASE_DW_NAME: ${process.env.SUPABASE_DW_NAME || '❌ No configurada'}`);
console.log(`  SUPABASE_DW_USER: ${process.env.SUPABASE_DW_USER || '❌ No configurada'}`);
console.log(`  SUPABASE_DW_PASSWORD: ${process.env.SUPABASE_DW_PASSWORD ? '****' : '❌ No configurada'}`);
console.log('');

// MongoDB
console.log('📊 MongoDB:');
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? maskUri(process.env.MONGODB_URI) : '❌ No configurada'}`);
console.log(`  MONGODB_DATABASE: ${process.env.MONGODB_DATABASE || '❌ No configurada'}`);
console.log('');

// JWT
console.log('📊 JWT:');
console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? (process.env.JWT_SECRET.length > 20 ? '✅ Configurado (' + process.env.JWT_SECRET.length + ' caracteres)' : '⚠️  Muy corto') : '❌ No configurado'}`);
console.log(`  JWT_ISSUER: ${process.env.JWT_ISSUER || '❌ No configurado'}`);
console.log(`  JWT_AUDIENCE: ${process.env.JWT_AUDIENCE || '❌ No configurado'}`);
console.log(`  JWT_EXPIRATION: ${process.env.JWT_EXPIRATION || '❌ No configurado'}`);
console.log('');

// App
console.log('📊 App:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || '❌ No configurado'}`);
console.log(`  PORT: ${process.env.PORT || '❌ No configurado'}`);
console.log(`  CORS_ORIGIN: ${process.env.CORS_ORIGIN || '❌ No configurado'}`);
console.log('');

// Verificar problemas comunes
console.log('========================================');
console.log('  Verificación de Problemas Comunes');
console.log('========================================\n');

const problemas: string[] = [];

// Verificar placeholders
const todasLasUrls = [
  process.env.DIRECT_URL,
  process.env.POSTGRES_URL,
  process.env.SUPABASE_DB_URL,
  process.env.AZURE_DB_URL,
  process.env.SUPABASE_DW_URL,
  process.env.AZURE_DW_URL,
  process.env.MONGODB_URI,
].filter(Boolean);

todasLasUrls.forEach((url, index) => {
  if (url && (url.includes('[PASSWORD]') || url.includes('[USERNAME]') || url.includes('[PROJECT-REF]') || url.includes('[CLUSTER]'))) {
    problemas.push(`  ❌ URL #${index + 1} contiene placeholders sin reemplazar ([PASSWORD], [USERNAME], etc.)`);
  }
});

// Verificar que al menos una URL de PostgreSQL operacional esté configurada
const tienePostgresOperacional = !!(
  process.env.DIRECT_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.AZURE_DB_URL
);

if (!tienePostgresOperacional) {
  problemas.push('  ❌ No hay ninguna URL de PostgreSQL Operacional configurada');
}

// Verificar formato de URLs
if (process.env.DIRECT_URL && !process.env.DIRECT_URL.startsWith('postgresql://')) {
  problemas.push('  ⚠️  DIRECT_URL no parece ser una URL válida de PostgreSQL');
}

if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  problemas.push('  ⚠️  MONGODB_URI no parece ser una URI válida de MongoDB');
}

if (problemas.length === 0) {
  console.log('  ✅ No se encontraron problemas obvios');
} else {
  problemas.forEach((problema) => console.log(problema));
}

console.log('\n========================================');
console.log('  Recomendaciones');
console.log('========================================\n');

if (!tienePostgresOperacional) {
  console.log('  ⚠️  Configura al menos una de estas variables:');
  console.log('     - DIRECT_URL (recomendado para migraciones)');
  console.log('     - DATABASE_URL (recomendado para la aplicación)');
  console.log('     - SUPABASE_DB_URL');
}

if (!process.env.SUPABASE_DW_URL && !process.env.AZURE_DW_URL) {
  console.log('  ⚠️  DataWarehouse no está configurado (opcional por ahora)');
}

if (!process.env.MONGODB_URI) {
  console.log('  ⚠️  MongoDB no está configurado (opcional para desarrollo)');
}

console.log('\n');


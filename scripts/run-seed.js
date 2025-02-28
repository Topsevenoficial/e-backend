'use strict';

const { createStrapi } = require('@strapi/strapi');
const seedShalom = require('./seedShalom.js');

async function runSeed() {
  try {
    // Inicializa Strapi y espera a que se cargue
    const strapiInstance = await createStrapi().load();
    // Ejecuta el seed pasando la instancia de Strapi
    await seedShalom(strapiInstance);
    console.log('Proceso de seed finalizado.');
  } catch (error) {
    console.error('Error en el seeding:', error);
  } finally {
    process.exit();
  }
}

runSeed();

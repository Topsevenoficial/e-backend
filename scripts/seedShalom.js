// backend-ecommerce/scripts/seedShalom.js

'use strict';

const fs = require('fs');
const path = require('path');

async function seedShalom(strapi) {
  try {
    // Verifica si ya existen registros en la colección shalom.
    const existing = await strapi.entityService.findMany('api::shalom.shalom', {
      fields: ['id'],
      limit: 1,
    });
    if (existing && existing.length > 0) {
      console.log('La colección Shalom ya tiene registros. Seeding abortado.');
      return;
    }

    // Lee el archivo JSON
    const filePath = path.join(__dirname, '..', 'data', 'agencias-shalom.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    // Inserta cada registro en la colección
    for (const item of data) {
      await strapi.entityService.create('api::shalom.shalom', {
        data: {
          nombre: item.nombre,
          ubicacion: item.ubicacion,
          direccion: item.direccion,
        },
      });
      console.log(`Creado: ${item.nombre}`);
    }
    console.log('Seed completado exitosamente.');
  } catch (error) {
    console.error('Error al sembrar los datos:', error);
  }
}

module.exports = seedShalom;

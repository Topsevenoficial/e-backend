// scripts/seedShalom.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function seedShalom() {
  try {
    // 1. Inicializa Strapi usando createStrapi() y luego carga la aplicación
    const app = await createStrapi({ dir: process.cwd() });
    await app.load();

    // 2. Lee el archivo JSON con los datos
    const jsonFilePath = path.resolve(__dirname, '../data/agencias-shalom.json');
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    console.log(`Insertando ${data.length} registros en la colección "shalom"...`);

    // 3. Recorre cada item del JSON y usa la Entity Service para crear los registros
    for (const item of data) {
      // Verifica si ya existe un registro con el mismo "nombre"
      const existing = await app.db.query('api::shalom.shalom').findOne({
        where: { nombre: item.nombre },
      });

      if (!existing) {
        await app.db.query('api::shalom.shalom').create({
          data: {
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            direccion: item.direccion,
            // Si deseas que se publique automáticamente, descomenta la siguiente línea:
            // publishedAt: new Date(),
          },
        });
        console.log(`Insertado: ${item.nombre}`);
      } else {
        console.log(`Ya existe: ${item.nombre}`);
      }
    }

    console.log('¡Datos insertados exitosamente!');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    process.exit(0);
  }
}

seedShalom();

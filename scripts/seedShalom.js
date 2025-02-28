// scripts/seedShalom.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Depuración: muestra el usuario configurado
console.log("DATABASE_USERNAME:", process.env.DATABASE_USERNAME);

// Ruta absoluta del archivo JSON
const jsonFilePath = path.resolve(process.cwd(), "data", "agencias-shalom.json");

// Configuración de la conexión usando las variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Se usará si está definida
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
  database: process.env.DATABASE_NAME || "strapi",
  user: process.env.DATABASE_USERNAME || "strapi",
  password: process.env.DATABASE_PASSWORD || "strapi",
  ssl:
    process.env.DATABASE_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false" ? false : true,
        }
      : false,
});

async function seedData() {
  try {
    // Leer y parsear el archivo JSON
    const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    console.log(`Insertando ${data.length} registros en la tabla "shaloms"...`);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Inserta cada registro
      for (const item of data) {
        await client.query(
          `INSERT INTO shaloms ("nombre", "ubicacion", "direccion") VALUES ($1, $2, $3)`,
          [item.nombre, item.ubicacion, item.direccion]
        );
      }

      await client.query("COMMIT");
      console.log("Datos insertados exitosamente.");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error durante la inserción. Se realizó rollback:", err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error al leer el archivo JSON o en la conexión:", err);
  } finally {
    await pool.end();
  }
}

seedData();

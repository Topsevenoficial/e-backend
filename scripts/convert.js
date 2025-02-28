const fs = require("fs");

// Lee el archivo JSON
const data = JSON.parse(fs.readFileSync("data/agencias-shalom.json", "utf8"));

// Define los encabezados
const headers = ["nombre", "ubicacion", "direccion"];
const csvRows = [];

// Agrega los encabezados al CSV
csvRows.push(headers.join(","));

// Itera sobre cada registro y crea una fila CSV
data.forEach((item) => {
  const row = [
    `"${item.nombre}"`,
    `"${item.ubicacion}"`,
    `"${item.direccion}"`,
  ];
  csvRows.push(row.join(","));
});

// Escribe el CSV en un nuevo archivo
fs.writeFileSync("agencias-shalom.csv", csvRows.join("\n"));

console.log("Archivo CSV generado exitosamente.");

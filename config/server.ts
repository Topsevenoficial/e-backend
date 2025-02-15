// config/server.ts
module.exports = ({ env }) => {
  // Si process.env.PORT existe (como en Render), se usa; de lo contrario, se utiliza la variable PORT definida en env o 1337 por defecto.
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : env.int("PORT", 1337);
  return {
    host: env("HOST", "0.0.0.0"),
    port,
    app: {
      keys: env.array("APP_KEYS"),
    },
  };
};

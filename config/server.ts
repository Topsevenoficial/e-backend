// config/server.ts
export default ({ env }) => {
  // Si process.env.PORT está definido, úsalo; si no, usa el valor de env('PORT') o 1337
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : env.int('PORT', 1337);
  return {
    host: env('HOST', '0.0.0.0'),
    port,
    app: {
      keys: env.array('APP_KEYS'),
    },
  };
};

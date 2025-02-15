const plugins = {
  "strapi-neon-tech-db-branches": {
    enabled: true,
    config: {
      neonApiKey:
        "napi_86pjglpao6qrdiw1083pu6qpwj4ev63apv9vw04jknz34ys3tos9d0rqkczy5aao", // Obtén la clave desde: https://console.neon.tech/app/settings/api-keys
      neonProjectName: "Ecommerce", // El proyecto de Neon donde corre tu DB
      neonRole: "neondb_owner", // Asegúrate de crear este rol manualmente en tu proyecto
      gitBranch: "main", // Opcional: Fija la rama si no quieres usar la del Git
    },
  },
  // Otras configuraciones de plugins...
};

export default plugins;

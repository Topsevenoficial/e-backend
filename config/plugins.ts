export default ({ env }: { env: (key: string) => string }) => ({
  // Configuración del plugin de Cloudinary para Upload
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // Configuración de otro plugin
  "strapi-neon-tech-db-branches": {
    enabled: true,
    config: {
      neonApiKey:
        "napi_86pjglpao6qrdiw1083pu6qpwj4ev63apv9vw04jknz34ys3tos9d0rqkczy5aao", // Clave de Neon Tech
      neonProjectName: "Ecommerce", // Nombre del proyecto en Neon
      neonRole: "neondb_owner", // Rol configurado en tu proyecto
      gitBranch: "main", // Rama de Git (opcional)
    },
  },
  // Otras configuraciones de plugins pueden ir aquí...
});

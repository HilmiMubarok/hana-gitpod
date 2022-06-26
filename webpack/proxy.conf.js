function setupProxy({ tls }) {
  const conf = [
    {
      context: [
        '/api',
        '/services',
        '/management',
        '/v3/api-docs',
        '/h2-console',
        '/oauth2',
        '/login',
        '/auth',
        '/health',
        '/storage',
        '/strapi',
      ],
      target: `http${tls ? 's' : ''}://localhost:8190`,
      secure: false,
      changeOrigin: tls,
      headers: {
        'X-Tenant': '10000',
      },
    },
  ];
  return conf;
}

module.exports = setupProxy;

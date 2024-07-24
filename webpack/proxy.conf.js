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
        '/httpbin',
        '/strapi',
      ],
      // target: `http${tls ? 's' : ''}://localhost:8190`,
      target: `http${tls ? 's' : ''}://34.101.37.193:8190`,
      // target: `http${tls ? 's' : ''}://45.32.114.128:8190`,
      // target: `http${tls ? 's' : ''}://192.168.88.171:8080`,
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

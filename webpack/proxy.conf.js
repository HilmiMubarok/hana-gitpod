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
        '/spreadsheet',
      ],
      target: `http${tls ? 's' : ''}://34.101.37.193:8190`,
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

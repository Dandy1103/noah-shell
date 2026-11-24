export default [
  {
    context: ['/api', '/auth', '/oauth2', '/login'],
    target: process.env['CORE_URL'] || 'http://127.0.0.1:8080',
    secure: false,
    changeOrigin: false,
  },
];

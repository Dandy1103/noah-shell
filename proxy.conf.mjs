export default [
  remote('/remotes/portal', 4300),
  remote('/remotes/hrm', 4301),
  remote('/remotes/notice', 4302),
  remote('/remotes/notify', 4303),
  remote('/remotes/docs', 4304),
  remote('/remotes/calendar', 4305),
  remote('/remotes/account', 4306),
  remote('/remotes/apps', 4307),
  remote('/remotes/crm', 4308),
  remote('/remotes/erp', 4309),
  remote('/remotes/itsm', 4310),
  remote('/remotes/lms', 4311),
  remote('/remotes/approval', 4312),
  remote('/remotes/affairs', 4313),
  remote('/remotes/payroll', 4314),
  remote('/remotes/project', 4315),
  {
    context: ['/api', '/auth', '/oauth2', '/login'],
    target: process.env['CORE_URL'] || 'http://127.0.0.1:8080',
    secure: false,
    changeOrigin: false,
  },
];

function remote(context, port) {
  return {
    context: [context],
    target: `http://127.0.0.1:${port}`,
    secure: false,
    changeOrigin: false,
    pathRewrite: { [`^${context}`]: '' },
  };
}

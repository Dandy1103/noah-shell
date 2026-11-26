const platform = 'https://noah-platform.dandy-cheng.com';
const platformHost = 'noah-platform.dandy-cheng.com';

function markDevHost(proxyReq, req) {
  proxyReq.removeHeader('x-forwarded-port');
  const host = req.headers.host;
  if (host) {
    proxyReq.setHeader('X-Forwarded-Host', host);
    proxyReq.setHeader('X-Forwarded-Proto', 'http');
    proxyReq.setHeader('X-Noah-Dev-Host', host);
    proxyReq.setHeader('X-Noah-Dev-Proto', 'http');
  }
  if (localOrigin(req.headers.origin)) proxyReq.setHeader('Origin', platform);
  if (localOrigin(req.headers.referer)) proxyReq.setHeader('Referer', `${platform}/`);
}

function localOrigin(value) {
  if (!value) return false;
  try {
    const name = new URL(value).hostname;
    return name === 'localhost' || name === '127.0.0.1' || name === '[::1]';
  } catch {
    return false;
  }
}

function stayHere(proxyRes) {
  const location = proxyRes.headers.location;
  if (!location) return;
  proxyRes.headers.location = Array.isArray(location) ? location.map(localPath) : localPath(location);
}

function localPath(location) {
  if (!location || location.startsWith('/')) return location;
  try {
    const next = new URL(location);
    const loopback = next.hostname === 'localhost' || next.hostname === '127.0.0.1' || next.hostname === '[::1]';
    if (next.hostname !== platformHost && !loopback) return location;
    return `${next.pathname}${next.search}${next.hash}`;
  } catch {
    return location;
  }
}

function devPlatform() {
  return {
    target: platform,
    secure: true,
    changeOrigin: true,
    configure(proxy) {
      proxy.on('proxyReq', markDevHost);
      proxy.on('proxyRes', stayHere);
    },
  };
}

export default {
  '/remotes/portal': remote(4300),
  '/remotes/hrm': remote(4301),
  '/remotes/notice': remote(4302),
  '/remotes/notify': remote(4303),
  '/remotes/docs': remote(4304),
  '/remotes/calendar': remote(4305),
  '/remotes/account': remote(4306),
  '/remotes/apps': remote(4307),
  '/remotes/crm': remote(4308),
  '/remotes/erp': remote(4309),
  '/remotes/itsm': remote(4310),
  '/remotes/lms': remote(4311),
  '/remotes/approval': remote(4312),
  '/remotes/affairs': remote(4313),
  '/remotes/payroll': remote(4314),
  '/remotes/project': remote(4315),
  '/api': devPlatform(),
  '/auth': devPlatform(),
  '/oauth2': devPlatform(),
  '/login': devPlatform(),
};

function remote(port) {
  return {
    target: `http://localhost:${port}`,
    secure: false,
    changeOrigin: false,
    pathRewrite: { '^/remotes/[^/]+': '' },
  };
}

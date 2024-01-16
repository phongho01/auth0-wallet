const { AUTH0_WHITELIST_IP } = require('../constants');

const authenticateIpWhitelist = async (req, res, next) => {
  const ipInfo = requestIp.getClientIp(req);
  if (ipInfo != '::1') {
    const validIp = AUTH0_WHITELIST_IP.findIndex(
      (value) => '::ffff:' + value == ipInfo || value == ipInfo
    );
    if (validIp < 0) {
      res.status(403).send('Unauthorized');
      return;
    }
  }
  next();
};

module.exports = {
  authenticateIpWhitelist,
};

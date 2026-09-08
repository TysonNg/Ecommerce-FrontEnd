'use strict';

const getRequestIdentityHeaders = (clientId) =>
  clientId ? { 'x-client-id': clientId } : {};

module.exports = { getRequestIdentityHeaders };

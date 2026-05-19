'use strict';

/**
 * tracking-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tracking-session.tracking-session');

'use strict';

/**
 * chat-thread service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chat-thread.chat-thread');

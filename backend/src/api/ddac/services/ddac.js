'use strict';

/**
 * ddac service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ddac.ddac');

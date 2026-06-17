
const { PrismaClient } = require('../data/generated/prisma/client');
const prisma = new PrismaClient();

module.exports = { prisma };
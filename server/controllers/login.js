const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.process_login = async (req, res, next) => {
  console.log(req);
};

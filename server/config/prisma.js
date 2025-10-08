const { PrismaClient } = require("@prisma/client");

const prismaBase = new PrismaClient();
const MAX_NOTIFICATIONS = 10;

// Extend Prisma with middleware-like logic
const prisma = prismaBase.$extends({
  query: {
    notification: {
      async create({ args, query }) {
        // Run the original query first
        const result = await query(args);

        try {
          // Count notifications for this recipient
          const count = await prismaBase.notification.count({
            where: { recipientId: result.recipientId },
          });

          if (count > MAX_NOTIFICATIONS) {
            const excess = count - MAX_NOTIFICATIONS;

            // Get IDs of oldest notifications to delete
            const oldest = await prismaBase.notification.findMany({
              where: { recipientId: result.recipientId },
              orderBy: { createdAt: "asc" },
              take: excess,
              select: { id: true },
            });

            if (oldest.length > 0) {
              await prismaBase.notification.deleteMany({
                where: { id: { in: oldest.map((n) => n.id) } },
              });
            }
          }
        } catch (err) {
          console.error("Error enforcing notification limit:", err);
        }

        return result;
      },
    },
  },
});

module.exports = prisma;

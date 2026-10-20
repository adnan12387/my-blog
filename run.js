const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.update({
    where: { email: "adnan@test.com" },
    data: { role: "admin" },
  });
  console.log("✅ کاربر ادمین شد:", updated.email);
}

main()
  .catch((e) => console.error("❌ خطا:", e.message))
  .finally(() => prisma.$disconnect());
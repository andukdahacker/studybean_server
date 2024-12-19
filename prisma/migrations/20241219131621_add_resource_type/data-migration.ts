import { PrismaClient, ResourceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const actionResources = await tx.actionResource.findMany();

    for (const actionResource of actionResources) {
      let resourceType: ResourceType = "WEBSITE";

      const extension = actionResource.url.split(".").pop();

      if (extension == "pdf") {
        resourceType = "PDF";
      } else if (actionResource.url.includes("youtube")) {
        resourceType = "YOUTUBE";
      } else if (
        extension == "jpg" ||
        extension == "png" ||
        extension == "jpeg" ||
        extension == "heic"
      ) {
        resourceType = "IMAGE";
      }

      await tx.actionResource.update({
        where: {
          id: actionResource.id,
        },
        data: {
          resourceType: resourceType,
        },
      });
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
  Warnings:

  - You are about to drop the column `groupId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DmToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dmName` to the `Dm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Dm` table without a default value. This is not possible if the table is not empty.
  - Made the column `dmId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_dmId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_DmToUser" DROP CONSTRAINT "_DmToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DmToUser" DROP CONSTRAINT "_DmToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Dm" ADD COLUMN     "dmName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "groupId",
ALTER COLUMN "dmId" SET NOT NULL;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "_DmToUser";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "_DmOwners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DmMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DmOwners_AB_unique" ON "_DmOwners"("A", "B");

-- CreateIndex
CREATE INDEX "_DmOwners_B_index" ON "_DmOwners"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DmMembers_AB_unique" ON "_DmMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_DmMembers_B_index" ON "_DmMembers"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "Dm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmOwners" ADD CONSTRAINT "_DmOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "Dm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmOwners" ADD CONSTRAINT "_DmOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmMembers" ADD CONSTRAINT "_DmMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Dm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmMembers" ADD CONSTRAINT "_DmMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

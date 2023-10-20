/*
  Warnings:

  - You are about to drop the `_DmMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DmOwners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DmMembers" DROP CONSTRAINT "_DmMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_DmMembers" DROP CONSTRAINT "_DmMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_DmOwners" DROP CONSTRAINT "_DmOwners_A_fkey";

-- DropForeignKey
ALTER TABLE "_DmOwners" DROP CONSTRAINT "_DmOwners_B_fkey";

-- DropTable
DROP TABLE "_DmMembers";

-- DropTable
DROP TABLE "_DmOwners";

-- CreateTable
CREATE TABLE "_DmToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DmToUser_AB_unique" ON "_DmToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DmToUser_B_index" ON "_DmToUser"("B");

-- AddForeignKey
ALTER TABLE "_DmToUser" ADD CONSTRAINT "_DmToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Dm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DmToUser" ADD CONSTRAINT "_DmToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

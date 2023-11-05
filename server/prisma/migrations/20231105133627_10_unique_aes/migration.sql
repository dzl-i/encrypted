/*
  Warnings:

  - A unique constraint covering the columns `[dmId,userId]` on the table `AESKeys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AESKeys_dmId_userId_key" ON "AESKeys"("dmId", "userId");

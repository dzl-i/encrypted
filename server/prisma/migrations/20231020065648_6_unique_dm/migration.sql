/*
  Warnings:

  - A unique constraint covering the columns `[dmName]` on the table `Dm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dm_dmName_key" ON "Dm"("dmName");

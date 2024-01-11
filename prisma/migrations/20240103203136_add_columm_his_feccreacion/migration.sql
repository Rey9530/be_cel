/*
  Warnings:

  - Made the column `his_feccreacion` on table `mar_his_historial` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "mar_his_historial" ALTER COLUMN "his_feccreacion" SET NOT NULL;

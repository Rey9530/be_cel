/*
  Warnings:

  - You are about to drop the column `mar_hor_horariosHor_codigo` on the `mar_per_permisos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "mar_per_permisos" DROP CONSTRAINT "mar_per_permisos_mar_hor_horariosHor_codigo_fkey";

-- AlterTable
ALTER TABLE "mar_per_permisos" DROP COLUMN "mar_hor_horariosHor_codigo";

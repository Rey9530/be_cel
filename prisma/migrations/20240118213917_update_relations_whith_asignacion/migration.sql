/*
  Warnings:

  - You are about to drop the column `per_codhor` on the `mar_per_permisos` table. All the data in the column will be lost.
  - Added the required column `per_codasi` to the `mar_per_permisos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mar_per_permisos" DROP CONSTRAINT "mar_per_hor_fk";

-- AlterTable
ALTER TABLE "mar_per_permisos" DROP COLUMN "per_codhor",
ADD COLUMN     "mar_hor_horariosHor_codigo" TEXT,
ADD COLUMN     "per_codasi" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_asi_fk" FOREIGN KEY ("per_codasi") REFERENCES "mar_asi_asignacion"("asi_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_permisos_mar_hor_horariosHor_codigo_fkey" FOREIGN KEY ("mar_hor_horariosHor_codigo") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE SET NULL ON UPDATE CASCADE;

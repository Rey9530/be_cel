/*
  Warnings:

  - Added the required column `per_codemp_reemplazo` to the `mar_per_permisos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mar_per_permisos" ADD COLUMN     "per_codemp_reemplazo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_emp_remplazo_fk" FOREIGN KEY ("per_codemp_reemplazo") REFERENCES "mar_emp_empleados"("emp_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

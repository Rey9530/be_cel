-- AlterTable
ALTER TABLE "mar_his_historial" ADD COLUMN     "his_entrada_tarde" BOOLEAN DEFAULT false,
ADD COLUMN     "his_salida_temp" BOOLEAN DEFAULT false,
ALTER COLUMN "his_feccreacion" DROP NOT NULL;

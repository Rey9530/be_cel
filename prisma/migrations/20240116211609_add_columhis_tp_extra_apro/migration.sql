-- CreateEnum
CREATE TYPE "EstadoHorasExtra" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "mar_his_historial" ADD COLUMN     "his_tp_extra_apro" "EstadoHorasExtra" NOT NULL DEFAULT 'PENDIENTE';

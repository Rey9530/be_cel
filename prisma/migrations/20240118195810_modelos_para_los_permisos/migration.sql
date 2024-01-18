-- CreateTable
CREATE TABLE "mar_mop_motivo_per" (
    "mop_codigo" TEXT NOT NULL,
    "mop_nombre" TEXT NOT NULL,
    "mop_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "mop_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mop_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mop_usrcrea" TEXT NOT NULL,
    "mop_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_mop_pk" PRIMARY KEY ("mop_codigo")
);

-- CreateTable
CREATE TABLE "mar_per_permisos" (
    "per_codigo" TEXT NOT NULL,
    "per_nombre" TEXT NOT NULL,
    "per_codhor" TEXT NOT NULL,
    "per_codemp" TEXT NOT NULL,
    "per_codmop" TEXT NOT NULL,
    "per_fecha_inicio" DATE DEFAULT CURRENT_TIMESTAMP,
    "per_fecha_fin" DATE DEFAULT CURRENT_TIMESTAMP,
    "per_comentario" TEXT NOT NULL,
    "per_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "per_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "per_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "per_usrcrea" TEXT NOT NULL,
    "per_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_per_pk" PRIMARY KEY ("per_codigo")
);

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_hor_fk" FOREIGN KEY ("per_codhor") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_emp_fk" FOREIGN KEY ("per_codemp") REFERENCES "mar_emp_empleados"("emp_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_per_permisos" ADD CONSTRAINT "mar_per_mop_fk" FOREIGN KEY ("per_codmop") REFERENCES "mar_mop_motivo_per"("mop_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

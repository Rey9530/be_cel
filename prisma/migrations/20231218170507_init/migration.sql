-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "mar_gen_generos" (
    "gen_codigo" TEXT NOT NULL,
    "gen_nombre" TEXT NOT NULL,
    "gen_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "gen_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gen_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gen_usrcrea" TEXT NOT NULL,
    "gen_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_gen_pk" PRIMARY KEY ("gen_codigo")
);

-- CreateTable
CREATE TABLE "mar_dia_dias" (
    "dia_codigo" TEXT NOT NULL,
    "dia_nombre" TEXT NOT NULL,
    "dia_dia_codigo" TEXT NOT NULL,
    "dia_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "dia_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dia_usrcrea" TEXT NOT NULL,
    "dia_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_dia_pk" PRIMARY KEY ("dia_codigo")
);

-- CreateTable
CREATE TABLE "mar_ubi_ubicaciones" (
    "ubi_codigo" TEXT NOT NULL,
    "ubi_nombre" TEXT NOT NULL,
    "ubi_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "ubi_feccrea" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ubi_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ubi_usrcrea" TEXT NOT NULL,
    "ubi_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_ubi_pk" PRIMARY KEY ("ubi_codigo")
);

-- CreateTable
CREATE TABLE "mar_con_contrataciones" (
    "con_codigo" TEXT NOT NULL,
    "con_nombre" TEXT NOT NULL,
    "con_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "con_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "con_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "con_usrcrea" TEXT NOT NULL,
    "con_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_con_pk" PRIMARY KEY ("con_codigo")
);

-- CreateTable
CREATE TABLE "mar_epr_empresas" (
    "epr_codigo" TEXT NOT NULL,
    "epr_nombre" TEXT NOT NULL,
    "epr_direccion" TEXT NOT NULL,
    "epr_contacto_nombre" TEXT NOT NULL,
    "epr_contacto_correo" TEXT NOT NULL,
    "epr_contacto_telefono" TEXT NOT NULL,
    "epr_usrcrea" TEXT NOT NULL,
    "epr_usrmod" TEXT NOT NULL,
    "epr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "epr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "epr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "mar_epr_pk" PRIMARY KEY ("epr_codigo")
);

-- CreateTable
CREATE TABLE "mar_emp_empleados" (
    "emp_codigo" TEXT NOT NULL,
    "emp_codigo_emp" TEXT NOT NULL,
    "emp_fecha_nacimiento" DATE NOT NULL,
    "emp_nombres" TEXT NOT NULL,
    "emp_apellidos" TEXT NOT NULL,
    "emp_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "emp_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emp_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emp_usrcrea" TEXT NOT NULL,
    "emp_usrmod" TEXT NOT NULL,
    "emp_codgen" TEXT NOT NULL,
    "emp_codemp" TEXT NOT NULL,
    "emp_codubi" TEXT NOT NULL,
    "emp_codcon" TEXT NOT NULL,

    CONSTRAINT "mar_emp_pk" PRIMARY KEY ("emp_codigo")
);

-- CreateTable
CREATE TABLE "mar_usr_usuario" (
    "usr_codigo" TEXT NOT NULL,
    "usr_codigo_emple" TEXT NOT NULL,
    "usr_nombres" TEXT NOT NULL,
    "usr_apellidos" TEXT NOT NULL,
    "usr_contrasenia" TEXT NOT NULL,
    "usr_inten_inicio" SMALLINT NOT NULL DEFAULT 0,
    "usr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "usr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usr_usrcrea" TEXT NOT NULL,
    "usr_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_usr_pk" PRIMARY KEY ("usr_codigo")
);

-- CreateTable
CREATE TABLE "mar_ctr_contratos" (
    "ctr_codigo" TEXT NOT NULL,
    "ctr_nombre" TEXT NOT NULL,
    "ctr_num_contrato" TEXT NOT NULL,
    "ctr_horas_extras" INTEGER NOT NULL,
    "ctr_fecha_inicio" TIMESTAMP(3) NOT NULL,
    "ctr_fecha_fin" TIMESTAMP(3) NOT NULL,
    "ctr_fecha_inipro" TIMESTAMP(3),
    "ctr_fecha_finpro" TIMESTAMP(3),
    "ctr_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "ctr_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ctr_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ctr_usrcrea" TEXT NOT NULL,
    "ctr_usrmod" TEXT NOT NULL,
    "ctr_codepr" TEXT NOT NULL,
    "ctr_codusr" TEXT NOT NULL,

    CONSTRAINT "mar_ctr_pk" PRIMARY KEY ("ctr_codigo")
);

-- CreateTable
CREATE TABLE "mar_hor_horarios" (
    "hor_codigo" TEXT NOT NULL,
    "hor_nombre" TEXT NOT NULL,
    "hor_codctro" TEXT NOT NULL,
    "hor_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "hor_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hor_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hor_usrcrea" TEXT NOT NULL,
    "hor_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_hor_pk" PRIMARY KEY ("hor_codigo")
);

-- CreateTable
CREATE TABLE "mar_hde_detalle_ho" (
    "hde_codigo" TEXT NOT NULL,
    "hde_codhor" TEXT NOT NULL,
    "hde_coddia" TEXT NOT NULL,
    "hde_orden" TEXT,
    "hde_inicio_1" TEXT NOT NULL,
    "hde_fin_1" TEXT NOT NULL,
    "hde_inicio_2" TEXT NOT NULL,
    "hde_fin_2" TEXT NOT NULL,
    "hde_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "hde_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hde_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hde_usrcrea" TEXT NOT NULL,
    "hde_usrmod" TEXT NOT NULL,

    CONSTRAINT "mar_hde_pk" PRIMARY KEY ("hde_codigo")
);

-- CreateTable
CREATE TABLE "mar_asi_asignacion" (
    "asi_codigo" TEXT NOT NULL,
    "asi_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "asi_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asi_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asi_usrcrea" TEXT NOT NULL,
    "asi_usrmod" TEXT NOT NULL,
    "asi_codhor" TEXT NOT NULL,
    "asi_codemp" TEXT NOT NULL,

    CONSTRAINT "mar_asi_pk" PRIMARY KEY ("asi_codigo")
);

-- CreateTable
CREATE TABLE "mar_his_historial" (
    "his_codigo" TEXT NOT NULL,
    "his_hora_entrada" TIMESTAMP(3),
    "his_hora_salida" TIMESTAMP(3),
    "his_tp_trabajado" TEXT NOT NULL,
    "his_tp_extra" TEXT NOT NULL,
    "emp_estado" "Estado" NOT NULL DEFAULT 'ACTIVE',
    "his_feccrea" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "his_fecmod" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "his_usrcrea" TEXT NOT NULL,
    "his_usrmod" TEXT NOT NULL,
    "his_codasi" TEXT NOT NULL,

    CONSTRAINT "mar_his_pk" PRIMARY KEY ("his_codigo")
);

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_gen_fk" FOREIGN KEY ("emp_codgen") REFERENCES "mar_gen_generos"("gen_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_ubi_fk" FOREIGN KEY ("emp_codubi") REFERENCES "mar_ubi_ubicaciones"("ubi_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_emp_empleados" ADD CONSTRAINT "mar_emp_con_fk" FOREIGN KEY ("emp_codcon") REFERENCES "mar_con_contrataciones"("con_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_ctr_contratos" ADD CONSTRAINT "mar_ctr_epr_fk" FOREIGN KEY ("ctr_codepr") REFERENCES "mar_epr_empresas"("epr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_ctr_contratos" ADD CONSTRAINT "mar_ctr_usr_fk" FOREIGN KEY ("ctr_codusr") REFERENCES "mar_usr_usuario"("usr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hor_horarios" ADD CONSTRAINT "mar_hor_ctro_fk" FOREIGN KEY ("hor_codctro") REFERENCES "mar_ctr_contratos"("ctr_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hde_detalle_ho" ADD CONSTRAINT "mar_hde_hor_fk" FOREIGN KEY ("hde_codhor") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_hde_detalle_ho" ADD CONSTRAINT "mar_hor_dia_fk" FOREIGN KEY ("hde_coddia") REFERENCES "mar_dia_dias"("dia_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_asi_asignacion" ADD CONSTRAINT "mar_asi_hor_fk" FOREIGN KEY ("asi_codhor") REFERENCES "mar_hor_horarios"("hor_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_asi_asignacion" ADD CONSTRAINT "mar_asi_emp_fk" FOREIGN KEY ("asi_codemp") REFERENCES "mar_emp_empleados"("emp_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mar_his_historial" ADD CONSTRAINT "mar_his_asi_fk" FOREIGN KEY ("his_codasi") REFERENCES "mar_asi_asignacion"("asi_codigo") ON DELETE NO ACTION ON UPDATE NO ACTION;




COMMENT ON TABLE mar_dia_dias IS 'Listado de dias de la semana.';
COMMENT ON COLUMN mar_dia_dias.dia_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_dia_dias.dia_nombre IS 'Nombre del dia';
COMMENT ON COLUMN mar_dia_dias.dia_dia_codigo IS 'Codigo del dia que va de 0 a 6';
COMMENT ON COLUMN mar_dia_dias.dia_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_dia_dias.dia_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_dia_dias.dia_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_dia_dias.dia_usrcrea IS 'Usuario que creo el registro';


COMMENT ON TABLE mar_emp_empleados IS 'Tabla que almacenara el listado de empleado';
COMMENT ON COLUMN mar_emp_empleados.emp_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_emp_empleados.emp_codigo_emp IS 'Codigo del empleado';
COMMENT ON COLUMN mar_emp_empleados.emp_fecha_nacimiento IS 'Fecha de nacimiento del empleado';
COMMENT ON COLUMN mar_emp_empleados.emp_nombres IS 'Nombres del empleado';
COMMENT ON COLUMN mar_emp_empleados.emp_apellidos IS 'Apellidos del empleado';
COMMENT ON COLUMN mar_emp_empleados.emp_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_emp_empleados.emp_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_emp_empleados.emp_usrcrea IS 'Usuario que creo el registro';
COMMENT ON COLUMN mar_emp_empleados.emp_usrmod IS 'Ultimo usuario que actualizo el registro';
COMMENT ON COLUMN mar_emp_empleados.emp_codgen IS 'Id del genero asociado';
COMMENT ON COLUMN mar_emp_empleados.emp_codemp IS 'id del codigo de la empresa';
COMMENT ON COLUMN mar_emp_empleados.emp_codubi IS 'Id de la sede asignada';
COMMENT ON COLUMN mar_emp_empleados.emp_codcon IS 'Id del tipo de contratacion';



COMMENT ON COLUMN mar_epr_empresas.epr_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON TABLE mar_epr_empresas IS 'Esta tabla almacenara las empresas a las que se les puede asignar contratos';
COMMENT ON COLUMN mar_epr_empresas.epr_nombre IS 'Nombre de la empresa';
COMMENT ON COLUMN mar_epr_empresas.epr_direccion IS 'Direccion de la empresa';
COMMENT ON COLUMN mar_epr_empresas.epr_contacto_nombre IS 'Nombre del contacto de la empresa';
COMMENT ON COLUMN mar_epr_empresas.epr_contacto_correo IS 'Correo del contacto de la empresa';
COMMENT ON COLUMN mar_epr_empresas.epr_contacto_telefono IS 'Telefono del contacto de la empresa';
COMMENT ON COLUMN mar_epr_empresas.epr_usrcrea IS 'Usuario que creo el registro';
COMMENT ON COLUMN mar_epr_empresas.epr_usrmod IS 'Ultimo usuario que actualizo el registro';
COMMENT ON COLUMN mar_epr_empresas.epr_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_epr_empresas.epr_fecmod IS 'Fecha de ultima actualizacion del registro';


COMMENT ON TABLE mar_gen_generos IS 'Tabla almacena los generos que puede tener un empleado';
COMMENT ON COLUMN mar_gen_generos.gen_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_gen_generos.gen_nombre IS 'Nombre del genero';
COMMENT ON COLUMN mar_gen_generos.gen_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_gen_generos.gen_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_gen_generos.gen_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_gen_generos.gen_usrcrea IS 'Usuario que creo el registro';


COMMENT ON TABLE mar_hde_detalle_ho IS 'Tabla que almacena el detalle de los horarios a asignar a los empleados';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_codhor IS 'Codigo del horario padrea';
-- COMMENT ON COLUMN mar_hde_detalle_ho.hor_coddia IS 'Codigo del dia que esta configurado este horario';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_inicio_1 IS 'Hora de inicio de la parte 1 del horario';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_fin_1 IS 'Hora de fin de la parte 1 del horario';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_inicio_2 IS 'Hora de inicio de la parte 2 del horario';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_fin_2 IS 'Hora de fin de la parte 2 del horario';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_fecmod IS 'Fecha de ultima actualizacion del regist';
COMMENT ON COLUMN mar_hde_detalle_ho.hde_usrcrea IS 'Usuario que creo el registro';


COMMENT ON TABLE mar_his_historial IS 'Esta tabla almacena el historial de marcaciones de los empleados';
COMMENT ON COLUMN mar_his_historial.his_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_his_historial.his_hora_entrada IS 'Hora que se marco la entrada';
COMMENT ON COLUMN mar_his_historial.his_hora_salida IS 'Hora que se marco la salida';
COMMENT ON COLUMN mar_his_historial.his_tp_trabajado IS 'Horas trabajadas';
COMMENT ON COLUMN mar_his_historial.his_tp_extra IS 'Horas extras realizadas';
COMMENT ON COLUMN mar_his_historial.emp_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_his_historial.his_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_his_historial.his_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_his_historial.his_usrcrea IS 'Usuario que creo el registro';
COMMENT ON COLUMN mar_his_historial.his_usrmod IS 'Ultimo usuario que actualizo el registro';
COMMENT ON COLUMN mar_his_historial.his_codasi IS 'Id de la asignacion que le pertenecen el historial';


COMMENT ON TABLE mar_hor_horarios IS 'Tabla padre que sera el que se relacione con los empleados en las asignaciones';
COMMENT ON COLUMN mar_hor_horarios.hor_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_hor_horarios.hor_nombre IS 'Nombre del horario';
COMMENT ON COLUMN mar_hor_horarios.hor_codctro IS 'Id del contrato al que pertenece este horario';
COMMENT ON COLUMN mar_hor_horarios.hor_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_hor_horarios.hor_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_hor_horarios.hor_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_hor_horarios.hor_usrcrea IS 'Usuario que creo el registro';


COMMENT ON TABLE mar_ubi_ubicaciones IS 'Aqui se almacenaran el listado de sedes, a las cuales se puden asignar los empleados';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_nombre IS 'Nombre de la sede o ubicacion';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_usrcrea IS 'Usuario que creo el registro';
COMMENT ON COLUMN mar_ubi_ubicaciones.ubi_usrmod IS 'Ultimo usuario que actualizo el registro';


COMMENT ON TABLE mar_usr_usuario IS 'Tabla que almacenara los usuarios que pueden acceder al sistema';
COMMENT ON COLUMN mar_usr_usuario.usr_codigo IS 'Id o llave primaria de la tabla';
COMMENT ON COLUMN mar_usr_usuario.usr_codigo_emple IS 'Codigo del usuario (Codigo empleado)';
COMMENT ON COLUMN mar_usr_usuario.usr_nombres IS 'Nombres del usuario';
COMMENT ON COLUMN mar_usr_usuario.usr_apellidos IS 'Apellidos del usuario';
COMMENT ON COLUMN mar_usr_usuario.usr_contrasenia IS 'Contrasena o clave del usuario, para acceder al sistema';
COMMENT ON COLUMN mar_usr_usuario.usr_estado IS 'Estado del registro esto por temas de eliminacion para que sea logica';
COMMENT ON COLUMN mar_usr_usuario.usr_feccrea IS 'Fecha de creacion del registro';
COMMENT ON COLUMN mar_usr_usuario.usr_fecmod IS 'Fecha de ultima actualizacion del registro';
COMMENT ON COLUMN mar_usr_usuario.usr_usrcrea IS 'Usuario que creo el registro';

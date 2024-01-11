<p align="center">
  <a href="https://www.cel.gob.sv/" target="blank"><img src="https://pbs.twimg.com/profile_images/1307069445681172480/qRL3IeTh_400x400.jpg" width="200" alt="Nest Logo" /></a>
</p>
 
## Marca Recognition

1. Clonar el proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlos a ```.env```
4. Cambiar loas variables de entornos
5. Se deben crear los volumenes y la red que compartira con el proyecto de face_recognition
```
docker volume create volumen_db && docker volume create volumen_db_temp && docker network create network-mar
```
6. Levantar la db en este caso se uso una Db Dockerizada por lo tanto se puede usar el archivo yaml solo ejecutando
```
docker-compose.yaml up -d
```
7. Ejecutar ```npx prisma migrate dev --name first-migration```
8. Levantar con ```yarn start:dev```
9. Ejecutar ```http://localhost:3000/api/seed```
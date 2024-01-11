export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file.originalname.match(/\.(png)$/)) {
    return callback(new Error('Error en el archivo enviado.'), false);
  }
  callback(null, true);
};

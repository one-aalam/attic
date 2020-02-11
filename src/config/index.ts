import 'dotenv/config';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


export default {
  port: Number(process.env.NODE_PORT),
  cluster: process.env.USE_CLUSTER && parseInt(process.env.USE_CLUSTER) === 1 ? true : false ,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  api: {
    prefix: '/api',
  },
  emails: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: false, // show debug output
    logger: false // log information in console
  },
  dirs: {
    uploads: '/uploads',
  },
  clientUrl: process.env.CLIENT_URL
};

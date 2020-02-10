import 'dotenv/config';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


export default {
  port: Number(process.env.NODE_PORT),
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
    apiKey: '',
    domain: ''
  },
  dirs: {
    uploads: '/uploads',
  }
};

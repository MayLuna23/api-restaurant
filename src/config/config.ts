import * as dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const config = {
  env: process.env.NODE_ENV || 'development',
  db: {
    host: isProd ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    port: parseInt(isProd ? process.env.PROD_DB_PORT! : process.env.DEV_DB_PORT!),
    user: isProd ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
    password: isProd ? process.env.PROD_DB_PASSWORD : process.env.DEV_DB_PASSWORD,
    name: isProd ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
    get url() {
      return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`;
    },
  },
};

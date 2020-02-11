import nodemailer, { TransportOptions } from 'nodemailer';
import config from 'config';

export default nodemailer.createTransport(config.emails as TransportOptions);
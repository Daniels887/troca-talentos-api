export default {
  host: process.env.HOST_MAIL,
  port: Number(process.env.PORT_MAIL),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
};

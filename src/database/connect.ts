import { createConnection } from 'typeorm';

createConnection().then(() => console.log('Succesfully connected with database'));

import * as dotenv from 'dotenv';
import app from './app';

dotenv.config();

app.listen(3333, () => console.log('Server running in PORT 3333'));

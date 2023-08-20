
import express from 'express'
import initApp from './src/app.router.js';
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, './config/.env') });

const app = express();
const port = process.env.PORT || 5000;


// Cron jop
// import schedule from 'node-schedule'

// const job = schedule.scheduleJob('25 21 * * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });


initApp(app, express);
app.listen(port, () => console.log(`app running on port ............... ${port}`));




import { app } from './server';

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
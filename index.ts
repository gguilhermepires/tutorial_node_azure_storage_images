//import * as bodyparser from 'body-parser';
import * as express from 'express'
import uploadAzure from './uploadAzure';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
})

app.post('/', uploadAzure.single('avatar'), (req, res) => {
    if (!req.file) {
        res.send('Erro ao fazer upload do arquivo!');
    } else {
        res.send('Arquivo enviado com sucesso!');
    }
})
const port = 3001;
app.listen(port, function () {
    console.log(`listening on port ${port}!`);
});
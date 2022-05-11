//import * as bodyparser from 'body-parser';
import { BlobServiceClient } from '@azure/storage-blob';
import * as express from 'express'
import uploadAzure from './uploadAzure';
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=photocoatstag;AccountKey=a6/xFbyCRm6v3X0XPLTKL7UURDyVXIHC+RQzEhBn6dRoJJSAhuLFDM4Elqiw21E8eUtO5+cHWWYdQ7iHxCx+cQ==;EndpointSuffix=core.windows.net';
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.get('/', (req, res) => {
//     res.sendFile('index.html', { root: __dirname });
// })

app.post('/', uploadAzure.single('avatar'), (req, res) => {
    if (!req.file) {
        res.send('Erro ao fazer upload do arquivo!');
    } else {
        res.send('Arquivo enviado com sucesso!');
    }
});

app.post('/arquivo', async (req, res) =>  {

    let arquivo = 'uploads/7d1a6553-42c6-4563-acb0-43d472ebd742.jpg'
  
   
    const content = "Hello world!";
    const blobName = "newblob" + new Date().getTime();

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = 'photocoatstag';
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(arquivo);
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    res.json(`Upload block blob ${blobName} successfully ${uploadBlobResponse.requestId}` );
});

app.get('/arquivos', async (req, res) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = 'photocoatstag';

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log("\nListing blobs...");

    // List the blob(s) in the container.
    let lista = []
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log("\t", blob.name);
        lista.push(blob);
    }


    res.json(lista);
});

app.get('/arquivos/:nome', async (req, res) => {
    let { nome } = req.params;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = 'photocoatstag';

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log("\nListing blobs...");

    let response = {};
    const blobClient = containerClient.getBlobClient(nome);
    let downloaded = null;
    try {
        const downloadBlockBlobResponse = await blobClient.download();
        downloaded = (
            await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
        ).toString();
        console.log("Downloaded blob content:", downloaded);
    } catch (e) {
        console.log("nao encontrou");
        console.log(e);
    }
    res.json(downloaded);
});

app.delete('/arquivos/:nome', async (req, res) => {
    let { nome } = req.params;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = 'photocoatstag';

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log("\nListing blobs...");

    let response = {};
    const blobClient = containerClient.getBlobClient(nome);
    let downloaded = null;
    blobClient.deleteIfExists()
    try {
        downloaded = await  blobClient.deleteIfExists();
        console.log("Downloaded blob content:", downloaded);
    } catch (e) {
        console.log("nao encontrou");
        console.log(e);
    }
    res.json(downloaded);
});

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

const port = 3002;
app.listen(port, function () {
    console.log(`listening on port ${port}!`);
});
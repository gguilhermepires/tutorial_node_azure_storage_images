import * as multer from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';


const azureStorage: MulterAzureStorage = new MulterAzureStorage({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=photocoatstag;AccountKey=a6/xFbyCRm6v3X0XPLTKL7UURDyVXIHC+RQzEhBn6dRoJJSAhuLFDM4Elqiw21E8eUtO5+cHWWYdQ7iHxCx+cQ==;EndpointSuffix=core.windows.net',
    accessKey: 'a6/xFbyCRm6v3X0XPLTKL7UURDyVXIHC+RQzEhBn6dRoJJSAhuLFDM4Elqiw21E8eUtO5+cHWWYdQ7iHxCx+cQ==',
    accountName: 'photocoatstag',
    containerName: 'photocoatstag',
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});

const uploadAzure = multer({ storage: azureStorage });

export default uploadAzure;
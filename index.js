import express from 'express';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/process-image', async (req, res) => {
    const imageUrl = req.body.imageUrl;
    try {
        const image = await Jimp.read(imageUrl);
        image.resize(350, Jimp.AUTO).grayscale().quality(60);
        const fileName = `${nanoid()}.jpg`;
        const filePath = path.join(__dirname, 'public', 'processed-images', fileName);
        await image.writeAsync(filePath);
        res.send(`<h2>Imagen procesada:</h2><img src="/processed-images/${fileName}" alt="Processed Image"/>`);
    } catch (error) {
        res.status(500).send('Error al procesar la imagen.');
    }
});

import fs from 'fs';
const processedImagesDir = path.join(__dirname, 'public', 'processed-images');
if (!fs.existsSync(processedImagesDir)) {
    fs.mkdirSync(processedImagesDir);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


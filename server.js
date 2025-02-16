import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function getMusicFromDirectory() {
    const musicDir = path.join(__dirname, 'public', 'music');
    const files = await fs.readdir(musicDir);
    return files.map(file => ({
        title: path.parse(file).name,
        artist: 'Unknown Artist',
        file: file,
    }));
}

app.get('/music', async (req, res) => {
    try {
        const musicList = await getMusicFromDirectory();
        res.status(200).json(musicList);
    } catch (error) {
        console.error('Error fetching music:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/upload', async (req, res) => {
    const { title, artist, price, fileHash, owner } = req.body;
    try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const tx = await contract.methods.createMusic(title, artist, price, fileHash)
            .send({ from: owner, gas: 500000 });
        res.json({ message: 'Music uploaded successfully', tx });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

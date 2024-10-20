const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

let photoData = null;
let countdownEnd = null;

app.post('/api/start-countdown', upload.single('photo'), (req, res) => {
    const countdown = parseInt(req.body.countdown);
    photoData = req.file;
    countdownEnd = Date.now() + countdown * 1000;
    console.log(`Countdown started. End time: ${new Date(countdownEnd)}`);
    res.status(200).send({ message: 'Countdown started.' });
});

app.get('/api/get-photo', (req, res) => {
    if (countdownEnd && photoData) {
        const currentTime = Date.now();
        if (currentTime >= countdownEnd) {
            res.sendFile(path.resolve(photoData.path));
        } else {
            const remainingSeconds = Math.ceil((countdownEnd - currentTime) / 1000);
            res.status(403).send({ message: `Countdown not finished yet. ${remainingSeconds} seconds remaining.` });
        }
    } else {
        res.status(404).send({ message: 'No photo available or countdown not started.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

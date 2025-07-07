const express = require('express');
const ytdlp = require('yt-dlp-exec');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/audio', async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

  try {
    const info = await ytdlp(`https://www.youtube.com/watch?v=${videoId}`, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });
    const audio = info.formats.find(f => f.ext === 'm4a' && f.acodec !== 'none' && f.url);
    if (!audio) return res.status(404).json({ error: 'No audio found' });
    res.json({ audioUrl: audio.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`yt-dlp microservice running on ${PORT}`)); 
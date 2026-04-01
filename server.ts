import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { Readable } from 'stream';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory storage for submissions
  const submissions: any[] = [];

  app.post('/api/submit', (req, res) => {
    submissions.push({ ...req.body, timestamp: new Date().toISOString() });
    res.json({ success: true });
  });

  app.post('/api/verify-password', (req, res) => {
    if (req.body.password === 'Somena') {
      res.json({ success: true, submissions });
    } else {
      res.status(401).json({ success: false });
    }
  });

  app.get('/api/download', async (req, res) => {
    try {
      const mediafireUrl = 'https://www.mediafire.com/file/wtd6ukp5738utl6/1_PESO.zip/file';
      const response = await fetch(mediafireUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      
      // Extract the direct download link from the Mediafire page
      const match1 = html.match(/href="([^"]+)"[^>]*id="downloadButton"/i);
      const match2 = html.match(/id="downloadButton"[^>]*href="([^"]+)"/i);
      const directLink = (match1 && match1[1]) || (match2 && match2[1]);
      
      if (directLink) {
        
        // Stream the file to the client to completely hide the Mediafire URL
        const fileResponse = await fetch(directLink);
        res.setHeader('Content-Disposition', 'attachment; filename="1_PESO.zip"');
        res.setHeader('Content-Type', 'application/zip');
        
        if (fileResponse.body) {
           // @ts-ignore - Node 18+ fetch body is a web stream
           Readable.fromWeb(fileResponse.body).pipe(res);
        } else {
           // Fallback if streaming fails
           res.redirect(directLink);
        }
      } else {
        res.status(500).send('Could not find download link');
      }
    } catch (error) {
      res.status(500).send('Error processing download');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

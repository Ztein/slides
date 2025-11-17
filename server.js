const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { marked } = require('marked');

const app = express();
const PORT = 8085;

// Serve static files from presentations directory
app.use('/presentations', express.static(path.join(__dirname, 'presentations')));

// Serve reveal.js via CDN (we'll use CDN in template, but also allow local if needed)
// For now, we'll use CDN in the HTML template

// API endpoint to list available presentations
app.get('/api/presentations', async (req, res) => {
  try {
    const presentationsDir = path.join(__dirname, 'presentations');
    const entries = await fs.readdir(presentationsDir, { withFileTypes: true });
    const presentations = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    res.json({ presentations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get script.md content as parsed notes
app.get('/api/presentations/:name/notes', async (req, res) => {
  try {
    const presentationName = req.params.name;
    const scriptPath = path.join(__dirname, 'presentations', presentationName, 'script.md');
    
    // Check if script.md exists
    try {
      await fs.access(scriptPath);
    } catch {
      return res.status(404).json({ error: 'script.md not found' });
    }
    
    const content = await fs.readFile(scriptPath, 'utf-8');
    const notes = parseScriptNotes(content);
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get raw script.md
app.get('/api/presentations/:name/script', async (req, res) => {
  try {
    const presentationName = req.params.name;
    const scriptPath = path.join(__dirname, 'presentations', presentationName, 'script.md');
    
    const content = await fs.readFile(scriptPath, 'utf-8');
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve presentation index.html
app.get('/presentations/:name', (req, res) => {
  const presentationName = req.params.name;
  const indexPath = path.join(__dirname, 'presentations', presentationName, 'index.html');
  res.sendFile(indexPath);
});

// Root route - show available presentations
app.get('/', async (req, res) => {
  try {
    const presentationsDir = path.join(__dirname, 'presentations');
    const entries = await fs.readdir(presentationsDir, { withFileTypes: true });
    const presentations = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Presentations</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #1a2332;
            color: #e2e8f0;
          }
          h1 {
            color: #2dd4bf;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            margin: 15px 0;
          }
          a {
            color: #2dd4bf;
            text-decoration: none;
            font-size: 1.2em;
            padding: 10px 20px;
            display: inline-block;
            border: 2px solid #2dd4bf;
            border-radius: 8px;
            transition: all 0.3s;
          }
          a:hover {
            background: #2dd4bf;
            color: #1a2332;
          }
        </style>
      </head>
      <body>
        <h1>Available Presentations</h1>
        <ul>
          ${presentations.map(p => `<li><a href="/presentations/${p}">${p}</a></li>`).join('')}
        </ul>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Parse script.md to extract notes per slide
function parseScriptNotes(content) {
  const notes = [];
  const lines = content.split('\n');
  
  let currentSlide = null;
  let currentNotes = [];
  let inScriptSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for slide headers: "## SLIDE X:", "SLIDE X:", or "## SLIDE X: Title" patterns
    // Support both formats: with or without ##, with or without colon
    // Support decimal numbers like "7.5"
    // Need to check both patterns separately because ^##? doesn't work as expected
    const slideMatch1 = line.match(/^##\s*SLIDE\s+(\d+\.?\d*):?\s*(.*)$/i);
    const slideMatch2 = !slideMatch1 ? line.match(/^SLIDE\s+(\d+\.?\d*):?\s*(.*)$/i) : null;
    const slideMatch = slideMatch1 || slideMatch2;
    if (slideMatch) {
      // Save previous slide notes if any
      if (currentSlide !== null && currentNotes.length > 0) {
        notes.push({
          slide: currentSlide,
          title: '',
          notes: currentNotes.join('\n').trim()
        });
      }
      
      // Parse as float to support decimals like "7.5"
      currentSlide = parseFloat(slideMatch[1]);
      currentNotes = [];
      inScriptSection = false;
      continue;
    }
    
    // Check for script section - support multiple formats:
    // "**Script:**", "Script:", "Script (30 sec):", "Script (1.5 min):", etc.
    const scriptPattern = /^(\*\*)?script(\*\*)?\s*(\([^)]+\))?:?\s*$/i;
    if (line.trim().match(scriptPattern)) {
      inScriptSection = true;
      continue;
    }
    
    // Collect notes if in script section
    if (inScriptSection && currentSlide !== null) {
      // Stop at next major section (## or ---) or next SLIDE
      // Support decimal numbers like "7.5"
      if (line.trim() === '---' || 
          (line.startsWith('##') && !line.startsWith('###')) ||
          line.match(/^##\s*SLIDE\s+\d+\.?\d*/i) ||
          line.match(/^SLIDE\s+\d+\.?\d*/i)) {
        // Save current notes before moving to next slide
        if (currentNotes.length > 0) {
          notes.push({
            slide: currentSlide,
            title: '',
            notes: currentNotes.join('\n').trim()
          });
        }
        inScriptSection = false;
        continue;
      }
      
      // Skip empty lines at the start of script section
      if (currentNotes.length === 0 && line.trim() === '') {
        continue;
      }
      
      // Skip quotes at the start of lines (remove leading quotes)
      let noteLine = line;
      if (noteLine.trim().startsWith('"') && noteLine.trim().endsWith('"')) {
        noteLine = noteLine.trim().slice(1, -1); // Remove surrounding quotes
      }
      
      currentNotes.push(noteLine);
    }
  }
  
  // Save last slide notes
  if (currentSlide !== null && currentNotes.length > 0) {
    notes.push({
      slide: currentSlide,
      title: '',
      notes: currentNotes.join('\n').trim()
    });
  }
  
  return notes;
}

app.listen(PORT, () => {
  console.log(`Presentation server running on http://localhost:${PORT}`);
  console.log(`Available presentations: http://localhost:${PORT}`);
});


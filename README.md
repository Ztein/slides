# Presentation App

En enkel presentation-app som använder Reveal.js för att skapa och köra presentationer med presenter mode. Presentationer läser speaker notes från `script.md` filer.

## Funktioner

- ✅ Skapa presentationer baserat på `script.md` filer
- ✅ Lokal server på port 8085 för att jobba med presentationer
- ✅ Presenter mode med två vyer: slide för publik + manus för presentatör
- ✅ Stöd för externa bilder i `images/` mapp
- ✅ Automatisk inläsning av speaker notes från `script.md`

## Installation

```bash
npm install
```

## Starta servern

```bash
npm start
```

Servern startar på `http://localhost:8085`

## Öppna en presentation

```bash
npm run present <presentation-name>
```

Exempel:
```bash
npm run present uppsala_uni_18_nov_2025_improved
```

Eller öppna manuellt i webbläsaren:
```
http://localhost:8085/presentations/<presentation-name>
```

## Skapa en ny presentation

1. Skapa en ny mapp i `presentations/` mappen:
   ```bash
   mkdir presentations/my-presentation
   ```

2. Skapa `script.md` i presentation-mappen med följande format:
   ```markdown
   # Presentation Title
   
   ## SLIDE 1: Title Slide
   
   **Script:**
   Your speaker notes here...
   
   ## SLIDE 2: Next Slide
   
   **Script:**
   More notes...
   ```

3. Skapa `index.html` baserat på `presentation-template.html`:
   - Kopiera `presentation-template.html` till din presentation-mapp och döp om till `index.html`
   - Lägg till dina slides som `<section>` element i `<div class="slides">`
   - Varje slide kan ha `<aside class="notes">` för manuella notes, men de kommer automatiskt från `script.md`

4. (Valfritt) Skapa `images/` mapp för externa bilder:
   ```bash
   mkdir presentations/my-presentation/images
   ```
   Referera bilder i slides som: `images/bild.png`

## Presenter Mode

När du kör en presentation:

1. Tryck `S` i webbläsaren för att öppna presenter mode
2. Presenter mode öppnar två vyer:
   - **Publikvy**: Visar slides på projektorskärm
   - **Presentatörsvy**: Visar aktuell slide, nästa slide, timer och speaker notes från `script.md`

Du kan navigera presentationen från presentatörsvyn med piltangenter eller mellanslag.

## Projektstruktur

```
slides/
├── server.js                    # Express server
├── package.json                 # Dependencies
├── presentation-template.html   # Template för nya presentationer
├── scripts/
│   └── open-presentation.js    # Script för att öppna presentationer
└── presentations/
    └── <presentation-name>/
        ├── index.html          # Reveal.js presentation
        ├── script.md           # Speaker notes
        └── images/             # Externa bilder (valfritt)
```

## Script.md Format

Speaker notes extraheras från `script.md` baserat på slide-nummer:

```markdown
## SLIDE 1: Slide Title

**Script:**
Dina speaker notes här...

## SLIDE 2: Next Slide

**Script:**
Mer notes...
```

Parseren letar efter:
- `## SLIDE X: Title` för att identifiera slides
- `**Script:**` eller `Script:` för att starta notes-sektion
- Notes fortsätter tills nästa major section (## eller ---)

## Keyboard Shortcuts

- `Space` / `→` - Nästa slide
- `←` - Föregående slide
- `S` - Öppna presenter mode
- `ESC` - Översikt över alla slides
- `F` - Fullscreen

## Tips

- Använd Cursor AI för att skapa och redigera slides i `index.html`
- Presenter mode fungerar bäst med två skärmar - drag presenter-fönstret till din laptop och lämna publiksidan på projektorn
- Speaker notes från `script.md` synkas automatiskt med slides när servern startar

## Development

För att göra ändringar i presentationer medan servern kör:

1. Redigera `index.html` eller `script.md` i presentation-mappen
2. Uppdatera webbläsaren för att se ändringar
3. För notes-ändringar: sparar du `script.md` och uppdaterar sidan så laddas nya notes om

## Felsökning

**Servern startar inte:**
- Kontrollera att port 8085 inte är upptagen
- Installera dependencies: `npm install`

**Notes visas inte:**
- Kontrollera att `script.md` finns i presentation-mappen
- Verifiera att formatet följer `## SLIDE X: Title` och `**Script:**` struktur
- Kolla browser console för felmeddelanden

**Presenter mode fungerar inte:**
- Kontrollera att popup-blockerare inte blockerar presenter-fönstret
- Försök manuellt: Lägg till `?view=speaker` i URL:en


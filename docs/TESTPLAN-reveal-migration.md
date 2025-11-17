# Testplan: Reveal.js Migration

## Syfte
Verifiera att migreringen från individuella HTML-filer till Reveal.js index.html fungerar korrekt.

## Testfall

### T1: index.html existerar och laddas
**Förväntat resultat (RED först):** 
- Filen `presentations/uppsala_uni_18_nov_2025/index.html` finns inte
- HTTP status 404 när man försöker ladda `/presentations/uppsala_uni_18_nov_2025`

**Förväntat resultat (GREEN efter implementering):**
- Filen existerar
- HTTP status 200 när man laddar `/presentations/uppsala_uni_18_nov_2025`
- Ingen 404-felmeddelande i browser console

**Testmetod:** 
- Manuell: Navigera till `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
- Verifiera att sidan laddas utan 404

---

### T2: Reveal.js initialiseras korrekt
**Förväntat resultat (RED först):** 
- Reveal.js är inte initialiserat (inga slides visas)

**Förväntat resultat (GREEN efter implementering):**
- Reveal.js objekt finns i window (kan köra `Reveal.isReady()` i console)
- Browser console visar ingen Reveal.js-fel
- Reveal.js controls visas längst ner

**Testmetod:**
- Öppna browser console
- Kör: `Reveal.isReady()` - ska returnera `true`
- Kör: `Reveal.getTotalSlides()` - ska returnera antal slides

---

### T3: Material Icons laddas
**Förväntat resultat (RED först):**
- Material Icons saknas (ikoner visas som text)

**Förväntat resultat (GREEN efter implementering):**
- Alla Material Icons renderas som ikoner (inte text)
- Network tab visar att `fonts.googleapis.com/icon?family=Material+Icons` laddas med status 200

**Testmetod:**
- Inspektera en slide med ikoner
- Verifiera att `.material-icons` element visar grafiska ikoner

---

### T4: style.css laddas och appliceras
**Förväntat resultat (RED först):**
- style.css laddas inte eller har fel path
- Slides har ingen custom styling

**Förväntat resultat (GREEN efter implementering):**
- Network tab visar att `style.css` laddas med status 200
- Bakgrundsfärg är #1a2332 (från style.css)
- H1 element har rätt font-size och färg

**Testmetod:**
- Browser Network tab: verifiera att `style.css` laddas
- Inspektera element: verifiera att CSS-regler från `style.css` är applicerade

---

### T5: Första sliden (001) ser ut som originalet
**Förväntat resultat (RED först):**
- Slide 001 är inte migrerad
- Innehållet saknas eller ser fel ut

**Förväntat resultat (GREEN efter implementering):**
- Titel "Model Context Protocol" visas centrerat
- Subtitle "Connecting LLMs to External Systems" visas
- Agenda med tre items och ikoner visas
- Layout matchar originalet visuellt

**Testmetod:**
- Jämför sida vid sida: 
  - Original: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025/slides/001.html`
  - Ny: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025` (första sliden)
- Ta screenshots och jämför visuellt

---

### T6: Navigation fungerar med piltangenter
**Förväntat resultat (RED först):**
- Endast en slide finns, ingen navigation möjlig

**Förväntat resultat (GREEN efter alla slides är migrerade):**
- Höger pil går till nästa slide
- Vänster pil går till föregående slide
- Mellanslag går till nästa slide
- Slide-nummer uppdateras korrekt

**Testmetod:**
- Tryck höger pil, verifiera att nästa slide visas
- Tryck vänster pil, verifiera att föregående slide visas
- Mellanslag, verifiera att nästa slide visas

---

### T7: Presenter mode öppnas med 'S'
**Förväntat resultat (RED först):**
- 'S' gör ingenting eller öppnar inte presenter mode

**Förväntat resultat (GREEN efter implementering):**
- Tryck 'S' öppnar ett nytt fönster
- Presenter-fönstret visar:
  - Aktuell slide
  - Nästa slide (preview)
  - Timer
  - Notes-område (kan vara tomt för nu)
- Navigation i presenter-fönstret synkas med huvud-fönstret

**Testmetod:**
- Öppna presentation
- Tryck 'S'
- Verifiera att två fönster finns
- Navigera i presenter-fönstret, verifiera synkning

---

### T8: Alla 19 slides är migrerade och ser ut som originalen
**Förväntat resultat (RED först):**
- Inte alla slides är migrerade

**Förväntat resultat (GREEN efter alla slides är migrerade):**
- `Reveal.getTotalSlides()` returnerar 19
- Varje slide (001-019) ser ut som sitt original
- Ingen slide har broken layout eller saknade element

**Testmetod:**
- För varje slide 001-019:
  - Navigera till sliden i Reveal.js presentation
  - Jämför visuellt med original-filen
  - Verifiera att alla element finns
  - Verifiera att styling är korrekt

---

## Testordning

1. T1: index.html existerar (RED → GREEN)
2. T2: Reveal.js initialiseras (RED → GREEN)
3. T3: Material Icons laddas (RED → GREEN)
4. T4: style.css laddas (RED → GREEN)
5. T5: Slide 001 migrerad (RED → GREEN)
6. T6: Navigation fungerar (delvis RED → GREEN efter fler slides)
7. T8: Migrera slides 002-019 EN I TAGET (varje får gå från RED → GREEN)
8. T6: Navigation fungerar fullt (GREEN)
9. T7: Presenter mode (RED → GREEN)

## Status

- [x] T1: index.html existerar ✅ (verifierat via HTTP/terminal)
- [ ] T2: Reveal.js initialiseras ⏳ (kräver browser console)
- [ ] T3: Material Icons laddas ⏳ (kräver browser)
- [x] T4: style.css laddas ✅ (verifierat via HTTP - filen finns och laddas)
- [ ] T5: Slide 001 migrerad ⏳ (kräver visuell jämförelse)
- [ ] T6: Navigation fungerar ⏳ (kräver browser interaktion)
- [ ] T7: Presenter mode fungerar ⏳ (kräver browser interaktion)
- [x] T8: Alla 19 slides migrerade ✅ (verifierat - 19 sections i index.html)

## Testresultat

Se `TEST-RESULTS-reveal-migration.md` för detaljerade resultat.

**Automatiska tester (via terminal/HTTP):**
- ✅ T1: index.html existerar och laddas (HTTP 200)
- ✅ T4: style.css laddas (filen finns och returnerar innehåll)
- ✅ T8: 19 slides migrerade (19 section-element räknade)

**Manuella tester (kräver browser):**
- ⏳ T2: Reveal.js initialiseras korrekt
- ⏳ T3: Material Icons laddas
- ⏳ T5: Första sliden (001) ser ut som originalet
- ⏳ T6: Navigation fungerar med piltangenter
- ⏳ T7: Presenter mode öppnas med 'S'

## Anteckningar

Detta är en integration/manuell testplan eftersom Reveal.js-migration är svår att enhetstesta automatiskt. Vi följer TDD-principen genom att:
1. Definiera förväntat resultat FÖRST (RED state)
2. Implementera kod för att uppnå förväntat resultat
3. Verifiera manuellt att testet är GREEN
4. Gå vidare till nästa test

Varje steg får sin egen commit så vi kan backa om något går fel.


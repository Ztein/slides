# Test-instruktioner: Reveal.js Fixar

## Implementerat (alla commits på branch migrate/reveal-js)

### FAS 1: Analys ✅
- Dokumenterat systematiska problem
- Identifierat CSS-konflikter

### FAS 2: CSS-fixar ✅
- **2.1**: Ändrat `.reveal .slides section` från flex till block
- **2.2**: Override Reveal.js black theme (färger, bakgrund)
- **2.3**: Forced horisontell layout för `.flow-diagram`
- **2.4**: Forced 3-kolumns grid för `.characteristics`

### FAS 3.1: Keyboard fix ✅
- Tagit bort custom keyboard handler som blockerade 'S'
- Satt `keyboard: true` för default Reveal.js bindings

## Testa nu (FAS 3-4)

### Test 1: Grundläggande layout (slide 002)
1. **Refresh browser** (hårdrefresh med Cmd+Shift+R)
2. Öppna: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
3. Navigera till slide 002 (tryck höger pil)

**Förväntat resultat:**
- ✅ Flow-diagram är HORISONTELL (Input → Neural Network → Output i rad)
- ✅ Characteristics är 3-KOLUMNS GRID (inte vertikal stack)
- ✅ Färger ser bättre ut (vit text på mörk bakgrund)
- ✅ Element har mer rimliga storlekar

**Jämför med original:**
- Öppna i ny tab: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025/slides/002.html`
- Layout ska vara MYCKET närmare originalet

### Test 2: Presenter Mode
1. Öppna: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
2. **Tryck 'S'** på tangentbordet

**Förväntat resultat:**
- ✅ Ett nytt fönster öppnas (presentatörsvy)
- ✅ Presentatörsvyn visar:
  - Current slide (stor)
  - Next slide (preview, liten)
  - Timer
  - Notes area (tom, eftersom script.md inte är kopplat än)
- ✅ Navigera i presentatörsvyn (piltangenter)
- ✅ Båda fönster synkas (när du navigerar i presenter view, följer huvudfönstret med)

**Om popup blockeras:**
- Tillåt popups för localhost:8085 i din webbläsare

### Test 3: Övriga slides (snabb check)
Gå igenom några slides och kolla om layouten ser bättre ut:
- Slide 001 (titel)
- Slide 003 (transformer architecture)
- Slide 005 (isolation diagram)
- Slide 009 (MCP diagram)
- Slide 010 (architecture)

**Förväntat resultat:**
- ✅ Inga slides staplar element vertikalt (när de ska vara horisontella/grid)
- ✅ Grids fungerar (3-kolumners, etc.)
- ✅ Färger ser bättre ut

## Om något inte fungerar

### Problem: Layout fortfarande dålig
- Försök hårdrefresh (Cmd+Shift+R eller Ctrl+Shift+R)
- Kolla browser console för CSS-fel
- Verifiera att senaste commits är pullad: `git log --oneline -5`

### Problem: 'S' gör fortfarande ingenting
- Hårdrefresh
- Öppna browser console och kör: `Reveal.getConfig().keyboard`
- Ska returnera `true` (inte ett objekt med key 83)

### Problem: Slides ser fel ut men i andra riktningen
- Kanske vi behöver justera !important-rules
- Rapportera vilka specifika slides som har problem

## Sammanfattning av förändringar

**7 commits på migrate/reveal-js:**
1. CSS analysis document
2. Fix section display (flex → block)
3. Override black theme colors
4. Force horizontal flow-diagram
5. Force 3-column grid characteristics
6. Update CSS analysis
7. Fix presenter mode keyboard

**Resultat:**
- Systematiska CSS-konflikter fixade
- Reveal.js black theme override
- Layout ska nu fungera för alla slides
- Presenter mode ska öppnas med 'S'

**Nästa steg efter test:**
- Om det ser bra ut: merge till main
- Om problem kvarstår: dokumentera vilka slides/problem
- Därefter: FAS 7 (koppla script.md för notes)


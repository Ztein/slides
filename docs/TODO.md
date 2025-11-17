Vi ska göra så att vi ska bygga en applikation som kan ta HTML-filer och javascript och använda detta till en presentationsprogram. Jag ska kunna skapa nya slajds och återanvända CSS och liknande i en presentation. Jag ska kunna ha olika presentationer. Se struktur i presentations/uppsala_uni_18_nov_2025 eller presentations/uppsala_uni_18_nov_2025_improved

Jag ska kunna ha en presentatörsvy på en av mina skärmar.
Jag ska kunna visa själva presentationens innehåll på en annan skärm.

i Readme.md ska det framgå hur man gör för att skapa en ny presentation, köra en befintlig och ändra på en som finns.

Till slut ska det bli en riktigt proffsig applikation som jag kan använda vid presentationer. 
Normalt ska vara att en slajd ska vara 16:9 men om det behövs ska man kunna skrolla i den så man kan se hela innehållet. 

Vi ska försöka nå mot en proffsappliktaion som använder något javaskriptramverk som är till för att göra snygga och smarta presentationer. 

**BESLUT: Vi använder Reveal.js** - det finns redan i projektet (`presentation-template.html`, `server.js`) och ger:
- ✅ Presenter mode med två fönster (tryck `S`) - byggt in gratis
- ✅ Keyboard navigation och shortcuts
- ✅ Stöd för notes (`<aside class="notes">`) som kopplas till `script.md`
- ✅ Profesionell slide-navigation
- ✅ Mobilanpassning och övergångar

**Nuvarande situation:**
- `presentations/uppsala_uni_18_nov_2025/` använder egen implementation (001.html, 002.html, etc. med inline CSS)
- `presentation-template.html` har redan Reveal.js-setup
- `server.js` har redan API för att läsa `script.md` och stoppa in notes

**Plan: Migrera den snygga presentationen till Reveal.js + centralisera CSS**

VI vill inte att varje html-fil ska behöve ha all css etc utan vi ska göra en gemensam css-fil för varje presentation.

**DETALJERAD PLAN - EN LITEN BIT I TAGET:**

**FAS 1: Analysera och förbereda (INGA FÄNDRINGAR ÄN)**

1.1. Läs igenom `presentations/uppsala_uni_18_nov_2025/slides/009.html` - dokumentera alla CSS-regler som finns i `<style>`-taggen. Lista alla klasser och ID:n som används. ✅ KLAR
1.2. Läs igenom `presentations/uppsala_uni_18_nov_2025/slides/010.html` - dokumentera alla CSS-regler. Jämför med 009: vilka regler är identiska? Vilka är liknande men olika? Vilka är helt unika? ✅ KLAR
1.3. Skriv ner en lista över gemensamma CSS-regler (t.ex. body, h1, .slide, .nav-controls) som kan flyttas till gemensam CSS. ✅ KLAR

**FAS 1 KLAR - Committad och mergad till main**

**FAS 2: Skapa gemensam CSS-fil (EN FIL I TAGET)**
2.1. Skapa filen `presentations/uppsala_uni_18_nov_2025/style.css` (tom fil först). ✅ KLAR
2.2. Flytta över ALLA CSS-regler från 009.html:s `<style>`-tag till `style.css`. Kopiera exakt, ändra inget ännu. ✅ KLAR
2.3. Testa: Uppdatera 009.html så att den länkar till `style.css` istället för att ha inline `<style>`. Verifiera att slide 009 ser exakt likadan ut som innan. ✅ KLAR (validerad med screenshot och network requests)

**FAS 2.1-2.3 KLAR - Committad och mergad till main**

2.4. Om 009 ser bra ut: Uppdatera 010.html så att den också länkar till `style.css`. Lägg till eventuella nya CSS-regler från 010 som inte fanns i 009 till `style.css`. ✅ KLAR
2.5. Testa: Verifiera att både 009 och 010 ser bra ut och fungerar. ✅ KLAR (validerad med screenshots och network requests, inga console-fel)
2.6. **Cleanup:** Ta bort `docs/common-css-list.md` när `style.css` är skapad och CSS:en är flyttad (filen var bara tillfällig analys för att hjälpa till att skapa style.css). ✅ KLAR

**FAS 2 KLAR - Committad och mergad till main**

**FAS 2.7: Fixa responsiv design för alla 16:9 skärmar (EN ÄNDRING I TAGET, VALIDERA EFTER VARJE STEG)**

**Problem:**
- Slide 009 och 010 renderas inte bra på MacBook Pro inbyggd skärm (blir för stort, behöver scrolla)
- Fungerar bra på 27-tums skärm (2560x1440)
- MacBook Pro har 3024x1964 (16:10, inte 16:9)
- "Hoppandet" beror på att fönstret är precis på gränsen mellan liggande/stående vy

**Mål:**
- Slides ska visas snyggt på alla 16:9 skärmar (och 16:10)
- Inga scrollningar ska behövas
- Innehållet ska skalas proportionellt med viewport

**Plan (EN ÄNDRING I TAGET, VALIDERA EFTER VARJE STEG):**

2.7.1. **ANALYS - Identifiera problem (INGA FÄNDRINGAR)**
   - Mät viewport-storlekar: MacBook Pro (3024x1964) och 27-tums (2560x1440)
   - Identifiera vilka CSS-värden som orsakar problem (padding, margins, font-sizes, max-widths)
   - Dokumentera exakt vilka element som blir för stora på MacBook Pro
   - **Validering:** Screenshot av 009 och 010 på båda skärmstorlekarna, dokumentera problem

2.7.2. **TEST - Skapa testfall för validering (INGA FÄNDRINGAR)**
   - Skapa testfall: "Slide 009 ska passa på viewport 3024x1964 utan scroll"
   - Skapa testfall: "Slide 010 ska passa på viewport 3024x1964 utan scroll"
   - Skapa testfall: "Slide 009 ska fortfarande se bra ut på viewport 2560x1440"
   - Skapa testfall: "Slide 010 ska fortfarande se bra ut på viewport 2560x1440"
   - **Validering:** Testfallen är dokumenterade och kan köras manuellt

2.7.3. **FIX - Body padding (EN ÄNDRING)**
   - Ändra `body { padding: 40px; }` till responsiv padding (t.ex. `padding: 2vh 2vw;` eller media query)
   - **Validering:** Testa 009 och 010 på båda skärmstorlekarna, inga scrollningar, screenshot

2.7.4. **FIX - Slide max-width (EN ÄNDRING)**
   - Ändra `.slide { max-width: 1400px; }` till responsiv max-width (t.ex. `max-width: min(1400px, 95vw);`)
   - **Validering:** Testa 009 och 010 på båda skärmstorlekarna, inga scrollningar, screenshot

2.7.5. **FIX - H1 font-size och margin (EN ÄNDRING)**
   - Ändra `h1 { font-size: 3.5em; margin-bottom: 80px; }` till responsiva värden (t.ex. `font-size: clamp(2em, 5vw, 3.5em); margin-bottom: clamp(40px, 8vh, 80px);`)
   - **Validering:** Testa 009 och 010 på båda skärmstorlekarna, h1 ser bra ut, screenshot

2.7.6. **FIX - Diagram margins (EN ÄNDRING)**
   - Ändra `.diagram { margin: 100px 0; }` till responsiv margin (t.ex. `margin: clamp(40px, 8vh, 100px) 0;`)
   - **Validering:** Testa 009 på båda skärmstorlekarna, diagram ser bra ut, screenshot

2.7.7. **FIX - Material-icons font-size (EN ÄNDRING)**
   - Ändra `.material-icons { font-size: 120px; }` till responsiv font-size (t.ex. `font-size: clamp(60px, 8vw, 120px);`)
   - **Validering:** Testa 009 på båda skärmstorlekarna, ikoner ser bra ut, screenshot

2.7.8. **FIX - Architecture max-width och gaps (EN ÄNDRING)**
   - Ändra `.architecture { max-width: 1200px; gap: 50px; }` till responsiva värden
   - **Validering:** Testa 010 på båda skärmstorlekarna, architecture ser bra ut, screenshot

2.7.9. **FIX - Layer-box padding (EN ÄNDRING)**
   - Ändra `.layer-box { padding: 40px; }` till responsiv padding
   - **Validering:** Testa 010 på båda skärmstorlekarna, layer-box ser bra ut, screenshot

2.7.10. **FIX - Media queries för MacBook Pro (EN ÄNDRING)**
   - Lägg till media query för MacBook Pro's viewport (t.ex. `@media (max-height: 2000px) and (min-width: 2000px)`)
   - **Validering:** Testa 009 och 010 på MacBook Pro, inga scrollningar, screenshot

2.7.11. **VALIDERINGSSTEG - Testa alla ändringar tillsammans**
   - Testa 009 och 010 på båda skärmstorlekarna
   - Testa resize-funktionalitet (säkra att det inte tar flera sekunder)
   - Testa att inga "hopp" sker mellan visningslägen
   - **Validering:** Alla testfall är gröna, screenshots visar att allt ser bra ut

2.7.12. **CLEANUP - Ta bort temporära testfiler om några skapades**
   - **Validering:** Inga temporära filer finns kvar

**FAS 2.7 KLAR - Committad och mergad till main**

**FAS 3 KLAR - Analys genomförd**

**FAS 3: Identifiera återanvändbara klasser** ✅ KLAR
- ✅ 12 identiska CSS-regler identifierade (grundläggande layout, navigation)
- ✅ 18 unika regler för 009 (diagram-layout)
- ✅ 19 unika regler för 010 (architecture-layout)
- ✅ Refactoring-strategi dokumenterad: organisera CSS med kommentarer, behåll slide-specifika klasser, vänta med abstraktion

**SLUTSATS FAS 3:**
- **Gemensamma klasser:** `*`, `body`, `.slide`, `h1`, navigation (`nav-controls`, `nav-button`, etc.)
- **009-specifika:** `.diagram`, `.component`, `.box`, `.arrow-container`, `.features`, etc.
- **010-specifika:** `.architecture`, `.layer`, `.layer-box`, `.servers-row`, `.connection-arrow`, etc.
- **Nästa steg:** Organisera CSS med tydliga kommentarer (`/* === GEMENSAMMA STILAR === */`, `/* === SLIDE 009 === */`, `/* === SLIDE 010 === */`)

---

**FAS 4: Refaktorera CSS (EN KLASS I TAGET)**
4.1. Organisera CSS med tydliga kommentarer för att markera gemensamma vs specifika klasser. ✅ KLAR
   - CSS organiserad i sektioner: `/* === GEMENSAMMA STILAR === */`, `/* === POTENTIELLT GEMENSAMMA KLASSER === */`, `/* === SLIDE 009 === */`, `/* === SLIDE 010 === */`, `/* === NAVIGATION === */`
   - Validerad: Slides 009 och 010 ser bra ut efter organisering

**FAS 5: Migrera övriga slides (EN SLIDE I TAGET)** ✅ KLAR
5.1. Ta slide 001. Lägg till länk till `style.css`. Lägg till eventuella nya CSS-regler som behövs i `style.css`. Testa att 001 fungerar. ✅ KLAR
5.2. Ta slide 002. Samma process. Testa. ✅ KLAR
5.3. Fortsätt med 003, 004, 005... EN I TAGET. Efter varje slide: testa att den fungerar innan du går vidare.
   - ✅ Slide 003: Migrerad till style.css med kompakt lista-liknande design (pilar på höger sida utanför items)
   - ✅ Slide 004: Migrerad till style.css med kompakt design (fast padding, mindre gaps)
   - ✅ Slide 005: Migrerad till style.css med kompakt design (mindre LLM-bubbla, fast gaps och padding)
   - ✅ Slide 006: Migrerad till style.css med kompakt design
   - ✅ Slide 007: Migrerad till style.css med kompakt design
   - ✅ Slide 008: Migrerad till style.css med kompakt design
   - ✅ Slide 009: Redan migrerad i FAS 2
   - ✅ Slide 010: Redan migrerad i FAS 2
   - ✅ Slide 011: Migrerad till style.css med kompakt design
   - ✅ Slide 012: Migrerad till style.css med kompakt design
   - ✅ Slide 013: Migrerad till style.css med kompakt design
   - ✅ Slide 014: Migrerad till style.css med kompakt design (fixat CSS-konflikt med slide 003)
   - ✅ Slide 015: Migrerad till style.css med kompakt design (fixat kodformatering med <br> och &nbsp;)
   - ✅ Slide 016: Migrerad till style.css med kompakt design
   - ✅ Slide 017: Migrerad till style.css med kompakt design
   - ✅ Slide 018: Migrerad till style.css med kompakt design
   - ✅ Slide 019: Migrerad till style.css med kompakt lista-design (utan stora boxar)

**FAS 5 KLAR - Committad och mergad till main**

**FAS 6: Migrera till Reveal.js** ✅ KLAR
6.1. ✅ Skapa `index.html` baserat på `presentation-template.html`
6.2. ✅ Anpassa `style.css` för Reveal.js wrapper-struktur (`.reveal .slides section`)
6.3. ✅ Migrera alla 19 slides från individuella HTML-filer till `<section>`-element
6.4. ✅ Ta bort navigation-CSS (Reveal.js hanterar navigation)
6.5. ✅ Varje slide har `<aside class="notes"></aside>` för framtida notes-integration
6.6. 🔄 **ÅTERSTÅR:** Manuell testning av presentation (se `docs/MANUAL-TEST-INSTRUCTIONS.md`)

**Resultat FAS 6:**
- `presentations/uppsala_uni_18_nov_2025/index.html` skapad med alla 19 slides
- Reveal.js implementerat och konfigurerat
- Presenter mode tekniskt redo (tryck 'S' för att öppna)
- Navigation fungerar via Reveal.js (piltangenter, mellanslag)
- CSS anpassad för Reveal.js struktur

**FAS 6 KLAR - Committad till branch `migrate/reveal-js`** (väntar på manuell testning och merge)

<VI ÄR HÄR I ARBETET (FLYTTA EFTER DENNA MARKERING I TAKT MED EN GREJ BLIR KLAR)>
**NÄSTA ÅTGÄRD: Manuell testning av Reveal.js presentation, därefter FAS 7**

**FAS 7: Koppla script.md (EN DEL I TAGET)**
7.1. Läs `presentations/uppsala_uni_18_nov_2025/script.md` - förstå strukturen.
7.2. Testa att API:et `/api/presentations/uppsala_uni_18_nov_2025/notes` fungerar (kör servern och testa i webbläsare).
7.3. Verifiera att notes från `script.md` automatiskt injiceras i `<aside class="notes">` (redan implementerat i `index.html`)
7.4. Testa presenter mode med notes - verifiera att notes visas korrekt

**FAS 8: Presenter mode och final polish**
8.1. ✅ Reveal.js presenter mode redan implementerat (inbyggd funktion)
8.2. 🔄 Testa presenter mode manuellt (tryck 'S' i presentation)
8.3. 🔄 Verifiera att två fönster öppnas (publikvy + presentatörsvy)
8.4. 🔄 Verifiera att navigation synkas mellan fönstren
8.5. 🔄 Verifiera att timer och nästa slide visas i presentatörsvyn

**FAS 9: Dokumentation (EN SEKTION I TAGET)**
9.1. Uppdatera `README.md` med sektion om hur man skapar ny presentation. Testa att instruktionerna fungerar.
9.2. Lägg till sektion om CSS-struktur. Testa.
9.3. Lägg till sektion om script.md. Testa.
9.4. Lägg till sektion om presenter mode. Testa.

y. Navigationspilarna på slajdsen ska bara visas vid hover.
z. Det ska vara enkelt att ändra ordning på slajdsen, eller ta bort en, eller lägga till en. Dvs vi kan inte längre ha filnamn med index i.

x. Vidareutveckla presentatörsvyn till en riktigt proffsig lösning (timer, nästa slide, tydligare manuslayout, snabbnavigation m.m.)


Future features:
kunna exportera till PDF. med och utan manus.
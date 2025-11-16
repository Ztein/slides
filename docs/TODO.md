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
1.1. Läs igenom `presentations/uppsala_uni_18_nov_2025/slides/009.html` - dokumentera alla CSS-regler som finns i `<style>`-taggen. Lista alla klasser och ID:n som används.
1.2. Läs igenom `presentations/uppsala_uni_18_nov_2025/slides/010.html` - dokumentera alla CSS-regler. Jämför med 009: vilka regler är identiska? Vilka är liknande men olika? Vilka är helt unika?
1.3. Skriv ner en lista över gemensamma CSS-regler (t.ex. body, h1, .slide, .nav-controls) som kan flyttas till gemensam CSS.

**FAS 2: Skapa gemensam CSS-fil (EN FIL I TAGET)**
2.1. Skapa filen `presentations/uppsala_uni_18_nov_2025/style.css` (tom fil först).
2.2. Flytta över ALLA CSS-regler från 009.html:s `<style>`-tag till `style.css`. Kopiera exakt, ändra inget ännu.
2.3. Testa: Uppdatera 009.html så att den länkar till `style.css` istället för att ha inline `<style>`. Verifiera att slide 009 ser exakt likadan ut som innan.
2.4. Om 009 ser bra ut: Uppdatera 010.html så att den också länkar till `style.css`. Lägg till eventuella nya CSS-regler från 010 som inte fanns i 009 till `style.css`.
2.5. Testa: Verifiera att både 009 och 010 ser bra ut och fungerar.

**FAS 3: Identifiera återanvändbara klasser (ANALYS, INGA FÄNDRINGAR)**
3.1. Gå igenom CSS:en i `style.css`. Identifiera regler som är identiska eller nästan identiska mellan 009 och 010.
3.2. Identifiera regler som är unika för 009 eller 010. Fundera: kan dessa göras mer generella? Eller behöver de vara specifika?
3.3. Skriv ner en plan för vilka klasser som ska vara gemensamma och vilka som kan behöva vara specifika.

**FAS 4: Refaktorera CSS (EN KLASS I TAGET)**
4.1. Börja med de mest grundläggande reglerna (t.ex. `*`, `body`, `.slide`). Se till att de fungerar för både 009 och 010.
4.2. Fortsätt med rubrikstilar (`h1`, etc). Testa efter varje ändring att både 009 och 010 fortfarande ser bra ut.
4.3. Fortsätt med navigation-komponenter (`.nav-controls`, `.nav-button`, etc). Testa.
4.4. Fortsätt med slide-specifika komponenter (`.diagram`, `.architecture`, etc). Testa efter varje ändring.

**FAS 5: Migrera övriga slides (EN SLIDE I TAGET)**
5.1. Ta slide 001. Lägg till länk till `style.css`. Lägg till eventuella nya CSS-regler som behövs i `style.css`. Testa att 001 fungerar.
5.2. Ta slide 002. Samma process. Testa.
5.3. Fortsätt med 003, 004, 005... EN I TAGET. Efter varje slide: testa att den fungerar innan du går vidare.

**FAS 6: Säkerställ 16:9 och scroll (EN ÄNDRING I TAGET)**
6.1. Lägg till CSS-regel för att säkerställa 16:9-aspekt. Testa på en slide.
6.2. Lägg till CSS-regel för overflow-scroll. Testa på en slide med mycket innehåll.
6.3. Testa på flera slides för att säkerställa att det fungerar överallt.

**FAS 7: Koppla script.md (EN DEL I TAGET)**
7.1. Läs `presentations/uppsala_uni_18_nov_2025/script.md` - förstå strukturen.
7.2. Testa att API:et `/api/presentations/uppsala_uni_18_nov_2025/notes` fungerar (kör servern och testa i webbläsare).
7.3. Välj EN slide (t.ex. 009). Lägg till `<aside class="notes">` i HTML:en. Testa att notes från script.md injiceras korrekt.
7.4. Om det fungerar: fortsätt med nästa slide. EN I TAGET.

**FAS 8: Presenter mode (TESTA FÖRST, SEDAN FIXA)**
8.1. Skapa en test-`index.html` baserat på `presentation-template.html` med BARA slide 009 som `<section>`.
8.2. Testa att Reveal.js presenter mode (tryck `S`) fungerar med denna ena slide.
8.3. Om det fungerar: lägg till slide 010. Testa igen.
8.4. Fortsätt att lägga till slides EN I TAGET och testa presenter mode efter varje tillägg.

**FAS 9: Dokumentation (EN SEKTION I TAGET)**
9.1. Uppdatera `README.md` med sektion om hur man skapar ny presentation. Testa att instruktionerna fungerar.
9.2. Lägg till sektion om CSS-struktur. Testa.
9.3. Lägg till sektion om script.md. Testa.
9.4. Lägg till sektion om presenter mode. Testa.

x. Vidareutveckla presentatörsvyn till en riktigt proffsig lösning (timer, nästa slide, tydligare manuslayout, snabbnavigation m.m.)

Future features:
kunna exportera till PDF. med och utan manus.
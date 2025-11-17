# Diagnostiska Instruktioner

## Syfte
Identifiera varför CSS inte appliceras korrekt i Reveal.js presentationen.

## Steg 1: Öppna presentationen
1. Starta servern: `npm start`
2. Öppna presentationen: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
3. Öppna browser console (F12 eller Cmd+Option+I)

## Steg 2: Kolla diagnostisk output
När presentationen laddas kommer en omfattande diagnostisk analys att loggas i konsolen.

### Vad analysen visar:

1. **DOM STRUCTURE**: Fullständig DOM-träd från section-elementet
   - Var ligger innehållet faktiskt?
   - Finns det wrappers som Reveal.js skapar?

2. **REVEAL.JS WRAPPERS**: Kollar om `.slide-background` eller `.slide-background-content` finns
   - Om de finns: var är de placerade?
   - Hur många barn har de?

3. **CONTENT LOCATION**: Var ligger faktiskt innehållet?
   - Är h1 direkt i section?
   - Är .flow-diagram direkt i section eller i en wrapper?

4. **COMPUTED STYLES FOR SECTION**: Vilka styles appliceras faktiskt?
   - display, flex-direction, text-align, etc.
   - Finns det inline styles?

5. **COMPUTED STYLES FOR .slide-background-content**: Om wrapper finns
   - Vilka styles har den?
   - Finns det inline styles?

6. **COMPUTED STYLES FOR .flow-diagram**: Layout för flow-diagram
   - display, flex-direction, etc.
   - Finns det inline styles?

7. **CSS RULES ANALYSIS**: Vilka CSS-regler matchar?
   - Från vilka stylesheets?
   - Vilka selectors matchar?

## Steg 3: Testa minimal slide
Navigera till första sliden (DIAGNOSTIC TEST) och kolla:
- Ser den ut som den ska?
- Vad säger diagnostiken för den sliden?

## Steg 4: Jämför med slide 002
Navigera till slide 002 (What is a Large Language Model?) och kolla:
- Vad är skillnaden i DOM-struktur?
- Vad är skillnaden i computed styles?

## Steg 5: Kopiera diagnostisk output
Kopiera hela diagnostiska outputen från konsolen och skicka till mig så kan jag analysera vad som faktiskt händer.

## Förväntat resultat
Om allt fungerade korrekt skulle vi se:
- Innehållet direkt i `<section>` (ingen wrapper)
- `display: flex` och `flex-direction: column` på section
- `.flow-diagram` med `display: flex` och `flex-direction: row`

Om det inte fungerar kommer diagnostiken visa:
- Var innehållet faktiskt ligger
- Vilka styles som faktiskt appliceras
- Om Reveal.js sätter inline styles som override:ar CSS
- Vilka CSS-regler som faktiskt matchar


# CSS Analysis - Reveal.js Migration Problem

## FAS 1.1: Jämförelse Original vs Reveal.js (alla slides)

### Slide 002 - What is a Large Language Model?

**Original (slides/002.html):**
- URL: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025/slides/002.html`
- Layout: Horisontell flow-diagram (Input -> Neural Network -> Output i rad)
- Characteristics: 3-kolumns grid
- Storlek: Boxes är lagom storlek, text är läsbar
- Navigation: Gamla navigation controls längst ner

**Reveal.js (index.html slide 2):**
- URL: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025` (slide 2)
- Layout: **PROBLEM** - Flow-diagram vertikal (staplar element)
- Characteristics: **PROBLEM** - Blir vertikal lista istället för 3-kolumns grid
- Storlek: **PROBLEM** - Boxes och text för stora
- Navigation: Reveal.js pilar (stora och fula enligt användaren)

### Gemensamma problem på ALLA slides:

1. **Layout-problem (vertikal staplning istället för horisontell/grid):**
   - Flexbox-element staplas vertikalt
   - Grid-element kollapsar till 1 kolumn
   - Horisontella arrangemang blir vertikala

2. **Storlek-problem:**
   - Element blir för stora
   - Text blir för stor
   - Boxes/containers tar för mycket plats

3. **Spacing-problem:**
   - För mycket eller för lite spacing
   - Margin/padding ser annorlunda ut

4. **Navigation:**
   - Reveal.js visar stora navigation-pilar
   - Gamla navigation controls kan fortfarande synas (måste verifiera)

## FAS 1.2: CSS-konflikter (identifiering pågår)

### Källor till CSS:
1. **reveal.css (CDN)** - `https://cdn.jsdelivr.net/npm/reveal.js@4.6.1/dist/reveal.css`
2. **black.css theme (CDN)** - `https://cdn.jsdelivr.net/npm/reveal.js@4.6.1/dist/theme/black.css`
3. **style.css (lokal)** - `presentations/uppsala_uni_18_nov_2025/style.css`
4. **Inline <style> (index.html)** - Minimala overrides i `<head>`

### Misstänkta konflikter:

#### Konflikt 1: Dubbel Flex Wrapper
```css
/* I style.css - rad 18 */
.reveal .slides section {
    display: flex;          /* ← PROBLEM */
    flex-direction: column; /* ← PROBLEM - staplar allt vertikalt */
    max-width: min(1400px, calc(100vw - 2 * clamp(20px, 2vw, 40px)));
    width: 100%;
    max-height: 96vh;
    padding: 2vh 2vw;
}

/* OCH .slide wrapper inuti som OCKSÅ är flex */
.slide {
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
```
**Effekt:** Dubbel vertikal staplning - Reveal.js section + .slide wrapper båda använder flex-direction: column

#### Konflikt 2: Reveal.js Black Theme Override
`black.css` theme sätter egna defaults för:
- text-align
- colors
- font-sizes
- backgrounds
- spacing

Dessa kan override:a våra CSS-regler från `style.css`.

#### Konflikt 3: Specificity
Våra CSS-regler kanske inte är tillräckligt specifika för att override:a Reveal.js defaults.

## FAS 1.3: Reveal.js Initialization (att verifiera i browser console)

Kör i browser console:
```javascript
Reveal.isReady()              // Förväntat: true
Reveal.getConfig()            // Kolla keyboard settings
Reveal.getKeyboardShortcuts() // Verifiera att 'S' är registrerad
```

## FAS 2 - Systemiska CSS-fixar (IMPLEMENTERADE)

✅ **2.1: Section display** - Ändrat från flex till block
✅ **2.2: Black theme override** - Färger och bakgrund
✅ **2.3: Flow-diagram** - Forced horizontal med !important
✅ **2.4: Characteristics** - Forced 3-column grid med !important

### Test-instruktioner:
1. Starta server: `npm start`
2. Öppna: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
3. Gå till slide 002 (höger pil)
4. Jämför med original: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025/slides/002.html`

### Förväntat resultat efter fixar:
- Flow-diagram är HORISONTELL (Input -> Neural Network -> Output i rad)
- Characteristics är 3-KOLUMNS GRID (inte vertikal stack)
- Färger matchar originalet (vit text på mörk bakgrund)
- Storlekar ser närmare originalet ut

## Nästa steg: FAS 3 - Testa presenter mode

Kolla keyboard setup för att fixa "S" tangenten.


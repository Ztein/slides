# Design Guide för Presentations

## Översikt

Denna guide definierar hur alla slides ska designas och struktureras i presentationerna. Följ dessa regler konsekvent för att säkerställa professionell och läsbar design.

## 1. Layoutprinciper

### 1.1 Centrering och Balans
- **Alla slides ska vara centrerade vertikalt och horisontellt**
- Använd `display: flex` med `flex-direction: column` för section-innehåll
- Huvudinnehåll ska vara centrerat, inte vänster/höger-stämt (förutom specifika diagram-slides)
- Använd `margin: 0 auto` för centrering av containrar

### 1.2 Hierarki
- **Tydlig visuell hierarki**: Stor titel → Undertitel → Huvudinnehåll → Detaljer
- H1 är alltid huvudfokus, centrerad och prominent
- Subtitle/underrubriker är sekundära men tydliga
- Body-text är läsbar men inte dominant

### 1.3 Whitespace
- **Generös spacing mellan element**
- Använd `clamp()` för responsiv spacing men med FIXA pixel-värden för vertikal kompaktitet
- Vertikal spacing: `clamp(6px, 0.8vh, 10px)` till `clamp(12px, 1.5vh, 18px)`
- Horisontell spacing kan vara mer responsiv: `clamp(12px, 1.5vw, 20px)`

### 1.4 Reveal.js Kontext
- **Allt måste passa på skärmen utan scrolling**
- Max-höjd för section: `96vh` med `overflow: hidden`
- Använd `!important` för Reveal.js-specificiteten när nödvändigt
- Alla storlekar måste vara reducerade jämfört med standalone HTML-filer

## 2. Typografi

### 2.1 H1 (Huvudrubrik)
```css
h1 {
    font-size: clamp(2.5rem, 5vh, 4rem) !important;
    margin-bottom: clamp(15px, 2vh, 25px) !important;
    font-weight: 700;
    text-align: left;
    line-height: 1.2;
    color: #ffffff;
}
```
- **Alltid vänsterställd** (konsistent stil på alla slides)
- **Samma storlek som title slide** - clamp(2.5rem, 5vh, 4rem)
- Stor nog att vara huvudfokus och dominant
- Tydlig avgränsning från body-text
- **Konsekvent på alla slides** - undvik slide-specifika undantag

### 2.2 Title Slide H1
```css
.title-slide-h1 {
    font-size: clamp(2.5rem, 5vh, 4rem) !important;
    margin-bottom: clamp(10px, 1.5vh, 18px) !important;
    font-weight: 700;
    line-height: 1.2;
}
```
- **MYCKET större än vanlig H1** för title slide - ska vara DOMINANT och tydligt störst
- Storleksrelation till subtitle: H1 ska vara **minst 3x - 4x större** än subtitle
- Minstorlek: `2.5rem` (40px), Maxstorlek: `4rem` (64px)
- Är fortfarande läsbar och passar på skärmen

### 2.3 Subtitle/Undertitel
```css
.subtitle-large {
    font-size: clamp(0.9em, 1.8vh, 1.3em) !important;
    margin-bottom: clamp(20px, 3vh, 40px) !important;
    color: #2dd4bf;
    text-align: center;
}
```
- **Centrerad under H1**
- **Betydligt mindre än H1** - storleksrelation: subtitle ska vara ca 25-30% av H1-storlek (H1 är 3-4x större)
- Teal-färg (#2dd4bf) för visuell distinktion
- **Tydlig hierarki**: H1 är DOMINANT och tydligt störst, subtitle är sekundär

### 2.4 Body Text
- **Font-size**: `clamp(0.8em, 1.3vh, 0.95em)` till `clamp(0.9em, 1.5vh, 1.1em)`
- **Line-height**: 1.3-1.4 (tighter för kompakt layout)
- **Color**: `#e2e8f0` (ljus grå)

### 2.5 Labels/Small Text
- **Font-size**: `clamp(0.75em, 1.2vh, 0.85em)`
- **Color**: `#94a3b8` (mörkare grå för mindre vikt)

## 3. Färger

### 3.1 Färgpalett
```css
/* Primär färger */
--primary-teal: #2dd4bf;      /* Huvud accent - titlar, ikoner, highlights */
--background-dark: #1a2332;   /* Bakgrund */
--background-box: #0f172a;    /* Box bakgrunder */
--text-primary: #ffffff;       /* Huvudtext (H1) */
--text-secondary: #e2e8f0;    /* Body text */
--text-muted: #94a3b8;        /* Muted text, labels */
--text-disabled: #64748b;     /* Disabled/inactive */

/* Status färger */
--error-red: #ef4444;         /* Fel, limitations, varningar */
--success-green: #10b981;     /* Success states */
```

### 3.2 Användning
- **Teal (#2dd4bf)**: Titlar, ikoner, highlights, länkar, borders på viktiga element
- **Vit (#ffffff)**: H1, viktiga rubriker
- **Ljus grå (#e2e8f0)**: Body text, vanligt innehåll
- **Mörk grå (#94a3b8)**: Labels, secondary info
- **Röd (#ef4444)**: Limitations, warnings, errors

## 4. Spacing och Sizing

### 4.1 Allmänna Regler
- **ALLT ska vara reducerat med 25-30% jämfört med standalone HTML-filer**
- **Vertikal spacing**: Använd FIXA pixel-värden eller små `vh`-värden
  - Small: `clamp(6px, 0.8vh, 10px)`
  - Medium: `clamp(10px, 1.2vh, 15px)`
  - Large: `clamp(15px, 2vh, 20px)`
- **Horisontell spacing**: Kan vara mer responsiv
  - Small: `clamp(10px, 1.2vw, 15px)`
  - Medium: `clamp(12px, 1.5vw, 20px)`
  - Large: `clamp(15px, 2vw, 25px)`

### 4.2 Icon Storlekar
- **Small icons**: `clamp(20px, 2.5vw, 28px)`
- **Medium icons**: `clamp(24px, 3vw, 32px)`
- **Large icons**: `clamp(32px, 4vw, 48px)`
- **Extra large icons**: `clamp(40px, 5vw, 60px)` (använd sparsamt)

### 4.3 Padding i Boxar
- **Kompakt padding**: `clamp(8px, 1vh, 12px)` vertikalt, `clamp(10px, 1.3vw, 16px)` horisontellt
- **Normal padding**: `clamp(10px, 1.2vh, 14px)` vertikalt, `clamp(12px, 1.5vw, 20px)` horisontellt
- **Large padding**: `clamp(12px, 1.5vh, 18px)` vertikalt, `clamp(15px, 2vw, 25px)` horisontellt

### 4.4 Gaps i Grids/Flex
- **Small gap**: `clamp(8px, 1.2vw, 14px)`
- **Medium gap**: `clamp(10px, 1.5vw, 18px)`
- **Large gap**: `clamp(12px, 2vw, 20px)`

### 4.5 Borders
- **Thin border**: `2px` (standard)
- **Medium border**: `3px` (highlights, viktiga element)
- **Border-radius**: `6px` (standard), `8px` (larger boxes), `10px` (special cases)

## 5. Slide-typer och Layout

### 5.1 Title Slide
```
Layout:
  [STOR TITLE - centrerad]
  [Subtitle - centrerad, teal]
  [Whitespace]
  [Presenter info - centrerad, liten, nederst]
  ELLER
  [Agenda - centrerad, kompakt lista]
```

**Regler:**
- H1 är huvudfokus, centrerad
- Subtitle direkt under H1, teal-färg
- Presenter info (institution, datum) nederst, liten och diskret
- Agenda (om med) är centrerad, kompakt lista med ikoner
- **INGEN vänster/höger layout** - allt centrerat

### 5.2 Content Slide
```
Layout:
  [H1 - centrerad]
  [Huvudinnehåll - centrerad eller två-kolumns grid]
```

**Regler:**
- H1 alltid centrerad överst
- Huvudinnehåll kan vara:
  - Centrerad (en kolumn)
  - Två-kolumns grid för jämförelser
  - Tre-kolumns grid för features/listor
- Max-bredd för innehåll: `min(1200px, 90vw)`
- Centrera med `margin: 0 auto`

### 5.3 Diagram/Flow Slide
```
Layout:
  [H1 - centrerad]
  [Diagram - centrerat]
```

**Regler:**
- H1 centrerad
- Diagram/flöde centrerat
- Använd flexbox med `justify-content: center`
- Gaps mellan element: `clamp(10px, 1.5vw, 18px)`

### 5.4 List Slide
```
Layout:
  [H1 - centrerad]
  [Lista - centrerad, max 4-5 items]
```

**Regler:**
- H1 centrerad
- List-items centrerade eller vänster-justerade i centrerad container
- Max 4-5 items per slide (annars dela upp)
- Icons + text, kompakt spacing

### 5.5 Comparison Slide
```
Layout:
  [H1 - centrerad]
  [Grid - 2 eller 3 kolumner]
```

**Regler:**
- H1 centrerad
- Grid med 2 eller 3 kolumner
- Jämt spacing mellan kolumner
- Varje kolumn har samma styling

## 6. Komponenter

### 6.1 Box/Card
```css
.box {
    background: #0f172a;
    border: 2px solid #2dd4bf;
    border-radius: 6px;
    padding: clamp(10px, 1.2vh, 14px) clamp(12px, 1.5vw, 20px);
}
```
- **Standard bakgrund**: `#0f172a`
- **Border**: `2px solid #2dd4bf` (teal)
- **Border-radius**: `6px` (standard)
- **Padding**: Kompakt för Reveal.js

### 6.2 Highlight Box
```css
.box-highlight {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    border: 3px solid #2dd4bf;
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
}
```
- **Gradient bakgrund** för viktiga element
- **Tjockare border**: `3px`
- **Box-shadow** för djup

### 6.3 Icon + Text Item
```css
.item {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.5vw, 16px);
}

.item-icon {
    font-size: clamp(24px, 3vw, 32px);
    color: #2dd4bf;
}
```
- **Flexbox** för alignment
- **Gap**: `clamp(10px, 1.5vw, 16px)`
- **Icons**: Teal-färg, medium storlek

## 7. Reveal.js Specifika Regler

### 7.1 Section Styling
```css
.reveal .slides section {
    display: flex !important;
    flex-direction: column !important;
    max-height: 96vh !important;
    overflow: hidden !important;
    padding: clamp(10px, 1.5vh, 20px) clamp(15px, 2vw, 30px) !important;
}
```
- **Alltid** `!important` för Reveal.js overrides
- **Max-höjd**: `96vh` för att passa på skärmen
- **Overflow**: `hidden` för att förhindra scrolling

### 7.2 Global Font Size Reduction
```css
.reveal .slides section {
    font-size: 0.85em !important;  /* Aggressive reduction */
}
```
- **Global reduktion** på all text i Reveal.js context

### 7.3 Icon Override
```css
.reveal .slides section .material-icons {
    font-size: clamp(24px, 3vw, 36px) !important;
}
```
- **Standard icon-storlek** i Reveal.js context

## 8. Måttregler (DON'Ts)

### 8.1 Layout
- ❌ **ALDRIG** vänster/höger-layout på title slide
- ❌ **ALDRIG** för stora font-sizes (>= 3vh, >= 4vw, >= 2rem) utan reduktion
- ❌ **ALDRIG** scrollbar - allt måste passa på skärmen
- ❌ **ALDRIG** inconsistent spacing - följ clamp()-mönster

### 8.2 Typografi
- ❌ **ALDRIG** font-size > `2.5vh` för H1 (förutom title slide)
- ❌ **ALDRIG** line-height > `1.5` (för tight, kompakt layout)
- ❌ **ALDRIG** olika färger på samma nivå utan anledning

### 8.3 Spacing
- ❌ **ALDRIG** margins/padding med `vh` > `3vh` (använd clamp med max)
- ❌ **ALDRIG** gaps > `3vw` (använd clamp med max)
- ❌ **ALDRIG** whitespace > `4vh` mellan element

### 8.4 Storlekar
- ❌ **ALDRIG** icons > `5vw` (använd clamp max `48px-60px`)
- ❌ **ALDRIG** box-padding > `2vh` vertikalt
- ❌ **ALDRIG** border-radius > `12px`

## 9. Checklista för Varje Slide

När du skapar eller fixar en slide, kontrollera:

- [ ] H1 är centrerad och läsbar
- [ ] Allt innehåll passar på skärmen utan scrolling
- [ ] Font-sizes är reducerade (max `2.5vh` för H1, `1.5vh` för body)
- [ ] Icons är max `4vw` (eller `48px`)
- [ ] Spacing använder `clamp()` med FIXA pixel-värden för vertikal
- [ ] Boxes har kompakt padding (`clamp(10px, 1.2vh, 14px)`)
- [ ] Färger följer paletten (teal för accents, grå för text)
- [ ] Layout är centrerad (inte vänster/höger)
- [ ] Reveal.js overrides har `!important`
- [ ] Max-höjd är `96vh` med `overflow: hidden`

## 10. Exempel: Perfekt Title Slide

```html
<section>
    <h1 class="title-slide-h1">Model Context Protocol</h1>
    <div class="subtitle-large">Connecting LLMs to External Systems</div>
    
    <div class="presenter-info">
        Uppsala University<br>
        November 18, 2025
    </div>
</section>
```

```css
.title-slide-h1 {
    font-size: clamp(2.5rem, 5vh, 4rem) !important;
    margin-bottom: clamp(10px, 1.5vh, 18px) !important;
    text-align: center;
    color: #ffffff;
}

.subtitle-large {
    font-size: clamp(0.9em, 1.8vh, 1.3em) !important;
    margin-bottom: clamp(20px, 3vh, 40px) !important;
    text-align: center;
    color: #2dd4bf;
}

.presenter-info {
    font-size: clamp(0.85em, 1.5vh, 1.2em) !important;
    color: #94a3b8;
    text-align: center;
    margin-top: auto; /* Push to bottom if using flex */
}
```

**Layout:** Allt centrerat vertikalt, H1 → Subtitle → Whitespace → Presenter info

## 11. Exempel: Perfekt Content Slide

```html
<section>
    <h1>Tokens, Context Windows, and Limitations</h1>
    
    <div class="content-grid">
        <div class="section">
            <div class="section-title">
                <span class="material-icons section-icon">label</span>
                Tokens
            </div>
            <div class="section-content">...</div>
        </div>
    </div>
</section>
```

```css
h1 {
    font-size: clamp(1.2rem, 2.2vh, 1.7rem) !important;
    margin-bottom: clamp(12px, 1.5vh, 18px) !important;
    text-align: center;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(10px, 1.5vw, 16px) !important;
    max-width: min(1200px, 90vw);
    margin: 0 auto;
}

.section {
    background: #0f172a;
    border: 2px solid #2dd4bf;
    border-radius: 6px;
    padding: clamp(10px, 1.2vh, 14px) clamp(12px, 1.5vw, 20px) !important;
}
```

---

## Sammanfattning: Golden Rules

1. **Centrering**: Allt centrerat, ingen vänster/höger-layout
2. **Kompakt**: Allt reducerat 25-30% för Reveal.js
3. **Tydlig hierarki**: H1 → Subtitle → Content → Details
4. **Fixa pixel-värden**: Vertikal spacing med clamp() men max-värden
5. **Max-höjd 96vh**: Inget scrolling, overflow: hidden
6. **Konsekvent**: Följ samma mönster på alla slides
7. **Teal för accents**: #2dd4bf för ikoner, titlar, borders
8. **Kompakt padding**: `clamp(10px, 1.2vh, 14px)` för boxes
9. **Medium icons**: `clamp(24px, 3vw, 32px)` standardstorlek
10. **!important**: Använd för Reveal.js overrides

---

**Version**: 1.0  
**Senast uppdaterad**: 2025-11-17  
**Gäller för**: Alla presentationer i Reveal.js


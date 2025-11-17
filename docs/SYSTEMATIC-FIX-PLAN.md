# Systematisk plan för att fixa alla slides för Reveal.js

## Problem
Alla slides var designade för individuella HTML-filer och har för stora storlekar i Reveal.js.

## Metod
**Gå igenom varje slide systematiskt, EN I TAGET.**

För varje slide:
1. Identifiera slide-nummer och alla CSS-klasser
2. Lista alla font-sizes, padding, margins, gaps
3. Identifiera storlekar som är för stora (>= 3vh, >= 4vw, >= 2rem)
4. Minska alla stora storlekar med 25-30%
5. Lägg till `!important` för Reveal.js-specificiteten
6. Testa att slide passar på skärmen (manuell validering krävs)
7. Gå till nästa slide

## Slides status

### ✅ Slide 001: Title slide
- [x] title-slide-h1: 3vh/2.5rem → 2.5vh/2rem
- [x] subtitle-large: 2.2vh/1.6em → 1.8vh/1.3em, margin: 8vh/80px → 3vh/40px
- [x] presenter-info: 2vh/1.5em → 1.5vh/1.2em, margin: 10vh/100px → 4vh/50px
- [x] agenda-title: 2.5vh/1.8em → 1.8vh/1.4em, margin: 4vh/40px → 2vh/20px
- [x] agenda-item: 2vh/1.3em → 1.5vh/1.1em, margin: 3vh/25px → 1.8vh/16px
- [x] agenda-icon: 3vw/32px → 2.5vw/28px
- **Status:** ✅ Fixad

### ✅ Slide 002: LLM Flow Diagram
- [x] flow-diagram: margin, gap reduktion
- [x] flow-box: padding, font-size reduktion
- [x] flow-arrow: font-size reduktion
- [x] characteristics: grid, margin, gap reduktion
- [x] characteristic: padding, icon, title, text reduktion
- **Status:** ✅ Fixad

### ✅ Slide 003: Transformer Architecture
- [x] architecture-flow: margin reduktion
- [x] flow-row: gap, margin-bottom reduktion
- [x] flow-item: padding, gap reduktion
- [x] flow-icon, flow-title, flow-description: font-size reduktion
- [x] flow-arrow: font-size reduktion
- **Status:** ✅ Fixad

### ✅ Slide 004: Tokens, Context Windows, Limitations
- [x] content-grid: gap, margin-bottom reduktion
- [x] section: padding, border, border-radius reduktion
- [x] section-title, section-icon: font-size reduktion
- [x] token-example, token-text, token-info: padding, font-size reduktion
- [x] context-window, window-box, window-text, window-info: reduktion
- [x] limitations-grid, limitation: gap, padding, font-size reduktion
- **Status:** ✅ Fixad

### ⏳ Slide 005: LLMs Are Isolated
- [ ] Identifiera alla klasser
- [ ] Lista alla storlekar
- [ ] Minska stora storlekar
- **Status:** ⏳ Pågående

### ⏳ Slides 006-019: 
- [ ] Gå igenom systematiskt, en i taget

## Process för varje slide
1. Läs slide HTML i index.html
2. Identifiera alla CSS-klasser som används
3. Hitta dessa klasser i style.css
4. Identifiera alla font-size, padding, margin, gap värden
5. Minska stora värden (>= 3vh, >= 4vw, >= 2rem) med 25-30%
6. Lägg till `!important` för Reveal.js
7. Commita med beskrivning av vad som ändrats
8. Be användare testa innan nästa slide

## Nästa steg
Gå igenom slide 005 systematiskt.


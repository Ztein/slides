# Plan: Fixa alla slides för Reveal.js

## Problem
Alla slides var designade för individuella HTML-filer och har för stora storlekar när de körs i Reveal.js. 

## Lösning: Slide-för-slide approach

Gå igenom varje slide systematiskt och minska:
1. Font-sizes (allt med vh/vw/rem >= 3vh, 4vw, 2rem)
2. Padding/margins (allt med vh/vw >= 3vh, 4vw)
3. Icons (allt med vw >= 5vw)
4. Gaps (allt med vw/vh >= 3vw/3vh)

## Process per slide
1. Identifiera slide-nummer och CSS-klasser
2. Minska alla stora storlekar med 25-30%
3. Testa att slide passar på skärmen
4. Gå till nästa slide

## Slides att fixa
- ✅ Slide 002: Fixad (flow-diagram, characteristics)
- ✅ Slide 003: Fixad (architecture-flow)
- ✅ Slide 004: Fixad (content-grid, sections, limitations)
- ⏳ Slide 001: Behöver fixas (title-slide-h1, subtitle-large, agenda)
- ⏳ Slide 005-019: Alla behöver fixas

## Nästa steg
Gå igenom slide 001 först, sedan 005, 006, etc. EN I TAGET.


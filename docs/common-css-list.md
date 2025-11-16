# Lista över gemensamma CSS-regler för uppsala_uni_18_nov_2025

## Steg 1.3: Gemensamma CSS-regler som kan flyttas till gemensam CSS

### Nivå 1: Direkt delbara regler (100% identiska)

Dessa regler är **exakt identiska** i både 009.html och 010.html och kan flyttas direkt till gemensam CSS:

#### 1. Universal selector
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

#### 2. Body
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    background: #1a2332;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 40px;
    color: #e2e8f0;
}
```

#### 3. .slide (huvudwrapper)
```css
.slide {
    max-width: 1400px;
    width: 100%;
}
```

#### 4. h1 (rubrik)
```css
h1 {
    text-align: center;
    color: #ffffff;
    font-size: 3.5em;
    margin-bottom: 80px;
    font-weight: 600;
    letter-spacing: -0.02em;
}
```

#### 5. Navigation Controls - alla regler
```css
.nav-controls {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 1000;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    border-radius: 50px;
    border: 2px solid #2dd4bf;
    box-shadow: 0 4px 20px rgba(45, 212, 191, 0.3);
}

.nav-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #2dd4bf;
    border: none;
    color: #1a2332;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 0;
}

.nav-button:hover:not(:disabled) {
    background: #14b8a6;
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(45, 212, 191, 0.5);
}

.nav-button:disabled {
    background: #475569;
    cursor: not-allowed;
    opacity: 0.4;
}

.nav-button .material-icons {
    font-size: 32px;
    color: #1a2332;
}

.nav-button:disabled .material-icons {
    color: #64748b;
}

.slide-indicator {
    color: #e2e8f0;
    font-size: 1.1em;
    font-weight: 600;
    padding: 0 10px;
    min-width: 80px;
    text-align: center;
}
```

#### 6. Media queries - Navigation (max-width: 768px)
```css
@media (max-width: 768px) {
    .nav-controls {
        bottom: 20px;
        right: 20px;
        padding: 12px 15px;
    }

    .nav-button {
        width: 45px;
        height: 45px;
    }

    .nav-button .material-icons {
        font-size: 28px;
    }

    .slide-indicator {
        font-size: 0.95em;
        min-width: 70px;
    }
}
```

#### 7. Media query - h1 (max-width: 1200px)
```css
@media (max-width: 1200px) {
    h1 {
        font-size: 2.5em;
    }
}
```

### Nivå 2: Liknande regler (kan generaliseras)

Dessa regler är **liknande men olika** och kan göras generella med modifierare eller specifika selektorer:

#### 1. Material Icons - olika storlekar
**Problem:** Olika font-size i olika kontexter
- 009: 120px (standard), 48px (arrow), 56px (feature), 32px (nav-button)
- 010: 80px (standard), 48px (connection-arrow), 60px (server-icon), 32px (nav-button)

**Lösning:** Använd modifierare eller specifika selektorer
```css
.material-icons {
    color: #2dd4bf;
}

.material-icons.large {
    font-size: 120px; /* för 009 */
}

.material-icons.medium {
    font-size: 80px; /* för 010 */
}

.material-icons.arrow {
    font-size: 48px;
}

.material-icons.feature {
    font-size: 56px;
}

.material-icons.server {
    font-size: 60px;
}
```

#### 2. Arrow animations
**Problem:** Olika animationer (horisontell vs vertikal)
- 009: `.arrow-right`, `.arrow-left` med `pulseRight`, `pulseLeft`
- 010: `.arrow-down`, `.arrow-up` med `pulseDown`, `pulseUp`

**Lösning:** Behåll båda, de är slide-specifika men kan ligga i samma fil

### Nivå 3: Slide-specifika regler (behåll i gemensam CSS med tydliga namn)

Dessa regler är **unika för varje slide** men kan ligga i samma CSS-fil:

#### 009-specifika klasser:
- `.diagram`
- `.component`
- `.box`
- `.box-highlight`
- `.icon-highlight`
- `.label`
- `.arrow-container`
- `.subtitle`
- `.features`
- `.feature`
- `.feature-text`

#### 010-specifika klasser:
- `.architecture`
- `.layer`
- `.layer-box`
- `.layer-highlight`
- `.layer-title`
- `.servers-row`
- `.server-item`
- `.server-icon`
- `.server-label`
- `.connection-arrow`
- `.protocol-badge`
- `.transport-info`

## Sammanfattning

### Direkt delbara (flytta först):
1. `*` (universal selector)
2. `body`
3. `.slide`
4. `h1`
5. Alla navigation-regler (7 regler)
6. Media queries för navigation och h1

**Totalt: ~15 regler som är 100% identiska**

### Kan generaliseras:
- Material icons storlekar (använd modifierare)
- Arrow animations (behåll båda, de är olika)

### Slide-specifika (men kan ligga i samma fil):
- 009-specifika: ~11 klasser
- 010-specifika: ~12 klasser

## Rekommendation för struktur i style.css

```css
/* ============================================
   GEMENSAMMA REGLER (delas av alla slides)
   ============================================ */

/* Reset & Base */
* { ... }
body { ... }
.slide { ... }
h1 { ... }

/* Navigation (gemensam för alla) */
.nav-controls { ... }
.nav-button { ... }
/* etc. */

/* Media Queries - Gemensamma */
@media (max-width: 1200px) { h1 { ... } }
@media (max-width: 768px) { /* navigation */ }

/* ============================================
   SLIDE-SPECIFIKA REGLER
   ============================================ */

/* Slide 009 - What is MCP? */
.diagram { ... }
.component { ... }
/* etc. */

/* Slide 010 - MCP Architecture */
.architecture { ... }
.layer { ... }
/* etc. */
```

## Nästa steg

När vi skapar `style.css`:
1. Börja med alla gemensamma regler (Nivå 1)
2. Lägg till slide-specifika regler med kommentarer som tydligt visar vilken slide de tillhör
3. Testa varje slide efter att CSS:en är flyttad


# Manual Test Instructions for Reveal.js Migration

## Prerequisites
- Server is running on port 8085 (run `npm start` if not)
- Browser is ready

## Test Steps

### T1: Verify index.html loads
1. Open browser
2. Navigate to: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
3. **Expected:** Page loads without 404 error
4. **Expected:** First slide (Model Context Protocol) is visible

### T2: Verify Reveal.js is initialized
1. Open browser console (F12)
2. Type: `Reveal.isReady()`
3. **Expected:** Returns `true`
4. Type: `Reveal.getTotalSlides()`
5. **Expected:** Returns `19`

### T3: Verify Material Icons load
1. Look at first slide
2. **Expected:** Agenda items show icons (psychology, extension, electrical_services)
3. **Expected:** No "material-icons" text visible (icons render properly)

### T4: Verify style.css loads
1. Open Network tab in browser dev tools
2. Refresh page
3. **Expected:** `style.css` loads with status 200
4. **Expected:** Background is dark (#1a2332)
5. **Expected:** Text is light colored

### T5: Verify navigation works
1. Press Right Arrow key
2. **Expected:** Moves to slide 2 (What is a Large Language Model?)
3. Press Left Arrow key
4. **Expected:** Returns to slide 1
5. Press Space bar
6. **Expected:** Moves forward one slide
7. Continue through all 19 slides
8. **Expected:** All slides display correctly, no broken layouts

### T6: Verify slides match originals
For each slide 1-19:
1. Navigate to slide in Reveal.js presentation
2. Open original in new tab: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025/slides/00X.html`
3. **Expected:** Content is identical (may look slightly different due to Reveal.js wrapper)
4. **Expected:** All text, icons, and layout elements are present

### T7: Test Presenter Mode
1. Navigate to: `http://localhost:8085/presentations/uppsala_uni_18_nov_2025`
2. Press `S` key
3. **Expected:** New window opens (presenter view)
4. **Expected:** Presenter view shows:
   - Current slide (large)
   - Next slide (small preview)
   - Timer
   - Notes area (empty for now, since we haven't connected script.md yet)
5. Navigate in presenter view (arrow keys)
6. **Expected:** Both windows stay in sync
7. Close presenter view
8. **Expected:** Main window continues to work

### T8: Check for console errors
1. Open browser console
2. Refresh page
3. Navigate through a few slides
4. **Expected:** No JavaScript errors
5. **Expected:** No 404 errors for resources
6. **Expected:** No CSS errors

## Success Criteria
All tests pass (T1-T8) without errors.

## If Tests Fail
- Document which test failed
- Note the error message or unexpected behavior
- Check browser console for errors
- Verify server is running
- Check that all commits were applied

## Notes
- T7 (Presenter Mode) is the critical test for this migration
- If popup blockers prevent presenter mode, add exception for localhost:8085
- Notes integration (script.md) will be tested in next phase (FAS 7)


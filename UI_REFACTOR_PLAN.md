# UI/UX Refactoring Plan

## Current State Analysis

### Critical Issue: Canvas Too Small on Load
**Problem:** Canvas loads at fixed size requiring users to zoom in
**Solution:** Canvas should fill available space automatically

```
Current:
┌────────────────────────────────────────┐
│ Header                                 │
├──────┬─────────────────────┬───────────┤
│      │   ┌─────────────┐   │           │
│ Side │   │   Canvas    │   │   Side    │  ← Canvas is tiny
│ bar  │   │   (small)   │   │   bar     │
│      │   └─────────────┘   │           │
└──────┴─────────────────────┴───────────┘

Proposed:
┌────────────────────────────────────────┐
│ Header                                 │
├──────┬─────────────────────┬───────────┤
│      │ ┌─────────────────┐ │           │
│ Side │ │                 │ │   Side    │  ← Canvas fills space
│ bar  │ │     Canvas      │ │   bar     │
│      │ │   (full size)   │ │           │
│      │ └─────────────────┘ │           │
└──────┴─────────────────────┴───────────┘
```

### Problems Identified

#### 1. Top Bar Overcrowding
Current top bar has too many buttons:
- Logo + Template selector
- Tool buttons (brush, eraser, fill, shape)
- Undo/Redo
- Zoom controls
- Session timer
- Export
- Sounds
- Breathing
- Daily prompt
- Focus mode
- Dark mode
- Mobile tools

**Issues:**
- 12+ buttons in a single row
- Inconsistent grouping
- Hard to find specific features
- Poor mobile experience

#### 2. Left Sidebar Overload
Currently contains:
- Brush type grid (9 types)
- Size slider
- Opacity slider
- Stabilization slider
- Lazy brush toggle + slider
- Shape tools (when shape selected)
- Symmetry modes (8 options)
- Color section (palettes, picker, recent, harmony)
- Canvas options (grid, snap, background)
- Clear button

**Issues:**
- Too much scrolling needed
- Mixed concerns (tools + colors + canvas)
- Color harmony buried at bottom
- No clear visual hierarchy

#### 3. Floating Panels Chaos
Multiple floating panels that can overlap:
- Sounds panel (top-right)
- Timer panel (top-right)
- Break reminder (center modal)
- Breathing exercise (bottom-right)
- Daily prompt (bottom-left)
- Template picker (top-left dropdown)

**Issues:**
- Panels can overlap each other
- Inconsistent positioning
- No unified panel system
- Hard to manage multiple features at once

#### 4. Feature Discoverability
- New users won't find breathing, prompts, harmony
- No onboarding or feature hints
- Icons without labels on some buttons
- Wellness features hidden behind single icons

#### 5. Mobile Experience
- Cramped toolbar
- No gesture support
- Tools panel is a full overlay
- Can't access multiple features simultaneously

---

## Proposed Solution: Tabbed Sidebar Architecture

### New Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER BAR (Minimal)                                                │
│  [Logo] [Template ▼] [Undo/Redo] ──── [Zoom] [Focus] [Menu ☰]       │
├────────────┬─────────────────────────────────────────┬───────────────┤
│            │                                         │               │
│  LEFT      │                                         │    RIGHT      │
│  SIDEBAR   │                                         │    SIDEBAR    │
│            │                                         │               │
│  [Tabs]    │           CANVAS                        │    [Tabs]     │
│  🖌️ Tools  │                                         │    📚 Layers  │
│  🎨 Colors │                                         │    🧘 Wellness│
│  ⚙️ Canvas │                                         │               │
│            │                                         │               │
│  [Content] │                                         │    [Content]  │
│            │                                         │               │
├────────────┴─────────────────────────────────────────┴───────────────┤
│  STATUS BAR: [Template] [Layer] [Symmetry] [Timer] [Zoom]           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Specifications

### 1. Header Bar (Simplified)

**Left Section:**
- Logo (clickable → about/help)
- Template dropdown (current design)

**Center Section:**
- Primary tools: Brush | Eraser | Fill | Shape (icon buttons)
- Undo/Redo

**Right Section:**
- Zoom controls (compact)
- Focus mode toggle
- Hamburger menu (settings, export, help)

**Height:** 48px fixed

---

### 2. Left Sidebar - Creative Tools

**Tab System:**
```
┌─────────────────────────────┐
│ [🖌️] [🎨] [⚙️]              │  ← Tab buttons
├─────────────────────────────┤
│                             │
│    Tab Content Area         │
│                             │
└─────────────────────────────┘
```

#### Tab 1: 🖌️ Tools
```
┌─────────────────────────────┐
│ BRUSH                       │
│ ┌───┬───┬───┬───┬───┐      │
│ │✒️ │✏️ │🖊️│🎨│🖍️│      │  Brush types
│ └───┴───┴───┴───┴───┘      │
│ ┌───┬───┬───┬───┐          │
│ │💨│🖋️│🔆│🎨│          │
│ └───┴───┴───┴───┘          │
│                             │
│ Size      ━━━━●━━━━  24px  │
│ Opacity   ━━━━━━●━━  80%   │
│ Stabilize ━━●━━━━━━  Low   │
│                             │
│ ☐ Lazy Brush               │
│   Radius  ━━━●━━━━━  30px  │
├─────────────────────────────┤
│ SHAPES (when shape tool)    │
│ [⬜][⭕][➖][△]             │
│ [⭐][➡️][⬡][♥️]             │
│ ☑ Fill shape               │
├─────────────────────────────┤
│ SYMMETRY                    │
│ [⊘][↔️][↕️][✚]              │
│ [✦][✶][❋][✺]              │
└─────────────────────────────┘
```

#### Tab 2: 🎨 Colors
```
┌─────────────────────────────┐
│ CURRENT COLOR               │
│ ┌─────┐ #FF6B6B            │
│ │     │ [Hex input_____]   │
│ └─────┘                     │
├─────────────────────────────┤
│ PALETTE                     │
│ [soft][nature][ocean]...    │
│ ┌─┬─┬─┬─┬─┐                │
│ │■│■│■│■│■│  Color grid    │
│ └─┴─┴─┴─┴─┘                │
│ ┌─┬─┬─┬─┬─┐                │
│ │■│■│■│■│■│                │
│ └─┴─┴─┴─┴─┘                │
├─────────────────────────────┤
│ HARMONY     [Triadic ▼]     │
│ ┌─────┬─────┬─────┐        │
│ │  ■  │  ■  │  ■  │        │
│ └─────┴─────┴─────┘        │
│ [Apply to Palette]          │
├─────────────────────────────┤
│ RECENT                      │
│ [■][■][■][■][■]            │
└─────────────────────────────┘
```

#### Tab 3: ⚙️ Canvas
```
┌─────────────────────────────┐
│ BACKGROUND                  │
│ [■][■][■][■][■][■][■][■]   │
│ [■][■][■][■][■][■][■][■]   │
├─────────────────────────────┤
│ GRID                        │
│ ☐ Show grid                 │
│ ☐ Snap to grid              │
│ Size ━━━━●━━━━ 20px        │
├─────────────────────────────┤
│ VIEW                        │
│ Zoom ━━━━━●━━━━ 100%       │
│ [Fit] [100%] [Fill]         │
├─────────────────────────────┤
│ ACTIONS                     │
│ [🗑️ Clear Canvas]           │
│ [💾 Export...]              │
└─────────────────────────────┘
```

---

### 3. Right Sidebar - Layers & Wellness

#### Tab 1: 📚 Layers
```
┌─────────────────────────────┐
│ LAYERS              [+ Add] │
├─────────────────────────────┤
│ ┌───────────────────────┐   │
│ │ 👁️ 🔓 Layer 3     [⋮] │   │
│ ├───────────────────────┤   │
│ │ 👁️ 🔓 Layer 2     [⋮] │   │
│ ├───────────────────────┤   │
│ │ 👁️ 🔒 Layer 1     [⋮] │   │ ← Active
│ └───────────────────────┘   │
├─────────────────────────────┤
│ LAYER OPACITY               │
│ ━━━━━━━━━●━━━ 100%         │
└─────────────────────────────┘
```

#### Tab 2: 🧘 Wellness (NEW)
```
┌─────────────────────────────┐
│ SESSION                     │
│ ┌─────────────────────────┐ │
│ │    ⏱️ 0:23:45           │ │
│ │    Today's drawing time  │ │
│ └─────────────────────────┘ │
│ Break reminder: [25 min ▼]  │
├─────────────────────────────┤
│ BREATHING                   │
│ ┌─────────────────────────┐ │
│ │      ◉ Inhale...        │ │ ← Animated
│ │        4.0s             │ │
│ └─────────────────────────┘ │
│ Pattern: [Box Breathing ▼]  │
│ [Start] [Stop]              │
├─────────────────────────────┤
│ TODAY'S PROMPT              │
│ ┌─────────────────────────┐ │
│ │ 💭 "Draw how you feel   │ │
│ │     right now"          │ │
│ └─────────────────────────┘ │
│ [🔄 New] [Category ▼]       │
├─────────────────────────────┤
│ SOUNDS                      │
│ 🎵 Music: [Gentle Dreams▼]  │
│ ┌─────────────────────────┐ │
│ │🌧️ Rain      ━━━●━━ 50% │ │
│ │🔥 Fire      ━━━━●━ 30% │ │
│ │[+ Add Sound]            │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

### 4. Status Bar (Bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🌸 Lotus │ Layer 2 │ Symmetry: 8-Way │ ⏱️ 0:23:45 │ History 5/50 │ 100% │
└──────────────────────────────────────────────────────────────────────┘
```

- Shows current context without taking UI space
- Click elements to jump to relevant panel

---

### 5. Mobile Layout

```
Portrait Mode:
┌─────────────────────┐
│ [≡] Calm    [▼][⚙️]│  Minimal header
├─────────────────────┤
│                     │
│                     │
│      CANVAS         │
│                     │
│                     │
├─────────────────────┤
│ [🖌️][🧽][🪣][⬜]    │  Tool dock
│ ━━━━━━●━━━━ Size   │  Quick size
│ [■][■][■][■][■]    │  Quick colors
└─────────────────────┘

Bottom Sheet (swipe up):
- Full tools panel
- Color picker
- Layer management
- Wellness features
```

---

## Quick Wins (Implement Immediately)

### QW1: Full Canvas on Load
**Priority:** CRITICAL
**Effort:** Low

Make canvas fill available space instead of fixed size:

```jsx
// Current (fixed size):
const canvasWidth = isMobile ? windowSize.width - 16 : Math.min(windowSize.width - 380, 900);
const canvasHeight = canvasWidth * (300 / 420);

// New (fill available space):
const sidebarWidth = isMobile ? 0 : (focusMode ? 0 : 224 * 2); // 224px each sidebar
const headerHeight = focusMode ? 0 : 52;
const statusHeight = focusMode ? 0 : 28;
const padding = 16;

const availableWidth = windowSize.width - sidebarWidth - padding * 2;
const availableHeight = windowSize.height - headerHeight - statusHeight - padding * 2;

// Maintain aspect ratio while filling space
const aspectRatio = 420 / 300;
let canvasWidth, canvasHeight;

if (availableWidth / availableHeight > aspectRatio) {
  // Height is limiting factor
  canvasHeight = availableHeight;
  canvasWidth = canvasHeight * aspectRatio;
} else {
  // Width is limiting factor
  canvasWidth = availableWidth;
  canvasHeight = canvasWidth / aspectRatio;
}
```

### QW2: Remember Zoom Level
Store zoom in localStorage so it persists:
```jsx
const [zoom, setZoom] = useState(() => {
  const saved = localStorage.getItem('canvasZoom');
  return saved ? parseFloat(saved) : 1;
});

useEffect(() => {
  localStorage.setItem('canvasZoom', zoom.toString());
}, [zoom]);
```

### QW3: Fit-to-Screen Button
Add a "Fit" button that auto-calculates optimal zoom:
```jsx
const fitToScreen = () => {
  const optimalZoom = Math.min(
    availableWidth / 420,
    availableHeight / 300
  ) * 0.95; // 95% to leave some margin
  setZoom(optimalZoom);
  setPan({ x: 0, y: 0 });
};
```

### QW4: Default Zoom to Fit
On first load, auto-fit the canvas:
```jsx
useEffect(() => {
  if (!localStorage.getItem('hasVisited')) {
    fitToScreen();
    localStorage.setItem('hasVisited', 'true');
  }
}, []);
```

---

## Implementation Phases

### Phase A: Component Restructuring (Week 1-2)

#### A.1 Create Reusable Components
```
src/components/
├── ColoringGame.jsx (main, refactored)
├── ui/
│   ├── TabPanel.jsx         # Reusable tab container
│   ├── Sidebar.jsx          # Collapsible sidebar
│   ├── IconButton.jsx       # Consistent button styling
│   ├── Slider.jsx           # Styled range input
│   ├── ColorSwatch.jsx      # Color button with selection
│   ├── Dropdown.jsx         # Consistent dropdowns
│   └── Modal.jsx            # Unified modal system
├── panels/
│   ├── ToolsPanel.jsx       # Brush, shape, symmetry
│   ├── ColorsPanel.jsx      # Palettes, harmony, picker
│   ├── CanvasPanel.jsx      # Background, grid, export
│   ├── LayersPanel.jsx      # Layer management
│   └── WellnessPanel.jsx    # Timer, breathing, prompts, sounds
├── toolbar/
│   ├── HeaderBar.jsx        # Top navigation
│   ├── StatusBar.jsx        # Bottom status
│   └── FocusToolbar.jsx     # Focus mode mini-toolbar
└── canvas/
    ├── DrawingCanvas.jsx    # SVG canvas component
    ├── LazyBrushIndicator.jsx
    └── GridOverlay.jsx
```

#### A.2 State Management
- Extract state into custom hooks:
  - `useDrawingState` - paths, layers, history
  - `useToolState` - active tool, brush settings
  - `useColorState` - palette, selected, harmony
  - `useWellnessState` - timer, breathing, prompts
  - `useAudioState` - music, ambient sounds

#### A.3 Create Tab System
```jsx
// TabPanel component
<TabPanel
  tabs={[
    { id: 'tools', icon: '🖌️', label: 'Tools' },
    { id: 'colors', icon: '🎨', label: 'Colors' },
    { id: 'canvas', icon: '⚙️', label: 'Canvas' },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
>
  {activeTab === 'tools' && <ToolsPanel />}
  {activeTab === 'colors' && <ColorsPanel />}
  {activeTab === 'canvas' && <CanvasPanel />}
</TabPanel>
```

---

### Phase B: Layout Refactoring (Week 2-3)

#### B.1 Implement New Header
- Remove tool buttons from header (move to sidebar)
- Add hamburger menu for secondary actions
- Simplify to: Logo | Template | [spacer] | Zoom | Focus | Menu

#### B.2 Implement Tabbed Sidebars
- Left sidebar: Tools, Colors, Canvas
- Right sidebar: Layers, Wellness
- Both collapsible on tablet/desktop
- Convert to bottom sheet on mobile

#### B.3 Implement Status Bar
- Move session timer to status bar
- Add click-to-navigate functionality
- Show symmetry mode indicator

---

### Phase C: Mobile Optimization (Week 3-4)

#### C.1 Responsive Breakpoints
```css
/* Mobile: < 640px */
- Single column layout
- Bottom tool dock
- Swipe-up panels

/* Tablet: 640px - 1024px */
- Collapsible sidebars
- Can hide one sidebar

/* Desktop: > 1024px */
- Full dual sidebar
- All panels visible
```

#### C.2 Touch Gestures
- Two-finger pinch to zoom
- Two-finger pan
- Swipe up for tools panel
- Long-press for context menu

#### C.3 Bottom Sheet System
- Unified bottom sheet component
- Drag handle to expand/collapse
- Snap points: closed, half, full

---

### Phase D: Polish & Animation (Week 4)

#### D.1 Transitions
- Smooth tab switching
- Panel slide animations
- Color transitions on theme change

#### D.2 Loading States
- Skeleton loaders for panels
- Optimistic UI updates

#### D.3 Keyboard Shortcuts Panel
- `?` to show shortcut overlay
- Organized by category

---

## Component Specifications

### TabPanel Component
```jsx
interface TabPanelProps {
  tabs: Array<{
    id: string;
    icon: string;
    label: string;
    badge?: number; // notification count
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  position: 'left' | 'right';
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapse?: () => void;
  children: React.ReactNode;
}
```

### Sidebar Component
```jsx
interface SidebarProps {
  position: 'left' | 'right';
  width: number; // default 240px
  minWidth: number; // collapsed width, 48px
  collapsible: boolean;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
```

### Wellness Panel Sections
```jsx
// Session Timer Section
<SessionTimer
  startTime={sessionStartTime}
  breakInterval={breakInterval}
  onBreakIntervalChange={setBreakInterval}
  showBreakReminder={showBreakReminder}
  onDismissBreak={dismissBreakReminder}
/>

// Breathing Section
<BreathingExercise
  pattern={breathingPattern}
  onPatternChange={setBreathingPattern}
  isActive={showBreathing}
  onToggle={() => setShowBreathing(!showBreathing)}
/>

// Daily Prompt Section
<DailyPrompt
  prompt={currentPrompt}
  onNewPrompt={getRandomPrompt}
  onCategoryFilter={filterByCategory}
/>

// Sound Mixer Section
<SoundMixer
  musicTracks={musicTracks}
  ambientSounds={ambientSounds}
  activeSounds={activeSounds}
  onSoundToggle={toggleSound}
  onVolumeChange={setVolume}
/>
```

---

## Migration Strategy

### Step 1: Create New Components (Non-Breaking)
- Build new components alongside existing code
- Test in isolation with Storybook

### Step 2: Feature Flag
```jsx
const useNewUI = localStorage.getItem('newUI') === 'true';

return useNewUI ? <NewLayout /> : <LegacyLayout />;
```

### Step 3: Gradual Migration
- Migrate one panel at a time
- Keep old UI as fallback
- Gather feedback

### Step 4: Full Rollout
- Remove feature flag
- Delete legacy components
- Update documentation

---

## Success Metrics

### Usability
- [ ] All features accessible in ≤ 2 clicks
- [ ] No overlapping panels
- [ ] Clear visual hierarchy
- [ ] Mobile-friendly

### Performance
- [ ] Initial load < 2s
- [ ] Tab switch < 100ms
- [ ] Smooth 60fps animations

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Sufficient color contrast
- [ ] Focus indicators

---

## File Checklist

### New Files to Create
- [ ] `src/components/ui/TabPanel.jsx`
- [ ] `src/components/ui/Sidebar.jsx`
- [ ] `src/components/ui/IconButton.jsx`
- [ ] `src/components/ui/Slider.jsx`
- [ ] `src/components/ui/Modal.jsx`
- [ ] `src/components/panels/ToolsPanel.jsx`
- [ ] `src/components/panels/ColorsPanel.jsx`
- [ ] `src/components/panels/CanvasPanel.jsx`
- [ ] `src/components/panels/LayersPanel.jsx`
- [ ] `src/components/panels/WellnessPanel.jsx`
- [ ] `src/components/toolbar/HeaderBar.jsx`
- [ ] `src/components/toolbar/StatusBar.jsx`
- [ ] `src/hooks/useDrawingState.js`
- [ ] `src/hooks/useToolState.js`
- [ ] `src/hooks/useWellnessState.js`

### Files to Refactor
- [ ] `src/components/ColoringGame.jsx` - Main orchestrator only
- [ ] `src/index.css` - Add new layout styles

### Files to Delete (After Migration)
- None initially (keep for rollback)

---

*Plan Version: 1.0*
*Created: January 2026*
*Target Completion: 4 weeks*

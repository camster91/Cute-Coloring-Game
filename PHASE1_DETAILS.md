# Phase 1: Core Experience Enhancement - Detailed Specifications

This document provides comprehensive implementation details for Phase 1 of the Calm Drawing roadmap, focusing on transforming the app for older kids and adults seeking creative expression and relaxation.

---

## Table of Contents

1. [1.1 Mindfulness & Relaxation Features](#11-mindfulness--relaxation-features)
2. [1.2 Mature Template Library](#12-mature-template-library)
3. [1.3 Professional Color Tools](#13-professional-color-tools)
4. [1.4 Advanced Brush Engine](#14-advanced-brush-engine)

---

## 1.1 Mindfulness & Relaxation Features

### 1.1.1 Guided Breathing Exercises

**Priority:** High
**Complexity:** Medium

#### Description
A visual breathing guide overlay that helps users relax while drawing through synchronized breathing animations.

#### User Stories
- As a stressed user, I want guided breathing exercises so I can calm down before/during my drawing session
- As a user with anxiety, I want subtle breathing prompts that don't interrupt my creative flow

#### UI/UX Specifications
- **Trigger:** Toolbar button (lungs/breath icon) or keyboard shortcut (Ctrl/Cmd + B)
- **Position:** Semi-transparent overlay in corner (user-configurable: top-left, top-right, bottom-left, bottom-right, center)
- **Animation:** Expanding/contracting circle with soft glow
- **Phases:**
  - Inhale (4 seconds) - circle expands, soft blue glow
  - Hold (4 seconds) - circle pulses gently
  - Exhale (6 seconds) - circle contracts, soft purple glow
  - Optional hold (2 seconds) - pause before next cycle

#### Visual Design
```
┌─────────────────────────────────────┐
│  ○ Breathe                    [×]   │
│                                     │
│         ╭─────────────╮             │
│        │   INHALE...   │            │
│        │      ◉        │            │
│        │    4.0s       │            │
│         ╰─────────────╯             │
│                                     │
│  [4-7-8] [Box] [Custom] [Settings]  │
└─────────────────────────────────────┘
```

#### Breathing Patterns
| Pattern | Inhale | Hold | Exhale | Hold | Use Case |
|---------|--------|------|--------|------|----------|
| 4-7-8 Relaxing | 4s | 7s | 8s | - | Deep relaxation, sleep prep |
| Box Breathing | 4s | 4s | 4s | 4s | Focus, stress relief |
| Energizing | 4s | - | 4s | - | Quick refresh |
| Calming | 4s | 2s | 6s | 2s | Anxiety reduction |
| Custom | User-defined | User-defined | User-defined | User-defined | Personal preference |

#### Technical Implementation
```javascript
// State structure
const breathingState = {
  isActive: boolean,
  pattern: 'box' | '4-7-8' | 'energizing' | 'calming' | 'custom',
  phase: 'inhale' | 'hold1' | 'exhale' | 'hold2',
  progress: number, // 0-1
  customTiming: { inhale: number, hold1: number, exhale: number, hold2: number },
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center',
  opacity: number, // 0.3 - 1.0
  soundEnabled: boolean,
  hapticEnabled: boolean
};

// Animation using requestAnimationFrame
// Audio cues: soft chime at phase transitions
// Haptic feedback on mobile at phase transitions
```

#### Settings
- Pattern selection
- Custom timing (sliders: 1-15 seconds per phase)
- Sound on/off (subtle chimes)
- Haptic feedback on/off
- Auto-start with session (optional)
- Reminder interval (every 10/15/20/30 minutes)
- Overlay opacity (30%-100%)
- Position selection

#### Acceptance Criteria
- [ ] Breathing animation runs smoothly at 60fps
- [ ] All 5 preset patterns work correctly
- [ ] Custom timing saves to local storage
- [ ] Audio cues are subtle and non-jarring
- [ ] Overlay doesn't block drawing interaction
- [ ] Works in both light and dark themes

---

### 1.1.2 Session Timers

**Priority:** High
**Complexity:** Low

#### Description
Track creative time and receive gentle reminders to take breaks, promoting healthy drawing habits.

#### User Stories
- As a user prone to losing track of time, I want session timers so I remember to take breaks
- As someone building a creative habit, I want to track how long I spend drawing

#### UI/UX Specifications
- **Display:** Status bar showing elapsed time (HH:MM:SS)
- **Break reminders:** Gentle notification after configurable interval
- **Pomodoro mode:** 25min draw / 5min break cycles

#### Visual Design
```
Status Bar:
┌─────────────────────────────────────────────────────┐
│ 🎨 Session: 0:23:45  │  🍅 Focus: 15:00 remaining   │
└─────────────────────────────────────────────────────┘

Break Reminder (Modal):
┌─────────────────────────────────────────┐
│         Time for a Break! ☕            │
│                                         │
│   You've been drawing for 25 minutes.   │
│   Take a 5-minute break to:             │
│                                         │
│   • Stretch your hands and wrists       │
│   • Look away from the screen           │
│   • Get some water                      │
│                                         │
│   [Skip] [Start Break: 5:00]            │
└─────────────────────────────────────────┘
```

#### Timer Modes
| Mode | Description | Default Intervals |
|------|-------------|-------------------|
| Simple | Just tracks time, no interruptions | - |
| Reminder | Gentle break reminders | Every 25 min |
| Pomodoro | Work/break cycles | 25 min work / 5 min break |
| Custom | User-defined intervals | Configurable |

#### Settings
- Timer mode selection
- Reminder interval (15/20/25/30/45/60 minutes)
- Break duration (3/5/10/15 minutes)
- Sound notification on/off
- Show in status bar on/off
- Auto-pause when idle
- Daily goal tracking (optional)

#### Technical Implementation
```javascript
const timerState = {
  sessionStart: Date,
  totalElapsed: number, // milliseconds
  isBreak: boolean,
  breakRemaining: number,
  mode: 'simple' | 'reminder' | 'pomodoro' | 'custom',
  reminderInterval: number, // minutes
  breakDuration: number, // minutes
  pomodoroCount: number, // completed cycles
  dailyTotal: number, // persisted
};
```

#### Acceptance Criteria
- [ ] Timer accurately tracks elapsed time
- [ ] Break reminders appear at correct intervals
- [ ] Pomodoro cycles work correctly (4 cycles then longer break)
- [ ] Timer persists across page refreshes
- [ ] Daily totals save to local storage
- [ ] Timer pauses when tab is inactive (optional)

---

### 1.1.3 Mood Tracking

**Priority:** Medium
**Complexity:** Medium

#### Description
Optional mood check-ins before and after drawing sessions to help users recognize art's emotional benefits.

#### User Stories
- As a user using art for mental health, I want to track my mood so I can see how drawing affects me
- As a curious user, I want to understand my emotional patterns related to creativity

#### UI/UX Specifications
- **Check-in prompt:** Optional modal at session start
- **Check-out prompt:** Optional modal when saving/exiting
- **History view:** Calendar/graph showing mood over time

#### Visual Design
```
Mood Check-in:
┌─────────────────────────────────────────┐
│         How are you feeling? 💭         │
│                                         │
│   😫    😔    😐    🙂    😊           │
│  Awful  Low  Okay  Good  Great         │
│                                         │
│   Tags (optional):                      │
│   [Stressed] [Anxious] [Tired]         │
│   [Calm] [Inspired] [Energetic]        │
│                                         │
│   Notes: ____________________________  │
│                                         │
│         [Skip]  [Save & Draw]           │
└─────────────────────────────────────────┘

Mood History:
┌─────────────────────────────────────────┐
│  January 2026                           │
│  ┌──┬──┬──┬──┬──┬──┬──┐               │
│  │Mo│Tu│We│Th│Fr│Sa│Su│               │
│  ├──┼──┼──┼──┼──┼──┼──┤               │
│  │😊│🙂│  │😐│🙂│😊│😊│               │
│  │🙂│😊│😊│  │😐│🙂│  │               │
│  └──┴──┴──┴──┴──┴──┴──┘               │
│                                         │
│  Average mood improvement: +1.2 ↑       │
│  Most productive mood: 😊 Great         │
│  Sessions this month: 12                │
└─────────────────────────────────────────┘
```

#### Mood Scale
| Value | Emoji | Label | Color |
|-------|-------|-------|-------|
| 1 | 😫 | Awful | #EF4444 (red) |
| 2 | 😔 | Low | #F97316 (orange) |
| 3 | 😐 | Okay | #EAB308 (yellow) |
| 4 | 🙂 | Good | #84CC16 (lime) |
| 5 | 😊 | Great | #22C55E (green) |

#### Emotion Tags
- **Negative:** Stressed, Anxious, Tired, Sad, Frustrated, Overwhelmed
- **Neutral:** Calm, Focused, Curious, Contemplative
- **Positive:** Happy, Inspired, Energetic, Creative, Peaceful, Grateful

#### Data Structure
```javascript
const moodEntry = {
  id: string,
  timestamp: Date,
  type: 'before' | 'after',
  sessionId: string,
  moodScore: 1 | 2 | 3 | 4 | 5,
  tags: string[],
  notes: string, // max 500 chars
};

const moodAnalytics = {
  averageBefore: number,
  averageAfter: number,
  improvement: number,
  totalSessions: number,
  streakDays: number,
  commonTags: { tag: string, count: number }[],
};
```

#### Privacy Considerations
- All data stored locally only (IndexedDB)
- Export data option (JSON)
- Clear all data option
- No analytics/tracking sent to servers

#### Acceptance Criteria
- [ ] Check-in modal appears on session start (if enabled)
- [ ] Check-out modal appears on save/exit (if enabled)
- [ ] Mood history displays correctly in calendar view
- [ ] Statistics calculate correctly
- [ ] Data persists in IndexedDB
- [ ] Export/import functionality works
- [ ] Can be completely disabled in settings

---

### 1.1.4 Ambient Soundscapes

**Priority:** High
**Complexity:** Medium

#### Description
Expand the existing music system with nature sounds and ambient audio for deeper relaxation.

#### Current State
- 6 background music tracks already exist

#### New Soundscapes to Add
| Category | Sounds | Description |
|----------|--------|-------------|
| Nature | Rain, Thunderstorm, Ocean Waves, Forest, Birds, Wind | Natural environmental sounds |
| Urban | Coffee Shop, Library, Train, Fireplace | Comfortable ambient noise |
| Abstract | White Noise, Pink Noise, Brown Noise, Binaural Beats | Focus-enhancing sounds |
| Meditation | Singing Bowls, Wind Chimes, Om Drone, Temple Bells | Spiritual/meditative sounds |

#### UI/UX Specifications
```
Sound Mixer Panel:
┌─────────────────────────────────────────┐
│  🎵 Sound Mixer                   [×]   │
│                                         │
│  Master Volume: ━━━━━━━━○━━━ 70%       │
│                                         │
│  ♫ Music                               │
│  [Gentle Piano    ▼] ━━━━○━━━━━ 50%    │
│                                         │
│  🌧️ Rain                               │
│  [Light Rain      ▼] ━━━━━━○━━━ 60%    │
│                                         │
│  🔥 Fireplace                          │
│  [Crackling Fire  ▼] ━━○━━━━━━━ 30%    │
│                                         │
│  🐦 Nature                              │
│  [Forest Birds    ▼] ━○━━━━━━━━ 20%    │
│                                         │
│  [+ Add Sound]  [Save Preset ▼]         │
│                                         │
│  Presets: [Rainy Day] [Focus] [Calm]   │
└─────────────────────────────────────────┘
```

#### Sound Sources (Royalty-Free)
- Generate procedural sounds where possible (rain, white noise)
- Use Web Audio API for dynamic mixing
- Compress audio files (MP3/OGG at 128kbps)
- Loop seamlessly (crossfade endings)

#### Technical Implementation
```javascript
const soundMixerState = {
  masterVolume: number, // 0-1
  channels: [
    {
      id: string,
      type: 'music' | 'nature' | 'ambient' | 'abstract',
      sound: string,
      volume: number, // 0-1
      isPlaying: boolean,
    }
  ],
  presets: [
    {
      name: string,
      channels: [...],
    }
  ],
  fadeOnIdle: boolean,
  fadeOnMinimize: boolean,
};

// Use Web Audio API
const audioContext = new AudioContext();
const gainNodes = new Map(); // Per-channel volume control
const masterGain = audioContext.createGain();
```

#### Preset Examples
| Preset | Sounds | Use Case |
|--------|--------|----------|
| Rainy Day | Light Rain 60%, Lo-fi Music 40% | Cozy drawing |
| Deep Focus | Brown Noise 40%, Binaural 30% | Concentration |
| Nature Escape | Forest 50%, Birds 30%, Stream 40% | Relaxation |
| Coffee Shop | Cafe Ambience 60%, Jazz 30% | Casual creativity |
| Meditation | Singing Bowls 40%, Om 20% | Mindful drawing |
| Silent | All off | No audio |

#### Acceptance Criteria
- [ ] At least 15 new ambient sounds available
- [ ] Sound mixer UI with multiple channel support
- [ ] Individual volume control per channel
- [ ] Master volume control
- [ ] Preset save/load functionality
- [ ] Seamless audio looping (no gaps/pops)
- [ ] Sounds fade when tab is hidden (optional)
- [ ] Low CPU/memory usage

---

### 1.1.5 Focus Mode

**Priority:** High
**Complexity:** Low

#### Description
A minimalist UI mode that hides all panels and tools, leaving only the canvas for distraction-free drawing.

#### UI/UX Specifications
- **Activation:** F11, double-click canvas, or toolbar button
- **Exit:** Escape key, edge hover reveals tools, or gesture

#### Visual States
```
Normal Mode:
┌─────────────────────────────────────────────────────┐
│ [Tools] [File] [View]              [Zoom] [Settings]│
├────────┬────────────────────────────┬───────────────┤
│        │                            │               │
│ Tools  │                            │    Layers     │
│ Panel  │        CANVAS              │    Panel      │
│        │                            │               │
├────────┴────────────────────────────┴───────────────┤
│ Status Bar                                          │
└─────────────────────────────────────────────────────┘

Focus Mode:
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                                                     │
│                     CANVAS                          │
│                                                     │
│                                                     │
│                                                     │
│                                         [Exit Focus]│
└─────────────────────────────────────────────────────┘
```

#### Hover Zones (Edge Reveal)
- **Top edge:** Quick access toolbar (tools, colors, brush size)
- **Right edge:** Layers panel (mini view)
- **Bottom edge:** Status (zoom, position)
- **Left edge:** Tool panel (vertical)

#### Settings
- Edge hover reveal on/off
- Reveal delay (instant, 300ms, 500ms)
- Show floating mini-toolbar
- Show cursor-follow color/size indicator
- Dim edges (vignette effect)
- Auto-enter focus mode on new canvas

#### Keyboard Shortcuts in Focus Mode
| Key | Action |
|-----|--------|
| Escape | Exit focus mode |
| B | Brush tool |
| E | Eraser |
| [ / ] | Brush size |
| Z | Undo |
| Y | Redo |
| Space+drag | Pan |
| Scroll | Zoom |

#### Acceptance Criteria
- [ ] All panels hide smoothly (CSS transition)
- [ ] Canvas expands to full viewport
- [ ] Essential shortcuts still work
- [ ] Edge hover reveals relevant panel
- [ ] Exit via Escape works
- [ ] Focus mode state persists in session

---

### 1.1.6 Daily Drawing Prompts

**Priority:** Medium
**Complexity:** Medium

#### Description
Inspirational quotes and creative challenges to spark creativity and build a daily drawing habit.

#### Prompt Categories
| Category | Examples |
|----------|----------|
| Abstract | "Draw how today feels", "Visualize your dreams" |
| Nature | "Draw your favorite season", "A tree in wind" |
| Emotion | "Draw calm", "What does hope look like?" |
| Memory | "A childhood memory", "Your happy place" |
| Challenge | "Use only 3 colors", "Draw without lifting" |
| Mindful | "Slow, deliberate lines", "Focus on texture" |
| Random | "A door to another world", "Music as color" |

#### UI/UX Specifications
```
Daily Prompt Modal:
┌─────────────────────────────────────────┐
│        ✨ Today's Prompt ✨              │
│                                         │
│   "Draw a place where you feel safe"    │
│                                         │
│   Category: Memory                      │
│   Difficulty: ★★☆☆☆                     │
│                                         │
│   [🔄 New Prompt]  [Start Drawing]      │
│                                         │
│   □ Show prompt daily at session start  │
└─────────────────────────────────────────┘

Prompt Widget (Floating):
┌─────────────────────────────────────────┐
│ 💡 "Draw a place where you feel safe"   │
│                        [Hide] [New]     │
└─────────────────────────────────────────┘
```

#### Prompt Data Structure
```javascript
const prompt = {
  id: string,
  text: string,
  category: 'abstract' | 'nature' | 'emotion' | 'memory' | 'challenge' | 'mindful' | 'random',
  difficulty: 1 | 2 | 3 | 4 | 5,
  tags: string[],
  suggestedTime: number, // minutes
  suggestedTools: string[], // 'brush', 'watercolor', etc.
};

const promptHistory = {
  date: Date,
  promptId: string,
  completed: boolean,
  artworkId: string | null, // link to saved work
};
```

#### Features
- Daily prompt changes at midnight (local time)
- Prompt history calendar
- Skip/shuffle prompt
- Favorite prompts
- Custom prompt submission (for future community feature)
- Streak tracking (consecutive days with prompts)
- Optional reminder notification

#### Content: Initial Prompt Library (100+ prompts)
```json
[
  { "text": "Draw how you feel right now", "category": "emotion" },
  { "text": "A door leading somewhere magical", "category": "abstract" },
  { "text": "Your morning coffee or tea", "category": "memory" },
  { "text": "Draw using only curved lines", "category": "challenge" },
  { "text": "The view from your window", "category": "nature" },
  { "text": "What does peace sound like?", "category": "mindful" },
  // ... 94 more prompts
]
```

#### Acceptance Criteria
- [ ] Daily prompt appears on session start (if enabled)
- [ ] Prompts rotate daily based on local date
- [ ] Shuffle gives new random prompt
- [ ] Prompt history tracks completion
- [ ] Streak counter works correctly
- [ ] At least 100 prompts in initial library

---

### 1.1.7 Gratitude Journaling

**Priority:** Low
**Complexity:** Medium

#### Description
Combine art with brief text reflections, allowing users to journal alongside their drawings.

#### UI/UX Specifications
```
Journal Panel:
┌─────────────────────────────────────────┐
│  📝 Today's Reflection                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ I'm grateful for...               │  │
│  │ _________________________________ │  │
│  │ _________________________________ │  │
│  │ _________________________________ │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Prompts:                               │
│  • What made you smile today?           │
│  • What are you looking forward to?     │
│  • What's one thing you appreciate?     │
│                                         │
│  [Save with Artwork]                    │
└─────────────────────────────────────────┘
```

#### Features
- Text area linked to artwork (saved together)
- Journaling prompts for inspiration
- Private by default (never shared)
- Search past journal entries
- Export journal as PDF with artwork

#### Data Structure
```javascript
const journalEntry = {
  id: string,
  artworkId: string,
  date: Date,
  content: string, // max 2000 chars
  promptUsed: string | null,
  mood: number | null, // link to mood tracking
};
```

#### Acceptance Criteria
- [ ] Journal panel accessible from toolbar
- [ ] Text saves with artwork
- [ ] Journal entries searchable
- [ ] Export as PDF works
- [ ] Character count shown
- [ ] Auto-save draft

---

### 1.1.8 Progressive Muscle Relaxation Prompts

**Priority:** Low
**Complexity:** Low

#### Description
Gentle reminders during long sessions to relax specific muscle groups, preventing tension.

#### Prompt Sequence
| Timing | Body Part | Instruction |
|--------|-----------|-------------|
| 15 min | Hands | "Shake out your hands gently" |
| 25 min | Shoulders | "Roll your shoulders back" |
| 35 min | Neck | "Gently tilt your head side to side" |
| 45 min | Eyes | "Look away from screen, focus on distance" |
| 55 min | Full body | "Stand up and stretch" |

#### UI/UX Specifications
```
Relaxation Reminder (Toast):
┌─────────────────────────────────────────┐
│  🙆 Time to relax your shoulders        │
│                                         │
│  Roll your shoulders back 3 times,      │
│  then forward 3 times.                  │
│                                         │
│  [Dismiss]  [Show me]  [Disable]        │
└─────────────────────────────────────────┘
```

#### Settings
- Enable/disable reminders
- Reminder frequency (every 15/20/30/45 min)
- Sound notification on/off
- Show animation demonstration

#### Acceptance Criteria
- [ ] Reminders appear at correct intervals
- [ ] Different body parts rotate through sequence
- [ ] Can be dismissed or disabled
- [ ] Non-intrusive toast notification style

---

## 1.2 Mature Template Library

### Overview

Replace child-oriented templates (bunny, star, fish) with sophisticated designs appealing to teens and adults.

### Template Categories

#### 1.2.1 Mandala Designs

**Count:** 20 templates
**Complexity:** Low to High

| Template | Description | Complexity |
|----------|-------------|------------|
| Simple Circle | Basic radial pattern | Low |
| Lotus Mandala | Flower-based design | Medium |
| Geometric Mandala | Sharp angles, precise | Medium |
| Nature Mandala | Leaves, petals | Medium |
| Complex Mandala | Intricate details | High |
| 3D Illusion | Depth and perspective | High |

**Design Guidelines:**
- All mandalas perfectly symmetrical
- Clear, clean line work
- Multiple complexity levels
- Inner and outer ring sections
- Center focal point

---

#### 1.2.2 Zentangle Patterns

**Count:** 15 templates

| Pattern Type | Description |
|--------------|-------------|
| Grid-based | Repeating geometric cells |
| Organic flow | Curved, flowing sections |
| Mixed media | Combination of styles |
| Border designs | Frame-style patterns |
| Full page | Complete compositions |

---

#### 1.2.3 Nature Scenes

**Count:** 25 templates

| Category | Templates |
|----------|-----------|
| Landscapes | Mountains, valleys, beaches, forests |
| Botanicals | Flowers (rose, lily, sunflower), leaves, trees |
| Wildlife | Birds, butterflies, fish, deer, fox |
| Seasons | Spring blossoms, summer beach, autumn leaves, winter snow |
| Water | Ocean waves, waterfalls, ponds, rain |

**Detail Levels:**
- Simple: Bold outlines, few details
- Medium: Some interior detail
- Complex: Full realistic detail

---

#### 1.2.4 Architecture

**Count:** 15 templates

| Type | Examples |
|------|----------|
| Buildings | Victorian house, modern skyscraper, cottage |
| Landmarks | Eiffel Tower, Japanese temple, castle |
| Interiors | Cozy room, library, kitchen |
| Cityscapes | Skyline, street scene, cafe |
| Details | Doors, windows, staircases |

---

#### 1.2.5 Abstract Art

**Count:** 15 templates

| Style | Description |
|-------|-------------|
| Geometric | Shapes, lines, patterns |
| Expressionist | Emotional, bold strokes |
| Minimalist | Simple, clean forms |
| Surrealist | Dream-like imagery |
| Op Art | Optical illusions |

---

#### 1.2.6 Stained Glass Designs

**Count:** 10 templates

| Theme | Description |
|-------|-------------|
| Floral | Rose window, lily pattern |
| Geometric | Art deco, modern |
| Nature | Trees, birds, sun/moon |
| Abstract | Color blocks, flowing |
| Religious | Neutral spiritual symbols |

---

#### 1.2.7 Celtic Knots

**Count:** 10 templates

| Type | Complexity |
|------|------------|
| Simple knot | Low |
| Triquetra | Low |
| Square knot | Medium |
| Circular knot | Medium |
| Border pattern | Medium |
| Full page design | High |

---

#### 1.2.8 Japanese Patterns

**Count:** 15 templates

| Pattern | Description |
|---------|-------------|
| Seigaiha | Wave pattern |
| Asanoha | Hemp leaf |
| Koi fish | Swimming fish |
| Cherry blossom | Sakura branches |
| Mount Fuji | Landscape |
| Bamboo | Forest scene |
| Origami | Paper crane pattern |

---

#### 1.2.9 Art Nouveau

**Count:** 10 templates

| Theme | Characteristics |
|-------|-----------------|
| Floral | Flowing vines, flowers |
| Female figures | Elegant silhouettes |
| Nature | Peacocks, dragonflies |
| Borders | Decorative frames |
| Typography | Ornate letters |

---

#### 1.2.10 Geometric Patterns

**Count:** 15 templates

| Type | Description |
|------|-------------|
| Tessellations | Repeating shapes |
| Impossible objects | Optical illusions |
| Sacred geometry | Flower of life, metatron |
| Isometric | 3D cube patterns |
| Fractals | Recursive patterns |

---

#### 1.2.11 Anatomy Studies

**Count:** 20 templates

| Focus | Templates |
|-------|-----------|
| Hands | Multiple poses, angles |
| Faces | Front, profile, 3/4 view |
| Eyes | Detail studies |
| Figure | Standing, sitting, action |
| Gesture | Quick pose outlines |

**Note:** All anatomy templates are artistic/educational in nature.

---

#### 1.2.12 Typography Templates

**Count:** 15 templates

| Type | Use Case |
|------|----------|
| Alphabet practice | Lettering guides |
| Quote layouts | Inspirational quotes |
| Monogram | Initial designs |
| Script | Cursive practice |
| Gothic | Blackletter style |

---

### Template Technical Specifications

#### File Format
```svg
<!-- Template structure -->
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Metadata -->
  <metadata>
    <template-info>
      <name>Lotus Mandala</name>
      <category>mandala</category>
      <complexity>medium</complexity>
      <tags>flower, meditation, circular</tags>
    </template-info>
  </metadata>

  <!-- Line art (stroke only, no fill) -->
  <g id="lineart" fill="none" stroke="#333" stroke-width="2">
    <!-- Template paths -->
  </g>

  <!-- Regions for fill tool (optional) -->
  <g id="regions" fill="transparent" stroke="none">
    <!-- Closed paths for easy filling -->
  </g>
</svg>
```

#### Template Metadata
```javascript
const templateMeta = {
  id: string,
  name: string,
  category: string,
  complexity: 'low' | 'medium' | 'high',
  tags: string[],
  suggestedPalettes: string[], // palette IDs
  suggestedTime: number, // minutes
  premium: boolean, // for future monetization
};
```

#### Total Template Count: 185 templates

---

## 1.3 Professional Color Tools

### 1.3.1 Color Harmony Suggestions

**Priority:** High
**Complexity:** Medium

#### Description
Automatically suggest harmonious color palettes based on a selected base color.

#### Harmony Types
| Type | Description | Colors |
|------|-------------|--------|
| Complementary | Opposite on color wheel | 2 |
| Analogous | Adjacent colors | 3-5 |
| Triadic | Evenly spaced (120°) | 3 |
| Split-Complementary | Base + adjacent to complement | 3 |
| Square | Four evenly spaced (90°) | 4 |
| Tetradic | Two complementary pairs | 4 |
| Monochromatic | Same hue, different saturation/value | 5 |

#### UI/UX Specifications
```
Color Harmony Panel:
┌─────────────────────────────────────────┐
│  🎨 Color Harmony                       │
│                                         │
│  Base Color: [#E94560] ■                │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       Color Wheel Visualization │    │
│  │            ● ●                  │    │
│  │          ●  ◉  ●                │    │
│  │            ● ●                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Harmony: [Triadic         ▼]           │
│                                         │
│  Suggested Palette:                     │
│  ■ ■ ■                                  │
│  #E94560  #45E960  #6045E9              │
│                                         │
│  [Apply to Palette]  [Copy All]         │
└─────────────────────────────────────────┘
```

#### Technical Implementation
```javascript
function generateHarmony(baseColor, harmonyType) {
  const hsl = hexToHSL(baseColor);

  switch(harmonyType) {
    case 'complementary':
      return [baseColor, hslToHex({ ...hsl, h: (hsl.h + 180) % 360 })];
    case 'triadic':
      return [
        baseColor,
        hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 240) % 360 })
      ];
    // ... other harmonies
  }
}
```

#### Acceptance Criteria
- [ ] All 7 harmony types generate correctly
- [ ] Color wheel visualization shows harmony relationship
- [ ] Colors can be applied to current palette
- [ ] Copy as CSS/HEX/RGB options
- [ ] Works with any base color

---

### 1.3.2 Color Theory Guides

**Priority:** Medium
**Complexity:** Low

#### Description
Educational overlays explaining color relationships and theory basics.

#### Content Modules
| Module | Topics |
|--------|--------|
| Color Wheel | Primary, secondary, tertiary colors |
| Temperature | Warm vs cool colors |
| Value | Light and dark |
| Saturation | Intensity/chroma |
| Psychology | Color emotions |
| Mixing | How colors combine |

#### UI: Interactive Tutorial Overlays
```
Color Theory Guide:
┌─────────────────────────────────────────┐
│  📚 Color Theory: The Color Wheel       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  [Interactive color wheel with  │    │
│  │   highlighted sections and      │    │
│  │   explanatory callouts]         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Primary colors (red, yellow, blue)     │
│  form the foundation of all other       │
│  colors. They cannot be created by      │
│  mixing other colors together.          │
│                                         │
│  [← Previous]  3/6  [Next →]            │
└─────────────────────────────────────────┘
```

---

### 1.3.3 Custom Palette Creation

**Priority:** High
**Complexity:** Medium

#### Description
Create, save, and organize personal color collections for quick access.

#### Features
- Create unlimited palettes
- Name and tag palettes
- Reorder colors via drag-and-drop
- Import/export palettes (JSON, ASE, GPL)
- Favorite palettes for quick access
- Palette folders/categories

#### UI/UX Specifications
```
Palette Manager:
┌─────────────────────────────────────────┐
│  🎨 My Palettes                    [+]  │
│                                         │
│  📁 Favorites                           │
│  ├── Sunset Vibes        ■■■■■          │
│  └── Ocean Blues         ■■■■■          │
│                                         │
│  📁 Nature                              │
│  ├── Forest              ■■■■■          │
│  ├── Desert              ■■■■           │
│  └── Spring              ■■■■■■         │
│                                         │
│  📁 Projects                            │
│  └── Logo v2             ■■■            │
│                                         │
│  [Import]  [Export All]                 │
└─────────────────────────────────────────┘

Palette Editor:
┌─────────────────────────────────────────┐
│  ✏️ Edit: Sunset Vibes                  │
│                                         │
│  ■ #FF6B6B  [×]                         │
│  ■ #4ECDC4  [×]                         │
│  ■ #45B7D1  [×]                         │
│  ■ #96CEB4  [×]                         │
│  ■ #FFEAA7  [×]                         │
│                                         │
│  [+ Add Color]                          │
│                                         │
│  Tags: sunset, warm, tropical           │
│                                         │
│  [Delete Palette]  [Save]               │
└─────────────────────────────────────────┘
```

#### Data Structure
```javascript
const palette = {
  id: string,
  name: string,
  colors: string[], // hex values
  tags: string[],
  folder: string,
  isFavorite: boolean,
  createdAt: Date,
  updatedAt: Date,
};
```

---

### 1.3.4 Palette Import

**Priority:** Medium
**Complexity:** Medium

#### Supported Formats
| Format | Source |
|--------|--------|
| JSON | Calm Drawing export |
| URL | Coolors.co links |
| Image | Extract from uploaded image |
| ASE | Adobe Swatch Exchange |
| GPL | GIMP Palette |
| CSS | CSS color variables |

#### Image Palette Extraction
```javascript
function extractPaletteFromImage(imageData, colorCount = 5) {
  // Use color quantization algorithm (median cut or k-means)
  // Return dominant colors
  return dominantColors;
}
```

---

### 1.3.5 Color Blindness Simulation

**Priority:** Medium
**Complexity:** Medium

#### Simulation Types
| Type | Affected | Population |
|------|----------|------------|
| Deuteranopia | Green | ~6% males |
| Protanopia | Red | ~2% males |
| Tritanopia | Blue | ~0.01% |
| Achromatopsia | All (grayscale) | Rare |

#### Implementation
```javascript
// Apply color matrix to canvas for preview
const colorBlindnessMatrices = {
  deuteranopia: [
    0.625, 0.375, 0, 0, 0,
    0.7, 0.3, 0, 0, 0,
    0, 0.3, 0.7, 0, 0,
    0, 0, 0, 1, 0
  ],
  // ... other matrices
};
```

#### UI: Toggle in View menu
- Preview artwork as different color blindness types
- Show side-by-side comparison
- Suggest more distinguishable colors

---

### 1.3.6 Gradient Editor

**Priority:** High
**Complexity:** High

#### Features
- Linear and radial gradients
- Multi-stop color gradients
- Adjustable stop positions
- Gradient angle/direction
- Opacity per stop
- Save gradient presets

#### UI/UX Specifications
```
Gradient Editor:
┌─────────────────────────────────────────┐
│  🌈 Gradient Editor                     │
│                                         │
│  Type: [Linear ▼]  [Radial]             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ■━━━━━━━●━━━━━━━●━━━━━━━■      │    │
│  │ ▲       ▲       ▲       ▲      │    │
│  │ Stop 1  Stop 2  Stop 3  Stop 4 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Selected Stop: 2                       │
│  Color: [#4ECDC4] ■                     │
│  Position: [35%]                        │
│  Opacity: [100%]                        │
│                                         │
│  Angle: [45°] ━━━━━●━━━━━               │
│                                         │
│  [+ Add Stop]  [Save Preset]            │
└─────────────────────────────────────────┘
```

#### Data Structure
```javascript
const gradient = {
  type: 'linear' | 'radial',
  angle: number, // degrees, for linear
  stops: [
    { color: string, position: number, opacity: number }
  ],
  // For radial
  centerX: number,
  centerY: number,
  radius: number,
};
```

---

### 1.3.7 Color Mixing Simulation

**Priority:** Low
**Complexity:** High

#### Description
Blend colors like real paint using realistic color mixing algorithms.

#### Mixing Models
| Model | Use Case |
|-------|----------|
| RGB | Digital (additive) |
| RYB | Traditional paint (subtractive) |
| CMYK | Print |

#### UI: Mixing Palette
```
Color Mixer:
┌─────────────────────────────────────────┐
│  🎨 Color Mixer                         │
│                                         │
│  Color A: ■ #FF6B6B                     │
│  Color B: ■ #4ECDC4                     │
│                                         │
│  Ratio: A ━━━━●━━━━ B                   │
│              50%                        │
│                                         │
│  Result: ■ #A2AD97                      │
│                                         │
│  [Add to Palette]                       │
└─────────────────────────────────────────┘
```

---

### 1.3.8 Global Color Swatches

**Priority:** Medium
**Complexity:** High

#### Description
Define global colors that update everywhere when changed.

#### Features
- Define named color variables
- All uses update when variable changes
- Import/export color systems
- Design token support

#### UI/UX Specifications
```
Global Colors:
┌─────────────────────────────────────────┐
│  🌐 Global Colors                       │
│                                         │
│  Primary:    ■ #E94560  [Edit]          │
│  Secondary:  ■ #45E960  [Edit]          │
│  Accent:     ■ #4560E9  [Edit]          │
│  Background: ■ #1A1A2E  [Edit]          │
│  Text:       ■ #EAEAEA  [Edit]          │
│                                         │
│  [+ Add Global Color]                   │
│                                         │
│  ⚠️ Changing a global color updates     │
│     all 23 uses in this artwork.        │
└─────────────────────────────────────────┘
```

---

## 1.4 Advanced Brush Engine

### 1.4.1 Custom Brush Creation

**Priority:** High
**Complexity:** High

#### Description
Allow users to design their own brushes with custom tips and dynamics.

#### Brush Properties
| Property | Description | Range |
|----------|-------------|-------|
| Tip Shape | Circle, square, custom image | - |
| Size | Base brush size | 1-500px |
| Hardness | Edge softness | 0-100% |
| Spacing | Distance between stamps | 1-500% |
| Scatter | Random position offset | 0-100% |
| Rotation | Tip angle | 0-360° |
| Rotation Jitter | Random rotation | 0-180° |
| Size Jitter | Random size variation | 0-100% |
| Opacity Jitter | Random opacity | 0-100% |

#### UI/UX Specifications
```
Brush Editor:
┌─────────────────────────────────────────┐
│  🖌️ Brush Editor                        │
│                                         │
│  Name: [Custom Brush 1    ]             │
│                                         │
│  Tip:   ○ Circle  ○ Square  ○ Custom    │
│         [Upload Tip Image]              │
│                                         │
│  Preview: ┌───────────────────────┐     │
│           │ ~~~~~~~~~~~~~~~~~~~~~~ │     │
│           └───────────────────────┘     │
│                                         │
│  Size:     ━━━━●━━━━━━━  24px          │
│  Hardness: ━━━━━━━●━━━  80%            │
│  Spacing:  ━━●━━━━━━━━  15%            │
│  Scatter:  ━━━━━━━━━●━  0%             │
│                                         │
│  Dynamics:                              │
│  □ Size → Speed                         │
│  □ Opacity → Speed                      │
│  ☑ Rotation → Direction                 │
│                                         │
│  [Test Area]  [Save Brush]  [Cancel]    │
└─────────────────────────────────────────┘
```

#### Data Structure
```javascript
const customBrush = {
  id: string,
  name: string,
  tip: {
    shape: 'circle' | 'square' | 'custom',
    customImage: string | null, // base64 or URL
  },
  size: number,
  hardness: number,
  spacing: number,
  scatter: number,
  rotation: number,
  jitter: {
    rotation: number,
    size: number,
    opacity: number,
  },
  dynamics: {
    sizeBySpeed: boolean,
    opacityBySpeed: boolean,
    rotationByDirection: boolean,
  },
};
```

---

### 1.4.2 Brush Texture Support

**Priority:** Medium
**Complexity:** Medium

#### Description
Apply paper/canvas textures to brush strokes for realistic effects.

#### Built-in Textures
| Texture | Description |
|---------|-------------|
| Smooth | No texture |
| Canvas | Woven fabric texture |
| Watercolor Paper | Rough, absorbent |
| Drawing Paper | Light tooth |
| Cardboard | Heavy texture |
| Linen | Fine woven |

#### Implementation
- Texture applied as multiply blend mode
- Texture scale adjustable (50-200%)
- Texture rotation
- Custom texture upload

---

### 1.4.3 Wet Brush Simulation

**Priority:** Medium
**Complexity:** High

#### Description
Colors blend when overlapping, simulating wet paint mixing.

#### Parameters
| Setting | Description |
|---------|-------------|
| Wetness | How much colors blend (0-100%) |
| Dilution | Water content (lighter colors) |
| Dry Time | Strokes dry over time |
| Pick-up | Brush picks up underlying color |

#### Technical Approach
- Use pixel buffer for wet layer
- Blend colors using weighted average
- Apply diffusion algorithm for edge blending
- Decrease wetness over time

---

### 1.4.4 Dry Brush Effects

**Priority:** Low
**Complexity:** Medium

#### Description
Textured, broken strokes simulating dry brush painting technique.

#### Implementation
- Use noise map to create gaps
- Higher opacity at peaks, transparent at valleys
- Adjustable texture density
- Works with brush tip shape

---

### 1.4.5 Scatter Brushes

**Priority:** Medium
**Complexity:** Medium

#### Description
Randomized placement of brush tip (leaves, stars, bubbles, etc.).

#### Settings
| Setting | Description |
|---------|-------------|
| Count | Tips per stamp (1-10) |
| Scatter X | Horizontal randomness |
| Scatter Y | Vertical randomness |
| Size Range | Min-max size variation |
| Rotation Range | Random rotation |

#### Built-in Scatter Presets
- Leaves (various shapes)
- Stars
- Bubbles
- Confetti
- Snow
- Grass
- Flowers

---

### 1.4.6 Pattern Brushes

**Priority:** Low
**Complexity:** High

#### Description
Repeating patterns along brush stroke path.

#### Features
- Pattern tiles seamlessly
- Follows stroke curve
- Scale to stroke width
- Custom pattern upload

---

### 1.4.7 Pressure-Sensitive Stylus Support

**Priority:** High
**Complexity:** Medium

#### Description
Full integration with pressure-sensitive styli (Apple Pencil, Wacom, etc.).

#### Supported Properties
| Property | Stylus Input |
|----------|--------------|
| Size | Pressure |
| Opacity | Pressure |
| Tilt | Brush angle |
| Twist | Rotation (if supported) |

#### Technical Implementation
```javascript
// Pointer Events API
canvas.addEventListener('pointerdown', (e) => {
  const pressure = e.pressure; // 0-1
  const tiltX = e.tiltX; // -90 to 90
  const tiltY = e.tiltY; // -90 to 90
  const twist = e.twist; // 0-359

  // Apply to brush
  brush.size = baseSize * pressure;
  brush.opacity = baseOpacity * pressure;
  brush.angle = Math.atan2(tiltY, tiltX);
});
```

---

### 1.4.8 Brush Stabilization

**Priority:** High
**Complexity:** Medium

#### Description
Smooth out shaky hand movements for cleaner lines.

#### Stabilization Levels
| Level | Delay | Use Case |
|-------|-------|----------|
| Off | 0ms | Quick sketching |
| Low | 20ms | Normal drawing |
| Medium | 50ms | Smoother lines |
| High | 100ms | Very smooth curves |
| Maximum | 200ms | Precise linework |

#### Algorithm
```javascript
function stabilize(currentPoint, level) {
  // Moving average of last N points
  // Higher level = more points averaged
  const points = pointHistory.slice(-level * 3);
  return {
    x: average(points.map(p => p.x)),
    y: average(points.map(p => p.y))
  };
}
```

---

### 1.4.9 Lazy Brush

**Priority:** Medium
**Complexity:** Medium

#### Description
Brush follows cursor with a delay, creating smooth, precise strokes.

#### Settings
| Setting | Description |
|---------|-------------|
| String Length | Distance between cursor and brush |
| Catch-up Speed | How fast brush follows |
| Show String | Visual indicator |

#### Visualization
```
Cursor position: ○
String: --------
Brush position: ●

   ○--------●
   ↑        ↑
  Cursor   Brush
```

---

## Implementation Priority Matrix

### Immediate (Sprint 1-2)
| Feature | Impact | Effort |
|---------|--------|--------|
| Focus Mode | High | Low |
| Session Timers | High | Low |
| Brush Stabilization | High | Medium |
| Ambient Soundscapes | High | Medium |
| Color Harmony | High | Medium |

### Short-term (Sprint 3-4)
| Feature | Impact | Effort |
|---------|--------|--------|
| Guided Breathing | Medium | Medium |
| Daily Prompts | Medium | Medium |
| Custom Palette | High | Medium |
| Stylus Support | High | Medium |
| 50 Templates | High | High |

### Medium-term (Sprint 5-8)
| Feature | Impact | Effort |
|---------|--------|--------|
| Mood Tracking | Medium | Medium |
| Custom Brushes | High | High |
| Gradient Editor | Medium | High |
| All Templates | High | High |
| Wet Brush | Low | High |

### Long-term (Sprint 9+)
| Feature | Impact | Effort |
|---------|--------|--------|
| Gratitude Journal | Low | Medium |
| PMR Prompts | Low | Low |
| Color Mixing | Low | High |
| Global Swatches | Medium | High |
| Pattern Brushes | Low | High |

---

## Success Metrics for Phase 1

### User Engagement
- 30% increase in average session duration
- 20% increase in return users
- 50% of users try Focus Mode
- 40% of users use new templates

### Feature Adoption
- Breathing exercises used by 25% of users
- Session timer enabled by 40% of users
- Custom palettes created by 30% of users
- New templates colored by 60% of users

### User Satisfaction
- 4.5+ star rating for new features
- Positive feedback on relaxation features
- Requests for more template categories
- Community sharing of custom palettes

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Phase 1 Target Completion: Q2 2026*

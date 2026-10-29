---
title: "Lineup Webpage"
description: "Interactive event roster coordinator and conflict-free schedule grid allocation interface."
category: "Software"
year: "2025"
tags: ["TypeScript", "React", "TailwindCSS", "State Management", "Vite"]
featured: false
github: "https://github.com/krishquanta/lineup-webpage"
demo: "https://lineup-roster.dev"
order: 5
---

## Problem
College symposiums, technical hackathons, and lab sessions struggle with coordinating multi-track speaker schedules, equipment availability, and attendee allocations. Existing spreadsheet solutions suffer from version desynchronization, concurrent editing overwrites, and zero automated overlap detection when sessions run behind schedule.

## What Was Built
A responsive, high-performance web interface designed for dynamic event rosters and timeline management:

1. **Interactive Timeline Grid**: Renders multi-room event tracks with dynamic zoom levels, drag-to-reschedule capabilities, and visual milestone markers.
2. **Conflict Detection Engine**: Evaluates speaker and room availability in $O(N \log N)$ time, flagging temporal overlaps and venue double-bookings with clear visual warnings.
3. **Offline State Persistence & Export**: Persists state changes locally in IndexedDB, supporting instant JSON schema import/export and ICS calendar feeds for mobile synchronization.

## Architecture Layout

```
[Schedule Store / IndexedDB] <───> [Conflict Detection Engine]
             │                                   │
             ▼                                   ▼
[Timeline Grid Controller] ─────────> [Live Collision Warnings]
             │
             ▼
[Multi-Track Session Renderer] ─────> [Calendar ICS Export Service]
```

## Tech Used
- **Frontend**: TypeScript, React 18, Vite
- **Styling**: TailwindCSS, CSS Grid
- **State & Storage**: Zustand, IndexedDB (`idb`)
- **Date Algorithms**: date-fns

## Key Decisions & Engineering Challenges
- **Virtualization for Long Multi-Day Rosters**: Rendering hundreds of micro-events simultaneously introduced scrolling lag. Employed a virtualized grid container that mounts only visible session nodes, maintaining 60 FPS scrolling even with 500+ timetable blocks.
- **Bi-directional Time Mapping**: Converting pixel coordinate deltas to discrete 15-minute time quantization required precise mathematical normalization across differing display aspect ratios.
- **Optimistic State Updates**: Implemented immediate UI feedback on event drop operations with atomic rollback if schedule conflicts exceeded defined room safety capacities.

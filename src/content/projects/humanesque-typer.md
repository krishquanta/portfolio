---
title: "Humanesque Typer"
description: "Windows low-level input simulation engine with stochastic keystroke timing distributions."
category: "Automation"
year: "2025"
tags: ["C++", "Win32 API", "System Programming", "Probability Modeling", "Windows"]
featured: false
github: "https://github.com/krishquanta/humanesque-typer"
demo: ""
order: 4
---

## Problem
Automated software testing and accessibility tools often rely on standard high-level programmatic text injection (such as clipboard pasting or basic synthetic events). These synthetic inputs fire with zero millisecond latency between events and lack physical keypress telemetry (scan codes, make/break transitions, and key rollover). Consequently, systems undergoing end-to-end user experience testing, latency profiling, or legacy terminal software fail to mirror realistic operator interaction profiles.

## What Was Built
A low-level Windows input simulation utility written in C++ that models realistic human typing biometrics and injects hardware-level keystrokes directly into the OS input queue:

1. **Win32 Input Injection Subsystem**: Interacts directly with the Windows `SendInput` API, populating `KEYBDINPUT` structures with hardware scan codes rather than virtual key codes to maintain compatibility across legacy terminals and DirectInput applications.
2. **Stochastic Timing Engine**: Models inter-keystroke intervals (IKIs) using log-normal and Gaussian distributions tailored to digraph frequencies (e.g., common character pairs like 'th' or 'er' exhibit lower transit times than distal combinations like 'q-p').
3. **Fatigue & Cadence Modulation**: Introduces micro-jitter, variable key hold duration (dwell time between 60ms and 110ms), and periodic paragraph pause intervals reflecting cognitive chunking.

## Pipeline Architecture

```
[Target Text Stream] ───> [Digraph Frequency Analyzer]
                                    │
                                    ▼
                         [Log-Normal Latency Engine]
                         (Dwell Time + Flight Time)
                                    │
                                    ▼
                          [Scan Code Resolver]
                       (Map VK to Hardware Make/Break)
                                    │
                                    ▼
                          [Win32 SendInput Queue]
                                    │
                                    ▼
                        [Target Window Context]
```

## Tech Used
- **Language**: C++20, C
- **API & Platform**: Windows User32 API (`SendInput`, `MapVirtualKeyEx`), Win32 Subsystem
- **Statistics**: C++ `<random>` library, Log-Normal and Box-Muller Gaussian generators
- **Build System**: CMake, MSVC

## Key Decisions & Engineering Challenges
- **Virtual Keys vs. Scan Codes**: Standard virtual keys (`VK_*`) bypass keyboard driver scan code translation, which certain virtual terminals and low-level gaming frameworks reject. Implemented `MapVirtualKeyExW` with the active keyboard layout identifier to emit raw OEM hardware scan codes and appropriate extended key flags (`KEYEVENTF_SCANCODE` / `KEYEVENTF_KEYUP`).
- **Timer Resolution on Windows**: Default Windows `Sleep()` resolution is 15.6ms, far too coarse for millisecond-level dwell time modeling. Leveraged `timeBeginPeriod(1)` and high-resolution multimedia timers (`QueryPerformanceCounter`) to achieve deterministic sub-millisecond dispatch accuracy.
- **Modifier Key Synchronization**: Accurately modeled Shift, Ctrl, and Alt state transitions by queuing synthetic make/break packets to ensure proper capitalization and symbol generation without buffer desynchronization.

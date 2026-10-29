---
title: "IoT Power & Energy Telemetry Node"
description: "Real-time AC power monitor with Hall-effect current sensing, ESP32 ADC calibration, and Tinkercad breadboard simulation."
category: "Hardware"
year: "2026"
tags: ["Embedded C++", "ESP32", "Arduino", "Tinkercad", "KVL/KCL", "Sensors"]
featured: true
github: "https://github.com/krishquanta/iot-energy-monitor"
demo: ""
order: 1
---

## Problem
In electrical and electronics engineering (EEE), monitoring electrical equipment energy consumption and transient power spikes requires accurate voltage and current measurement. Commercial energy meters are typically closed-source, bulky, and lack configurable telemetry for small-scale bench tests. The primary engineering challenge was designing an optically isolated sensor node that safely samples high-voltage mains, filters electrical noise, and streams calibrated metrics over low-power wireless protocols without overloading the microcontroller's CPU.

## What Was Built
An embedded sensor node combining an analog front-end with dual-core ESP32 firmware for continuous True-RMS voltage and current computation:

1. **Galvanically Isolated Analog Front-End**: Employs an Allegro ACS712 Hall-effect current sensor alongside a ZMPT101B potential transformer module, ensuring optical and magnetic isolation between 230V AC load circuits and the 3.3V microcontroller logic rail.
2. **Deterministic Dual-Core Sampling Firmware**: Core 0 runs a dedicated FreeRTOS task sampling the ADC at 2.5 kHz (50 samples per 50 Hz AC cycle) using hardware timer interrupts. Core 1 computes True-RMS current, active power ($P = V_{rms} \cdot I_{rms} \cdot \cos\theta$), and apparent power.
3. **Telemetry & Visual Telemetry**: Transmits compressed JSON payloads over MQTT via WiFi to an InfluxDB / Grafana dashboard, with fallback local reporting over an I2C 128x64 OLED display.

## Circuit & Subsystem Schematic

![Tinkercad Simulated Breadboard Circuit Schematic](/tinkercad-circuit.svg)
*Figure 1: Tinkercad simulated analog front-end and ESP32 dual-core sampling topology with 1.65V DC virtual ground offset and 2.5 kHz hardware timer ADC interrupts.*

```
[230V AC Mains Load] ───> [ACS712 Current Sensor] ───> [Anti-Aliasing Filter]
                                                               │
                                                               ▼
[ZMPT101B Voltage PT] ──> [Op-Amp Bias Shifter] ──────> [ESP32 ADC1 (Core 0)]
                                                               │
                                                        (2.5 kHz ISR Timer)
                                                               │
                                                               ▼
                                                       [True-RMS & Cos φ Calc]
                                                               │
                                                               ▼
[I2C 0.96" OLED Display] <──── [Telemetry Core 1] ────> [WiFi / MQTT Gateway]
```

## Tech Used
- **Hardware & Microcontroller**: ESP32 (Xtensa Dual-Core 32-bit), Arduino Framework, ATmega328P prototype
- **Sensors & Passives**: Allegro ACS712-05B, ZMPT101B Active Voltage Transformer, LM358 Op-Amp
- **CAD & Simulation**: KiCad 7.0 (Schematic & PCB Layout), Autodesk Tinkercad (Initial Breadboard Simulation)
- **Protocols & RTOS**: FreeRTOS, SPI, I2C, MQTT, Wi-Fi 802.11 b/g/n

## Key Decisions & Engineering Challenges
- **ESP32 ADC Non-Linearity Correction**: The ESP32's internal successive approximation ADC exhibits non-linear response below 0.1V and above 2.8V. Designed an active op-amp voltage divider with a 1.65V DC virtual ground offset and implemented a multi-point polynomial calibration curve in firmware, reducing RMS measurement error from 8.5% down to < 1.2%.
- **True-RMS vs. Peak Approximation**: In circuits with non-linear loads (switching power supplies, LED drivers), current waveforms are non-sinusoidal. Pure peak-detect approximations yielded erratic readings. Implemented discrete numerical integration:
  $$I_{rms} = \sqrt{\frac{1}{N} \sum_{k=1}^{N} i[k]^2}$$
  across synchronized integral cycles.
- **Hardware Isolation Safety**: Physical PCB trace routing strictly maintains a 6.5mm creepage distance between the high-voltage AC terminal block and the low-voltage DC planes, supplemented by an unplated routing isolation slot under the optocoupler and sensor boundaries.

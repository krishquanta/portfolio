---
title: "Shop Cold Outreach"
description: "Distributed business lead aggregation and rate-governed notification dispatch pipeline."
category: "Automation"
year: "2026"
tags: ["Python", "FastAPI", "Docker", "PostgreSQL", "Celery", "Redis"]
featured: true
github: "https://github.com/krishquanta/shop-cold-outreach"
demo: ""
order: 2
---

## Problem
Local commercial vendors and independent shopfronts frequently lack unified communication channels. Aggregating vendor contact details from public registries and executing contextual outreach manually is time-intensive, error-prone, and susceptible to upstream API rate limits or network disconnects. The core engineering requirement was a reliable, self-hosted pipeline that could parse unstructured vendor registries, deduplicate records, and dispatch scheduled notifications without exceeding third-party provider threshold quotas.

## What Was Built
An automated ingestion and queue-governed dispatch service architected as isolated microservices:

1. **Extraction & Normalization Service**: Ingests public directory datasets, standardizes geographic coordinates, cleans phone/email formats using E.164 specifications, and executes duplicate detection against PostgreSQL with fuzzy matching.
2. **Rate-Governed Task Broker**: Utilizes Celery and Redis to implement token-bucket rate limiting. Tasks are throttled per domain and recipient gateway to strictly adhere to messaging provider throughput limits (e.g., maximum 1 request per 4 seconds).
3. **Containerized Worker Pool**: Deployed via Docker Compose with health checks, ephemeral storage cleanup, and persistent database volumes.

## Architecture Diagram

```
[Registry Scraper] ───> [Data Normalizer & Validator]
                                 │
                                 ▼
                         [PostgreSQL Store]
                                 │
                                 ▼
                     [Redis Task Queue / Broker]
                                 │
                     (Token-Bucket Throttler)
                                 │
                                 ▼
            [Worker Pool] ───> [Gateway Dispatcher] ───> [Receipt Logger]
```

## Tech Used
- **Runtime & Language**: Python 3.11, FastAPI
- **Queue & Storage**: Redis, Celery, PostgreSQL 15, SQLAlchemy ORM
- **Containerization**: Docker, Docker Compose
- **Testing & Quality**: Pytest, Flake8, Black

## Key Decisions & Engineering Challenges
- **Token Bucket vs. Fixed Window**: Fixed window rate limiting caused burst traffic spikes at window boundaries, triggering temporary gateway blocks. Migrating to a Redis-backed token bucket algorithm smoothed transmission curves and maintained zero gateway rejections over 10,000+ dispatches.
- **Resilient Worker Recovery**: Network drops during upstream HTTP calls previously caused hanging tasks. Implemented idempotent task payloads with explicit transaction rollbacks, dead-letter queues (DLQ), and exponential backoff retry policies.
- **Container Isolation**: Encapsulated stateful services in private Docker bridge networks, exposing only the metrics endpoint and admin health probes.

---
title: "Recall"
description: "Contextual semantic search engine and local-first personal knowledge retrieval indexing system."
category: "AI"
year: "2025"
tags: ["Rust", "Python", "SQLite-VSS", "HNSW", "Local Embeddings", "Tauri"]
featured: false
github: "https://github.com/krishquanta/recall"
demo: ""
order: 4
---

## Problem
Developers and engineering students accumulate fragmented technical knowledge across local markdown notes, PDF textbooks, terminal command histories, and browser bookmarks. Traditional desktop file search (Windows Search / grep) relies on rigid keyword matching, failing when searching for concepts rather than exact strings (e.g., searching "handling asynchronous interrupt timing" misses documents titled "non-blocking timer ISR patterns"). Cloud solutions, conversely, introduce latency and privacy concerns for proprietary engineering notes.

## What Was Built
A lightweight, offline-first personal knowledge retrieval daemon that continuously indexes technical documentation and provides sub-50ms fuzzy conceptual retrieval:

1. **Incremental Document Watcher**: Monitors local technical directories using filesystem event notifications (`notify`), triggering chunking and embedding only when file hashes update.
2. **Deterministic Chunking & Tokenizer**: Chunks markdown and code files along structural AST boundaries (functions, headers, code blocks) rather than arbitrary character splits.
3. **Local Vector Search**: Runs quantized `all-MiniLM-L6-v2` embeddings locally via ONNX Runtime, persisting embeddings into SQLite with an in-memory HNSW index for ultra-low latency queries.

## Data Flow Diagram

```
[Local Markdown / Code / PDFs] ───> [Filesystem Notifier]
                                            │
                                            ▼
                               [AST Structural Chunker]
                                            │
                                            ▼
                                [ONNX Quantized Embedding]
                                            │
                                            ▼
                               [SQLite + HNSW Vector Store]
                                            │
                                            ▼
  [Developer Query] ────────────────> [Hybrid BM25 + Vector Ranker]
                                            │
                                            ▼
                                 [Top-K Ranked Context]
```

## Tech Used
- **Core Engine**: Rust, Python, ONNX Runtime
- **Storage & Indexing**: SQLite, SQLite-VSS, HNSW (Hierarchical Navigable Small World)
- **Tokenization**: Fastembed, Hugging Face Tokenizers
- **Interface**: CLI binary & minimal desktop tray daemon

## Key Decisions & Engineering Challenges
- **Semantic + Keyword Hybrid Ranking**: Vector similarity alone struggles with exact variable names or compiler flags (e.g., `-O3` or `uint32_t`). Combined BM25 lexical search with dense vector embeddings via Reciprocal Rank Fusion (RRF), yielding high precision for code identifiers alongside conceptual queries.
- **Resource Constraints on Battery**: Running full Transformer inference in the background drained laptop battery. Switched to INT8 quantized ONNX models with lazy batching: embedding queues process only when the CPU is idle for more than 30 seconds.
- **Zero Cloud Leakage**: Designed with strict local-first guarantees; no telemetry or data packets ever leave the host machine.

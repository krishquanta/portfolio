---
title: "Krish C Projects"
description: "Systems programming suite: custom memory allocators, dynamic data structures, and POSIX CLI tools in C99."
category: "Software"
year: "2024"
tags: ["C99", "Memory Management", "Data Structures", "POSIX", "Valgrind", "GDB"]
featured: false
github: "https://github.com/krishquanta/c-systems-suite"
demo: ""
order: 6
---

## Problem
High-level languages conceal fundamental hardware mechanics: virtual memory mapping, cache line alignment, heap fragmentation, and system call overhead. Mastering low-level systems programming and writing deterministic embedded firmware requires understanding how data structures map directly into physical RAM and how memory allocations impact CPU cache performance.

## What Was Built
A modular suite of systems utilities and data structure implementations written in strict C99, validated under Valgrind for zero memory leaks:

1. **Custom Free-List Memory Allocator**: Implements `malloc` and `free` primitives atop `sbrk` / `mmap`. Features explicit free lists, first-fit / best-fit block allocation, header/footer boundary tagging, and immediate adjacent block coalescing to counteract heap fragmentation.
2. **Cache-Conscious Data Structures**: High-performance intrusive linked lists, dynamically resizing hash maps with linear probing (Robin Hood hashing), and balanced AVL trees with strict pointer sanitization.
3. **POSIX Command-Line Utilities**: Low-level reimplementations of UNIX core tools (`my_grep` with regex byte-matching, `my_cat` with circular buffer IO, and `my_ls` with POSIX `dirent` traversal).

## Allocator Block Layout

```
+---------------------------------------------------------------+
| Chunk Size (4B) | Prev In Use (1B) | Payload / User Data ...  |
+---------------------------------------------------------------+
| ... User Data   | Free: Next Ptr   | Free: Prev Ptr           |
+---------------------------------------------------------------+
| Boundary Tag / Size Footer (4B)                               |
+---------------------------------------------------------------+
```

## Tech Used
- **Language**: C (C99 standard, `-Wall -Wextra -Werror -pedantic`)
- **Tooling & Profiling**: GCC, Clang, GNU Make, GDB, Valgrind (Memcheck), AddressSanitizer (ASan)
- **OS Interface**: POSIX system calls (`mmap`, `brk`, `open`, `read`, `write`)

## Key Decisions & Engineering Challenges
- **8-Byte Memory Alignment**: Misaligned pointer access on certain CPU architectures incurs steep penalty cycles or hardware traps. Enforced strict 8-byte boundary alignment (`(size + 7) & ~7`) across all allocated blocks.
- **Cache Locality in Hash Table Probing**: Chained hashing with individual pointer nodes caused pointer chasing across disparate RAM addresses. Switched to open addressing with Robin Hood linear probing, yielding a 2.4x speedup during lookups due to contiguous CPU cache line utilization.
- **Valgrind Verification Gate**: Integrated AddressSanitizer and Valgrind into the Makefile test harness to guarantee zero memory leaks, zero heap buffer overflows, and zero uninitialized variable reads across all test suites.

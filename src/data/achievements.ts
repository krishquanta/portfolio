export interface Achievement {
  event: string;
  result: string;
  date: string;
  description: string;
  link?: string;
  category?: 'Hackathon' | 'Competition' | 'Academic' | 'Open Source';
}

export const achievements: Achievement[] = [
  {
    event: "ARCANE 2K26 — Code Canvas",
    result: "1st Place Winner (₹2,000 Cash Prize)",
    date: "28 Oct 2026",
    description: "Won 1st place with a ₹2,000 cash prize in the 'Code Canvas' web development competition organized by the Department of Computer Science & Engineering at B.S. Abdur Rahman Crescent Institute of Science and Technology (Vandalur), outperforming 4th-year engineering competitors as a 1st-year student.",
    link: "/images/certificates/arcane-code-canvas-1st.jpg",
    category: "Competition"
  },
  {
    event: "VELSATHON'26",
    result: "Participant",
    date: "8–9 Oct 2026",
    description: "Participated in the inter-collegiate hackathon organized by the School of Computing Sciences at Vels Institute of Science, Technology & Advanced Studies (VISTAS), Pallavaram.",
    link: "/images/certificates/velsathon-participation.jpg",
    category: "Hackathon"
  },
  {
    event: "Smart India Hackathon (SIH 2026)",
    result: "Internal Round Shortlisted",
    date: "Oct 2026",
    description: "Proposed and simulated a low-bandwidth telemetry protocol for distributed agricultural sensors and solar inverter monitoring.",
    link: "https://github.com/krishquanta",
    category: "Hackathon"
  },
  {
    event: "Inter-Collegiate Circuit Debugging Challenge",
    result: "1st Place — Speed Analysis",
    date: "Aug 2026",
    description: "Diagnosed RC time-constant faults and component bias errors in analog breadboard circuits under timed troubleshooting rounds.",
    link: "https://github.com/krishquanta",
    category: "Competition"
  },
  {
    event: "State Science & Engineering Exhibition",
    result: "Distinction Award",
    date: "Dec 2025",
    description: "Built and demonstrated a multi-stage water level sensor circuit with automated pump cut-off using discrete transistors and 555 timers.",
    link: "https://github.com/krishquanta",
    category: "Competition"
  },
  {
    event: "FOSS Systems Contribution Sprint",
    result: "Contributor",
    date: "Nov 2025",
    description: "Contributed test scripts and boundary sanity checks for open-source C and Python utility libraries.",
    link: "https://github.com/krishquanta",
    category: "Open Source"
  }
];

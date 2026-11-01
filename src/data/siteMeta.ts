export interface SiteMeta {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  college: string;
  degree: string;
  nav: Array<{ label: string; href: string }>;
}

export const siteMeta: SiteMeta = {
  name: "Mohnish Krishna S",
  title: "Mohnish Krishna S — B.E. EEE Undergraduate · Embedded Systems, Automation, Circuits",
  tagline: "B.E. EEE undergraduate · embedded systems, automation, circuits",
  bio: "First-year Electrical and Electronics Engineering undergraduate at Dhaanish Ahmed College of Engineering, passionate about embedded systems, circuit prototyping, and workflow automation.",
  email: "krishquanta+pf@gmail.com",
  github: "https://github.com/krishquanta",
  linkedin: "https://www.linkedin.com/in/mohnish-krishna",
  location: "Chennai, India",
  college: "Dhaanish Ahmed College of Engineering, Chennai",
  degree: "B.E. in Electrical & Electronics Engineering (EEE)",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Education", href: "/#education" },
    { label: "Work", href: "/#work" },
    { label: "Achievements", href: "/#achievements" },
    { label: "Contact", href: "/#contact" },
  ],
};

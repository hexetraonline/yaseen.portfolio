window.PORTFOLIO = { projects: [
        { id: 1, name: "DC-2 Vulnerable Machine Penetration Test", cat: "Cybersecurity Lab", stack: "Authorized lab VM, Kali Linux, enumeration, rbash escape, Git sudo privilege escalation, flag3.txt & flag4.txt", status: "Completed" },
        { id: 2, name: "Windows Incident Investigation with Sysmon", cat: "Security Monitoring", stack: "Windows, PowerShell, Event Viewer, Practice-Sysmon.evtx — Event IDs 1, 3, 11, and 22 investigation", status: "Completed" },
        { id: 3, name: "RFID-Activated Door Lock System", cat: "Hardware & IoT", stack: "Arduino UNO R3 (ATmega328P), MFRC522 RFID reader, keypad PIN override, servo lock, LiquidCrystal_I2C", status: "Completed" },
        { id: 4, name: "Akshaya@Doorstep Management System", cat: "Web Development", stack: "PHP, MySQL, HTML, CSS, JavaScript, Apache — Role-based login, bookings, payments, and audit logs", status: "In Progress" },
        { id: 5, name: "Splunk SIEM Investigation Lab", cat: "Security Monitoring", stack: "Splunk, Windows security telemetry, Sysmon logs, network IP configuration & search queries", status: "In Progress" },
        { id: 6, name: "CTF & Ethical Hacking Lab Practice", cat: "Cybersecurity Lab", stack: "Linux enumeration, shell & permissions investigation, privilege-escalation practice", status: "In Progress" },
        { id: 7, name: "Hexetra Digital Solutions", cat: "Web & Branding", stack: "hexetra.online (formerly Digi Dreamers) — Branding, web development, domain & hosting tasks", status: "In Progress" },
        { id: 8, name: "Zella Builders Website Maintenance", cat: "Web Development", stack: "zellabuilders.in — WordPress maintenance, Kubio builder, hosting renewal research & troubleshooting", status: "In Progress" },
        { id: 9, name: "Chathalloor Unit Membership System", cat: "Web Development", stack: "Mobile-friendly membership collection form, photo requirements, and password-protected dashboard", status: "In Progress" },
        { id: 10, name: "TransitBridge — Kerala Bus Tracking App", cat: "Application Development", stack: "Flutter, Firebase, Cloud Firestore — Bus route & timing lookup prototype (live tracking planned)", status: "Prototype" },
        { id: 11, name: "CastUrVote — Online Voting Project", cat: "Web Development", stack: "Web technologies, MySQL database setup, QR loading, and deployment troubleshooting", status: "Prototype" },
        { id: 12, name: "CampusCore — Campus Management Project", cat: "Web Development", stack: "Web & MySQL database identification, administration, and local server troubleshooting", status: "Prototype" },
        { id: 13, name: "Sahithyolsav 2026 Digital Support", cat: "Community & Event Tech", stack: "Event schedule preparation, Malayalam posters, and competition rules website prototype", status: "Prototype" },
        { id: 14, name: "Vulnerable Web Application Assessment", cat: "Cybersecurity Lab", stack: "Evaluation of bWAPP, VulnBank, and WackoPicko for academic vulnerability assessment planning", status: "Planned" },
        { id: 15, name: "EventMaster — Arts & Meelad Platform", cat: "Software Design", stack: "Planned stack: React, TypeScript, Node.js, Express, PostgreSQL, JWT — QR registration & live scoreboard", status: "Planned" },
        { id: 16, name: "Digital Heist — Interactive Cyber Game", cat: "Cybersecurity Event", stack: "5 planned levels: Logic Breaker, Code Cracker, Threat Detector, QR Hunt, and Final Vault", status: "Planned" },
        { id: 17, name: "College Cybersecurity Technical Events", cat: "Cybersecurity Event", stack: "Planned lineup: Cyber Heist, Cyber Escape Run, OSINT Detective, Bug Hunt, Code vs Hacker", status: "Planned" },
        { id: 18, name: "Yaseen Daily — Personal Productivity Tracker", cat: "App Concept", stack: "Planned Android app for daily study, coding, and cybersecurity task tracking with local storage", status: "Planned" }
      ], dossiers: {
        dc2: {
          tag: "AUTHORIZED LAB // OFFENSIVE SECURITY (COMPLETED)",
          title: "DC-2 Penetration-Testing Lab",
          desc: "Completed a full walkthrough of the intentionally vulnerable DC-2 lab machine in Kali Linux to practice enumeration, restricted-shell bypass, and privilege escalation.",
          bullets: [
            "Performed target enumeration and initial shell exploration in an isolated lab network",
            "Investigated and escaped a restricted shell (rbash) environment",
            "Audited sudo permissions and identified a permitted Git executable",
            "Used the misconfigured Git privilege to obtain root access on the lab machine",
            "Retrieved flag3.txt and flag4.txt and prepared a technical walkthrough report"
          ],
          stack: ["Kali Linux", "DC-2 Lab Machine", "rbash", "Git Privilege Escalation"]
        },
        sysmon: {
          tag: "PRACTICAL INVESTIGATION // LOG ANALYSIS (COMPLETED)",
          title: "Windows Incident Investigation with Sysmon",
          desc: "Investigated a Windows event-log capture (Practice-Sysmon.evtx) to identify suspicious host and network activity.",
          bullets: [
            "Filtered Sysmon Event IDs 1 (process creation), 3 (network connection), 11 (file creation), and 22 (DNS events)",
            "Used PowerShell to search and filter a large volume of event records",
            "Inspected event messages for suspicious executable names and outbound URLs",
            "Correlated process and network events using Windows Event Viewer"
          ],
          stack: ["Windows", "Sysmon", "PowerShell", "Event Viewer"]
        },
        splunk: {
          tag: "SECURITY MONITORING // SIEM LAB (IN PROGRESS)",
          title: "Splunk SIEM Investigation Lab",
          desc: "Practical security-monitoring exercises configuring Splunk and investigating Windows security telemetry.",
          bullets: [
            "Troubleshot Splunk network and IP configuration settings",
            "Worked with Windows security telemetry and Sysmon-related event logs",
            "Practiced running searches to investigate event data for suspicious activity"
          ],
          stack: ["Splunk", "Windows Security Telemetry", "Sysmon Logs"]
        },
        rfid: {
          tag: "HARDWARE PROJECT // ACCESS CONTROL (COMPLETED)",
          title: "RFID-Activated Door Lock System",
          desc: "Built an Arduino-based physical access-control prototype using RFID card authentication, keypad PIN override, and a servo locking mechanism.",
          bullets: [
            "Assembled an Arduino UNO R3 (ATmega328P) with an MFRC522 RFID reader and servo motor",
            "Integrated keypad PIN override, buzzer, LEDs, and a LiquidCrystal_I2C display",
            "Programmed authentication logic in Arduino C/C++ and resolved library and wiring issues"
          ],
          stack: ["Arduino UNO R3", "Arduino C/C++", "MFRC522", "LiquidCrystal_I2C", "Servo Motor"]
        },
        akshaya: {
          tag: "WEB APPLICATION // PHP & MYSQL (IN PROGRESS)",
          title: "Akshaya@Doorstep — Digital Service Centre System",
          desc: "A PHP and MySQL web application built to manage digital service-centre operations across office visits and doorstep appointments.",
          bullets: [
            "Implemented Admin and Staff/Operator role-based login and dashboards",
            "Built customer booking management, operator assignment, and booking-status workflows",
            "Added payment tracking alongside income and expense transaction records",
            "Designed MySQL tables for users, operators, bookings, payments, notifications, and audit logs, plus database backup tools"
          ],
          stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "Linux", "Apache"]
        },
        transit: {
          tag: "MOBILE PROTOTYPE // FLUTTER & FIREBASE (PROTOTYPE)",
          title: "TransitBridge — Kerala Bus Tracking Application",
          desc: "Public-transport application concept and prototype focused on making bus travel information easier to access in Kerala.",
          bullets: [
            "Implemented prototype Flutter screens for searching buses, routes, and timings",
            "Configured Firebase and Cloud Firestore backend connectivity",
            "Planned concepts: Google Maps live tracking integration and passenger arrival notifications"
          ],
          stack: ["Flutter", "Firebase", "Cloud Firestore", "Google Maps Concept"]
        },
        hexetra: {
          tag: "WEB DEVELOPMENT & BRANDING (IN PROGRESS)",
          title: "Hexetra Digital Solutions & Web Projects",
          desc: "Ongoing web development, branding, and maintenance projects across business, academic, and community websites.",
          bullets: [
            "Hexetra Digital Solutions (hexetra.online): Branding, visual identity, domain/hosting setup, and web development",
            "Zella Builders (zellabuilders.in): WordPress and Kubio maintenance, hosting research, and troubleshooting",
            "CastUrVote & CampusCore: MySQL database management, QR loading, and server deployment troubleshooting",
            "Chathalloor & Sahithyolsav 2026: Mobile-friendly membership form/dashboard and event schedule/rules prototype"
          ],
          stack: ["HTML/CSS/JS", "PHP/MySQL", "WordPress", "Hosting & Domains"]
        }
      } };

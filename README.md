# ⏳ Arbeitszeitrechner Pro

Ein moderner, browserbasierter Arbeitszeitrechner, der präzise Berechnungen nach dem deutschen Arbeitszeitgesetz (ArbZG) durchführt. Das Tool ist optimiert für die mobile Nutzung und bietet eine automatische Speicherung der Eingaben.

> **Hinweis:** Diese App stellt für mich eine Übung im Umgang mit JavaScript dar und ist ein persönlicher Ausflug ins Webdesign. Sie wird daher ohne Gewährleistung für die Richtigkeit der Ergebnisse bereitgestellt.

![Vorschau der Anwendung](https://raw.githubusercontent.com/ChrBeringer/arbeitszeitrechner/main/screenshot.png) 

## ✨ Features

- **Pausenautomatik:** Automatische Berechnung der gesetzlichen Pausenzeiten pro Arbeitsblock gemäß § 4 ArbZG:
  - > 6 Stunden am Stück: 30 Minuten Abzug
  - > 9 Stunden am Stück: 45 Minuten Abzug
- **Soll-Ist-Vergleich:** Sofortige Anzeige von Überstunden oder Minderarbeit basierend auf einer einstellbaren täglichen Sollzeit.
- **Persistence:** Speichert Sollzeit und Zeitblöcke lokal im Browser (`localStorage`). Die Daten bleiben auch nach dem Schließen des Tabs erhalten.
- **PWA-Support:** Als App auf dem Smartphone installierbar (Add to Homescreen).
- **Responsive Design:** Dank Tailwind CSS optimiert für alle Endgeräte.

## 🚀 Live-Demo & Nutzung

Die App ist direkt im Browser nutzbar unter:
👉 **[https://chrberinger.github.io/arbeitszeitrechner/](https://chrberinger.github.io/arbeitszeitrechner/)**

### Lokal ausführen:
1. Klone das Repository:
   ```bash
   git clone [https://github.com/ChrBeringer/arbeitszeitrechner.git](https://github.com/ChrBeringer/arbeitszeitrechner.git)

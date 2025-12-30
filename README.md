# ⏳ Arbeitszeitrechner Pro

Ein moderner, browserbasierter Arbeitszeitrechner, der präzise Berechnungen nach dem deutschen Arbeitszeitgesetz (ArbZG) durchführt. Das Tool ist optimiert für die mobile Nutzung und bietet eine automatische Speicherung der Eingaben.
Diese App stellt für mich eine Übung im Umgang mit Javascript dar und ist ein persönlicher Ausflug ins Webdesign und wird daher auch ohne Gewährleistung für die Richtigkeit der Ergebnisse bereitgestellt.

![Vorschau der Anwendung](https://https://github.com/ChrBeringer/arbeitszeitrechner/blob/main/screenshot.png?raw=true/800x400?text=Vorschau+Arbeitszeitrechner) 

## ✨ Features

- **Pausenautomatik:** Automatische Berechnung der gesetzlichen Pausenzeiten pro Arbeitsblock:
  - > 6 Stunden: 30 Minuten Abzug
  - > 9 Stunden: 45 Minuten Abzug
- **Soll-Ist-Vergleich:** Sofortige Anzeige von Überstunden oder Minderarbeit basierend auf einer einstellbaren täglichen Sollzeit.
- **Persistence:** Speichert deine Sollzeit und die eingetragenen Zeitblöcke lokal im Browser (`localStorage`), sodass die Daten nach einem Reload erhalten bleiben.
- **Responsive Design:** Optimiert für Desktop, Tablet und Smartphone dank Tailwind CSS.
- **Clean Architecture:** Strikte Trennung von HTML5, CSS3 und modernem JavaScript (ES6+).

## 🚀 Installation & Nutzung

Da es sich um eine rein statische Webanwendung handelt, ist keine Installation erforderlich.
Die App ist erreichbar unter: https://chrberinger.github.io/arbeitszeitrechner/

1. Klone das Repository:
   ```bash
   git clone [https://github.com/DEIN-NUTZERNAME/arbeitszeitrechner.git](https://github.com/DEIN-NUTZERNAME/arbeitszeitrechner.git)

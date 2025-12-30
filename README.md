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

## 🚀 Live-Demo & Benutzung

Die App ist direkt im Browser nutzbar unter:
👉 **[https://chrberinger.github.io/arbeitszeitrechner/](https://chrberinger.github.io/arbeitszeitrechner/)**

### Schnellzugriff per QR-Code:
Scanne diesen Code mit deiner Handy-Kamera, um die App sofort zu öffnen:

![QR Code zur App](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chrberinger.github.io/arbeitszeitrechner/)

### Nutzung als Handy-App (Installation):
1. Öffne den Link oder scanne den QR-Code.
2. **iOS:** Tippe auf das **"Teilen"**-Icon und wähle **"Zum Home-Bildschirm"**.
3. **Android:** Tippe auf die drei Punkte und wähle **"App installieren"**.

### Lokal ausführen:
1. Klone das Repository:
   ```bash
   git clone [https://github.com/ChrBeringer/arbeitszeitrechner.git](https://github.com/ChrBeringer/arbeitszeitrechner.git)


#ENGLISH VERSION:

# ⏳ Work Time Calculator Pro

A modern, browser-based work time calculator that performs precise calculations according to the German Labor Hours Act (ArbZG). The tool is optimized for mobile use and features automatic data persistence.

> **Note:** This app serves as an exercise in JavaScript and a personal exploration of web design. It is provided "as is" without any guarantee regarding the accuracy of the results.

![Application Preview](https://raw.githubusercontent.com/ChrBeringer/arbeitszeitrechner/main/screenshot.png) 

## ✨ Features

- **Automated Break Logic:** Automatic calculation of legal break times per work block according to § 4 ArbZG:
  - > 6 consecutive hours: 30-minute deduction
  - > 9 consecutive hours: 45-minute deduction
- **Target vs. Actual Comparison:** Instant display of overtime or deficit hours based on a customizable daily target time.
- **Persistence:** Saves target time and work blocks locally in the browser (`localStorage`). Data remains available even after closing the tab.
- **PWA Support:** Installable as an app on your smartphone (Add to Homescreen).
- **Responsive Design:** Optimized for all devices using Tailwind CSS.

## 🚀 Live Demo & Usage

The app is ready to use in your browser at:
👉 **[https://chrberinger.github.io/arbeitszeitrechner/](https://chrberinger.github.io/arbeitszeitrechner/)**

### Quick Access via QR Code:
Scan this code with your smartphone camera to open the app instantly:

![QR Code to App](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://chrberinger.github.io/arbeitszeitrechner/)

### Mobile App Usage (Installation):
1. Open the link or scan the QR code.
2. **iOS:** Tap the **"Share"** icon and select **"Add to Home Screen"**.
3. **Android:** Tap the three dots (menu) and select **"Install App"** or **"Add to Home Screen"**.

### Run Locally:
1. Clone the repository:
   ```bash
   git clone [https://github.com/ChrBeringer/arbeitszeitrechner.git](https://github.com/ChrBeringer/arbeitszeitrechner.git)

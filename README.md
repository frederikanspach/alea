# ALEA — Secure Random Suite

ALEA ist ein moderner, minimalistischer und kryptografisch sicherer Zufallsgenerator. Entwickelt für Umgebungen, die Wert auf Datensicherheit und saubere Architektur legen.

[https://frederikanspach.github.io/alea/]

## ✨ Features
* **Sicherheit geht vor:** Nutzung der nativen `Web Crypto API` für echte, kryptografisch starke Zufallszahlen.
* **Privatsphäre durch Lokalität:** Alle Berechnungen finden ausschließlich im Browser statt. Es werden keine generierten Daten übertragen oder auf Servern gespeichert.
* **Modulare Architektur:** Strikte Trennung von Geschäftslogik (`alea-engine.js`) und UI-Steuerung (`main.js`).
* **System-Optimiert:** Vordefinierte Zeichensätze für Passwörter, Dateinamen (Linux/Windows safe) und Lotto (6 aus 49).
* **Smart UX:** Batch-Generierung bis zu 99 Einheiten, Dark Mode Support und persistente Einstellungen via `LocalStorage`.

## 🛠 Tech Stack
* **Vanilla JavaScript (ES6+):** Modularer Aufbau ohne schwere Framework-Abhängigkeiten.
* **SCSS:** Dynamisches Styling mit Variablen und Dark Mode Management.
* **Vite:** Als moderner Build-Server und Bundler.
* **HTML5:** Semantische Struktur für Barrierefreiheit und SEO.

## 🚀 Installation & Deployment
Da ALEA eine zustandslose Frontend-Anwendung ist, kann sie auf jedem statischen Webserver gehostet werden.

1. Repository klonen: `git clone https://github.com/DEIN-GITHUB-NAME/alea.git`
2. Abhängigkeiten installieren: `npm install`
3. Lokal starten: `npm run dev`
4. Build erstellen: `npm run build` (Bereit für den Upload bei all-inkl.com oder GitHub Pages).

## ⚖️ Lizenz
Dieses Projekt steht unter der MIT-Lizenz.

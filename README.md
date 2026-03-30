# Rabatto Mio - Deal-Alarm Landingpage

## Schnellstart

```bash
# 1. Dependencies installieren
npm install

# 2. Server starten
npm start

# 3. Browser oeffnen
# http://localhost:3000
```

## Wie es funktioniert

Die Webseite bietet eine Live-Produktsuche ueber Amazon.de Autocomplete.
Wenn ein Besucher sein Wunschprodukt + E-Mail eingibt, wird er als
Subscriber gespeichert und wartet auf seinen Deal-Alarm.

## API Endpoints

| Endpoint | Methode | Beschreibung |
|---|---|---|
| `/api/suggestions?q=...` | GET | Live-Produktvorschlaege von Amazon.de |
| `/api/search?q=...` | GET | Produktsuche (PA-API Platzhalter) |
| `/api/subscribe` | POST | Neuen Deal-Alarm registrieren |
| `/api/subscribers` | GET | Alle Subscriber anzeigen (Admin) |

## Naechste Schritte fuer den Live-Betrieb

### 1. Datenbank anbinden
Aktuell werden Subscriber im RAM gespeichert. Fuer Produktion:
- SQLite (einfach, fuer den Anfang)
- PostgreSQL oder MongoDB (fuer mehr Traffic)
- Oder: Mailchimp / ConvertKit API fuer E-Mail-Verwaltung

### 2. Amazon Affiliate einrichten
1. Bei Amazon PartnerNet registrieren: https://partnernet.amazon.de
2. Affiliate-Tag erstellen (z.B. `rabattomio-21`)
3. PA-API Zugang beantragen
4. In `server.js` die PA-API Credentials eintragen

### 3. Deal-Finder automatisieren
Optionen:
- **Keepa API** - Preishistorie + Preisalarme fuer Amazon-Produkte
- **Idealo API** - Preisvergleich ueber viele Shops
- **Eigener Crawler** - Regelmaessig Preise pruefen

### 4. E-Mail-Versand
- **Nodemailer** + SMTP (z.B. Gmail, Mailgun)
- **SendGrid** / **Mailjet** fuer professionellen Versand
- **Mailchimp** fuer Marketing-Automation

### 5. Deployment
- **Railway.app** - Einfaches Node.js Hosting (gratis Tier)
- **Render.com** - Kostenlos fuer kleine Projekte
- **Vercel** oder **Netlify** - Mit Serverless Functions
- **Eigener VPS** (z.B. Hetzner) - Volle Kontrolle

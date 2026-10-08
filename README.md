# BusinessHandler – klickbarer Prototyp

Ein klickbarer, rein frontend-seitiger Prototyp für ein BusinessHandler-Cockpit mit
den drei wichtigsten Ansichten **Dashboard**, **Customers** und **Orders**. Alle
Daten stammen aus typisierten Mock-Modulen im Quellcode – es gibt kein Backend,
keine Datenbank und keinen Netzwerkverkehr außer dem initialen Laden der Seite.

## Tech-Stack

- **Sprache:** TypeScript (strict, ohne `any`)
- **Framework:** React + Vite
- **Styling:** reines CSS / CSS Modules auf Basis der Design-Tokens in `src/styles/tokens.css`
- **State:** lokaler React-State über den `FilterProvider` in `src/state/FilterContext.tsx`
- **Daten:** statische, typisierte Mock-Module in `src/data/`
- **Tests:** Vitest + React Testing Library (jsdom)
- **Diagramme:** Recharts

## Installation

Voraussetzung: Node.js 20.19+ (oder 22.12+) und npm.

```bash
npm ci
```

## Starten (Entwicklung)

```bash
npm run dev
```

Öffnet den Vite-Entwicklungsserver; die App ist standardmäßig unter
`http://localhost:5173` erreichbar.

## Build für Produktion

```bash
npm run build
```

Ergebnis liegt in `dist/`. Zum lokalen Prüfen des Builds:

```bash
npm run preview
```

## Tests

```bash
npm test
```

## Verwendung

Die App startet mit dem Dashboard. Über die dauerhaft sichtbare Navigation in der
linken Leiste (auf kleinen Bildschirmen als obere Leiste) sind drei Bereiche
erreichbar; der aktive Bereich wird farblich und mit `aria-current` markiert.

- **Dashboard** (`/`): KPI-Karten, ein Umsatzverlauf der letzten zwölf Monate und
  eine Liste der letzten Aktivitäten.
- **Customers** (`/customers`): Liste aller Kunden mit Live-Suche, Statusfilter und
  sortierbaren Spalten. Ein Klick auf eine Zeile öffnet die Detailansicht; „Zurück
  zur Liste“ stellt Suche und Filter unverändert wieder her.
- **Customers – Detail** (`/customers/:customerId`): Kontaktdaten, Umsatz und
  Auftragshistorie des gewählten Kunden.
- **Orders** (`/orders`): Liste aller Aufträge mit Status-Badges, Statusfilter und
  sortierbaren Spalten. Ein Klick auf eine Zeile öffnet die Detailansicht.
- **Orders – Detail** (`/orders/:orderId`): Positionen, Zwischensumme, Umsatzsteuer
  und Gesamtsumme des gewählten Auftrags.

Unbekannte Adressen sowie nicht existierende Kunden- oder Auftrags-IDs zeigen eine
freundliche Nicht-gefunden-Ansicht mit einem Link zurück zum Dashboard.

## Formatierung

- Beträge erscheinen überall als EUR in deutscher Schreibweise (`1.234,56 EUR`).
- Datumsangaben erscheinen überall als `dd.MM.yyyy`.
- Beide Formate liefern `src/lib/format.ts` (`formatCurrencyEUR`, `formatDateDE`).

## Feature-Liste

- Persistente Navigation zu Dashboard, Customers und Orders (aktueller Bereich markiert)
- Dashboard mit KPI-Karten, Umsatzdiagramm und Aktivitätenliste
- Kundenliste mit Live-Suche, Statusfilter und sortierbaren Spalten
- Kundendetail mit Kontaktdaten, Umsatz und Auftragshistorie
- Auftragsliste mit Status-Badges, Statusfilter und sortierbaren Spalten
- Auftragsdetail mit Positionen, Zwischensumme, USt. und Gesamtsumme
- Freundliche Nicht-gefunden-Ansicht für unbekannte Routen und IDs
- Einheitliche Formatierung (EUR deutsch, Datum `dd.MM.yyyy`)
- Alle Daten aus lokalen Mock-Modulen, kein Netzwerkverkehr

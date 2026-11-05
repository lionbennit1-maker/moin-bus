# Moin Bus 🚌☔

Dein Bus- und Wetter-Assistent fürs Handy. Zeigt Abfahrten an deiner Haltestelle, Verbindungen zu deinen Zielen, Ausfälle und Verspätungen, Regen auf die Viertelstunde genau, was du anziehen sollst, und einen Spruch des Tages.

Alles kostenlos, kein Login, keine Werbung.

## Wege-Tab 🧭

Oben wählst du, wo du gerade bist: 🏠 Zuhause, 💛 Lulu, 📚 Nachhilfe oder 📍 Hier (GPS). Wenn du der App den Standort erlaubt hast, erkennt sie das automatisch. Darunter stehen die passenden Wege:

- **Zu Lulu** → Marienstraße in Kellinghusen
- **Zur Nachhilfe** → Krichauffstraße *oder* Mühlenweg in Itzehoe, je nachdem, wo du schneller bist
- **Nach Hamburg** → Hbf. Von zuhause vergleicht die App über Elmshorn (6550 → RE7) mit über Itzehoe (RE6 → S7) und sagt dir, was schneller ist. Von Lulu aus rechnet sie zusätzlich ab Bahnhof Wrist (RE70, ca. 45 min).
- **Zu Opa** → Schulstraße in Hohenaspe (6550 bis Itzehoe, dann 6150, ca. 50 min)
- **Nach Hause** → inkl. 🌙 letzte Verbindung heute

**Linie 6193 über Schloss Breitenburg:** Für Lulu-Wege (hin und zurück) zeigt die App zusätzlich die 6193 ab/bis Haltestelle *Breitenburg Am Schloss* und rechnet aus, wann du mit 🚲 (Standard 10 min) oder zu Fuß (30 min) los musst bzw. zuhause bist. Weil die 6193 nicht in den offenen Daten ist, sind ihre Zeiten vom hvv-Haltestellenaushang fest eingetragen (Mo–Fr, gültig bis 12.12.2026). Nach dem Fahrplanwechsel am 13.12. zeigt die App eine Warnung; dann unter **Mehr → Linie 6193** die neuen Zeiten eintragen (auf hvv.de → Fahrpläne → Haltestellenaushang).

Außerdem: **Los um** / **Da sein bis** (z. B. „Ich muss um 16 Uhr bei der Nachhilfe sein“), **Details** mit allen Umstiegen, **📤 Ankunft teilen** (schickt „Bin um 17:42 da 🚌“ per WhatsApp & Co.) und **In Google Maps gegenchecken**.

⚠️ Die Buslinien Kellinghusen ↔ Itzehoe/Wrist (619x) fehlen in den offenen Fahrplandaten. Bei allem rund um Lulu deshalb den Google-Maps-Knopf benutzen.

## Alltag-Tab 📒

- **🆘 Notfall:** 112, 110, ärztlicher Bereitschaftsdienst 116 117, Giftnotruf Nord, Karten-Sperrnotruf 116 116, Nummer gegen Kummer. Antippen = anrufen.
- **📇 Kontakte:** Ärzte, Familie, Freunde, Schule, Arbeit. Mit Anrufen, WhatsApp, Mail und Notiz (z. B. Sprechzeiten). Mit Suche.
- **📅 Termine:** mit Erinnerung und **„Wie komm ich hin?“**. Liegt der Termin bei Nachhilfe, Lulu, Opa oder in Hamburg, springt die App in den Wege-Tab und rechnet aus, wann du spätestens los musst (5 min Puffer). Bei anderen Adressen geht Google Maps auf.
- **✅ To-dos** zum Abhaken.
- **🎂 Geburtstage** mit Countdown und Hinweis am Vortag.
- **„Heute“-Box** oben mit allem, was heute ansteht.
- **💾 Backup:** speichert alles als Datei und lädt es wieder (z. B. bei neuem Handy).

🔒 Kontakte, Termine & Co. werden **nur im Browser auf deinem Handy** gespeichert, nicht auf GitHub. Dein Repo ist öffentlich, deshalb bitte **keine** Telefonnummern oder Mails in die Dateien selbst schreiben. Und ab und zu ein Backup machen, falls der Browser mal aufräumt.

## Was drin ist

| Ordner/Datei | Was es macht |
|---|---|
| `index.html` | Die App selbst |
| `manifest.json`, `sw.js`, `icon-*.png` | Damit du sie wie eine echte App auf den Startbildschirm legen kannst |
| `wachhund/check.mjs` | Der Wachhund: checkt alle 15 min deine Busse und den Regen und schickt dir Push-Nachrichten |
| `wachhund/config.json` | Deine Haltestelle, deine Ziele, Ruhezeit (22–6 Uhr) und wann der Morgen-Brief kommt |
| `.github/workflows/wachhund.yml` | Sagt GitHub, dass der Wachhund alle 15 min laufen soll |

## Einrichten (ca. 15 Minuten)

### 1. App online stellen (GitHub Pages)

1. Auf [github.com](https://github.com) ein kostenloses Konto anlegen, falls du keins hast.
2. Oben rechts **+ → New repository**. Name: `moin-bus`. Auf **Public** lassen, **Create repository**.
3. Auf **uploading an existing file** klicken und den **kompletten Inhalt** des entpackten Ordners reinziehen (auch den Ordner `.github`, der ist manchmal versteckt: am Mac mit `Cmd + Shift + .` einblenden, unter Windows im Explorer „Ausgeblendete Elemente“ anhaken). **Commit changes**.
4. Im Repo: **Settings → Pages → Branch: main → / (root) → Save**.
5. Nach 1–2 Minuten läuft die App unter `https://DEINNAME.github.io/moin-bus/`.

### 2. Aufs Handy holen

- **Android (Chrome):** Link öffnen → Menü ⋮ → **App installieren** / **Zum Startbildschirm**.
- **iPhone (Safari):** Link öffnen → Teilen-Knopf → **Zum Home-Bildschirm**.

In der App unter **Mehr** deine Haltestelle wählen (Standard: Lägerdorf Schule) und unter **Ziele** mit „+ Ziel“ alles hinzufügen, wo du oft hinfährst.

### 3. Push-Nachrichten, auch wenn die App zu ist

1. Die App **ntfy** installieren (gratis, im Play Store bzw. App Store nach „ntfy“ suchen, Infos auf [ntfy.sh](https://ntfy.sh)).
2. In Moin Bus unter **Mehr** steht dein geheimer Kanal, z. B. `moinbus-a1b2c3d4e5f6`. Kopieren.
3. In ntfy auf **+** und genau diesen Namen als Thema eintragen. Server: `ntfy.sh` lassen.
4. Im GitHub-Repo: **Settings → Secrets and variables → Actions → New repository secret**.
   Name: `NTFY_TOPIC`, Wert: dein Kanal. Speichern.
5. Im Repo oben auf **Actions** → falls gefragt „I understand…, enable them“ → links **Wachhund** → **Run workflow**. Läuft er grün durch, ist alles scharf.

Der Wachhund meldet sich dann bei:
- 🚫 **Ausfall** einer Verbindung zu deinen Zielen in den nächsten 2 Stunden
- 🐢 **Verspätung** ab 5 Minuten (in der nächsten Stunde)
- ⚠️ **Hinweisen** der Verkehrsbetriebe (Baustellen, Umleitungen), wenn welche gemeldet sind
- ☔ **Regen** in der nächsten Dreiviertelstunde
- ☕ **Morgen-Brief** um 6 Uhr: Wetter, Regen, nächster Bus zu jedem Ziel

Ruhezeit ist 22–6 Uhr. Ändern kannst du alles in `wachhund/config.json` (direkt auf GitHub mit dem Stift-Symbol).

### Ziele für den Wachhund ändern

Voreingestellt sind Nachhilfe, Opa, Hamburg Hbf und Itzehoe ZOB (jeweils ab deiner Haltestelle). Lulu ist absichtlich nicht drin, weil die Busse dahin in den Daten fehlen.

Der Wachhund liest seine Ziele aus `wachhund/config.json`, nicht aus der App. Ein Ziel geht entweder mit `"place": "Breite,Länge"` (Koordinaten, z. B. aus Google Maps per langem Tippen) oder mit einer Haltestellen-ID. Die ID findest du so: im Browser
`https://api.transitous.org/api/v1/geocode?text=Itzehoe%20Bahnhof&type=STOP`
öffnen und die `id` vom richtigen Treffer kopieren (sieht aus wie `de-DELFI_000010091802`).

## Gut zu wissen

- **Datenquellen:** Busse von [Transitous](https://transitous.org) (offene Fahrplandaten, Echtzeit wo die Verkehrsbetriebe sie liefern; bei vielen Bussen im Kreis Steinburg gibt's nur den Fahrplan), Wetter von [Open-Meteo](https://open-meteo.com) mit dem DWD-Modell ICON.
- **Ausfälle** kommen nur rein, wenn der Betreiber sie digital meldet. Im Zweifel die NAH.SH-App gegenchecken.
- **GitHub pausiert** zeitgesteuerte Abläufe nach 60 Tagen ohne Änderungen am Repo. Kriegst du dann eine Mail, einfach unter Actions wieder aktivieren.
- Benachrichtigungen direkt aus der App (ohne ntfy) gehen nur, solange sie offen ist. Dafür gibt's den Wachhund.

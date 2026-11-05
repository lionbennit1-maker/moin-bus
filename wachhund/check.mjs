// Moin Bus – Wachhund
// Läuft alle 15 Minuten auf GitHub Actions, checkt deine Ziele und das Wetter
// und schickt dir über ntfy eine Push-Nachricht, wenn was ist.
// Lokal testen:  NTFY_TOPIC=dein-kanal node wachhund/check.mjs
import { readFile, writeFile } from "node:fs/promises";

const API = "https://api.transitous.org/api";
const WX = "https://api.open-meteo.com/v1/forecast";
const TZ = "Europe/Berlin";
const TOPIC = process.env.NTFY_TOPIC;
const DRY = process.env.DRY_RUN === "1";
const STATE_FILE = new URL("./state.json", import.meta.url);
const cfg = JSON.parse(await readFile(new URL("./config.json", import.meta.url), "utf8"));

if (!TOPIC && !DRY) { console.error("NTFY_TOPIC fehlt (GitHub-Secret anlegen, siehe LIESMICH.md)"); process.exit(1); }

const fmt = d => new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
const mins = d => Math.round((new Date(d) - Date.now()) / 60000);
const delay = (a, s) => (a && s) ? Math.round((new Date(a) - new Date(s)) / 60000) : 0;
const hourBerlin = () => parseInt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: TZ }).format(new Date()), 10);
const todayBerlin = () => new Date().toLocaleDateString("sv-SE", { timeZone: TZ });

async function getJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": "moin-bus-wachhund" } });
  if (!r.ok) throw new Error(`${r.status} bei ${url}`);
  return r.json();
}

// Gemerkte Meldungen, damit nix doppelt kommt
let state = { sent: {} };
try { state = JSON.parse(await readFile(STATE_FILE, "utf8")); } catch {}
const cutoff = Date.now() - 36 * 3600e3;
for (const [k, t] of Object.entries(state.sent)) if (t < cutoff) delete state.sent[k];
let changed = false;

async function push(key, title, msg, { tags = "bus", priority = 3 } = {}) {
  if (state.sent[key]) return;
  console.log(`PUSH [${key}] ${title} – ${msg}`);
  if (!DRY) {
    // JSON-Variante, damit Umlaute und Emojis sauber ankommen
    const r = await fetch("https://ntfy.sh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: TOPIC, title, message: msg, tags: tags.split(","), priority, click: process.env.APP_URL || undefined })
    });
    if (!r.ok) throw new Error("ntfy " + r.status);
  }
  state.sent[key] = Date.now(); changed = true;
}

const h = hourBerlin();
const quiet = cfg.ruhezeit.von > cfg.ruhezeit.bis ? (h >= cfg.ruhezeit.von || h < cfg.ruhezeit.bis) : (h >= cfg.ruhezeit.von && h < cfg.ruhezeit.bis);
if (quiet && !process.env.FORCE) { console.log("Ruhezeit, Wachhund pennt."); process.exit(0); }

const lines = []; // für den Morgen-Brief

// 1) Busse zu deinen Zielen
for (const ziel of cfg.ziele) {
  try {
    const j = await getJSON(`${API}/v5/plan?fromPlace=${encodeURIComponent(cfg.heimat.id)}&toPlace=${encodeURIComponent(ziel.place || ziel.id)}&numItineraries=6`);
    const its = (j.itineraries || []).filter(i => mins(i.startTime) >= -2 && mins(i.startTime) <= cfg.ausfaelleVorausMinuten);
    for (const it of its) {
      const ride = it.legs.filter(l => l.mode !== "WALK");
      const first = ride[0]; if (!first) continue;
      const sched = first.scheduledStartTime || it.startTime;
      const key = `${ziel.name}|${sched}`;
      const line = first.routeShortName || first.displayName || "Bus";
      if (ride.some(l => l.cancelled)) {
        await push("cx:" + key, `Fällt aus: ${line} um ${fmt(sched)}`, `Deine Verbindung nach ${ziel.name} um ${fmt(sched)} fällt aus. Guck in der App nach der nächsten.`, { tags: "no_entry,bus", priority: 4 });
      } else {
        const d = Math.max(...ride.map(l => delay(l.startTime, l.scheduledStartTime)));
        if (d >= cfg.verspaetungAbMinuten && mins(it.startTime) <= 60)
          await push(`late${d >= 15 ? 15 : 5}:` + key, `+${d} min: ${line} nach ${ziel.name}`, `Statt ${fmt(sched)} jetzt ca. ${fmt(it.startTime)}. Chill noch kurz.`, { tags: "turtle,bus" });
      }
      for (const a of ride.flatMap(l => l.alerts || [])) {
        const txt = a.headerText || a.descriptionText; if (!txt) continue;
        await push("al:" + ziel.name + "|" + txt.slice(0, 60), `Hinweis: ${line}`, txt, { tags: "warning" });
      }
    }
    const next = its.find(i => !i.legs.some(l => l.cancelled));
    if (next) lines.push(`🚌 ${ziel.name}: ${fmt(next.startTime)} (${next.legs.filter(l => l.mode !== "WALK").map(l => l.routeShortName).join(" → ")})`);
  } catch (e) { console.warn("Fahrplan-Fehler", ziel.name, e.message); }
}

// 2) Regen
try {
  const w = await getJSON(`${WX}?latitude=${cfg.heimat.lat}&longitude=${cfg.heimat.lon}&timezone=${encodeURIComponent(TZ)}&minutely_15=precipitation&forecast_minutely_15=12&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&forecast_days=1&models=icon_seamless`);
  const toDate = local => { const g = new Date(local + ":00Z"); const s = g.toLocaleString("sv-SE", { timeZone: TZ }).replace(" ", "T") + "Z"; return new Date(g - (new Date(s) - g)); };
  const slots = w.minutely_15.time.map((t, i) => ({ t: toDate(t), p: w.minutely_15.precipitation[i] || 0 })).filter(s => s.t.getTime() + 15 * 60e3 > Date.now());
  const wasWet = (slots[0]?.p ?? 0) >= 0.1;
  const start = slots.find(s => s.p >= 0.1);
  if (start && !wasWet && mins(start.t) <= cfg.regenWarnungVorausMinuten) {
    const total = slots.reduce((a, s) => a + s.p, 0);
    await push("rain:" + start.t.toISOString().slice(0, 13), `Regen ab ca. ${fmt(start.t)} ☔`, `In ${cfg.heimat.name.split(" ")[0]} geht's gleich los${total > 3 ? ", und zwar ordentlich" : ""}. Jacke mit Kapuze!`, { tags: "umbrella" });
  }
  const c = w.current, d = w.daily;
  lines.unshift(`🌡️ Jetzt ${Math.round(c.temperature_2m)}° (gefühlt ${Math.round(c.apparent_temperature)}°), heute ${Math.round(d.temperature_2m_min[0])}–${Math.round(d.temperature_2m_max[0])}°, Regenrisiko ${d.precipitation_probability_max[0]}%`);
  if (start) lines.splice(1, 0, `☔ Regen ab ca. ${fmt(start.t)}`);
} catch (e) { console.warn("Wetter-Fehler", e.message); }

// 3) Morgen-Brief, einmal am Tag
if (h === cfg.morgenBriefUm && lines.length) {
  await push("brief:" + todayBerlin(), "Moin Lion ☕", lines.join("\n"), { tags: "sunrise", priority: 2 });
}

if (changed && !DRY) await writeFile(STATE_FILE, JSON.stringify(state, null, 1));
console.log(lines.join("\n") || "Nix Neues.");

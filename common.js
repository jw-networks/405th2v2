// common.js
export function qs(name, fallback = "") {
  const p = new URLSearchParams(location.search);
  return p.get(name) ?? fallback;
}

export function norm(s) {
  return (s ?? "").toString().trim();
}

export async function fetchJson(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${url}`);
  return await r.json();
}

export function buildOpenSheetUrl(sheetId, tabName) {
  // Requires the sheet to be published to the web.
  return `https://opensheet.elk.sh/${encodeURIComponent(sheetId)}/${encodeURIComponent(tabName)}`;
}

export async function resolveSlotAssignment({ sheetId, slot }) {
  const activeUrl = buildOpenSheetUrl(sheetId, "ActiveMatch");
  const playersUrl = buildOpenSheetUrl(sheetId, "Players");

  const [active, players] = await Promise.all([fetchJson(activeUrl), fetchJson(playersUrl)]);

  const row = active.find(r => norm(r.Slot) === norm(slot));
  const playerId = norm(row?.PlayerID);
  if (!playerId) return null;

  const p = players.find(x => norm(x.PlayerID) === playerId);
  if (!p) return null;

  return {
    playerId,
    name: norm(p.Name),
    team: norm(p.Team),
    camId: norm(p.CamID),
    gameId: norm(p.GameID),
  };
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "";
}

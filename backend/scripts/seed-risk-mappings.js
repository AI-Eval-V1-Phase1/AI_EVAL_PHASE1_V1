/**
 * Seed risk_mappings table from "Shared Enhanced Risk Database Jan 2026.xlsx".
 * All Excel data (risks sheet and mappings sheet) is stored in the risk_mappings table.
 *
 * Expected Excel structure (header row = column names, case-insensitive, spaces allowed):
 * - Risks sheet: risk_id, title, domain, description  -> stored with risk_* columns, mitigation_* null
 * - Mappings sheet: mapping_id, risk_id, mitigation_action_id, mitigation_action_name,
 *   mitigation_category, mitigation_definition  -> stored with mapping_id + mitigation_* columns
 *
 * Prerequisite: npm install xlsx pg (from backend). DATABASE_URL in .env.local.
 * Run from backend: node scripts/seed-risk-mappings.js
 * Ensure risk_mappings table exists (migration 0043) before running.
 *
 * Excel path: project root "Shared Enhanced Risk Database Jan 2026.xlsx"
 *             or set env RISK_EXCEL_PATH to full path.
 */

import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendDir = join(__dirname, "..");
const rootDir = join(backendDir, "..");

config({ path: join(backendDir, ".env.local") });
const connectionString = process.env.DATABASE_URL;

const excelFileName = "Shared Enhanced Risk Database Jan 2026.xlsx";
const possiblePaths = [
  process.env.RISK_EXCEL_PATH,
  join(rootDir, excelFileName),
  join(rootDir, "..", excelFileName),
  join(backendDir, excelFileName),
  join(process.cwd(), excelFileName),
].filter(Boolean);
const excelPath = possiblePaths.find(existsSync);
if (!excelPath) {
  console.error("Excel file not found. Tried:", possiblePaths.join(", "));
  console.error("Place the file in project root or set RISK_EXCEL_PATH.");
  process.exit(1);
}
console.log("Using Excel:", excelPath);

let connStr = connectionString;
if (!connStr) {
  const user = process.env.DATABASE_USER ?? "postgres";
  const password = process.env.DATABASE_PASSWORD ?? "Postgresql123";
  const host = process.env.DATABASE_HOST ?? "localhost";
  const port = process.env.DATABASE_PORT ?? "5432";
  const database = process.env.DATABASE_NAME ?? "ai_eval_db";
  connStr = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

let XLSX;
try {
  XLSX = (await import("xlsx")).default;
} catch {
  console.error("From backend run: npm install xlsx --save-dev");
  process.exit(1);
}

const client = new pg.Client({ connectionString: connStr });

/** Normalize header for matching: lowercase, trim, replace spaces with underscores */
function norm(s) {
  if (s == null || typeof s !== "string") return "";
  return s.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Get column index by possible header names (exact or without underscores) */
function colIndex(headers, ...names) {
  const normalized = headers.map((h, i) => ({ i, n: norm(h) }));
  for (const name of names) {
    const n = norm(name);
    const found = normalized.find((x) => x.n === n || x.n.replace(/_/g, "") === n.replace(/_/g, ""));
    if (found) return found.i;
  }
  return -1;
}

/** Get column index by header containing all of the given substrings (e.g. "risk" + "id" -> risk_id) */
function colIndexContains(headers, ...substrings) {
  for (let i = 0; i < headers.length; i++) {
    const n = norm(headers[i]);
    if (!n) continue;
    if (substrings.every((s) => n.includes(norm(s)))) return i;
  }
  return -1;
}

/** Read cell value as string or number */
function val(row, index, defaultVal = null) {
  if (index < 0 || !row || index >= row.length) return defaultVal;
  const c = row[index];
  if (c === null || c === undefined || c === "") return defaultVal;
  if (typeof c === "number" && !Number.isNaN(c)) return c;
  return String(c).trim() || defaultVal;
}

async function run() {
  try {
    const wb = XLSX.readFile(excelPath);
    await client.connect();
    console.log("Sheets:", wb.SheetNames.join(", "));

    let rowsInserted = 0;

    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      if (!rows.length) {
        console.log(sheetName, ": empty, skipped");
        continue;
      }

      const headers = rows[0].map((h) => (h != null ? String(h) : ""));
      const dataRows = rows.slice(1).filter((r) => Array.isArray(r) && r.some((c) => c !== "" && c != null));

      // Detect risks sheet: has risk_id and title; prefer when sheet is not mainly mappings
      let riskIdCol = colIndex(headers, "risk_id", "Risk ID", "risk id");
      if (riskIdCol < 0) riskIdCol = colIndexContains(headers, "risk", "id");
      let titleCol = colIndex(headers, "title", "Title");
      if (titleCol < 0) titleCol = colIndexContains(headers, "title");
      const domainCol = colIndex(headers, "domain", "Domain") >= 0 ? colIndex(headers, "domain", "Domain") : colIndexContains(headers, "domain");
      const descCol = colIndex(headers, "description", "Description") >= 0 ? colIndex(headers, "description", "Description") : colIndexContains(headers, "description");

      const hasMappingCols = colIndex(headers, "mapping_id", "Mapping ID") >= 0 || colIndexContains(headers, "mapping", "id") >= 0;
      const looksLikeRisks = riskIdCol >= 0 && titleCol >= 0 && !hasMappingCols;
      if (looksLikeRisks) {
        for (const row of dataRows) {
          const risk_id = val(row, riskIdCol, "");
          const risk_title = val(row, titleCol, "");
          if (!risk_id || !risk_title) continue;
          const risk_domain = val(row, domainCol, null);
          const risk_description = val(row, descCol, null);
          await client.query(
            `INSERT INTO risk_mappings (
               risk_id, risk_title, risk_domain, risk_description
             ) VALUES ($1, $2, $3, $4)`,
            [
              String(risk_id).slice(0, 50),
              String(risk_title).slice(0, 500),
              risk_domain != null ? String(risk_domain).slice(0, 100) : null,
              risk_description,
            ]
          );
          rowsInserted++;
        }
        console.log(sheetName, ": inserted", dataRows.filter((r) => val(r, riskIdCol) && val(r, titleCol)).length, "rows into risk_mappings");
        continue;
      }

      // Detect mappings sheet: mapping_id, risk_id, and at least one mitigation column
      let mappingIdCol = colIndex(headers, "mapping_id", "Mapping ID", "mapping id");
      if (mappingIdCol < 0) mappingIdCol = colIndexContains(headers, "mapping", "id");
      let mapRiskIdCol = colIndex(headers, "risk_id", "Risk ID", "risk id");
      if (mapRiskIdCol < 0) mapRiskIdCol = colIndexContains(headers, "risk", "id");
      let actionIdCol = colIndex(headers, "mitigation_action_id", "Mitigation Action ID", "mitigation action id");
      if (actionIdCol < 0) actionIdCol = colIndexContains(headers, "mitigation", "action", "id");
      let actionNameCol = colIndex(headers, "mitigation_action_name", "Mitigation Action Name", "mitigation action name");
      if (actionNameCol < 0) actionNameCol = colIndexContains(headers, "mitigation", "action", "name");
      if (actionNameCol < 0) actionNameCol = colIndexContains(headers, "mitigation", "name");
      const categoryCol = colIndex(headers, "mitigation_category", "Mitigation Category", "mitigation category") >= 0 ? colIndex(headers, "mitigation_category", "Mitigation Category", "mitigation category") : colIndexContains(headers, "mitigation", "category");
      const definitionCol = colIndex(headers, "mitigation_definition", "Mitigation Definition", "mitigation definition") >= 0 ? colIndex(headers, "mitigation_definition", "Mitigation Definition", "mitigation definition") : colIndexContains(headers, "mitigation", "definition");

      const hasMapping =
        mappingIdCol >= 0 &&
        mapRiskIdCol >= 0 &&
        (actionIdCol >= 0 || actionNameCol >= 0);

      if (hasMapping) {
        let mappingCount = 0;
        for (const row of dataRows) {
          const mapping_id = val(row, mappingIdCol, null);
          const risk_id = val(row, mapRiskIdCol, "");
          const mitigation_action_id = val(row, actionIdCol, val(row, actionNameCol, "") || "unknown");
          const mitigation_action_name = val(row, actionNameCol, val(row, actionIdCol, "") || "Unnamed");
          const mitigation_category = categoryCol >= 0 ? val(row, categoryCol, "General") : "General";
          const mitigation_definition = definitionCol >= 0 ? val(row, definitionCol, null) : null;

          if (mapping_id === null || mapping_id === "" || risk_id === "") continue;
          const mid = Number(mapping_id);
          if (Number.isNaN(mid)) continue;

          await client.query(
            `INSERT INTO risk_mappings (
               mapping_id, risk_id, mitigation_action_id, mitigation_action_name,
               mitigation_category, mitigation_definition
             ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              mid,
              String(risk_id).slice(0, 50),
              String(mitigation_action_id).slice(0, 100),
              String(mitigation_action_name).slice(0, 500),
              String(mitigation_category).slice(0, 200),
              mitigation_definition,
            ]
          );
          rowsInserted++;
          mappingCount++;
        }
        console.log(sheetName, ": inserted", mappingCount, "mapping rows into risk_mappings");
        // Same sheet may have risk-only rows (no mapping_id); insert them as risk rows
        if (riskIdCol >= 0 && titleCol >= 0) {
          let riskCount = 0;
          for (const row of dataRows) {
            const mapping_id = val(row, mappingIdCol, null);
            if (mapping_id != null && mapping_id !== "") continue;
            const risk_id = val(row, riskIdCol, "");
            const risk_title = val(row, titleCol, "");
            if (!risk_id || !risk_title) continue;
            const risk_domain = domainCol >= 0 ? val(row, domainCol, null) : null;
            const risk_description = descCol >= 0 ? val(row, descCol, null) : null;
            await client.query(
              `INSERT INTO risk_mappings (risk_id, risk_title, risk_domain, risk_description) VALUES ($1, $2, $3, $4)`,
              [
                String(risk_id).slice(0, 50),
                String(risk_title).slice(0, 500),
                risk_domain != null ? String(risk_domain).slice(0, 100) : null,
                risk_description,
              ]
            );
            rowsInserted++;
            riskCount++;
          }
          if (riskCount > 0) console.log(sheetName, ": inserted", riskCount, "risk-only rows into risk_mappings");
        }
      } else {
        console.log(sheetName, ": skipped (no matching columns). Headers:", headers.slice(0, 15).join(" | "));
      }
    }

    console.log("Done. Total rows inserted into risk_mappings:", rowsInserted);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

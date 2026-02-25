const fs = require('fs-extra');
const path = require('path');
const Papa = require('papaparse');
const config = require('./config');

/**
 * Read and parse a CSV file with headers.
 * @param {string} filePath - absolute path to CSV
 * @returns {Promise<{data: object[], fields: string[]}>}
 */
async function readCSV(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });

  if (result.errors.length > 0) {
    console.warn('CSV parse warnings:', result.errors);
  }

  return { data: result.data, fields: result.meta.fields };
}

/**
 * Write data back to CSV, validating minimum row count.
 * @param {string} filePath - absolute path to CSV
 * @param {object[]} data - array of row objects
 * @param {string[]} columns - column names in order
 */
async function writeCSV(filePath, data, columns) {
  if (data.length < config.MIN_ROW_COUNT) {
    throw new Error(`Safety check failed: only ${data.length} rows (minimum ${config.MIN_ROW_COUNT}). Refusing to overwrite CSV.`);
  }

  const csv = Papa.unparse(data, { columns });
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, csv + '\n', 'utf-8');
}

/**
 * Generate a timestamped report file path.
 * @param {string} prefix - e.g. "perk-health" or "discovery"
 * @returns {string} path like reports/perk-health-2026-02-26.json
 */
function generateReportPath(prefix) {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(config.REPORTS_DIR, `${prefix}-${date}.json`);
}

/**
 * Case-insensitive bidirectional includes check.
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
function fuzzyMatch(str1, str2) {
  const a = str1.toLowerCase().trim();
  const b = str2.toLowerCase().trim();
  return a.includes(b) || b.includes(a);
}

module.exports = { readCSV, writeCSV, generateReportPath, fuzzyMatch };

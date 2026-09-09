// ============================================================
// BALMANDAISA — Confidential Google Sheets Availability API Route
// Production-Ready for Vercel Serverless Deployment
// ============================================================

import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { SHEET_CONFIG } from '@/config/project';
import { Unit, normalizeStatus } from '@/types';
import { SEED_STOCK } from '@/data/seed-stock';

// Force dynamic execution for API route
export const dynamic = 'force-dynamic';

// Server-side memory cache with 2-second TTL for near-instant responsiveness
let cachedData: { units: Record<string, Unit>; timestamp: number } | null = null;
const CACHE_TTL = 2_000;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceFresh = url.searchParams.has('fresh') || url.searchParams.has('t');

    // Return cache only if fresh and not explicitly bypassed
    if (!forceFresh && cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json({
        status: 'ok',
        data: cachedData.units,
        cached: true,
        timestamp: cachedData.timestamp,
      }, { headers: NO_CACHE_HEADERS });
    }

    const units = await fetchFromSecureSource();
    if (Object.keys(units).length > 0) {
      cachedData = { units, timestamp: Date.now() };
    }

    return NextResponse.json({
      status: 'ok',
      data: units && Object.keys(units).length > 0 ? units : (cachedData?.units || SEED_STOCK),
      cached: false,
      timestamp: Date.now(),
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Availability fetch fallback triggered:', (error as Error)?.message || error);

    // If cache exists, return it even if stale
    if (cachedData) {
      return NextResponse.json({
        status: 'ok',
        data: cachedData.units,
        cached: true,
        stale: true,
        timestamp: cachedData.timestamp,
      }, { headers: NO_CACHE_HEADERS });
    }

    // Fallback to embedded seed stock to guarantee 0 presentation disruption
    return NextResponse.json({
      status: 'ok',
      data: SEED_STOCK,
      fallback: true,
      timestamp: Date.now(),
    }, { headers: NO_CACHE_HEADERS });
  }
}

async function fetchFromSecureSource(): Promise<Record<string, Unit>> {
  const sheetId = process.env.GOOGLE_SHEET_ID || SHEET_CONFIG.sheetId;
  const sheetName = process.env.GOOGLE_SHEET_NAME || SHEET_CONFIG.tabName || 'Stock';

  let rows: string[][] = [];

  const DEFAULT_CLIENT_EMAIL = 'prod-416@adroit-nuance-501711-f5.iam.gserviceaccount.com';

  // METHOD 1: JSON Service Account Key (or raw private key) in GOOGLE_SERVICE_ACCOUNT_KEY / GOOGLE_SERVICE_ACCOUNT_JSON
  const rawKey = (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').trim();
  if (rawKey) {
    try {
      let credentials: { client_email?: string; private_key?: string } = {};

      // Check if it's wrapped in single quotes
      let cleanKey = rawKey;
      if ((cleanKey.startsWith("'") && cleanKey.endsWith("'")) || (cleanKey.startsWith('"') && cleanKey.endsWith('"') && cleanKey.includes('{'))) {
        cleanKey = cleanKey.slice(1, -1);
      }

      if (cleanKey.startsWith('{')) {
        credentials = JSON.parse(cleanKey);
      } else if (cleanKey.includes('BEGIN PRIVATE KEY')) {
        credentials = {
          private_key: cleanKey.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || DEFAULT_CLIENT_EMAIL,
        };
      }

      // Ensure client_email is populated
      if (!credentials.client_email) {
        credentials.client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || DEFAULT_CLIENT_EMAIL;
      }
      if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }

      if (credentials.client_email && credentials.private_key) {
        const auth = new GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const token = tokenResponse.token;
        if (token) {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            rows = json.values || [];
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:', (err as Error)?.message);
    }
  }

  // METHOD 2: Separate Client Email & Private Key in Environment Variables
  if (rows.length === 0) {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || DEFAULT_CLIENT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (privateKey) {
      try {
        const auth = new GoogleAuth({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const token = tokenResponse.token;
        if (token) {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            rows = json.values || [];
          }
        }
      } catch (err) {
        console.warn('Failed to auth via separate email/key env vars:', (err as Error)?.message);
      }
    }
  }

  // METHOD 3: Local JSON key file (for local development)
  if (rows.length === 0) {
    const localKeyPath = path.join(process.cwd(), 'service-account.json');
    if (fs.existsSync(localKeyPath)) {
      try {
        const auth = new GoogleAuth({
          keyFile: localKeyPath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const token = tokenResponse.token;
        if (token) {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            rows = json.values || [];
          }
        }
      } catch (err) {
        console.warn('Failed to auth via local service-account.json:', (err as Error)?.message);
      }
    }
  }

  // METHOD 4: Published CSV Fallback (if sheet is viewable)
  if (rows.length === 0) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const csv = await res.text();
        rows = parseCSV(csv);
      }
    } catch (err) {
      console.warn('CSV fallback failed:', (err as Error)?.message);
    }
  }

  if (rows.length < 2) {
    throw new Error('No valid rows retrieved from Google Sheets source');
  }

  return mapRowsToUnits(rows);
}

function mapRowsToUnits(rows: string[][]): Record<string, Unit> {
  const units: Record<string, Unit> = {};
  if (rows.length < 2) return units;

  const headerRow = rows[0].map(h => (h || '').trim().toUpperCase());
  const findCol = (predicate: (h: string) => boolean, defaultIdx: number) => {
    const idx = headerRow.findIndex(predicate);
    return idx !== -1 ? idx : defaultIdx;
  };

  const cols = {
    sno: findCol(h => h.includes('S.NO') || h === 'SNO', SHEET_CONFIG.columns.sno),
    unitNo: findCol(h => h.includes('UNIT'), SHEET_CONFIG.columns.unitNo),
    facing: findCol(h => h.includes('FACING'), SHEET_CONFIG.columns.facing),
    type: findCol(h => h.includes('TYPE'), SHEET_CONFIG.columns.type),
    saleableArea: findCol(h => h.includes('SALEABLE') || h.includes('AREA'), SHEET_CONFIG.columns.saleableArea),
    uds: findCol(h => h.includes('UDS'), SHEET_CONFIG.columns.uds),
    terrace: findCol(h => h.includes('TERRACE'), SHEET_CONFIG.columns.terrace),
    carpark: findCol(h => h.includes('CAR'), SHEET_CONFIG.columns.carpark),
    totalCost: findCol(h => h.includes('TOTAL') || h.includes('COST'), SHEET_CONFIG.columns.totalCost),
    availability: findCol(h => h.includes('AVAIL'), SHEET_CONFIG.columns.availability),
  };

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[cols.unitNo]) continue;

    const unitNo = String(row[cols.unitNo]).trim();
    if (!unitNo || unitNo.length < 3) continue;

    // Strict validation of floor number
    const floor = unitNo.length <= 3
      ? parseInt(unitNo.charAt(0), 10)
      : parseInt(unitNo.substring(0, unitNo.length - 2), 10);

    if (isNaN(floor) || floor < 1 || floor > 13) continue;

    const builtup = parseFloat(String(row[cols.saleableArea] || '0').replace(/[^\d.]/g, '')) || 0;
    const totalCost = parseFloat(String(row[cols.totalCost] || '0').replace(/[^\d.]/g, '')) || 0;

    units[unitNo] = {
      id: unitNo,
      floor,
      facing: String(row[cols.facing] || '').trim().toUpperCase(),
      type: String(row[cols.type] || '').trim(),
      sizeLabel: String(row[cols.saleableArea] || '').trim(),
      builtup,
      totalCost,
      status: normalizeStatus(String(row[cols.availability] || '')),
      uds: parseFloat(String(row[cols.uds] || '0').replace(/[^\d.]/g, '')) || undefined,
      terrace: parseFloat(String(row[cols.terrace] || '0').replace(/[^\d.]/g, '')) || undefined,
      carpark: String(row[cols.carpark] || '').trim() || undefined,
      isDuplex: String(row[cols.type] || '').toUpperCase().includes('DUPLEX'),
    };
  }

  return units;
}

function parseCSV(csv: string): string[][] {
  const lines = csv.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

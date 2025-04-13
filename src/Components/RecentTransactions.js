import AWS from "aws-sdk";
import { awsConfig } from "./aws-config"; // << Import the credentials

/* ---------- Helpers ---------- */

// Correct parser for positive/negative amounts
function parseAmount(raw) {
  if (raw == null) return 0;

  let str = String(raw).trim();
  let isCredit = false;

  if (str.startsWith("(") && str.endsWith(")")) {
    str = str.slice(1, -1);
    isCredit = true;
  }

  if (str.toUpperCase().endsWith("CR")) {
    str = str.slice(0, -2);
    isCredit = true;
  }

  const negative = str.includes("-");

  str = str.replace(/[$,()\-\s]/g, "");

  const value = parseFloat(str);
  if (isNaN(value)) return 0;

  if (isCredit) return value;
  return negative ? -value : value;
}

function parseTransactionDate(raw) {
  if (!raw) return new Date(0);

  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (isoPattern.test(raw.trim())) {
    const parsed = new Date(raw.trim());
    return isNaN(parsed) ? new Date(0) : parsed;
  }

  const currentYear = new Date().getFullYear();
  const guess = new Date(`${raw.trim()} ${currentYear}`);
  return isNaN(guess) ? new Date(0) : guess;
}

function normalizeTransaction(item) {
  const cleanedName = item.TransactionName
    ? item.TransactionName
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/[^a-zA-Z0-9\s]/g, "")
    : "Unknown";

  const parsedAmount = parseAmount(item.TransactionAmount);
  const parsedBalance = item.RunningBalance != null ? parseAmount(item.RunningBalance) : null;
  const parsedDate = parseTransactionDate(item.Transaction_Date);

  return {
    TransactionID: item.TransactionID || null,
    TransactionName: cleanedName,
    TransactionAmount: parsedAmount,
    RunningBalance: parsedBalance,
    TransactionCategory: item.TransactionCategory || "Unknown",
    TransactionDate: parsedDate,
  };
}

/* ---------- Main Fetch Function ---------- */

export async function fetchRecentTransactions() {
  AWS.config.update(awsConfig); // << Use imported config

  const docClient = new AWS.DynamoDB.DocumentClient();

  try {
    const data = await docClient.scan({ TableName: "DiscoverTransaction" }).promise();
    const items = (data.Items || []).map(normalizeTransaction);

    items.sort((a, b) => b.TransactionDate - a.TransactionDate);

    return items;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
}

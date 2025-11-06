// db.js
import * as SQLite from "expo-sqlite";

// Open or create database
export const openDB = async () => {
  try {
    return await SQLite.openDatabaseAsync("invoice.db");
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
};

// Initialize the table
export const initDB = async () => {
  try {
    const db = await openDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoiceType TEXT,
        date TEXT,
        invoiceNumber TEXT,
        shopName TEXT,
        customerName TEXT,
        mobile TEXT,
        total TEXT,
        invoiceData TEXT
      );
    `);
    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Save new invoice
export const saveInvoice = async (invoiceData) => {
  try {
    const db = await openDB();

    // Extract data from invoiceData
    const {
      invoiceType,
      date,
      invoiceNumber,
      customer,
      totals,
    } = invoiceData;

    const shopName = "Anu Crackers";
    const customerName = customer?.name || "";
    const mobile = customer?.phone || "";
    const total = totals?.grandTotal?.toString() || "0";

    // Convert date to string if it's a Date object
    const dateString = date instanceof Date ? date.toISOString() : date;

    console.log("Saving invoice:", {
      invoiceType,
      date: dateString,
      invoiceNumber,
      customerName,
      mobile,
      total
    });

    // Store full JSON string in invoiceData
    const result = await db.runAsync(
      `INSERT INTO invoices 
        (invoiceType, date, invoiceNumber, shopName, customerName, mobile, total, invoiceData)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        invoiceType,
        dateString,
        invoiceNumber,
        shopName,
        customerName,
        mobile,
        total,
        JSON.stringify(invoiceData),
      ]
    );

    console.log("Invoice saved successfully with ID:", result.lastInsertRowId);
    return result;
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
};

// Get all invoices
export const getInvoices = async () => {
  try {
    const db = await openDB();
    const rows = await db.getAllAsync("SELECT * FROM invoices ORDER BY id DESC;");
    
    const invoices = rows.map((row) => {
      try {
        return {
          ...row,
          invoiceData: row.invoiceData ? JSON.parse(row.invoiceData) : null,
        };
      } catch (parseError) {
        console.error("Error parsing invoiceData for row:", row.id, parseError);
        return {
          ...row,
          invoiceData: null,
        };
      }
    });

    console.log(`Retrieved ${invoices.length} invoices`);
    return invoices;
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw error;
  }
};

// Get single invoice by ID
export const getInvoiceById = async (id) => {
  try {
    const db = await openDB();
    const row = await db.getFirstAsync("SELECT * FROM invoices WHERE id = ?;", [id]);
    
    if (row) {
      return {
        ...row,
        invoiceData: row.invoiceData ? JSON.parse(row.invoiceData) : null,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting invoice by ID:", error);
    throw error;
  }
};

// Delete invoice
export const deleteInvoice = async (id) => {
  try {
    const db = await openDB();
    const result = await db.runAsync("DELETE FROM invoices WHERE id = ?;", [id]);
    console.log("Invoice deleted:", id);
    return result;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  try {
    const db = await openDB();

    const {
      invoiceType,
      date,
      invoiceNumber,
      customer,
      totals,
    } = invoiceData;

    const customerName = customer?.name || "";
    const mobile = customer?.phone || "";
    const total = totals?.grandTotal?.toString() || "0";
    const dateString = date instanceof Date ? date.toISOString() : date;

    const result = await db.runAsync(
      `UPDATE invoices 
       SET invoiceType = ?, date = ?, invoiceNumber = ?, customerName = ?, mobile = ?, total = ?, invoiceData = ?
       WHERE id = ?;`,
      [
        invoiceType,
        dateString,
        invoiceNumber,
        customerName,
        mobile,
        total,
        JSON.stringify(invoiceData),
        id
      ]
    );

    console.log("Invoice updated:", id);
    return result;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// Get invoice count
export const getInvoiceCount = async () => {
  try {
    const db = await openDB();
    const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM invoices;");
    return result?.count || 0;
  } catch (error) {
    console.error("Error getting invoice count:", error);
    throw error;
  }
};

// Clear all invoices (for testing/reset)
export const clearAllInvoices = async () => {
  try {
    const db = await openDB();
    await db.execAsync("DELETE FROM invoices;");
    console.log("All invoices cleared");
  } catch (error) {
    console.error("Error clearing invoices:", error);
    throw error;
  }
};
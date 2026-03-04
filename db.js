const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'orders.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    sand_type TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    delivery_date TEXT,
    comment TEXT
  )
`);

const insertOrderStmt = db.prepare(`
  INSERT INTO orders (
    created_at,
    customer_name,
    phone,
    email,
    address,
    sand_type,
    quantity,
    unit,
    delivery_date,
    comment
  ) VALUES (
    @created_at,
    @customer_name,
    @phone,
    @email,
    @address,
    @sand_type,
    @quantity,
    @unit,
    @delivery_date,
    @comment
  )
`);

const selectAllOrdersStmt = db.prepare(`
  SELECT
    id,
    created_at AS createdAt,
    customer_name AS customerName,
    phone,
    email,
    address,
    sand_type AS sandType,
    quantity,
    unit,
    delivery_date AS deliveryDate,
    comment
  FROM orders
  ORDER BY created_at DESC, id DESC
`);

function createOrder(payload) {
  const now = new Date().toISOString();

  const result = insertOrderStmt.run({
    created_at: now,
    customer_name: payload.customerName,
    phone: payload.phone,
    email: payload.email || null,
    address: payload.address,
    sand_type: payload.sandType,
    quantity: Number(payload.quantity),
    unit: payload.unit,
    delivery_date: payload.deliveryDate || null,
    comment: payload.comment || null,
  });

  return {
    id: result.lastInsertRowid,
    createdAt: now,
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email || null,
    address: payload.address,
    sandType: payload.sandType,
    quantity: Number(payload.quantity),
    unit: payload.unit,
    deliveryDate: payload.deliveryDate || null,
    comment: payload.comment || null,
  };
}

function getAllOrders() {
  return selectAllOrdersStmt.all();
}

module.exports = {
  createOrder,
  getAllOrders,
};


const { Pool } = require('pg');

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  // Не падаем сразу, но логируем, чтобы было видно проблему в Railway/локально
  // eslint-disable-next-line no-console
  console.error('SUPABASE_DB_URL не задан. Настройте переменную окружения.');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createOrder(payload) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      INSERT INTO orders (
        customer_name,
        phone,
        email,
        address,
        sand_type,
        quantity,
        unit,
        delivery_date,
        comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        created_at AS "createdAt",
        customer_name AS "customerName",
        phone,
        email,
        address,
        sand_type AS "sandType",
        quantity,
        unit,
        delivery_date AS "deliveryDate",
        comment
      `,
      [
        payload.customerName,
        payload.phone,
        payload.email || null,
        payload.address,
        payload.sandType,
        Number(payload.quantity),
        payload.unit,
        payload.deliveryDate || null,
        payload.comment || null,
      ],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function getAllOrders() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT
        id,
        created_at AS "createdAt",
        customer_name AS "customerName",
        phone,
        email,
        address,
        sand_type AS "sandType",
        quantity,
        unit,
        delivery_date AS "deliveryDate",
        comment
      FROM orders
      ORDER BY created_at DESC, id DESC
      `,
    );
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  getAllOrders,
};


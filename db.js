const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // eslint-disable-next-line no-console
  console.error('SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы. Настройте переменные окружения.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

async function createOrder(payload) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: payload.customerName,
      phone: payload.phone,
      email: payload.email || null,
      address: payload.address,
      sand_type: payload.sandType,
      quantity: Number(payload.quantity),
      unit: payload.unit,
      delivery_date: payload.deliveryDate || null,
      comment: payload.comment || null,
    })
    .select(
      `
      id,
      created_at as "createdAt",
      customer_name as "customerName",
      phone,
      email,
      address,
      sand_type as "sandType",
      quantity,
      unit,
      delivery_date as "deliveryDate",
      comment
    `,
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      created_at as "createdAt",
      customer_name as "customerName",
      phone,
      email,
      address,
      sand_type as "sandType",
      quantity,
      unit,
      delivery_date as "deliveryDate",
      comment
    `,
    )
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

module.exports = {
  createOrder,
  getAllOrders,
};


const express = require('express');
const cors = require('cors');
const path = require('path');
const { createOrder, getAllOrders } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/orders', (req, res) => {
  const {
    customerName,
    phone,
    email,
    address,
    sandType,
    quantity,
    unit,
    deliveryDate,
    comment,
  } = req.body;

  if (!customerName || !phone || !address || !sandType || !quantity || !unit) {
    return res.status(400).json({ message: 'Заполните все обязательные поля.' });
  }

  try {
    const order = createOrder({
      customerName,
      phone,
      email,
      address,
      sandType,
      quantity,
      unit,
      deliveryDate,
      comment,
    });

    console.log('Новая заявка на песок (SQLite):', order);

    return res.status(201).json({
      message: 'Заявка успешно отправлена!',
      orderId: order.id,
    });
  } catch (error) {
    console.error('Ошибка при сохранении заявки в БД:', error);
    return res.status(500).json({ message: 'Ошибка сервера при сохранении заявки.' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заявок из БД:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении заявок.' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

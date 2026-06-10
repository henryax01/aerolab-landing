const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const stripe = require('stripe');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// ===== STRIPE & EMAIL CONFIG =====
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  }
});

// Función para enviar emails
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log(`📧 Email enviado a ${to}`);
  } catch (err) {
    console.error(`❌ Error enviando email: ${err.message}`);
  }
}

const mongoURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/landing-project';

// ===== MODELOS MONGOOSE =====
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  message: String,
  date: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  product: String,
  quantity: Number,
  address: String,
  notes: String,
  price: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  stripePaymentIntentId: String,
  trackingNumber: String
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Order = mongoose.model('Order', orderSchema);

// ===== FUNCIONES DE UTILIDAD =====
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function seedAdminUser() {
  try {
    const adminEmail = 'admin@miempresa.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'Administrador',
        email: adminEmail,
        password: hashPassword('admin123'),
        role: 'admin'
      });
      console.log('✅ Usuario administrador creado: admin@miempresa.com / admin123');
    }
  } catch (err) {
    console.error('Error al crear usuario administrador:', err.message);
  }
}

async function findUserByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

// ===== CONEXIÓN A MONGODB =====
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  seedAdminUser();
})
.catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  process.exit(1);
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== AUTENTICACIÓN =====
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese correo.' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      role: 'customer'
    });

    // Enviar email de bienvenida
    const welcomeHTML = `
      <h2>¡Bienvenido ${newUser.name}!</h2>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Email: ${newUser.email}</p>
      <p>Ahora puedes hacer pedidos y acceder a tu panel de control.</p>
    `;
    sendEmail(newUser.email, '¡Bienvenido a nuestra plataforma!', welcomeHTML);

    res.json({ success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro: ' + err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    const user = await findUserByEmail(email);
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Correo o contraseña incorrecta.' });
    }

    const role = user.role || 'customer';
    res.json({ success: true, user: { name: user.name, email: user.email, role } });
  } catch (err) {
    res.status(500).json({ error: 'Error en el login: ' + err.message });
  }
});

// ===== CONTACTO =====
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan datos en el formulario de contacto.' });
    }

    await Message.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim()
    });

    // Enviar confirmación al cliente
    const confirmHTML = `
      <h2>Recibimos tu mensaje</h2>
      <p>Hola ${name},</p>
      <p>Gracias por contactarnos. Nos pondremos en contacto pronto.</p>
      <p><strong>Tu mensaje:</strong> ${message}</p>
    `;
    sendEmail(email, 'Confirmación de contacto', confirmHTML);

    // Notificar al admin
    const adminHTML = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `;
    sendEmail(process.env.EMAIL_FROM || process.env.EMAIL_USER, 'Nuevo mensaje de contacto', adminHTML);

    res.json({ success: true, message: 'Tu mensaje fue recibido.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar mensaje: ' + err.message });
  }
});

// ===== PEDIDOS & PAGOS =====
app.post('/api/order', async (req, res) => {
  try {
    const { name, email, product, quantity, address, notes, price } = req.body;

    if (!name || !email || !product || !quantity || !address) {
      return res.status(400).json({ error: 'Faltan datos obligatorios en el pedido.' });
    }

    const newOrder = await Order.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      product: product.trim(),
      quantity: Number(quantity),
      address: address.trim(),
      notes: notes ? notes.trim() : '',
      price: price ? Number(price) : 0,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    // Enviar confirmación de pedido
    const orderHTML = `
      <h2>Pedido recibido - #${newOrder._id}</h2>
      <p>Hola ${name},</p>
      <p>Tu pedido ha sido registrado. Por favor completa el pago para confirmar.</p>
      <p><strong>Producto:</strong> ${product}</p>
      <p><strong>Cantidad:</strong> ${quantity}</p>
      <p><strong>Precio total:</strong> $${price}</p>
      <p><strong>Dirección:</strong> ${address}</p>
      <p>El estado de tu pedido será actualizado próximamente.</p>
    `;
    sendEmail(email, 'Pedido confirmado - Pendiente de pago', orderHTML);

    res.json({ success: true, orderId: newOrder._id, message: 'Pedido creado. Procede con el pago.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear pedido: ' + err.message });
  }
});

// Crear Payment Intent para Stripe
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Faltan orderId o amount' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { orderId: orderId.toString() }
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creando payment intent: ' + err.message });
  }
});

// Confirmar pago y actualizar estado
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'El pago no fue completado' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    const paymentHTML = `
      <h2>¡Pago confirmado!</h2>
      <p>Hola ${order.name},</p>
      <p>Tu pago de $${order.price} ha sido procesado exitosamente.</p>
      <p><strong>ID de Pedido:</strong> ${orderId}</p>
      <p><strong>Estado:</strong> Confirmado</p>
      <p>Tu pedido será preparado y enviado pronto.</p>
    `;
    sendEmail(order.email, 'Pago confirmado - Pedido confirmado', paymentHTML);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Error confirmando pago: ' + err.message });
  }
});

// Obtener pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;
    let orders;
    
    if (email) {
      orders = await Order.find({ email: email.toLowerCase() }).sort({ date: -1 });
    } else {
      orders = await Order.find().sort({ date: -1 });
    }
    
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos: ' + err.message });
  }
});

// Actualizar estado de pedido (admin)
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const { orderId } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Falta el estado' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    const statusMessages = {
      'confirmed': 'Tu pedido ha sido confirmado y está siendo preparado.',
      'shipped': `Tu pedido ha sido enviado. Número de seguimiento: ${trackingNumber || 'Por definir'}`,
      'delivered': 'Tu pedido ha sido entregado. ¡Gracias por tu compra!'
    };

    if (statusMessages[status]) {
      const updateHTML = `
        <h2>Actualización de tu pedido #${orderId}</h2>
        <p>Hola ${order.name},</p>
        <p>${statusMessages[status]}</p>
        <p><strong>Producto:</strong> ${order.product}</p>
        <p><strong>Nuevo estado:</strong> ${status.toUpperCase()}</p>
      `;
      sendEmail(order.email, `Pedido actualizado: ${status.toUpperCase()}`, updateHTML);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando pedido: ' + err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Servidor en funcionamiento.' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URL || 'localhost'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configurado' : 'NO CONFIGURADO'}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configurado' : 'NO CONFIGURADO'}`);
});

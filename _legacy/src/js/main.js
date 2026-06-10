const authState = {
  currentKey: 'lp_currentUser'
};

function getCurrentUser() {
  const raw = localStorage.getItem(authState.currentKey);
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(authState.currentKey, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(authState.currentKey);
}

function showMessage(id, message, type = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `auth-message ${type}`.trim();
}

function updateAuthView() {
  const user = getCurrentUser();
  const welcome = document.getElementById('authWelcome');
  const forms = document.getElementById('authForms');
  const userName = document.getElementById('userName');
  const myOrdersSection = document.getElementById('myOrders');
  const adminSection = document.getElementById('admin');

  if (user) {
    welcome?.classList.remove('hidden');
    forms?.classList.add('hidden');
    if (userName) userName.textContent = user.name;

    if (user.role === 'admin') {
      adminSection?.classList.remove('hidden');
      myOrdersSection?.classList.add('hidden');
    } else {
      myOrdersSection?.classList.remove('hidden');
      adminSection?.classList.add('hidden');
    }
  } else {
    welcome?.classList.add('hidden');
    forms?.classList.remove('hidden');
    myOrdersSection?.classList.add('hidden');
    adminSection?.classList.add('hidden');
  }

  showMessage('loginMessage', '');
  showMessage('registerMessage', '');
  loadOrdersForUser();
}

function switchTab(showLogin) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  if (showLogin) {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

function renderMyOrders(orders) {
  const container = document.getElementById('myOrdersList');
  if (!container) return;
  if (!orders.length) {
    container.innerHTML = '<p>No tienes pedidos registrados aún.</p>';
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <article class="order-item">
          <strong>${new Date(order.date).toLocaleString()}</strong>
          <p><span>Producto:</span> ${order.product}</p>
          <p><span>Cantidad:</span> ${order.quantity}</p>
          <p><span>Precio:</span> $${order.price}</p>
          <p><span>Estado:</span> ${order.status}</p>
        </article>
      `
    )
    .join('');
}

function renderAdminOrders(orders) {
  const totalOrders = document.getElementById('totalOrders');
  const totalRevenue = document.getElementById('totalRevenue');
  const adminBody = document.getElementById('adminOrdersBody');

  if (totalOrders) totalOrders.textContent = orders.length;
  if (totalRevenue) {
    const revenue = orders.reduce((sum, order) => sum + (order.price || 0) * order.quantity, 0);
    totalRevenue.textContent = `$${revenue}`;
  }

  if (!adminBody) return;
  adminBody.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td>${new Date(order.date).toLocaleDateString()}</td>
          <td>${order.name}</td>
          <td>${order.product}</td>
          <td>${order.quantity}</td>
          <td>$${order.price}</td>
          <td>${order.status}</td>
        </tr>
      `
    )
    .join('');
}

async function loadOrdersForUser() {
  const user = getCurrentUser();
  if (!user) return;

  const url = user.role === 'admin' ? '/api/orders' : `/api/orders?email=${encodeURIComponent(user.email)}`;
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) {
    console.error(result.error || 'No se pudo cargar los pedidos');
    return;
  }

  if (user.role === 'admin') {
    renderAdminOrders(result.orders);
  } else {
    renderMyOrders(result.orders);
  }
}

function updateOrderTotal() {
  const select = document.getElementById('productSelect');
  const quantity = Number(document.getElementById('orderQuantity')?.value || 1);
  const totalEl = document.getElementById('orderTotal');
  const priceInput = document.getElementById('orderPrice');
  if (!select || !totalEl || !priceInput) return;

  const selectedOption = select.selectedOptions[0];
  const productName = selectedOption?.value || '-';
  const price = Number(selectedOption?.dataset?.price || 0);
  const total = price * quantity;
  
  totalEl.textContent = `$${total}`;
  priceInput.value = price;

  // Update order summary box if it exists
  const summaryService = document.getElementById('summaryService');
  const summaryQty = document.getElementById('summaryQty');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryTotal = document.getElementById('summaryTotal');

  if (summaryService) summaryService.textContent = productName;
  if (summaryQty) summaryQty.textContent = quantity;
  if (summaryPrice) summaryPrice.textContent = `$${price}`;
  if (summaryTotal) summaryTotal.textContent = `$${total}`;
}

async function apiRequest(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Error de servidor');
  }

  return payload;
}

function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm && registerForm && tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => switchTab(true));
    tabRegister.addEventListener('click', () => switchTab(false));

    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());

      try {
        const result = await apiRequest('/api/login', data);
        setCurrentUser(result.user);
        showMessage('loginMessage', 'Inicio de sesión exitoso.', 'success');
        updateAuthView();
      } catch (error) {
        showMessage('loginMessage', error.message, 'error');
      }
    });

    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());

      try {
        const result = await apiRequest('/api/register', data);
        setCurrentUser(result.user);
        showMessage('registerMessage', 'Cuenta creada correctamente.', 'success');
        updateAuthView();
        registerForm.reset();
      } catch (error) {
        showMessage('registerMessage', error.message, 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearCurrentUser();
      switchTab(true);
      updateAuthView();
    });
  }
}

function initUI() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initUI();
  initAuth();
  updateAuthView();
  updateOrderTotal();
  loadOrdersForUser();

  document.getElementById('productSelect')?.addEventListener('change', updateOrderTotal);
  document.getElementById('orderQuantity')?.addEventListener('input', updateOrderTotal);

  document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const messageEl = document.getElementById('formMessage');
    if (messageEl) messageEl.textContent = 'Enviando...';

    try {
      const result = await apiRequest('/api/contact', data);
      if (messageEl) messageEl.textContent = result.message;
      e.target.reset();
    } catch (error) {
      if (messageEl) messageEl.textContent = error.message;
    }
  });

  document.getElementById('orderForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const orderMessage = document.getElementById('orderMessage');
    if (orderMessage) orderMessage.textContent = 'Enviando pedido...';

    try {
      const result = await apiRequest('/api/order', data);
      if (orderMessage) orderMessage.textContent = result.message;
      e.target.reset();
      updateOrderTotal();
      loadOrdersForUser();
    } catch (error) {
      if (orderMessage) orderMessage.textContent = error.message;
    }
  });
});

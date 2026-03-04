const form = document.getElementById('orderForm');
const messageEl = document.getElementById('message');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function setMessage(type, text) {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = 'message';
  if (type === 'success') {
    messageEl.classList.add('message--success');
  } else if (type === 'error') {
    messageEl.classList.add('message--error');
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const requiredFields = ['customerName', 'phone', 'address', 'sandType', 'quantity', 'unit'];
    const hasEmptyRequired = requiredFields.some((field) => {
      const value = (data[field] || '').toString().trim();
      return !value;
    });

    if (hasEmptyRequired) {
      setMessage('error', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
      }
      setMessage('success', 'Отправляем заявку...');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Не удалось отправить заявку');
      }

      setMessage('success', result.message || 'Заявка успешно отправлена!');
      form.reset();
    } catch (error) {
      console.error(error);
      setMessage('error', 'Произошла ошибка при отправке заявки. Попробуйте ещё раз.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}


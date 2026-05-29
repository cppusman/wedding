// netlify/functions/send-rsvp.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Метод не поддерживается' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Неверный JSON' };
  }

  const { guestName, attendance, message, alcohol } = body;
  if (!guestName) {
    return { statusCode: 400, body: 'Имя обязательно' };
  }

  const text = `🎉 *Новая анкета!*
👤 *Имя:* ${guestName}
📅 *Присутствие:* ${attendance || 'Не указано'}
💬 *Сообщение:* ${message || 'Нет сообщения'}
🍷 *Алкоголь:* ${alcohol || 'Не выбран'}`;

  const BOT_TOKEN = '8962443036:AAHn9ZY2KRuvqomf-37ExTwlZ2-KFXUPryA';
  const CHAT_ID = '-1003926368528'; // ваш ID группы

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
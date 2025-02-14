import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // URL del backend NestJS

export const fetchSubscribedTopics = async () => {
  const response = await fetch('http://localhost:3001/mqtt/topics');
  const data = await response.json();
  return data.topics;
};

export const subscribeTopic = async (topic) => {
  if (!topic) return alert('⚠️ Ingresa un topic para suscribirte.');

  await fetch('http://localhost:3001/mqtt/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  return topic;
};

export const publishMessage = async (topic, message) => {
  if (!topic || !message) return alert('⚠️ Ingresa un topic y un mensaje.');

  await fetch('http://localhost:3001/mqtt/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, message }),
  });
};

export const listenToMessages = (setMessages) => {
  socket.on('mqtt_message', (data) => {
    const messageContent =
      data.message instanceof ArrayBuffer
        ? new TextDecoder('utf-8').decode(data.message)
        : data.message;

    console.log('📩 Mensaje recibido:', { topic: data.topic, message: messageContent });

    setMessages((prev) => [...prev, { topic: data.topic, message: messageContent }]);
  });

  return () => socket.off('mqtt_message');
};

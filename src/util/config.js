const API_BASE_URL = 'http://localhost:3002';

export const API_ENDPOINTS = {
  SOCKET_URL: `${API_BASE_URL}`,
  WIFI_CONFIG: `${API_BASE_URL}/configs`,
  MQTT_SUBSCRIBE: `${API_BASE_URL}/mqtt/subscribe`,
  MQTT_PUBLISH: `${API_BASE_URL}/mqtt/publish`,
  MQTT_TOPICS: `${API_BASE_URL}/mqtt/topics`,
};

export default API_BASE_URL;

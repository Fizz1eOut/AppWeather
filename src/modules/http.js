// Функция для обработки ответа от API
export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} ${response.statusText}\n${errorText}`);
  }
  return response.json();
};

// Общая функция для выполнения запросов
export const fetchData = async (url) => {
  const response = await fetch(url);
  return handleResponse(response);
};
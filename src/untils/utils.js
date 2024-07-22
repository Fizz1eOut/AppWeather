// управления частотой выполнения функции
export function debounce(func, wait) {
  // Переменная для хранения идентификатора таймера
  let timeout;
  
  // Возвращаемая функция, которая будет вызываться вместо оригинальной
  return function (...args) {
    // Сохраняем текущий контекст выполнения
    const context = this;
    
    // Очищаем предыдущий таймер, если он существует
    clearTimeout(timeout);
    
    // Устанавливаем новый таймер с задержкой wait миллисекунд
    timeout = setTimeout(() => {
      // Вызываем оригинальную функцию func с сохраненным контекстом и аргументами
      func.apply(context, args);
    }, wait);
  };
}

// Преобразует строку: первая буква заглавная, остальные — строчные.
export function capitalizeFirstLetter(string) {
  if (!string) return '';
  
  return string
    .split(' ') // Разделяем строку на слова
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Преобразуем каждое слово
    )
    .join(' '); // Объединяем слова обратно в строку
}
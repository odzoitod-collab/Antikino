import { Rocket, Heart, Crown, Gamepad2, Mic, Pizza, MonitorPlay, Sparkles, Wind, Camera, PartyPopper, Dice5 } from 'lucide-react';

export const rooms = [
  { id: 1, name: 'Космос', style: 'Неон & Киберпанк', capacity: 6, price: 1500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQovvMkIoABbLDFS-uMXtRaOO1iFOyU834H8g&s', icon: Rocket },
  { id: 2, name: 'Париж', style: 'Романтика', capacity: 4, price: 1200, image: 'https://modo.kg/wp-content/uploads/2023/05/6-1-1024x600.jpg', icon: Heart },
  { id: 3, name: 'VIP-Лофт', style: 'Премиум', capacity: 10, price: 2500, image: 'https://img.restoclub.ru/uploads/place/7/c/f/6/7cf6aa0795da4538740aa24cddee754b_w1230_h820--no-cut.webp?v=3', icon: Crown },
  { id: 4, name: 'Неон', style: 'Вечеринка', capacity: 8, price: 1800, image: 'https://aif-s3.aif.ru/images/015/278/d609d0ef85223ba7caf2642e2a9ee730.jpg', icon: Sparkles },
  { id: 5, name: 'Киберпанк', style: 'Гейминг', capacity: 12, price: 3000, image: 'https://static.tildacdn.com/tild3935-6565-4161-a435-333732353365/photo_2025-01-21_21-.jpg', icon: Gamepad2 },
  { id: 6, name: 'Лаунж', style: 'Чилл', capacity: 2, price: 1000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkyis8Q7ABzKrwdNaRmhFF0gyiK8gMUxLFGg&s', icon: Mic },
];

export const features = [
  { title: 'Приватность', desc: 'Только свои. Никаких посторонних.', icon: Heart },
  { title: 'PS5 & Xbox', desc: 'Два геймпада, хиты и новинки.', icon: Gamepad2 },
  { title: 'Караоке', desc: 'Студийный звук и микрофоны.', icon: Mic },
  { title: 'Своя еда', desc: 'Без пробкового сбора.', icon: Pizza },
  { title: '4K Экраны', desc: 'Диагональ до 150 дюймов.', icon: MonitorPlay },
  { title: 'Атмосфера', desc: 'Настраиваемый свет.', icon: Sparkles },
];

export const addons = [
  { id: 1, name: 'Дымный коктейль', desc: 'Премиум табак, 2 часа', price: 1500, icon: Wind, image: 'https://kalyanchik.ua/image/cache/catalog/image/catalog/Aimages2020/21596_Yahya_Union_Joker_black_instagram.webp' },
  { id: 3, name: 'Романтик', desc: 'Лепестки роз, свечи, шампанское', price: 3500, icon: Heart, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHqtmlXSrGHv8M6TjEdZmdxXpgqz3s9jxGaA&s' },
  { id: 6, name: 'Настолки PRO', desc: 'Мафия, Бункер, Элиас и др.', price: 500, icon: Dice5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN56A4KXNjfhE2xKqv7Oha8HKK_PqTYuf6hQ&s' },
];

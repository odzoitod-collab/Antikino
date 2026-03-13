import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, Users, Clock } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

const Stepper = ({ value, onChange, min, max, icon: Icon, label }: any) => (
  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-1 md:rounded-xl overflow-hidden">
    <div className="flex items-center gap-2 pl-3">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
    <div className="flex items-center">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-10 h-10 md:w-12 md:h-12 bg-zinc-950 flex items-center justify-center active:bg-zinc-800 text-lg border-l border-y border-zinc-800 transition-colors hover:bg-zinc-800">-</button>
      <span className="w-12 md:w-16 text-center text-sm md:text-base font-black border-y border-zinc-800 h-10 md:h-12 flex items-center justify-center">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-10 h-10 md:w-12 md:h-12 bg-zinc-950 flex items-center justify-center active:bg-zinc-800 text-lg border-r border-y border-zinc-800 transition-colors hover:bg-zinc-800">+</button>
    </div>
  </div>
);

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, addons, logEvent } = useSiteConfig();
  const preselectedAddon = searchParams.get('addon');
  const preselectedRoom = searchParams.get('room');

  useEffect(() => {
    logEvent('booking_open');
  }, [logEvent]);

  const [room, setRoom] = useState(preselectedRoom || '');
  const [hours, setHours] = useState(2);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  
  const dateInputRef = React.useRef<HTMLInputElement>(null);
  const contactFocusedRef = React.useRef<{ name?: boolean; phone?: boolean }>({});

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  useEffect(() => {
    if (preselectedAddon) {
      setSelectedAddons([Number(preselectedAddon)]);
    }
  }, [preselectedAddon]);

  useEffect(() => {
    if (preselectedRoom) {
      setRoom(preselectedRoom);
    }
  }, [preselectedRoom]);

  const toggleAddon = (id: number) => {
    const addon = addons.find(a => a.id === id);
    const added = !selectedAddons.includes(id);
    setSelectedAddons(prev => added ? [...prev, id] : prev.filter(a => a !== id));
    logEvent('booking_addon_toggle', { addon_id: id, addon_name: addon?.name, added });
  };

  const handleRoomSelect = (r: { id: number; name: string }) => {
    setRoom(r.id.toString());
    logEvent('booking_room_select', { room_id: r.id, room_name: r.name });
  };

  const handleDateSelect = (d: string) => {
    setDate(d);
    logEvent('booking_date_select', { date: d });
  };

  const handleContactFocus = (field: 'name' | 'phone') => {
    if (contactFocusedRef.current[field]) return;
    contactFocusedRef.current[field] = true;
    logEvent('contact_focus', { field });
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const selectedRoom = rooms.find(r => r.id.toString() === room);
  const roomTotal = selectedRoom ? selectedRoom.price * hours : 0;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const total = roomTotal + addonsTotal;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !date || !name || !phone) return;

    logEvent('booking_submit', {
      room_id: selectedRoom?.id,
      room_name: selectedRoom?.name,
      addons_count: selectedAddons.length,
      total,
    });

    const addonNames = selectedAddons.map(id => addons.find(a => a.id === id)?.name).join(', ');
    
    const message = `Здравствуйте! Могу ли я купить сеанс?
Зал: ${selectedRoom?.name}
Дата: ${date}
Время: ${hours} ч.
Гостей: ${guests}
${addonNames ? `Доп. услуги: ${addonNames}\n` : ''}Имя: ${name}
Телефон: ${phone}

Итоговая сумма: ${total} ₽.`;

    navigate('/chat', { state: { autoSend: message } });
  };

  return (
    <div className="flex flex-col w-full bg-zinc-950 min-h-screen pb-28 md:pb-12">
      <div className="p-4 border-b border-zinc-900 sticky top-14 bg-zinc-950/90 backdrop-blur-md z-30">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Бронирование</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Оформление заказа</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <form className="p-4 flex flex-col md:flex-row gap-8 md:gap-12 md:mt-4" onSubmit={handleBooking}>
          
          <div className="flex-1 flex flex-col gap-8 md:gap-10">
            {/* Room Selection (Horizontal Scroll) */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">1. Выберите зал</label>
              <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-2 md:gap-4 no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
                {rooms.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoomSelect(r)}
                    className={`shrink-0 w-36 md:w-full h-28 md:h-32 relative border md:rounded-xl overflow-hidden transition-colors ${room === r.id.toString() ? 'border-pink-500 ring-1 ring-pink-500' : 'border-zinc-800 hover:border-zinc-600'}`}
                  >
                    <img src={r.image} alt={r.name} className={`absolute inset-0 w-full h-full object-cover transition-opacity ${room === r.id.toString() ? 'opacity-60' : 'opacity-30'}`} referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-left">
                      <p className="text-sm md:text-base font-black uppercase leading-none mb-1">{r.name}</p>
                      <p className="text-[10px] md:text-xs text-pink-500 font-bold">{r.price} ₽/ч</p>
                    </div>
                    {room === r.id.toString() && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 flex items-center justify-center md:rounded-md">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection — удобная зона нажатия на телефоне */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">2. Дата сеанса</label>
              <div className="flex flex-col sm:flex-row gap-2 min-h-[44px]">
                <div className="grid grid-cols-2 sm:flex-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDateSelect(today)}
                    className={`min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-xs md:text-sm font-bold uppercase tracking-widest border rounded-xl transition-colors touch-manipulation active:scale-[0.98] ${date === today ? 'border-pink-500 bg-pink-500/10 text-pink-500' : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800'}`}
                  >
                    Сегодня
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateSelect(tomorrow)}
                    className={`min-h-[48px] sm:min-h-[52px] md:min-h-[56px] text-xs md:text-sm font-bold uppercase tracking-widest border rounded-xl transition-colors touch-manipulation active:scale-[0.98] ${date === tomorrow ? 'border-pink-500 bg-pink-500/10 text-pink-500' : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800'}`}
                  >
                    Завтра
                  </button>
                </div>
                <div className="relative flex-1 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]">
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={date}
                    min={today}
                    max={maxDate}
                    onChange={e => handleDateSelect(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none z-0"
                    aria-label="Выбрать дату"
                  />
                  <button
                    type="button"
                    onClick={handleCalendarClick}
                    className={`absolute inset-0 z-10 w-full h-full flex items-center justify-center border rounded-xl transition-colors touch-manipulation active:scale-[0.98] select-none ${date !== today && date !== tomorrow && date !== '' ? 'border-pink-500 bg-pink-500/10 text-pink-500' : 'border-zinc-800 text-zinc-400 bg-zinc-900 hover:bg-zinc-800'}`}
                    aria-label="Открыть календарь"
                  >
                    {date !== today && date !== tomorrow && date !== '' ? (
                      <span className="text-xs md:text-sm font-bold">{new Date(date + 'T12:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}</span>
                    ) : (
                      <Calendar className="w-6 h-6 md:w-6 md:h-6" aria-hidden />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Time & Guests (Steppers) */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">3. Детали</label>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1"><Stepper value={hours} onChange={setHours} min={1} max={12} icon={Clock} label="Часы" /></div>
                <div className="flex-1"><Stepper value={guests} onChange={setGuests} min={1} max={selectedRoom ? selectedRoom.capacity : 20} icon={Users} label="Гости" /></div>
              </div>
            </div>

            {/* Addons Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">4. Дополнительно</label>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                {addons.map(a => {
                  const isSelected = selectedAddons.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAddon(a.id)}
                      className={`flex items-center justify-between p-4 border md:rounded-xl transition-colors text-left ${isSelected ? 'border-pink-500 bg-pink-500/10' : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 md:w-6 md:h-6 border md:rounded-md flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-pink-500 bg-pink-500' : 'border-zinc-600'}`}>
                          {isSelected && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm md:text-base font-bold uppercase tracking-tight">{a.name}</p>
                          <p className="text-[10px] md:text-xs text-zinc-500">{a.desc}</p>
                        </div>
                      </div>
                      <span className="text-sm md:text-base font-bold text-pink-500 whitespace-nowrap ml-2">+{a.price} ₽</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">5. Контакты</label>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleContactFocus('name')}
                  placeholder="Ваше имя"
                  className="w-full flex-1 bg-zinc-900 border border-zinc-800 md:rounded-xl text-sm md:text-base p-4 outline-none focus:border-pink-500 transition-colors" 
                />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => handleContactFocus('phone')}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full flex-1 bg-zinc-900 border border-zinc-800 md:rounded-xl text-sm md:text-base p-4 outline-none focus:border-pink-500 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Sticky Footer / Desktop Sidebar */}
          <div className="md:w-80 shrink-0">
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-900 p-4 pb-safe md:sticky md:top-24 md:border md:rounded-2xl md:p-6 md:bg-zinc-900/50 md:backdrop-blur-md">
              <div className="max-w-md mx-auto md:max-w-none flex md:flex-col items-center md:items-stretch justify-between gap-4">
                <div className="flex flex-col md:mb-6">
                  <span className="text-[10px] md:text-sm text-zinc-500 uppercase tracking-widest">Итого</span>
                  <span className="text-2xl md:text-5xl font-black text-pink-500 leading-none">{total} ₽</span>
                </div>
                <button 
                  onClick={handleBooking}
                  disabled={!room || !date || !name || !phone}
                  className="bg-white text-black px-8 py-4 md:py-5 text-sm md:text-base font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 md:rounded-xl hover:bg-zinc-200"
                >
                  Оформить
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

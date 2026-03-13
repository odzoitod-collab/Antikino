import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Users, Check } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getIcon } from '../lib/icons';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, features, logEvent } = useSiteConfig();
  const handleBookingClick = () => room && logEvent('cta_click', { cta: 'room_booking', room_id: room.id, room_name: room.name });
  const room = rooms.find((r) => r.id.toString() === id);

  useEffect(() => {
    if (room) logEvent('room_view', { room_id: room.id, room_name: room.name });
  }, [room?.id, room?.name, logEvent]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Зал не найден</h1>
        <button onClick={() => navigate('/rooms')} className="text-pink-500 font-bold uppercase tracking-widest text-sm">
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-zinc-950 min-h-screen pb-28 md:pb-0">
      {/* Hero Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10 md:top-8 md:left-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-zinc-950/50 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform border border-zinc-800/50 hover:bg-zinc-800/80">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-4 left-0 w-full">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">
                <Users className="w-3 h-3 md:w-4 md:h-4" />
                До {room.capacity} человек
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{room.name}</h1>
              <p className="text-sm md:text-base text-zinc-400 mt-2 uppercase tracking-widest">{room.style}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto w-full p-4 flex flex-col md:flex-row gap-8 mt-4 md:mt-8 md:mb-12">
        
        <div className="flex-1 flex flex-col gap-8">
          {/* Description */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">О зале</h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              Идеальное пространство для вашего отдыха. Зал "{room.name}" выполнен в стиле {room.style.toLowerCase()}. 
              Здесь есть всё необходимое для комфортного времяпрепровождения: от мощной акустики до удобных диванов.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">Включено в стоимость</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {features.map((f, i) => {
                const Icon = typeof f.icon === 'string' ? getIcon(f.icon) : f.icon;
                return (
                <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-3 md:p-4 md:rounded-xl">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-800 md:rounded-lg">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold uppercase tracking-tight">{f.title}</p>
                    <p className="text-[10px] md:text-xs text-zinc-500">{f.desc}</p>
                  </div>
                </div>
              ); })}
            </div>
          </div>

          {/* Rules */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">Правила</h2>
            <ul className="text-xs md:text-sm text-zinc-400 space-y-2 md:space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>Можно со своей едой и напитками (без пробкового сбора).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>Курение (в т.ч. электронных сигарет) только в специально отведенных местах.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>Бронирование от 2-х часов.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sticky Footer / Desktop Sidebar */}
        <div className="md:w-80 shrink-0">
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-900 p-4 pb-safe md:sticky md:top-24 md:border md:rounded-2xl md:p-6 md:bg-zinc-900/50 md:backdrop-blur-md">
            <div className="max-w-md mx-auto md:max-w-none flex md:flex-col items-center md:items-stretch justify-between gap-4">
              <div className="flex flex-col md:mb-4">
                <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">Стоимость</span>
                <span className="text-2xl md:text-4xl font-black text-pink-500 leading-none">{room.price} ₽<span className="text-sm md:text-lg text-zinc-500 font-normal">/ч</span></span>
              </div>
              <Link 
                to={`/booking?room=${room.id}`}
                onClick={handleBookingClick}
                className="bg-white text-black px-8 py-4 text-sm font-black uppercase tracking-widest active:scale-95 transition-transform text-center md:rounded-xl hover:bg-zinc-200"
              >
                Забронировать
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getIcon } from '../lib/icons';

export default function Home() {
  const { features, rooms, addons, logEvent } = useSiteConfig();
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] md:h-[80vh] flex flex-col justify-end bg-zinc-900">
        <img 
          src="https://sxodim.com/uploads/images/2022/10/04/optimized/c94e8c7e9709026fa7073ef3015748b2_800xauto-q-85.jpg" 
          alt="Cinema" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        
        <div className="relative z-10 p-4 pb-8 max-w-5xl mx-auto w-full">
          <div className="inline-block px-3 py-1 mb-4 border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm text-[10px] md:text-xs font-bold uppercase tracking-widest text-pink-500">
            Твой личный кинотеатр
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-4 md:mb-6">
            Кино.<br/>Игры.<br/>Свои.
          </h1>
          <p className="text-sm md:text-lg text-zinc-400 max-w-[280px] md:max-w-md leading-snug mb-6 md:mb-8">
            Арендуй приватный зал для свидания или вечеринки. Никаких посторонних.
          </p>
          <Link 
            to="/booking"
            onClick={() => logEvent('cta_click', { cta: 'hero_booking' })}
            className="inline-flex items-center justify-center w-full md:w-auto md:px-12 bg-white text-black py-4 text-sm font-black uppercase tracking-widest active:scale-95 transition-transform hover:bg-zinc-200 md:rounded-xl"
          >
            Забронировать
          </Link>
        </div>
      </section>

      {/* Dense Features Grid */}
      <section className="w-full bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto w-full">
          <div className="p-4 flex items-center justify-between border-b border-zinc-900 md:border-none md:pt-12">
            <h2 className="text-lg md:text-3xl font-black uppercase tracking-tight">Почему мы</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px md:gap-4 bg-zinc-900 md:bg-transparent md:p-4">
            {features.map((f, i) => {
              const Icon = typeof f.icon === 'string' ? getIcon(f.icon) : f.icon;
              return (
              <div key={i} className="bg-zinc-950 p-4 md:p-6 flex flex-col items-start md:border md:border-zinc-800 md:rounded-2xl">
                <Icon className="w-5 h-5 md:w-8 md:h-8 text-pink-500 mb-3 md:mb-4" />
                <h3 className="text-sm md:text-base font-bold uppercase tracking-tight mb-1">{f.title}</h3>
                <p className="text-[11px] md:text-sm text-zinc-500 leading-tight">{f.desc}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* Popular Rooms Preview */}
      <section className="w-full bg-zinc-950 border-t border-zinc-900 mt-8 md:mt-12">
        <div className="max-w-5xl mx-auto w-full">
          <div className="p-4 flex items-center justify-between border-b border-zinc-900 md:border-none">
            <h2 className="text-lg md:text-3xl font-black uppercase tracking-tight">Популярные залы</h2>
            <Link to="/rooms" className="text-xs md:text-sm font-bold text-pink-500 uppercase flex items-center hover:text-pink-400 transition-colors">
              Все <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-px md:gap-6 bg-zinc-900 md:bg-transparent md:p-4">
            {rooms.slice(0, 3).map((r) => (
              <Link key={r.id} to={`/room/${r.id}`} className="relative h-40 md:h-64 w-full bg-zinc-950 overflow-hidden block group md:rounded-2xl md:border md:border-zinc-800">
                <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-active:scale-105 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{r.name}</h3>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 mt-1">{r.capacity} чел • {r.style}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm md:text-base font-bold text-pink-500">{r.price} ₽/ч</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Addons Preview */}
      <section className="w-full bg-zinc-950 border-t border-zinc-900 mt-8 md:mt-12 mb-8 md:mb-16">
        <div className="max-w-5xl mx-auto w-full">
          <div className="p-4 flex items-center justify-between border-b border-zinc-900 md:border-none">
            <h2 className="text-lg md:text-3xl font-black uppercase tracking-tight">Доп. Услуги</h2>
            <Link to="/addons" className="text-xs md:text-sm font-bold text-pink-500 uppercase flex items-center hover:text-pink-400 transition-colors">
              Все <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-px md:gap-4 bg-zinc-900 md:bg-transparent snap-x snap-mandatory no-scrollbar md:p-4">
            {addons.slice(0, 4).map((a) => (
              <Link key={a.id} to={`/booking?addon=${a.id}`} className="snap-start shrink-0 w-[70%] md:w-full bg-zinc-950 flex flex-col relative md:rounded-2xl md:border md:border-zinc-800 md:overflow-hidden group">
                <div className="h-32 md:h-40 relative overflow-hidden">
                  <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                </div>
                <div className="p-4 pt-0 -mt-6 relative z-10">
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-1">{a.name}</h3>
                  <p className="text-xs md:text-sm font-bold text-pink-500">{a.price} ₽</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

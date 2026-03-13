import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Rooms() {
  const { rooms } = useSiteConfig();
  return (
    <div className="flex flex-col w-full bg-zinc-950 min-h-screen">
      <div className="p-4 border-b border-zinc-900 sticky top-14 bg-zinc-950/90 backdrop-blur-md z-30">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Все залы</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Выберите идеальное пространство</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-px md:gap-6 md:p-6 bg-zinc-900 md:bg-transparent">
        {rooms.map(r => (
          <div key={r.id} className="bg-zinc-950 flex flex-col md:rounded-2xl md:overflow-hidden md:border md:border-zinc-800">
            <Link to={`/room/${r.id}`} className="relative h-48 md:h-56 w-full overflow-hidden block group">
              <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-active:scale-105 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-2 py-1 flex items-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-zinc-800">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-pink-500" />
                До {r.capacity}
              </div>
            </Link>
            
            <div className="p-4 md:p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4 md:mb-6 flex-1">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">{r.name}</h2>
                  <p className="text-xs md:text-sm text-zinc-400 mt-2">{r.style}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest mb-1">Стоимость</p>
                  <p className="text-lg md:text-xl font-bold text-pink-500 leading-none">{r.price} ₽<span className="text-xs md:text-sm text-zinc-500 font-normal">/ч</span></p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Link 
                  to={`/room/${r.id}`}
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-white text-center py-3 text-xs md:text-sm font-black uppercase tracking-widest active:scale-95 transition-transform hover:bg-zinc-800"
                >
                  Подробнее
                </Link>
                <Link 
                  to={`/booking?room=${r.id}`}
                  className="flex-1 bg-white text-black text-center py-3 text-xs md:text-sm font-black uppercase tracking-widest active:scale-95 transition-transform hover:bg-zinc-200"
                >
                  Бронь
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

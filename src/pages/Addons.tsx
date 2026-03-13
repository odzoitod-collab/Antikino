import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getIcon } from '../lib/icons';

export default function Addons() {
  const { addons, logEvent } = useSiteConfig();
  return (
    <div className="flex flex-col w-full bg-zinc-950 min-h-screen">
      <div className="p-4 border-b border-zinc-900 sticky top-14 bg-zinc-950/90 backdrop-blur-md z-30">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Услуги</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Дополните ваш отдых</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-px md:gap-6 md:p-6 bg-zinc-900 md:bg-transparent">
        {addons.map(a => (
          <div key={a.id} className="bg-zinc-950 flex flex-col md:rounded-2xl md:overflow-hidden md:border md:border-zinc-800">
            <div className="relative h-40 md:h-56 w-full overflow-hidden">
              <img src={a.image} alt={a.name} className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                {(() => {
                  const Icon = getIcon(a.icon);
                  return <Icon className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />;
                })()}
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">{a.name}</h2>
              </div>
            </div>
            
            <div className="p-4 md:p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4 md:mb-6 flex-1">
                <p className="text-xs md:text-sm text-zinc-400 max-w-[70%]">{a.desc}</p>
                <div className="text-right">
                  <p className="text-lg md:text-xl font-bold text-pink-500 leading-none">{a.price} ₽</p>
                </div>
              </div>
              
              <Link 
                to={`/booking?addon=${a.id}`}
                onClick={() => logEvent('addon_click', { addon_id: a.id, addon_name: a.name })}
                className="w-full border border-zinc-800 text-white text-center py-3 text-xs md:text-sm font-black uppercase tracking-widest active:bg-white active:text-black transition-colors flex items-center justify-center gap-2 md:rounded-xl hover:bg-zinc-800"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" /> Добавить к брони
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

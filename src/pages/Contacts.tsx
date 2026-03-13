import { useEffect } from 'react';
import { MapPin, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Contacts() {
  const { address, workingHours, logEvent } = useSiteConfig();
  useEffect(() => {
    logEvent('contacts_view');
  }, [logEvent]);
  return (
    <div className="flex flex-col w-full bg-zinc-950 min-h-screen">
      <div className="p-4 border-b border-zinc-900 sticky top-14 bg-zinc-950/90 backdrop-blur-md z-30">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Контакты</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Наш адрес и связь</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-1 flex flex-col gap-px bg-zinc-900 md:bg-transparent md:gap-6">
          <div className="bg-zinc-950 p-4 md:p-6 flex flex-col gap-6 md:border md:border-zinc-800 md:rounded-2xl">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-pink-500 shrink-0" />
              <div>
                <h3 className="text-sm md:text-base font-bold uppercase tracking-widest mb-1">Адрес</h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-pink-500 shrink-0" />
              <div>
                <h3 className="text-sm md:text-base font-bold uppercase tracking-widest mb-1">Режим работы</h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{workingHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 pt-8 pb-12 md:p-6 md:border md:border-zinc-800 md:rounded-2xl">
            <Link 
              to="/chat"
              className="w-full bg-white text-black py-4 md:py-5 text-sm md:text-base font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-3 md:rounded-xl hover:bg-zinc-200"
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
              Связь с кассиром
            </Link>
            <p className="text-[10px] md:text-xs text-zinc-500 text-center mt-4 uppercase tracking-widest">
              Отвечаем в течение 1-2 минут
            </p>
          </div>
        </div>

        <div className="flex-1 h-64 md:h-auto min-h-[300px] bg-zinc-900 border border-zinc-800 relative overflow-hidden md:rounded-2xl">
          <img src="https://picsum.photos/seed/map/800/600" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  );
}

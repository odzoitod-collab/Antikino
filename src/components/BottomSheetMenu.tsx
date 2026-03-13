import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function BottomSheetMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  useEffect(() => {
    onClose();
    setActiveSubMenu(null);
  }, [location.pathname]);

  const menuItems = [
    { label: 'Главная', path: '/' },
    { 
      label: 'Залы', 
      subItems: [
        { label: 'Все залы', path: '/rooms' },
        { label: 'Для двоих', path: '/rooms?filter=couple' },
        { label: 'Для компаний', path: '/rooms?filter=party' },
      ]
    },
    { label: 'Доп. Услуги', path: '/addons' },
    { label: 'Бронирование', path: '/booking' },
    { label: 'Контакты', path: '/contacts' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 h-[85vh] bg-zinc-950 z-50 rounded-t-none flex flex-col overflow-hidden border-t border-zinc-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-900">
              <div className="w-10 h-1 bg-zinc-800 absolute left-1/2 -translate-x-1/2 top-3" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mt-2">Меню</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-white mt-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col space-y-2">
                {menuItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    {item.subItems ? (
                      <>
                        <button 
                          onClick={() => setActiveSubMenu(activeSubMenu === item.label ? null : item.label)}
                          className="flex items-center justify-between py-4 text-xl font-black uppercase tracking-tight border-b border-zinc-900"
                        >
                          {item.label}
                          <motion.div animate={{ rotate: activeSubMenu === item.label ? 90 : 0 }}>
                            <ChevronRight className="w-5 h-5 text-zinc-500" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {activeSubMenu === item.label && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col pl-4 border-l border-zinc-800 ml-2 mt-2 space-y-2"
                            >
                              {item.subItems.map((sub, sIdx) => (
                                <Link 
                                  key={sIdx} 
                                  to={sub.path}
                                  className="py-3 text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link 
                        to={item.path}
                        className="py-4 text-xl font-black uppercase tracking-tight border-b border-zinc-900 flex items-center justify-between"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-900">
              <Link 
                to="/booking"
                className="block w-full bg-white text-black text-center py-4 text-sm font-black uppercase tracking-widest active:scale-95 transition-transform"
              >
                Забронировать
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

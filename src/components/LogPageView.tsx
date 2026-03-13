import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

const PAGE_VIEW_DEBOUNCE_MS = 1800;

/** Логирует page_view при смене пути (с debounce, чтобы не спамить при быстрой навигации). */
export default function LogPageView() {
  const location = useLocation();
  const { refId, logEvent } = useSiteConfig();
  const prevPathRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!refId) return;
    const path = location.pathname || '/';
    if (prevPathRef.current === null) {
      prevPathRef.current = path;
      return;
    }
    if (prevPathRef.current === path) return;
    prevPathRef.current = path;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      logEvent('page_view', { path });
    }, PAGE_VIEW_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [refId, location.pathname, logEvent]);

  return null;
}

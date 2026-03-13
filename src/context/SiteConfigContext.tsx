import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { SiteSettingsRow, RoomRow, AddonRow } from '../lib/supabase';
import { logReferralEvent, getSessionId } from '../lib/referralLog';
import type { ReferralEventType, ReferralEventPayload } from '../lib/referralLog';
import { rooms as defaultRooms, addons as defaultAddons, features } from '../constants';

const REF_STORAGE_KEY = 'antick_ref_id';
const VISITOR_UID_KEY = 'antick_visitor_uid';

export function getVisitorUid(): string {
  let uid = localStorage.getItem(VISITOR_UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(VISITOR_UID_KEY, uid);
  }
  return uid;
}

export type SiteConfig = {
  refId: string | null;
  siteName: string;
  city: string;
  locationName: string;
  address: string;
  workingHours: string;
  rooms: RoomRow[];
  addons: AddonRow[];
  features: typeof features;
  loading: boolean;
  error: string | null;
  /** Лог действия реферала на сайте (только при наличии ref_id) */
  logEvent: (eventType: ReferralEventType, payload?: ReferralEventPayload) => void;
};

const defaultConfig: SiteConfig = {
  refId: null,
  siteName: 'Антикино',
  city: 'Москва',
  locationName: 'Антикино',
  address: 'ул. Примерная, д. 42. Вход со двора, 2 этаж',
  workingHours: 'Круглосуточно (24/7). Без выходных',
  rooms: defaultRooms.map((r, i) => ({
    id: r.id,
    name: r.name,
    style: r.style,
    capacity: r.capacity,
    price: r.price,
    image: r.image,
    icon: ['Rocket', 'Heart', 'Crown', 'Sparkles', 'Gamepad2', 'Mic'][i] ?? 'Rocket',
  })),
  addons: defaultAddons.map((a, i) => ({
    id: a.id,
    name: a.name,
    desc: a.desc,
    price: a.price,
    icon: ['Wind', 'Pizza', 'Heart', 'Camera', 'PartyPopper', 'Dice5'][i] ?? 'Wind',
    image: a.image,
  })),
  features,
  loading: false,
  error: null,
  logEvent: () => {},
};

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig used outside SiteConfigProvider');
  return ctx;
}

type ProviderProps = { children: React.ReactNode };

export function SiteConfigProvider({ children }: ProviderProps) {
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get('ref');
  const [refId, setRefId] = useState<string | null>(() => {
    const stored = localStorage.getItem(REF_STORAGE_KEY);
    return refFromUrl ?? stored;
  });
  const [config, setConfig] = useState<Omit<SiteConfig, 'refId' | 'loading' | 'error'>>(defaultConfig);
  const [loading, setLoading] = useState(!!refFromUrl);
  const [error, setError] = useState<string | null>(null);

  const persistRef = useCallback((ref: string | null) => {
    if (ref) localStorage.setItem(REF_STORAGE_KEY, ref);
    else localStorage.removeItem(REF_STORAGE_KEY);
    setRefId(ref);
  }, []);

  useEffect(() => {
    if (refFromUrl && refFromUrl !== refId) {
      persistRef(refFromUrl);
    }
  }, [refFromUrl, refId, persistRef]);

  const logVisit = useCallback((ref: string, path: string) => {
    if (!supabase) return;
    const visitorUid = getVisitorUid();
    const sessionId = getSessionId();
    supabase
      .from('visit_logs')
      .insert({
        ref_id: ref,
        visitor_uid: visitorUid,
        session_id: sessionId,
        event_type: 'visit',
        path,
        payload: {},
        user_agent: navigator.userAgent,
      })
      .then(({ error: e }) => {
        if (e) console.warn('Visit log error:', e.message);
      });
  }, []);

  useEffect(() => {
    if (!refId) {
      setConfig(defaultConfig);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setConfig(defaultConfig);

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('site_settings')
      .select('*')
      .eq('ref_id', refId)
      .single()
      .then(({ data, error: e }) => {
        setLoading(false);
        if (e) {
          setError(e.message);
          setConfig(defaultConfig);
          return;
        }
        const row = data as SiteSettingsRow | null;
        if (!row) {
          setConfig(defaultConfig);
          return;
        }
        setConfig({
          siteName: row.site_name,
          city: row.city,
          locationName: row.location_name,
          address: row.address,
          workingHours: row.working_hours,
          rooms: Array.isArray(row.rooms) ? row.rooms : defaultConfig.rooms,
          addons: Array.isArray(row.addons) ? row.addons : defaultConfig.addons,
          features,
        });
        logVisit(refId, window.location.pathname || '/');
      })
      .catch((err) => {
        setLoading(false);
        setError('Не удалось загрузить настройки');
        setConfig(defaultConfig);
        if (refId && supabase) {
          logReferralEvent(refId, getVisitorUid(), 'error', window.location.pathname, {
            source: 'site_settings',
            message: err?.message ?? 'failed to load',
          });
        }
      });
  }, [refId, logVisit]);

  const logEvent = useCallback(
    (eventType: ReferralEventType, payload: ReferralEventPayload = {}) => {
      if (!refId) return;
      logReferralEvent(refId, getVisitorUid(), eventType, window.location.pathname, payload);
    },
    [refId]
  );

  const value = useMemo<SiteConfig>(
    () => ({
      ...config,
      refId,
      loading,
      error,
      logEvent,
    }),
    [config, refId, loading, error, logEvent]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

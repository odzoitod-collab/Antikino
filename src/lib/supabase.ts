import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('Supabase: VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY не заданы. Работа без БД.');
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export type RoomRow = {
  id: number;
  name: string;
  style: string;
  capacity: number;
  price: number;
  image: string;
  icon: string;
};

export type AddonRow = {
  id: number;
  name: string;
  desc: string;
  price: number;
  icon: string;
  image: string;
};

export type SiteSettingsRow = {
  ref_id: string;
  site_name: string;
  city: string;
  location_name: string;
  address: string;
  working_hours: string;
  rooms: RoomRow[];
  addons: AddonRow[];
  updated_at: string;
};

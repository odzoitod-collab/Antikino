import { supabase } from './supabase';

const SESSION_KEY = 'antick_session_id';

export type ReferralEventType =
  | 'visit'
  | 'page_view'
  | 'room_view'
  | 'addon_click'
  | 'booking_open'
  | 'booking_room_select'
  | 'booking_date_select'
  | 'booking_addon_toggle'
  | 'booking_submit'
  | 'contact_focus'
  | 'chat_open'
  | 'contacts_view'
  | 'cta_click'
  | 'error';

export type ReferralEventPayload = {
  path?: string;
  room_id?: number;
  room_name?: string;
  addon_id?: number;
  addon_name?: string;
  addons_count?: number;
  total?: number;
  /** для cta_click: hero_booking, room_booking, addon_booking и т.д. */
  cta?: string;
  /** для contact_focus: name | phone */
  field?: string;
  /** для error: источник (e.g. site_settings, fetch) и сообщение */
  source?: string;
  message?: string;
  [key: string]: unknown;
};

/** Один заход (вкладка) — один session_id, сбрасывается при закрытии вкладки */
export function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `s-${Date.now()}`;
  }
}

export function logReferralEvent(
  refId: string,
  visitorUid: string,
  eventType: ReferralEventType,
  path: string,
  payload: ReferralEventPayload = {},
  sessionId?: string
): void {
  if (!supabase) return;
  const sid = sessionId ?? getSessionId();
  supabase
    .from('visit_logs')
    .insert({
      ref_id: refId,
      visitor_uid: visitorUid,
      session_id: sid,
      event_type: eventType,
      path,
      payload: Object.keys(payload).length ? payload : {},
      user_agent: navigator.userAgent,
    })
    .then(({ error }) => {
      if (error) console.warn('[referralLog]', error.message);
    });
}

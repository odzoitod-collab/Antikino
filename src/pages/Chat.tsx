import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Send, ImagePlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSiteConfig, getVisitorUid } from '../context/SiteConfigContext';
import { supabase } from '../lib/supabase';

type ChatMessage = {
  id: string;
  role: 'visitor' | 'support';
  content: string;
  created_at: string;
  image_url?: string | null;
};

const URL_REGEX = /(https?:\/\/[^\s<>]+)/gi;

function contentWithLinks(text: string): React.ReactNode {
  if (!text.trim()) return null;
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    /^https?:\/\//i.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline break-all hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refId, logEvent } = useSiteConfig();
  const visitorUid = getVisitorUid();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedAutoSend = useRef(false);
  const lastPollCreatedAt = useRef<string>('');
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    logEvent('chat_open');
  }, [logEvent]);

  // Один диалог (одна ветка в ТП) на пользователя: ищем по visitor_uid, при отсутствии — создаём с текущим ref_id
  useEffect(() => {
    if (!refId || !supabase) {
      setLoading(false);
      return;
    }

    const run = async () => {
      // Сначала ищем любой существующий диалог по visitor_uid — чтобы всегда писать в ту же ветку
      const { data: existingByVisitor } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('visitor_uid', visitorUid)
        .limit(1)
        .maybeSingle();

      let convId: string;
      if (existingByVisitor?.id) {
        convId = existingByVisitor.id;
      } else {
        const { data: inserted, error } = await supabase
          .from('chat_conversations')
          .insert({ ref_id: refId, visitor_uid: visitorUid })
          .select('id')
          .single();
        if (error?.code === '23505') {
          const { data: existing2 } = await supabase
            .from('chat_conversations')
            .select('id')
            .eq('visitor_uid', visitorUid)
            .limit(1)
            .maybeSingle();
          convId = existing2?.id ?? null;
        } else {
          convId = inserted?.id ?? null;
        }
        if (!convId) {
          setLoading(false);
          return;
        }
      }

      setConversationId(convId);

      const { data: rows } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at, image_url')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      const initial = (rows as ChatMessage[]) || [];
      setMessages(initial);
      const last = initial.length ? initial[initial.length - 1].created_at : '';
      lastPollCreatedAt.current = last;

      const POLL_MS = 5000;
      pollIntervalRef.current = setInterval(async () => {
        const since = lastPollCreatedAt.current;
        const { data: newRows } = await supabase
          .from('chat_messages')
          .select('id, role, content, created_at, image_url')
          .eq('conversation_id', convId)
          .gt('created_at', since)
          .order('created_at', { ascending: true });
        const list = (newRows as ChatMessage[]) || [];
        if (list.length === 0) return;
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const toAdd = list.filter((r) => !ids.has(r.id) && r.role === 'support');
          if (toAdd.length === 0) return prev;
          return [...prev, ...toAdd].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        lastPollCreatedAt.current = list[list.length - 1].created_at;
      }, POLL_MS);

      setLoading(false);
    };

    run();
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [refId, visitorUid]);

  // Авто-отправка текста с экрана брони (один раз)
  useEffect(() => {
    if (!conversationId || !location.state?.autoSend || processedAutoSend.current || !supabase) return;
    const text = location.state.autoSend as string;
    if (!text.trim()) return;

    processedAutoSend.current = true;
    navigate(location.pathname, { replace: true, state: {} });

    supabase
      .from('chat_messages')
      .insert({ conversation_id: conversationId, role: 'visitor', content: text.trim() })
      .select('id, role, content, created_at')
      .single()
      .then(({ data }) => {
        if (data) {
          setMessages((prev) => [...prev, { id: (data as ChatMessage).id, role: 'visitor', content: (data as ChatMessage).content, created_at: (data as ChatMessage).created_at }]);
        }
      });
  }, [conversationId, location.state?.autoSend, location.pathname, navigate]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !conversationId || !supabase || sending) return;

    setSending(true);
    setUploadError(null);
    setInput('');

    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      role: 'visitor',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: conversationId, role: 'visitor', content: text })
      .select('id, role, content, created_at')
      .single();

    setSending(false);
    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? (data as ChatMessage) : m)));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId || !supabase || uploadingImage || sending) return;
    if (!file.type.startsWith('image/')) return;

    setUploadingImage(true);
    setUploadError(null);
    e.target.value = '';

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `chat/${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const { error: uploadErr } = await supabase.storage.from('images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadErr) {
      setUploadingImage(false);
      setUploadError(uploadErr.message || 'Не удалось загрузить фото');
      return;
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
    const imageUrl = urlData.publicUrl;

    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      role: 'visitor',
      content: '',
      created_at: new Date().toISOString(),
      image_url: imageUrl,
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ conversation_id: conversationId, role: 'visitor', content: '', image_url: imageUrl })
      .select('id, role, content, created_at, image_url')
      .single();

    setUploadingImage(false);
    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setUploadError(error.message || 'Не удалось отправить фото');
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? (data as ChatMessage) : m)));
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!refId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-zinc-950">
        <p className="text-zinc-400 text-center mb-4">Чат доступен только по реф-ссылке.</p>
        <p className="text-zinc-500 text-sm text-center">Откройте сайт по ссылке от партнёра и обновите страницу.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-zinc-950">
        <p className="text-zinc-400">Загрузка чата...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-zinc-950 h-[calc(100dvh-60px)] md:h-[calc(100vh-80px)]">
      <div className="p-4 border-b border-zinc-900 sticky top-14 md:top-20 bg-zinc-950/90 backdrop-blur-md z-30 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white active:scale-95 transition-transform md:hidden">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              Поддержка
              <span className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full animate-pulse" />
            </h1>
            <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">Ответы оператора подгружаются автоматически</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4 min-h-full">
          {messages.length === 0 && (
            <p className="text-zinc-500 text-sm">Напишите сообщение — оператор ответит в этой ветке в Telegram.</p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] md:max-w-[70%] ${m.role === 'visitor' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div
                className={`p-3 md:p-4 text-sm md:text-base whitespace-pre-wrap border md:rounded-2xl flex flex-col gap-2 ${
                  m.role === 'visitor' ? 'bg-pink-600 text-white md:rounded-tr-none' : 'bg-zinc-900 text-zinc-300 border-zinc-800 md:rounded-tl-none'
                }`}
              >
                {m.image_url && (
                  <a href={m.image_url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                    <img src={m.image_url} alt="" className="max-w-full max-h-64 object-cover w-full" />
                  </a>
                )}
                {m.content ? contentWithLinks(m.content) : null}
              </div>
              <span className="text-[9px] md:text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">{formatTime(m.created_at)}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-900 shrink-0">
        <div className="max-w-3xl mx-auto">
          {uploadError && (
            <p className="text-red-400 text-sm mb-2" role="alert">
              {uploadError}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <form onSubmit={handleSend} className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!conversationId || sending || uploadingImage}
              className="p-3 md:p-4 bg-zinc-900 border border-zinc-800 md:rounded-xl text-zinc-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center"
              title="Прикрепить фото"
            >
              <ImagePlus className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Сообщение или фото..."
              className="flex-1 bg-zinc-900 border border-zinc-800 text-sm md:text-base p-4 md:p-5 outline-none md:rounded-xl focus:border-pink-500 transition-colors"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !uploadingImage) || sending}
              className="bg-white text-black px-6 md:px-8 md:rounded-xl disabled:bg-zinc-800 disabled:text-zinc-500 active:scale-95 transition-transform flex items-center justify-center hover:bg-zinc-200"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

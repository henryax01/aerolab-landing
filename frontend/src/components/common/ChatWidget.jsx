import { useEffect, useRef, useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaTrash } from 'react-icons/fa';
import useChat from '../../hooks/useChat.jsx';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-light-accent text-xs text-white dark:bg-dark-accent">
        <FaRobot aria-hidden="true" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-bl-none bg-light-surface-secondary px-4 py-3 dark:bg-dark-surface-secondary">
        <span className="h-2 w-2 animate-bounce rounded-full bg-light-text-secondary dark:bg-dark-text-secondary [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-light-text-secondary dark:bg-dark-text-secondary [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-light-text-secondary dark:bg-dark-text-secondary [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { messages, loading, error, sendMessage, clearChat } = useChat();

  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // 5 — Listen for programmatic open (e.g. from Contact page "Abrir chat" button)
  useEffect(() => {
    const handler = () => { setOpen(true); setBubble(false); };
    window.addEventListener('openChat', handler);
    return () => window.removeEventListener('openChat', handler);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    sendMessage(text);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[22rem] flex-col overflow-hidden rounded-2xl border border-light-border bg-light-surface shadow-2xl dark:border-dark-border dark:bg-dark-surface sm:right-6 sm:w-96">
          <div className="flex items-center justify-between gap-3 border-b border-light-border bg-light-accent px-4 py-3 dark:border-dark-border dark:bg-dark-accent">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                <FaRobot aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-light-accent bg-green-400 dark:border-dark-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Asistente IA</p>
                <p className="text-xs text-white/70">Siempre disponible</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="Limpiar conversación"
                  className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <FaTrash aria-hidden="true" className="text-xs" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Cerrar"
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: '26rem' }}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-light-accent/10 text-2xl text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                  <FaRobot aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  ¡Hola! Soy tu asistente IA.
                </p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  Pregúntame sobre nuestros servicios, precios o cómo podemos ayudarte.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-light-accent text-xs text-white dark:bg-dark-accent">
                      <FaRobot aria-hidden="true" />
                    </div>
                  )}
                  <p
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-none bg-light-accent text-white dark:bg-dark-accent'
                        : 'rounded-bl-none bg-light-surface-secondary text-light-text-primary dark:bg-dark-surface-secondary dark:text-dark-text-primary'
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              ))
            )}

            {loading && <TypingIndicator />}

            {error && (
              <p className="rounded-lg bg-light-error/10 px-3 py-2 text-xs text-light-error dark:bg-dark-error/10 dark:text-dark-error">
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-light-border bg-light-background p-3 dark:border-dark-border dark:bg-dark-background"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 rounded-full border border-light-border bg-light-surface px-4 py-2 text-sm text-light-text-primary placeholder:text-light-text-secondary focus:border-light-accent focus:outline-none disabled:opacity-60 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:dark-text-secondary dark:focus:border-dark-accent"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-light-accent text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-dark-accent"
            >
              <FaPaperPlane aria-hidden="true" className="text-sm" />
            </button>
          </form>
        </div>
      )}

      {bubble && !open && (
        <div className="fixed bottom-24 right-4 z-50 max-w-[200px] rounded-2xl rounded-br-none border border-light-border bg-light-surface px-4 py-3 shadow-lg dark:border-dark-border dark:bg-dark-surface sm:right-6">
          <p className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary">
            ¡Hola! ¿En qué puedo ayudarte? 👋
          </p>
          <button
            type="button"
            onClick={() => setBubble(false)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-light-border text-[10px] text-light-text-secondary hover:bg-light-accent hover:text-white dark:bg-dark-border dark:text-dark-text-secondary"
            aria-label="Cerrar burbuja"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setBubble(false); }}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente IA'}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-light-accent text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl dark:bg-dark-accent sm:right-6"
      >
        {!open && (
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-light-accent opacity-30 dark:bg-dark-accent" />
        )}
        {open ? <FaTimes className="text-xl" aria-hidden="true" /> : <FaRobot className="text-xl" aria-hidden="true" />}
      </button>
    </>
  );
}

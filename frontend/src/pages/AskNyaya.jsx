import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { chat as chatApi, cases as casesApi } from '../services/api';
import { DEMO_CASE, DEMO_CHAT } from '../services/demoData';
import ChatBubble from '../components/ChatBubble';
import { Send, Loader2 } from 'lucide-react';

const starterQuestions = [
  { hi: 'जमानत कैसे मिलती है?', en: 'How to get bail?' },
  { hi: 'मुफ्त वकील कहाँ मिलेगा?', en: 'Where to get free lawyer?' },
  { hi: 'सुनवाई की तारीख कैसे पता करें?', en: 'How to find hearing date?' },
  { hi: 'FIR की copy कैसे मिलेगी?', en: 'How to get FIR copy?' },
];

export default function AskNyaya() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case_id');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [casesList, setCasesList] = useState([]);
  const [selectedCase, setSelectedCase] = useState(caseId || '');
  const chatEndRef = useRef(null);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchCases = async () => {
    try {
      const res = await casesApi.getAll();
      setCasesList(res.data);
    } catch {
      setCasesList([DEMO_CASE]);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { message: text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.send({
        message: text, language: lang,
        case_id: selectedCase ? parseInt(selectedCase) : null,
      });
      setMessages(prev => [...prev, {
        response: res.data.response, isUser: false,
        suggestedActions: res.data.suggested_actions,
      }]);
    } catch {
      const demo = DEMO_CHAT.find(c => text.includes(c.message.slice(0, 10)));
      setMessages(prev => [...prev, {
        response: demo?.response || (lang === 'hindi'
          ? 'नमस्ते! मैं न्यायमित्र हूँ। DLSA हेल्पलाइन: 15100 पर कॉल करें।'
          : 'Hello! I am NyayaMitra. Call DLSA helpline: 15100.'),
        isUser: false,
        suggestedActions: [lang === 'hindi' ? 'DLSA से संपर्क करें' : 'Contact DLSA'],
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-4 px-4 max-w-3xl mx-auto flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-devanagari text-2xl font-bold text-accent-saffron mb-2">
          {lang === 'hindi' ? 'न्यायमित्र से पूछें' : 'Ask NyayaMitra'}
        </h1>
        {casesList.length > 0 && (
          <select value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="select-field !w-auto text-sm">
            <option value="">{lang === 'hindi' ? 'सामान्य प्रश्न' : 'General'}</option>
            {casesList.map(c => (
              <option key={c.id} value={c.id}>
                {c.prisoner_name} ({c.fir_number})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-auto mb-4 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <svg width="60" height="60" viewBox="0 0 100 100" className="mb-4 opacity-50">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9933" strokeWidth="3" />
              <circle cx="50" cy="50" r="6" fill="#FF9933" />
              {[...Array(12)].map((_, i) => (
                <line key={i} x1="50" y1="15" x2="50" y2="40" stroke="#FF9933" strokeWidth="2"
                  transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
            <p className="font-devanagari text-text-secondary mb-6">
              {lang === 'hindi' ? 'कोई भी सवाल पूछें' : 'Ask anything'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {starterQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(lang === 'hindi' ? q.hi : q.en)}
                  className="text-sm bg-bg-elevated border border-border-default rounded-full px-4 py-2
                    text-text-secondary hover:text-accent-saffron hover:border-border-hover transition-all font-devanagari">
                  {lang === 'hindi' ? q.hi : q.en}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} onActionClick={(action) => sendMessage(action)} />
            ))}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center">
                  <Loader2 size={16} className="text-accent-saffron animate-spin" />
                </div>
                <div className="bg-bg-elevated rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent-saffron/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-accent-saffron/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-accent-saffron/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          className="input-field flex-1 font-devanagari"
          placeholder={lang === 'hindi' ? 'कोई भी सवाल पूछें...' : 'Ask anything about your case...'}
          disabled={loading} />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          className="btn-saffron !px-4">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hearings as hearingsApi, cases as casesApi } from '../services/api';
import { DEMO_HEARINGS, DEMO_CASE } from '../services/demoData';
import HearingTimeline from '../components/HearingTimeline';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseISO, differenceInDays, isAfter } from 'date-fns';

export default function Hearings() {
  const [hearingsList, setHearingsList] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  const [newHearing, setNewHearing] = useState({
    case_id: '', hearing_date: '', court_name: '', hearing_type: 'arguments', judge_name: '',
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [casesRes] = await Promise.all([casesApi.getAll()]);
      setCasesList(casesRes.data);
      const allHearings = [];
      for (const c of casesRes.data) {
        try {
          const hRes = await hearingsApi.getByCase(c.id);
          allHearings.push(...hRes.data.map(h => ({ ...h, prisoner_name: c.prisoner_name })));
        } catch {}
      }
      setHearingsList(allHearings.length > 0 ? allHearings : DEMO_HEARINGS);
    } catch {
      setCasesList([DEMO_CASE]);
      setHearingsList(DEMO_HEARINGS);
    } finally { setLoading(false); }
  };

  const handleAddHearing = async (e) => {
    e.preventDefault();
    try {
      await hearingsApi.create({ ...newHearing, case_id: parseInt(newHearing.case_id) });
      toast.success(lang === 'hindi' ? 'सुनवाई जोड़ी गई' : 'Hearing added');
      setShowAdd(false);
      fetchData();
    } catch { toast.error('Failed to add'); }
  };

  const now = new Date();
  const upcoming = hearingsList.filter(h => isAfter(parseISO(h.hearing_date), now));
  const past = hearingsList.filter(h => !isAfter(parseISO(h.hearing_date), now));

  // Week view
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-devanagari text-2xl font-bold text-accent-saffron">
            {lang === 'hindi' ? 'आगामी सुनवाइयाँ' : 'Upcoming Hearings'}
          </h1>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-saffron text-sm flex items-center gap-1.5">
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {lang === 'hindi' ? (showAdd ? 'बंद' : 'जोड़ें') : (showAdd ? 'Close' : 'Add')}
          </button>
        </div>
      </motion.div>

      {/* Week calendar */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day, i) => {
          const hasHearing = upcoming.some(h => {
            const hd = parseISO(h.hearing_date);
            return hd.toDateString() === day.toDateString();
          });
          return (
            <div key={i} className={`text-center p-3 rounded-lg border ${hasHearing ? 'border-accent-saffron bg-accent-saffron/10' : 'border-border-default bg-bg-card'}`}>
              <p className="text-[10px] text-text-tertiary">{day.toLocaleDateString(lang === 'hindi' ? 'hi-IN' : 'en', { weekday: 'short' })}</p>
              <p className={`text-lg font-bold ${hasHearing ? 'text-accent-saffron' : 'text-text-secondary'}`}>{day.getDate()}</p>
              {hasHearing && <div className="w-1.5 h-1.5 rounded-full bg-accent-saffron mx-auto mt-1" />}
            </div>
          );
        })}
      </div>

      {showAdd && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAddHearing} className="card mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={newHearing.case_id} onChange={e => setNewHearing(p => ({ ...p, case_id: e.target.value }))} className="select-field" required>
              <option value="">Select Case</option>
              {casesList.map(c => <option key={c.id} value={c.id}>{c.prisoner_name} ({c.fir_number})</option>)}
            </select>
            <input type="date" value={newHearing.hearing_date} onChange={e => setNewHearing(p => ({ ...p, hearing_date: e.target.value }))} className="input-field" required />
            <input type="text" placeholder="Court Name" value={newHearing.court_name} onChange={e => setNewHearing(p => ({ ...p, court_name: e.target.value }))} className="input-field" required />
            <select value={newHearing.hearing_type} onChange={e => setNewHearing(p => ({ ...p, hearing_type: e.target.value }))} className="select-field">
              <option value="bail">Bail (जमानत)</option>
              <option value="framing">Framing (आरोप तय)</option>
              <option value="evidence">Evidence (साक्ष्य)</option>
              <option value="arguments">Arguments (बहस)</option>
              <option value="judgment">Judgment (फैसला)</option>
            </select>
          </div>
          <button type="submit" className="btn-saffron">Add Hearing</button>
        </motion.form>
      )}

      {loading ? (
        <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="font-devanagari text-lg text-text-secondary mb-4 flex items-center gap-2">
                <Clock size={18} className="text-accent-saffron" />
                {lang === 'hindi' ? 'आने वाली सुनवाइयाँ' : 'Upcoming'}
              </h2>
              {upcoming.map((h) => {
                const daysLeft = differenceInDays(parseISO(h.hearing_date), now);
                return (
                  <motion.div key={h.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="card mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{h.court_name}</p>
                      <p className="text-xs text-text-tertiary">{h.hearing_type} • {h.judge_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-accent-saffron font-bold">{parseISO(h.hearing_date).toLocaleDateString('hi-IN')}</p>
                      <p className="text-xs text-accent-saffron font-devanagari">{daysLeft} {lang === 'hindi' ? 'दिन बाकी' : 'days left'}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <h2 className="font-devanagari text-lg text-text-secondary mb-4">
            {lang === 'hindi' ? 'पूरा इतिहास' : 'Full Timeline'}
          </h2>
          <HearingTimeline hearings={hearingsList} />
        </>
      )}
    </div>
  );
}

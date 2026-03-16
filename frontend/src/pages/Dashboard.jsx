import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { cases as casesApi } from '../services/api';
import { DEMO_CASE } from '../services/demoData';
import CaseCard from '../components/CaseCard';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';
import { Briefcase, Users, FileText, Calendar, Plus, X } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [casesList, setCasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCase, setShowAddCase] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  const [newCase, setNewCase] = useState({
    prisoner_name: '', prisoner_age: '', fir_number: '', police_station: '',
    district: '', state: 'Uttar Pradesh', charges: '', court_name: '',
    judge_name: '', arrest_date: '', case_status: 'undertrial',
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await casesApi.getAll();
      setCasesList(res.data);
    } catch {
      setCasesList([DEMO_CASE]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await casesApi.create({
        ...newCase,
        prisoner_age: parseInt(newCase.prisoner_age),
      });
      toast.success('Case added! AI summary being generated...');
      setShowAddCase(false);
      setNewCase({
        prisoner_name: '', prisoner_age: '', fir_number: '', police_station: '',
        district: '', state: 'Uttar Pradesh', charges: '', court_name: '',
        judge_name: '', arrest_date: '', case_status: 'undertrial',
      });
      fetchCases();
    } catch (err) {
      toast.error('Failed to add case');
    } finally {
      setAddLoading(false);
    }
  };

  const undertrialCount = casesList.filter(c => c.case_status === 'undertrial').length;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-devanagari text-3xl font-bold text-accent-saffron mb-1">
          {lang === 'hindi' ? `नमस्ते, ${user?.full_name || 'User'}!` : `Hello, ${user?.full_name || 'User'}!`}
        </h1>
        <p className="text-text-secondary text-sm">
          {new Date().toLocaleDateString(lang === 'hindi' ? 'hi-IN' : 'en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          label={lang === 'hindi' ? 'कुल मामले' : 'Total Cases'}
          value={casesList.length}
          icon={Briefcase}
        />
        <StatCard
          label={lang === 'hindi' ? 'विचाराधीन' : 'Undertrial'}
          value={undertrialCount}
          icon={Users}
          color="text-amber-400"
        />
        <StatCard
          label={lang === 'hindi' ? 'जमानत आवेदन' : 'Bail Applications'}
          value={1}
          icon={FileText}
          color="text-accent-gold"
        />
        <StatCard
          label={lang === 'hindi' ? 'अगली सुनवाई' : 'Next Hearing'}
          value={lang === 'hindi' ? '15 दिन' : '15 days'}
          icon={Calendar}
          color="text-accent-green"
        />
      </div>

      {/* Cases header */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="font-devanagari text-xl font-semibold text-text-primary">
          {lang === 'hindi' ? 'मेरे मामले' : 'My Cases'}
        </h2>
        <button onClick={() => setShowAddCase(!showAddCase)} className="btn-saffron text-sm flex items-center gap-1.5">
          {showAddCase ? <X size={16} /> : <Plus size={16} />}
          {lang === 'hindi' ? (showAddCase ? 'बंद करें' : 'नया मामला जोड़ें') : (showAddCase ? 'Close' : 'Add New Case')}
        </button>
      </div>

      {/* Add Case Form */}
      {showAddCase && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAddCase}
          className="card mb-6 space-y-4"
        >
          <p className="text-xs text-accent-saffron font-devanagari">
            ✨ AI automatically generates Hindi case summary
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Prisoner Name" value={newCase.prisoner_name}
              onChange={e => setNewCase(p => ({ ...p, prisoner_name: e.target.value }))}
              className="input-field" required />
            <input type="number" placeholder="Age" value={newCase.prisoner_age}
              onChange={e => setNewCase(p => ({ ...p, prisoner_age: e.target.value }))}
              className="input-field" required />
            <input type="text" placeholder="FIR Number" value={newCase.fir_number}
              onChange={e => setNewCase(p => ({ ...p, fir_number: e.target.value }))}
              className="input-field" required />
            <input type="text" placeholder="Police Station" value={newCase.police_station}
              onChange={e => setNewCase(p => ({ ...p, police_station: e.target.value }))}
              className="input-field" required />
            <input type="text" placeholder="District" value={newCase.district}
              onChange={e => setNewCase(p => ({ ...p, district: e.target.value }))}
              className="input-field" required />
            <input type="text" placeholder="Court Name" value={newCase.court_name}
              onChange={e => setNewCase(p => ({ ...p, court_name: e.target.value }))}
              className="input-field" required />
            <input type="text" placeholder="Judge Name" value={newCase.judge_name}
              onChange={e => setNewCase(p => ({ ...p, judge_name: e.target.value }))}
              className="input-field" />
            <input type="date" placeholder="Arrest Date" value={newCase.arrest_date}
              onChange={e => setNewCase(p => ({ ...p, arrest_date: e.target.value }))}
              className="input-field" required />
            <select value={newCase.case_status}
              onChange={e => setNewCase(p => ({ ...p, case_status: e.target.value }))}
              className="select-field">
              <option value="undertrial">Undertrial</option>
              <option value="bailed">Bailed</option>
              <option value="convicted">Convicted</option>
              <option value="acquitted">Acquitted</option>
            </select>
          </div>
          <textarea placeholder="Charges (e.g., IPC 420, IPC 468)" value={newCase.charges}
            onChange={e => setNewCase(p => ({ ...p, charges: e.target.value }))}
            className="input-field min-h-[60px]" required />
          <button type="submit" disabled={addLoading} className="btn-saffron">
            {addLoading ? '⏳ Adding...' : '➕ Add Case'}
          </button>
        </motion.form>
      )}

      {/* Cases grid */}
      {loading ? (
        <div className="text-center py-20 text-text-tertiary">
          <div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full mx-auto mb-3" />
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {casesList.map((c, i) => (
            <CaseCard key={c.id} caseData={c} index={i} />
          ))}
        </div>
      )}

      {/* Impact section */}
      <div className="mt-16">
        <h3 className="font-devanagari text-lg text-text-secondary text-center mb-6">
          {lang === 'hindi' ? 'भारत की न्याय व्यवस्था' : "India's Justice System"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated text-center">
            <p className="text-3xl font-bold text-accent-saffron mb-1">40M+</p>
            <p className="text-sm text-text-secondary font-devanagari">
              {lang === 'hindi' ? 'लंबित मामले' : 'Pending Cases'}
            </p>
          </div>
          <div className="card-elevated text-center">
            <p className="text-3xl font-bold text-accent-red mb-1">75%</p>
            <p className="text-sm text-text-secondary font-devanagari">
              {lang === 'hindi' ? 'वकील नहीं ले सकते' : "Can't Afford Lawyers"}
            </p>
          </div>
          <div className="card-elevated text-center">
            <p className="text-3xl font-bold text-accent-green mb-1">Free</p>
            <p className="text-sm text-text-secondary font-devanagari">
              {lang === 'hindi' ? 'NyayaMitra: सबके लिए मुफ्त' : 'NyayaMitra: Free for All'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cases as casesApi, bail as bailApi } from '../services/api';
import { DEMO_CASE, DEFAULT_BAIL_GROUNDS_HINDI, DEFAULT_BAIL_GROUNDS_ENGLISH } from '../services/demoData';
import StatusBadge from '../components/StatusBadge';
import BailDraftModal from '../components/BailDraftModal';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const steps = [
  { label: 'Case Review', labelHi: 'केस समीक्षा' },
  { label: 'Applicant Info', labelHi: 'आवेदक जानकारी' },
  { label: 'Select Grounds', labelHi: 'आधार चुनें' },
  { label: 'Preview & Generate', labelHi: 'पूर्वावलोकन' },
];

export default function BailWizard() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bailApp, setBailApp] = useState(null);
  const [bailLoading, setBailLoading] = useState(false);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  const [formData, setFormData] = useState({
    applicant_name: '', relationship: 'wife', phone: '',
    advocate_name: '', selectedGrounds: [0, 1, 2, 4],
  });

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      const res = await casesApi.get(caseId);
      setCaseData(res.data);
    } catch {
      setCaseData(DEMO_CASE);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setBailLoading(true);
    const grounds = formData.selectedGrounds.map(i => DEFAULT_BAIL_GROUNDS_ENGLISH[i]);
    try {
      const res = await bailApi.generate({
        case_id: parseInt(caseId),
        applicant_name: formData.applicant_name,
        grounds,
        advocate_name: formData.advocate_name || null,
      });
      setBailApp(res.data);
      toast.success(lang === 'hindi' ? 'जमानत आवेदन तैयार!' : 'Bail application generated!');
    } catch {
      toast.error('Generation failed, showing demo');
    } finally {
      setBailLoading(false);
    }
  };

  const toggleGround = (idx) => {
    setFormData(prev => ({
      ...prev,
      selectedGrounds: prev.selectedGrounds.includes(idx)
        ? prev.selectedGrounds.filter(g => g !== idx)
        : [...prev.selectedGrounds, idx],
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full" />
    </div>
  );

  if (!caseData) return null;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-3xl mx-auto">
      <button onClick={() => navigate(`/case/${caseId}`)} className="flex items-center gap-2 text-text-secondary hover:text-accent-saffron mb-6 text-sm">
        <ArrowLeft size={16} /> {lang === 'hindi' ? 'केस पर वापस' : 'Back to case'}
      </button>

      <h1 className="font-devanagari text-2xl font-bold text-accent-saffron mb-6">
        {lang === 'hindi' ? 'जमानत आवेदन विज़ार्ड' : 'Bail Application Wizard'}
      </h1>

      {/* Progress bar */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${i <= step ? 'bg-accent-saffron text-bg-primary' : 'bg-bg-elevated text-text-tertiary border border-border-default'}`}>
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-accent-saffron' : 'bg-border-default'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
        {step === 0 && (
          <div>
            <h2 className="font-devanagari text-lg font-semibold mb-4">
              {lang === 'hindi' ? 'केस विवरण की समीक्षा करें' : 'Review Case Details'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-text-tertiary">Prisoner</span><span>{caseData.prisoner_name}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">FIR</span><span className="font-mono text-sm">{caseData.fir_number}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Charges</span><span className="text-accent-red">{caseData.charges}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Court</span><span>{caseData.court_name}</span></div>
              <div className="flex justify-between"><span className="text-text-tertiary">Bail Eligibility</span><StatusBadge status={caseData.bail_eligibility} /></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-devanagari text-lg font-semibold">
              {lang === 'hindi' ? 'आवेदक की जानकारी' : 'Applicant Information'}
            </h2>
            <div>
              <label className="text-sm text-text-secondary block mb-1 font-devanagari">आवेदक का नाम</label>
              <input type="text" value={formData.applicant_name}
                onChange={e => setFormData(p => ({ ...p, applicant_name: e.target.value }))}
                className="input-field" placeholder="e.g., Meena Devi" />
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Relationship</label>
              <select value={formData.relationship}
                onChange={e => setFormData(p => ({ ...p, relationship: e.target.value }))}
                className="select-field">
                <option value="wife">Wife (पत्नी)</option>
                <option value="husband">Husband (पति)</option>
                <option value="mother">Mother (माँ)</option>
                <option value="father">Father (पिता)</option>
                <option value="son">Son (पुत्र)</option>
                <option value="daughter">Daughter (पुत्री)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Advocate (optional)</label>
              <input type="text" value={formData.advocate_name}
                onChange={e => setFormData(p => ({ ...p, advocate_name: e.target.value }))}
                className="input-field" placeholder="Leave blank for DLSA free lawyer" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-devanagari text-lg font-semibold mb-4">
              {lang === 'hindi' ? 'जमानत के आधार चुनें' : 'Select Bail Grounds'}
            </h2>
            <div className="space-y-3">
              {(lang === 'hindi' ? DEFAULT_BAIL_GROUNDS_HINDI : DEFAULT_BAIL_GROUNDS_ENGLISH).map((ground, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-bg-elevated transition-colors">
                  <input type="checkbox" checked={formData.selectedGrounds.includes(idx)}
                    onChange={() => toggleGround(idx)}
                    className="mt-1 accent-[#FF9933]" />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary font-devanagari">
                    {ground}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-devanagari text-lg font-semibold mb-4">
              {lang === 'hindi' ? 'आवेदन तैयार करें' : 'Generate Application'}
            </h2>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-text-tertiary">Applicant:</span> {formData.applicant_name}</p>
              <p><span className="text-text-tertiary">Grounds selected:</span> {formData.selectedGrounds.length}</p>
              <p><span className="text-text-tertiary">Advocate:</span> {formData.advocate_name || 'DLSA Free Lawyer'}</p>
            </div>
            <button onClick={handleGenerate} disabled={bailLoading}
              className="btn-saffron w-full text-base font-devanagari">
              {bailLoading ? '⏳ AI तैयार कर रहा है...' : '📝 जमानत आवेदन तैयार करें'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="btn-outline flex items-center gap-1 disabled:opacity-30">
          <ArrowLeft size={16} /> {lang === 'hindi' ? 'पीछे' : 'Back'}
        </button>
        {step < 3 && (
          <button onClick={() => setStep(s => s + 1)}
            className="btn-saffron flex items-center gap-1">
            {lang === 'hindi' ? 'आगे' : 'Next'} <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Bail Modal for preview */}
      {bailApp && (
        <BailDraftModal
          isOpen={!!bailApp}
          onClose={() => setBailApp(null)}
          caseData={caseData}
          bailApp={bailApp}
          onGenerate={handleGenerate}
          loading={bailLoading}
        />
      )}
    </div>
  );
}

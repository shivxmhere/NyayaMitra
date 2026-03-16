import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cases as casesApi, bail as bailApi, hearings as hearingsApi } from '../services/api';
import { DEMO_CASE, DEMO_HEARINGS, DEMO_BAIL } from '../services/demoData';
import StatusBadge from '../components/StatusBadge';
import HearingTimeline from '../components/HearingTimeline';
import BailDraftModal from '../components/BailDraftModal';
import toast from 'react-hot-toast';
import { ArrowLeft, RefreshCw, Scale, MapPin, MessageCircle } from 'lucide-react';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [hearingsList, setHearingsList] = useState([]);
  const [bailApps, setBailApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBailModal, setShowBailModal] = useState(false);
  const [bailLoading, setBailLoading] = useState(false);
  const [summaryLang, setSummaryLang] = useState('hindi');
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [caseRes, hearingsRes, bailRes] = await Promise.all([
        casesApi.get(id),
        hearingsApi.getByCase(id),
        bailApi.getByCase(id),
      ]);
      setCaseData(caseRes.data || DEMO_CASE);
      setHearingsList(Array.isArray(hearingsRes.data) ? hearingsRes.data : DEMO_HEARINGS);
      setBailApps(Array.isArray(bailRes.data) ? bailRes.data : [DEMO_BAIL]);
    } catch {
      setCaseData(DEMO_CASE);
      setHearingsList(DEMO_HEARINGS);
      setBailApps([DEMO_BAIL]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBail = async (data) => {
    setBailLoading(true);
    try {
      const { generateGeminiContent } = await import('../services/gemini');
      let prompt = `Write a formal legal Bail Application for an Indian court. Do not include markdown formatting or asterisks. Return ONLY the text of the application.
      Applicant Name: ${data.applicant_name}
      Accused Name: ${caseData.prisoner_name}
      FIR Number: ${caseData.fir_number}
      Police Station: ${caseData.police_station}
      Court: ${caseData.court_name}
      Charges: ${caseData.charges}
      Grounds for Bail: ${data.grounds.join(', ')}
      Advocate: ${data.advocate_name || 'Legal Aid Advocate'}`;
      
      const resEn = await generateGeminiContent(prompt);
      const resHi = await generateGeminiContent(prompt + ' WRITE THE ENTIRE APPLICATION IN HINDI.');

      const generatedBail = {
        id: Date.now(),
        case_id: data.case_id,
        applicant_name: data.applicant_name,
        advocate_name: data.advocate_name,
        grounds: data.grounds.join(', '),
        status: 'draft',
        generated_text: resHi.response,
        generated_text_english: resEn.response,
        generated_at: new Date().toISOString()
      };
      
      setBailApps(prev => [generatedBail, ...prev]);
      toast.success(lang === 'hindi' ? 'जमानत आवेदन तैयार!' : 'Bail application generated!');
    } catch {
      setBailApps([DEMO_BAIL]);
      toast.success('Demo bail application loaded due to error');
    } finally {
      setBailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!caseData) return null;

  const summary = summaryLang === 'hindi' ? caseData.ai_summary_hindi : caseData.ai_summary_english;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-5xl mx-auto">
      {/* Back + Header */}
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-accent-saffron mb-4 text-sm">
        <ArrowLeft size={16} /> {lang === 'hindi' ? 'वापस' : 'Back'}
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-devanagari text-2xl font-bold text-accent-saffron">
              {caseData.prisoner_name}
            </h1>
            <p className="font-mono text-sm text-text-tertiary mt-1">{caseData.fir_number}</p>
          </div>
          <StatusBadge status={caseData.case_status} />
        </div>

        {/* Case Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">Police Station</p>
            <p className="text-sm text-text-primary flex items-center gap-1"><MapPin size={12} /> {caseData.police_station}</p>
          </div>
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">Court</p>
            <p className="text-sm text-text-primary flex items-center gap-1"><Scale size={12} /> {caseData.court_name}</p>
          </div>
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">Judge</p>
            <p className="text-sm text-text-primary">{caseData.judge_name}</p>
          </div>
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">Charges</p>
            <p className="text-sm text-accent-red font-mono">{caseData.charges}</p>
          </div>
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">Arrest Date</p>
            <p className="text-sm text-text-primary">{new Date(caseData.arrest_date).toLocaleDateString('hi-IN')}</p>
          </div>
          <div className="card !p-3">
            <p className="text-xs text-text-tertiary">District</p>
            <p className="text-sm text-text-primary">{caseData.district}, {caseData.state}</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-devanagari text-lg font-semibold text-text-primary">
              {lang === 'hindi' ? 'AI सारांश' : 'AI Summary'}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setSummaryLang('hindi')}
                className={`text-sm px-3 py-1 rounded-full ${summaryLang === 'hindi' ? 'bg-accent-saffron text-bg-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                हिंदी
              </button>
              <button onClick={() => setSummaryLang('english')}
                className={`text-sm px-3 py-1 rounded-full ${summaryLang === 'english' ? 'bg-accent-saffron text-bg-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                English
              </button>
            </div>
          </div>
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${summaryLang === 'hindi' ? 'font-devanagari text-text-primary' : 'text-text-primary'}`}>
            {summary || 'No summary available. Click Regenerate to generate one.'}
          </div>
        </div>

        {/* Bail Eligibility */}
        <div className={`card mb-6 ${caseData.bail_eligibility === 'eligible' ? '!border-accent-green/30' : '!border-accent-red/30'}`}>
          {caseData.bail_eligibility === 'eligible' ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent-green text-xl">✅</span>
                <h3 className="font-devanagari text-lg font-semibold text-accent-green">
                  {lang === 'hindi' ? 'यह केस जमानत योग्य है' : 'This case is bail-eligible'}
                </h3>
              </div>
              <p className="text-sm text-text-secondary mb-4 font-devanagari">
                {lang === 'hindi'
                  ? `IPC धाराएं ${caseData.charges} जमानती श्रेणी में आती हैं।`
                  : `IPC sections ${caseData.charges} fall under bailable category.`}
              </p>
              <button onClick={() => setShowBailModal(true)} className="btn-saffron font-devanagari">
                📝 {lang === 'hindi' ? 'जमानत आवेदन तैयार करें' : 'Generate Bail Application'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent-red text-xl">⚠️</span>
                <h3 className="font-devanagari text-lg font-semibold text-accent-red">
                  {lang === 'hindi' ? 'गैर-जमानती धाराएं' : 'Non-bailable charges detected'}
                </h3>
              </div>
              <p className="text-sm text-text-secondary font-devanagari">
                {lang === 'hindi'
                  ? 'वकील से सलाह जरूरी है। DLSA से मुफ्त वकील लें।'
                  : 'Legal aid lawyer consultation required. Contact DLSA for free lawyer.'}
              </p>
            </div>
          )}
        </div>

        {/* Hearing Timeline */}
        <div className="mb-6">
          <h3 className="font-devanagari text-lg font-semibold text-text-primary mb-4">
            {lang === 'hindi' ? 'सुनवाई का इतिहास' : 'Hearing Timeline'}
          </h3>
          <HearingTimeline hearings={hearingsList} />
        </div>

        {/* Bail Applications */}
        {bailApps.length > 0 && (
          <div className="mb-6">
            <h3 className="font-devanagari text-lg font-semibold text-text-primary mb-4">
              {lang === 'hindi' ? 'जमानत आवेदन' : 'Bail Applications'}
            </h3>
            <div className="space-y-3">
              {bailApps.map((app) => (
                <div key={app.id} className="card !p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">
                      {lang === 'hindi' ? 'आवेदक: ' : 'Applicant: '}{app.applicant_name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(app.generated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    <button onClick={() => setShowBailModal(true)} className="text-accent-saffron text-sm hover:underline">
                      {lang === 'hindi' ? 'देखें' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ask About This Case */}
        <button onClick={() => navigate(`/ask?case_id=${caseData.id}`)}
          className="btn-outline w-full flex items-center justify-center gap-2 font-devanagari">
          <MessageCircle size={18} />
          {lang === 'hindi' ? 'इस केस के बारे में पूछें' : 'Ask About This Case'}
        </button>
      </motion.div>

      {/* Bail Modal */}
      <BailDraftModal
        isOpen={showBailModal}
        onClose={() => setShowBailModal(false)}
        caseData={caseData}
        bailApp={bailApps[0] || null}
        onGenerate={handleGenerateBail}
        loading={bailLoading}
      />
    </div>
  );
}

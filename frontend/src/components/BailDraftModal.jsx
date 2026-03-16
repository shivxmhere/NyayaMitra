import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';

export default function BailDraftModal({ isOpen, onClose, caseData, bailApp, onGenerate, loading }) {
  const [formData, setFormData] = useState({
    applicant_name: '',
    relationship: 'wife',
    advocate_name: '',
    grounds: [0, 1, 2],
  });
  const [showLang, setShowLang] = useState('hindi');
  const [copied, setCopied] = useState(false);

  const groundsHindi = [
    "आरोपी बिना मुकदमे के अनुचित रूप से लंबे समय से न्यायिक हिरासत में है",
    "आरोपी का कोई पूर्व आपराधिक रिकॉर्ड नहीं है और वह पहली बार अपराधी है",
    "आरोपी परिवार का एकमात्र कमाने वाला सदस्य है",
    "आरोपी के फरार होने का कोई खतरा नहीं है",
    "जांच पूरी हो चुकी है और हिरासत अब आवश्यक नहीं है",
    "निरंतर कारावास अनुच्छेद 21 का उल्लंघन करता है",
  ];

  const groundsEnglish = [
    "Accused has been in judicial custody for an unreasonably long period without trial",
    "Accused has no prior criminal record and is a first-time offender",
    "Accused is the sole breadwinner of a dependent family",
    "There is no risk of the accused absconding",
    "Investigation is complete and custody is no longer required",
    "Continued incarceration violates Article 21 of the Constitution",
  ];

  const toggleGround = (idx) => {
    setFormData(prev => ({
      ...prev,
      grounds: prev.grounds.includes(idx)
        ? prev.grounds.filter(g => g !== idx)
        : [...prev.grounds, idx],
    }));
  };

  const handleGenerate = () => {
    if (!formData.applicant_name.trim()) {
      toast.error('Please enter applicant name');
      return;
    }
    const selectedGrounds = formData.grounds.map(i => groundsEnglish[i]);
    onGenerate({
      case_id: caseData.id,
      applicant_name: formData.applicant_name,
      grounds: selectedGrounds,
      advocate_name: formData.advocate_name || null,
    });
  };

  const handleCopy = () => {
    const text = showLang === 'hindi' ? bailApp?.generated_text : bailApp?.generated_text_english;
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = showLang === 'hindi' ? bailApp?.generated_text : bailApp?.generated_text_english;
    const blob = new Blob([text || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bail_application_${caseData.fir_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-bg-primary border border-border-default rounded-t-2xl sm:rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-default">
              <h2 className="font-devanagari text-lg text-accent-saffron font-semibold">
                जमानत आवेदन तैयार करें
              </h2>
              <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-auto">
              {/* Left: Form */}
              <div className="lg:w-2/5 p-5 border-b lg:border-b-0 lg:border-r border-border-default space-y-4">
                <div>
                  <label className="text-sm text-text-secondary block mb-1 font-devanagari">
                    आवेदक का नाम (Applicant Name)
                  </label>
                  <input type="text" value={formData.applicant_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                    className="input-field" placeholder="e.g., Meena Devi" />
                </div>

                <div>
                  <label className="text-sm text-text-secondary block mb-1">Relationship</label>
                  <select value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
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
                  <label className="text-sm text-text-secondary block mb-2 font-devanagari">
                    जमानत के आधार (Grounds for Bail)
                  </label>
                  <div className="space-y-2">
                    {groundsHindi.map((ground, idx) => (
                      <label key={idx} className="flex items-start gap-2 cursor-pointer group">
                        <input type="checkbox" checked={formData.grounds.includes(idx)}
                          onChange={() => toggleGround(idx)}
                          className="mt-1 accent-[#FF9933]" />
                        <span className="text-xs text-text-secondary group-hover:text-text-primary font-devanagari">
                          {ground}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary block mb-1">
                    Advocate Name (optional)
                  </label>
                  <input type="text" value={formData.advocate_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, advocate_name: e.target.value }))}
                    className="input-field" placeholder="Leave blank for DLSA free lawyer" />
                </div>

                <button onClick={handleGenerate} disabled={loading}
                  className="btn-saffron w-full font-devanagari text-base">
                  {loading ? '⏳ तैयार हो रहा है...' : '📝 तैयार करें (Generate)'}
                </button>
              </div>

              {/* Right: Preview */}
              <div className="lg:w-3/5 p-5 flex flex-col">
                {bailApp ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowLang('hindi')}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${showLang === 'hindi' ? 'bg-accent-saffron text-bg-primary' : 'text-text-secondary'}`}>
                          हिंदी
                        </button>
                        <button onClick={() => setShowLang('english')}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${showLang === 'english' ? 'bg-accent-saffron text-bg-primary' : 'text-text-secondary'}`}>
                          English
                        </button>
                        <StatusBadge status={bailApp.status} className="ml-2" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleCopy} className="btn-outline !px-3 !py-1.5 text-sm flex items-center gap-1">
                          {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                        </button>
                        <button onClick={handleDownload} className="btn-outline !px-3 !py-1.5 text-sm flex items-center gap-1">
                          <Download size={14} /> Download
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-bg-card rounded-xl p-5 border border-border-default">
                      <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${showLang === 'hindi' ? 'font-devanagari text-text-primary' : 'text-text-primary'}`}>
                        {showLang === 'hindi' ? bailApp.generated_text : bailApp.generated_text_english}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-text-tertiary text-center">
                    <div>
                      <p className="text-4xl mb-3">⚖️</p>
                      <p className="font-devanagari text-lg">फॉर्म भरें और "तैयार करें" दबाएं</p>
                      <p className="text-sm mt-1">Fill the form and click Generate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

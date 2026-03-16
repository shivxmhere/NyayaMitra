import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { lawyers as lawyersApi } from '../services/api';
import { DEMO_LAWYERS } from '../services/demoData';
import LawyerCard from '../components/LawyerCard';
import { Phone, Shield, Search } from 'lucide-react';

export default function LawyerFinder() {
  const [lawyersList, setLawyersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ district: 'Prayagraj', legal_aid_only: false });
  const [legalAidInfo, setLegalAidInfo] = useState(null);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  useEffect(() => { fetchLawyers(); fetchLegalAidInfo(); }, [filters]);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await lawyersApi.find({ district: filters.district, legal_aid_only: filters.legal_aid_only });
      if (res.data && Array.isArray(res.data)) {
        setLawyersList(res.data);
      } else {
        throw new Error("Invalid API response");
      }
    } catch {
      let filtered = DEMO_LAWYERS;
      if (filters.district) filtered = filtered.filter(l => l.district.toLowerCase() === filters.district.toLowerCase());
      if (filters.legal_aid_only) filtered = filtered.filter(l => l.is_legal_aid);
      setLawyersList(filtered);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalAidInfo = async () => {
    try {
      const res = await lawyersApi.getLegalAidInfo(filters.district);
      if (res.data && res.data.phone) {
        setLegalAidInfo(res.data);
      } else {
        throw new Error("Invalid API response");
      }
    } catch {
      setLegalAidInfo({ 
        body: "DLSA " + filters.district, 
        phone: "0532-2420660", 
        address: "Civil Court Complex, " + filters.district, 
        eligibility: "Free for anyone who cannot afford a lawyer" 
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-devanagari text-2xl font-bold text-accent-saffron mb-1">
          {lang === 'hindi' ? 'अपने जिले में वकील खोजें' : 'Find Lawyer in Your District'}
        </h1>
        <p className="text-text-secondary text-sm mb-6">{lang === 'hindi' ? 'मुफ्त कानूनी सहायता उपलब्ध है' : 'Free legal aid available'}</p>
      </motion.div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filters.district} onChange={e => setFilters(p => ({ ...p, district: e.target.value }))} className="select-field !w-auto">
          <option value="Prayagraj">Prayagraj (प्रयागराज)</option>
          <option value="Lucknow">Lucknow (लखनऊ)</option>
          <option value="Varanasi">Varanasi (वाराणसी)</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer bg-bg-elevated border border-border-default rounded-lg px-4 py-2.5 text-sm text-text-secondary">
          <input type="checkbox" checked={filters.legal_aid_only} onChange={e => setFilters(p => ({ ...p, legal_aid_only: e.target.checked }))} className="accent-[#FF9933]" />
          <Shield size={14} className="text-accent-green" />
          {lang === 'hindi' ? 'केवल मुफ्त वकील' : 'Legal Aid Only'}
        </label>
      </div>

      {legalAidInfo && (
        <div className="rounded-xl bg-accent-green/5 border border-accent-green/20 p-5 mb-6">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-accent-green flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-accent-green font-semibold mb-2">{legalAidInfo.body}</h3>
              <p className="text-sm text-text-secondary mb-1">📍 {legalAidInfo.address}</p>
              <p className="text-sm text-text-secondary mb-2">{legalAidInfo.eligibility}</p>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${legalAidInfo.phone.replace(/-/g, '')}`} className="btn-saffron text-sm flex items-center gap-1.5 !py-2"><Phone size={14} /> {legalAidInfo.phone}</a>
                <a href="tel:15100" className="btn-outline text-sm flex items-center gap-1.5 !py-2"><Phone size={14} /> NALSA: 15100</a>
              </div>
              <p className="text-xs text-accent-green mt-3 font-devanagari font-semibold">✅ {lang === 'hindi' ? 'यह सेवा पूरी तरह मुफ्त है' : 'This service is completely free'}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lawyersList.map((lawyer, i) => (<LawyerCard key={lawyer.id} lawyer={lawyer} index={i} />))}
          {lawyersList.length === 0 && (
            <div className="col-span-full text-center py-10 text-text-tertiary">
              <Search size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-devanagari">{lang === 'hindi' ? 'कोई वकील नहीं मिला' : 'No lawyers found'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import clsx from 'clsx';

const statusConfig = {
  undertrial: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'विचाराधीन', labelEn: 'Undertrial' },
  bailed: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'जमानत पर', labelEn: 'Bailed' },
  convicted: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'दोषसिद्ध', labelEn: 'Convicted' },
  acquitted: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'बरी', labelEn: 'Acquitted' },
  draft: { bg: 'bg-gray-500/15', text: 'text-gray-400', label: 'मसौदा', labelEn: 'Draft' },
  filed: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'दाखिल', labelEn: 'Filed' },
  granted: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'स्वीकृत', labelEn: 'Granted' },
  rejected: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'अस्वीकृत', labelEn: 'Rejected' },
  eligible: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'जमानत योग्य', labelEn: 'Eligible' },
  not_eligible: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'जमानत अयोग्य', labelEn: 'Not Eligible' },
  unknown: { bg: 'bg-gray-500/15', text: 'text-gray-400', label: 'अज्ञात', labelEn: 'Unknown' },
};

export default function StatusBadge({ status, className }) {
  const config = statusConfig[status] || statusConfig.unknown;
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  return (
    <span className={clsx(
      'badge font-devanagari text-xs',
      config.bg, config.text,
      className
    )}>
      {lang === 'hindi' ? config.label : config.labelEn}
    </span>
  );
}

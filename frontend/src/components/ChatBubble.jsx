import { motion } from 'framer-motion';

export default function ChatBubble({ message, response, isUser, suggestedActions, onActionClick }) {
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-[80%] bg-accent-saffron/15 border border-accent-saffron/20 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-text-primary text-sm font-devanagari whitespace-pre-wrap">{message}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 mb-4"
    >
      {/* AI Avatar - Ashoka Chakra */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FF9933" strokeWidth="4" />
          <circle cx="50" cy="50" r="6" fill="#FF9933" />
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="50" y1="15" x2="50" y2="40" stroke="#FF9933" strokeWidth="2"
              transform={`rotate(${i * 30} 50 50)`} />
          ))}
        </svg>
      </div>

      <div className="max-w-[80%]">
        <div className="bg-bg-elevated border border-border-default rounded-2xl rounded-bl-sm px-4 py-3">
          <p className="text-text-primary text-sm font-devanagari whitespace-pre-wrap leading-relaxed">
            {response}
          </p>
        </div>

        {/* Suggested actions */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedActions.map((action, i) => (
              <button key={i} onClick={() => onActionClick?.(action)}
                className="text-xs bg-accent-saffron/10 text-accent-saffron border border-accent-saffron/20 
                  rounded-full px-3 py-1 hover:bg-accent-saffron/20 transition-colors font-devanagari">
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

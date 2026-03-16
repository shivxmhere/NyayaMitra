import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AshokaChakraLarge = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-4">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#FF9933" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="8" fill="#FF9933" />
    {[...Array(24)].map((_, i) => (
      <line key={i} x1="50" y1="10" x2="50" y2="42" stroke="#FF9933" strokeWidth="1.5"
        transform={`rotate(${i * 15} 50 50)`} />
    ))}
  </svg>
);

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome to NyayaMitra!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <AshokaChakraLarge />
          <h1 className="font-devanagari text-4xl font-bold text-accent-saffron mb-2">
            न्यायमित्र
          </h1>
          <p className="font-devanagari text-text-secondary text-sm">
            न्याय सबका अधिकार है
          </p>
          <p className="text-text-tertiary text-xs mt-1">
            Justice is everyone's right
          </p>
        </div>

        <form onSubmit={handleLogin} className="card space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">Username</label>
            <input type="text" value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field" placeholder="Enter username" autoComplete="username" />
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">Password</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="Enter password" autoComplete="current-password" />
          </div>

          <button type="submit" disabled={loading}
            className="btn-saffron w-full text-base font-devanagari">
            {loading ? '⏳ प्रवेश हो रहा है...' : '🔑 प्रवेश करें (Login)'}
          </button>
        </form>

        {/* Demo buttons */}
        <div className="mt-4 space-y-2">
          <p className="text-xs text-text-tertiary text-center mb-2">Quick Demo Access:</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fillDemo('meena', 'meena123')}
              className="btn-outline text-sm font-devanagari !py-2">
              👩 मीना देवी
            </button>
            <button onClick={() => fillDemo('advocate', 'adv123')}
              className="btn-outline text-sm !py-2">
              ⚖️ Advocate
            </button>
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="font-devanagari text-text-tertiary text-xs leading-relaxed">
            "40 मिलियन मामले लंबित हैं।<br />
            आज किसी की मदद करें।"
          </p>
          <p className="text-text-tertiary/50 text-[10px] mt-2">
            40 million cases pending. Help someone today.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

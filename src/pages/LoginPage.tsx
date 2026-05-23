import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import api from '../services/api';
import { ArrowRight, BookOpen, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data && response.data.token) {
        // Set auth state with user info from backend
        login(response.data.token, response.data.data);
        // Sync virtual balance from backend
        if (response.data.data?.saldo_virtual !== undefined) {
          useUserStore.getState().setBalance(response.data.data.saldo_virtual);
        }
        
        // Redirect to onboarding if profile is not set
        const userProfile = useUserStore.getState().profile;
        if (!userProfile) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans text-slate-900">
      
      {/* Left Column: Educational/Interactive Side */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-primary relative overflow-hidden text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="StockMate" className="h-10 w-10" />
            <span className="text-2xl font-extrabold tracking-tight">StockMate</span>
          </Link>
        </div>

        <motion.div 
          className="relative z-10 max-w-lg mt-20"
          variants={staggerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={itemVariants} className="text-5xl font-black mb-6 leading-tight">
            {t('auth.loginTitle')} <br/> {t('auth.loginSubtitle')}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-primary-foreground/80 text-lg mb-12">
            {t('auth.loginDesc')}
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: BookOpen, title: t('auth.features.learn.title'), desc: t('auth.features.learn.desc') },
              { icon: TrendingUp, title: t('auth.features.trade.title'), desc: t('auth.features.trade.desc') },
              { icon: ShieldCheck, title: t('auth.features.risk.title'), desc: t('auth.features.risk.desc') }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="p-3 bg-white/20 rounded-xl">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-primary-foreground/70 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} StockMate. Educational Platform.
        </div>
      </div>

      {/* Right Column: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex justify-center mb-6">
              <img src="/logo.png" alt="StockMate" className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.welcomeBack')}</h2>
            <p className="text-slate-500">{t('auth.signInToContinue')}</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-8 text-sm flex items-center shadow-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants} initial="hidden" animate="show" custom={1}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('auth.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white focus:border-primary transition-all shadow-sm"
                placeholder={t('auth.enterUsername')}
              />
            </motion.div>

            <motion.div variants={itemVariants} initial="hidden" animate="show" custom={2}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  {t('auth.password')}
                </label>
                <a href="#" className="text-sm text-primary font-medium hover:underline">{t('auth.forgotPassword')}</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white focus:border-primary transition-all shadow-sm"
                placeholder={t('auth.enterPassword')}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-3.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-500">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-bold">
              {t('auth.createOne')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

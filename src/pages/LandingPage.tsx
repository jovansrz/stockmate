import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Globe2, BrainCircuit, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    // If user is already authenticated, redirect them to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: t('landing.features.ai.title'),
      description: t('landing.features.ai.desc')
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      title: t('landing.features.screening.title'),
      description: t('landing.features.screening.desc')
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: t('landing.features.risk.title'),
      description: t('landing.features.risk.desc')
    },
    {
      icon: <Globe2 className="w-6 h-6 text-violet-400" />,
      title: t('landing.features.learn.title'),
      description: t('landing.features.learn.desc')
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Dynamic Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/20 blur-[150px]" 
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-xl border-b border-border/40 bg-background/50">
        <div className="flex items-center gap-3">
          <motion.img 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            src="/logo.png"
            alt="StockMate Logo"
            className="h-10 w-10 shrink-0"
          />
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-extrabold tracking-tight"
          >
            <span className="text-black dark:text-white">Stock</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Mate</span>
          </motion.span>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6"
        >
          <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.login')}
          </Link>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-7 font-semibold transition-all hover:scale-105 active:scale-95">
              {t('nav.getStarted')}
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center lg:px-12 min-h-[calc(100vh-80px)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-10 shadow-inner backdrop-blur-md">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span>{t('landing.badge')}</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            {t('landing.title1')} <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-violet-400 drop-shadow-sm">
              {t('landing.title2')}
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-medium">
            {t('landing.subtitle')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] group h-14 px-10 text-lg font-semibold transition-all hover:scale-105">
                {t('landing.startFree')}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-border/50 hover:bg-muted/50 h-14 px-10 text-lg font-semibold bg-background/50 backdrop-blur-sm transition-all hover:border-foreground/20">
                {t('landing.liveDemo')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full max-w-7xl relative z-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 rounded-3xl glass-card text-left group transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner border border-primary/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FounderStoryBanner from '../components/FounderStoryBanner';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForm, setModalForm] = useState({
        name: '',
        institution: '',
        email: '',
        phone: '',
        region: '',
        city: '',
        address: '',
        institutionType: '',
        message: ''
    });

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    const handleAction = () => {
        if (user) {
            navigate('/app/dashboard');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleLogin = () => {
        navigate('/portal');
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', modalForm);
        alert('Thank you for your interest. Our institutional team will contact you shortly to empower education in ' + (modalForm.city || 'your school') + '.');
        setIsModalOpen(false);
        setModalForm({
            name: '',
            institution: '',
            email: '',
            phone: '',
            region: '',
            city: '',
            address: '',
            institutionType: '',
            message: ''
        });
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setModalForm(prev => ({ ...prev, [e.target.name]: value }));
    };

    return (
        <div className="landing-page-wrapper">
            {/* Header */}
            <header className="header" id="header">
                <nav className="nav container">
                    <div className="nav__logo" onClick={() => navigate('/')}>
                        <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                                    <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
                                </linearGradient>
                            </defs>
                            <path
                                d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
                                fill="url(#logoGradient)" opacity="0.2" />
                            <path
                                d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z"
                                stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
                            <path d="M20 15V20L23 23" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="20" cy="20" r="2" fill="url(#logoGradient)" />
                        </svg>
                        <span className="logo-text">Au<span className="logo-accent">Lock</span></span>
                    </div>

                    <ul className="nav__menu" id="navMenu">
                        <li className="nav__item"><a href="#solucion" className="nav__link">Solution</a></li>
                        <li className="nav__item"><a href="#ciencia" className="nav__link">Science</a></li>
                        <li className="nav__item"><a href="#nosotros" className="nav__link">About Us</a></li>
                        <li className="nav__item"><a href="#contacto" className="nav__link">Contact</a></li>
                    </ul>

                    <button className="nav__toggle" id="navToggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={handleLogin} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                            {user ? 'Go to Dashboard' : 'Sign In'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero" id="hero">
                <div className="hero__container container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <svg className="badge-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>NFC Technology & Google Workspace Ecosystem</span>
                        </div>

                        <h1 className="hero__title">
                            <span className="title-line">AuLock: Transforming</span>
                            <span className="title-line title-gradient">Focus into Academic Success</span>
                        </h1>

                        <p className="hero__description">
                            In the era of digital distraction, AuLock balances technology with discipline. We are not here to ban devices, but to turn them into tools for high productivity and deep learning.
                        </p>

                        <div className="hero__cta">
                            <button className="btn btn-primary" id="ctaButton" onClick={() => navigate('/login')}>
                                <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                                </svg>
                                <span>Connect with Google Classroom</span>
                            </button>
                            <a href="https://youtube.com/shorts/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <svg className="btn-icon-left" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                                </svg>
                                <span>Watch Demo</span>
                            </a>
                        </div>

                        <div className="hero__stats">
                            <div className="stat">
                                <div className="stat__number">95%</div>
                                <div className="stat__label">Improvement in Concentration</div>
                            </div>
                            <div className="stat">
                                <div className="stat__number">Beta 🚀</div>
                                <div className="stat__label">Development Phase // Seeking First Adopters</div>
                            </div>
                            <div className="stat">
                                <div className="stat__number">4.9★</div>
                                <div className="stat__label">Average Rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero__visual">
                        <div className="visual-card">
                            <div className="card-glow"></div>
                            <img src="/images/students-hero.jpg" alt="Students using AuLock" className="product-image" />
                            <div className="floating-badge badge-1">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        fill="currentColor" />
                                </svg>
                                <span>NFC Verified</span>
                            </div>
                            <div className="floating-badge badge-2">
                                <div className="pulse-dot"></div>
                                <span>Live Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero__background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
            </section>

            {/* BANNER HISTORIA DEL FUNDADOR & PARTICIPACIÓN EN XPRIZE */}
            <div className="container">
                <FounderStoryBanner />
            </div>

            {/* SECTION 1: WHY CHOOSE AULOCK? (CARDS SECTION) */}
            <section className="section solution" id="solucion">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🌟 Why Choose AuLock?</span>
                        <h2 className="section__title">Three Pillars Redefining Learning</h2>
                        <p className="section__description">
                            Specifically engineered for educational institutions seeking discipline without deprivation and transparent automation.
                        </p>
                    </div>

                    <div className="features-grid">
                        {/* CARD 1: GAMIFIED FOCUS */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                    <path d="M4 22h16" />
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Gamified Focus</h3>
                            <p className="feature-description">
                                We transform attendance and attention management into a motivating game. Students maintain their "Focus Score" (100 PS) and earn weekly benefits through consistency.
                            </p>
                        </div>

                        {/* CARD 2: GOOGLE INTEGRATION */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Full Google Integration</h3>
                            <p className="feature-description">
                                AuLock lives inside your school ecosystem. We synchronize your Google Classroom courses, Google Calendar schedules, and generate automated PDF reports in Google Drive.
                            </p>
                        </div>

                        {/* CARD 3: SOCRATIC AI */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Socratic Artificial Intelligence</h3>
                            <p className="feature-description">
                                Our AI engine does not hand out easy answers; it guides the student using the Socratic method, stimulating deep reasoning and critical thinking.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: FEATURED MODULES (TEASISTO & ACTIVE FOCUS MOTOR) */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🚀 Featured Modules</span>
                        <h2 className="section__title">Intelligent Tutoring & Non-Invasive Supervision</h2>
                        <p className="section__description">
                            Tools designed to support students and grant real-time pedagogical visibility to teachers.
                        </p>
                    </div>

                    <div className="features-grid">
                        {/* MODULE TEASISTO */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                    <rect x="4" y="8" width="16" height="12" rx="2" />
                                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                                    <path d="M9 17h6" />
                                </svg>
                            </div>
                            <h3 className="feature-title">🤖 TeAsisto: Your AI Learning Companion</h3>
                            <p className="feature-description">
                                The TeAsisto module is our AI-powered intelligent tutor. It acts as constant support for students during class:
                            </p>
                            <ul className="module-list">
                                <li><strong>✓ Proactive support:</strong> Resolves conceptual doubts without giving away final answers.</li>
                                <li><strong>✓ Personalization:</strong> Seamlessly adapts to each student's learning pace and profile.</li>
                                <li><strong>✓ Real-time connection:</strong> Teachers monitor interactions to identify concepts where students struggle.</li>
                            </ul>
                        </div>

                        {/* MODULE ACTIVE FOCUS MOTOR */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">🛡️ Active Focus Engine</h3>
                            <p className="feature-description">
                                We automatically detect tab switching or distractions using the <strong>Page Visibility API</strong>. This grants teachers real visibility into class engagement without invasive surveillance.
                            </p>
                            <div className="module-highlight-badge">
                                📈 <strong>Transparent Logic:</strong> Starts at 100 PS. Leaving the active tab deducts 3 points with a live alert; answering teacher questions correctly restores +2 points.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: INSTITUTIONAL IMPACT */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">📊 Educational Impact</span>
                        <h2 className="section__title">What AuLock Can Do For Your School</h2>
                        <p className="section__description">
                            Tangible outcomes for institutional administration, student well-being, and teacher workflow automation.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                    <line x1="12" y1="2" x2="12" y2="12" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Reduce Classroom Distractions</h3>
                            <p className="feature-description">
                                Eliminates inappropriate mobile device usage in virtual and in-person classrooms through self-regulation.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Automate Administration</h3>
                            <p className="feature-description">
                                Automates attendance recording and report generation, saving hours of administrative workload for educators.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Real-Time Metrics</h3>
                            <p className="feature-description">
                                Provides precise data on student engagement with intuitive executive dashboards for school leaders.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Drive Evidence Portfolio</h3>
                            <p className="feature-description">
                                Generates automated PDF reports directly in Google Drive to strengthen teacher evaluation portfolios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: PRIVACY COMMITMENT & SECURITY BADGE */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🔒 Privacy Commitment</span>
                        <h2 className="section__title">Your Data is Sacred</h2>
                        <p className="section__description">
                            We understand that academic data is sensitive. At AuLock, privacy is not an option; it is our fundamental pillar.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <h3 className="feature-title">1. School & Student Ownership</h3>
                            <p className="feature-description">
                                All generated data (student records, grades, focus metrics) belongs exclusively to the school and student.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">2. Zero Data Commercialization</h3>
                            <p className="feature-description">
                                AuLock never sells, shares, or monetizes personal information for advertising or third-party purposes.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M6 12h4m4 0h4" />
                                </svg>
                            </div>
                            <h3 className="feature-title">3. Bank-Grade Security</h3>
                            <p className="feature-description">
                                We enforce bank-grade encryption via Supabase to guarantee that only authorized users access their data.
                            </p>
                        </div>
                    </div>

                    {/* SECURITY BADGE AT BOTTOM */}
                    <div className="security-badge-wrapper">
                        <div className="security-badge">
                            <svg className="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>100% Private Data Protected by Supabase Institutional Encryption & Google Suite Security</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="section solution" id="solucion">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">Our Solution</span>
                        <h2 className="section__title">Technology Empowering Focus</h2>
                        <p className="section__description">
                            AuLock combines NFC hardware with intelligent software to create a complete focus management ecosystem.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">NFC Verification</h3>
                            <p className="feature-description">
                                Smart pouch that automatically verifies when the student is in deep concentration mode.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Study Blocks</h3>
                            <p className="feature-description">
                                Optimized interval system based on scientific research on human concentration and attention span.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M7 16l4-4 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Advanced Analytics</h3>
                            <p className="feature-description">
                                Comprehensive dashboard with performance metrics, trends, and personalized recommendations.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Institutional & DAEM Management</h3>
                            <p className="feature-description">
                                Comprehensive platform for school leadership and DAEM: obtain precise data for educational management and evidence-based decision making.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Real Inclusion (TEA/ADHD)</h3>
                            <p className="feature-description">
                                Distraction-free environment ideal for students with special needs (TEA/ADHD), facilitating self-regulation and focus.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Science Section */}
            <section className="section science" id="ciencia">
                <div className="container">
                    <div className="science__content">
                        <div className="science__text">
                            <span className="section__tag">Backed by Science</span>
                            <h2 className="section__title">Neuroscientific Foundations</h2>
                            <p className="science__description">
                                AuLock is built upon decades of research into attention, concentration, and effective learning.
                            </p>

                            <div className="science__points">
                                <div className="science__point">
                                    <div className="point-icon-wrapper">
                                        <svg className="science-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div className="point-content">
                                        <h4>Pomodoro Technique Principle</h4>
                                        <p><strong>The Concept:</strong> AuLock structures learning into intervals using device locking, fostering deep concentration cycles followed by breaks.</p>
                                        <p><strong>Benefit:</strong> Prevents cognitive exhaustion and enhances long-term retention.</p>
                                    </div>
                                </div>

                                <div className="science__point">
                                    <div className="point-icon-wrapper">
                                        <svg className="science-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                                        </svg>
                                    </div>
                                    <div className="point-content">
                                        <h4>Deep Work Psychology</h4>
                                        <p><strong>The Concept:</strong> By physically removing access to notifications (NFC), constant interruption is suppressed.</p>
                                        <p><strong>Benefit:</strong> Enables the brain to achieve flow states for complex problem solving.</p>
                                    </div>
                                </div>

                                <div className="science__point">
                                    <div className="point-icon-wrapper">
                                        <svg className="science-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            <path d="M8 10h.01" />
                                            <path d="M12 10h.01" />
                                            <path d="M16 10h.01" />
                                        </svg>
                                    </div>
                                    <div className="point-content">
                                        <h4>AI-Driven Socratic Learning</h4>
                                        <p><strong>The Concept:</strong> AuLock AI acts as a tutor guiding through inquiry (Socratic Method).</p>
                                        <p><strong>Benefit:</strong> Forces students to reason, achieving meaningful, non-rote learning.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="science__visual">
                            <div className="science-image-wrapper">
                                <div className="data-preview-card">
                                    <div className="preview-header">
                                        <div className="preview-dot red"></div>
                                        <div className="preview-dot yellow"></div>
                                        <div className="preview-dot green"></div>
                                    </div>
                                    <div className="preview-body">
                                        <div className="chart-placeholder">
                                            <div className="bar" style={{ height: '60%' }}></div>
                                            <div className="bar" style={{ height: '80%' }}></div>
                                            <div className="bar" style={{ height: '40%' }}></div>
                                            <div className="bar" style={{ height: '90%' }}></div>
                                        </div>
                                        <div className="preview-label">Concentration Index</div>
                                    </div>
                                </div>
                                <img src="/images/science-lab.jpg" alt="Educational innovation with AuLock" className="science-image" style={{ opacity: 0.5, mixBlendMode: 'overlay' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Intelligence Section */}
            <section className="section data-intelligence" id="datos">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">Educational Intelligence</span>
                        <h2 className="section__title">Data for Executive Leadership</h2>
                        <p className="section__description">
                            AuLock transforms classroom interaction into actionable intelligence for strategic decision-making.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 12h5l3 5 4-11 5 9h5" />
                                </svg>
                            </div>
                            <h3 className="feature-title">School Climate Monitoring</h3>
                            <p className="feature-description">
                                Real-time metrics on concentration levels and digital anxiety. Identify focus bottlenecks by grade or shift.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 21v-2a4 4 0 0 0-3-3.87M15.73 6.64a4 4 0 0 0-5.46 0l-3.35 3.35a4 4 0 0 0 0 5.66L9 17.76a4 4 0 0 0 5.66 0l3.35-3.35a4 4 0 0 0 0-5.66" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Predictive Reports</h3>
                            <p className="feature-description">
                                Adaptive AI that detects cognitive gaps and learning patterns before evaluations.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M3 9h18" />
                                    <path d="M9 21V9" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Evidence for Educational Boards</h3>
                            <p className="feature-description">
                                Automated dashboard justifying technology investment with usage data, effective time gains, and academic progress.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                                    <path d="M12 7v6" />
                                    <path d="M12 17h.01" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Inclusion Tracking (TEA/NEEP)</h3>
                            <p className="feature-description">
                                Specific metrics on special needs student progress, facilitating precise reports for multidisciplinary teams.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="section ecosystem" id="ecosistema">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">AuLock Ecosystem</span>
                        <h2 className="section__title">A Comprehensive Support Ecosystem</h2>
                        <p className="section__description">
                            Transforming educational interaction through three fundamental pillars that power active learning.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card ecosystem-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                    <path d="M5 22v-6.57a2 2 0 0 1 1.07-1.78l.83-.39a2 2 0 0 0 1.1-1.79V10a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.46a2 2 0 0 0 1.1 1.79l.83.39A2 2 0 0 1 19 15.43V22" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Adaptive AI & Specialized Tutors</h3>
                            <p className="feature-description">
                                AI Tutor system designed around the Socratic method, not a generic search bar.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Specialty Squads:</strong> Focused support in Math, Science, Language, and History.</li>
                                <li><strong>Personalized Leveling:</strong> Automatic difficulty adjustments.</li>
                            </ul>
                        </div>

                        <div className="feature-card ecosystem-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Active Interaction Methodology</h3>
                            <p className="feature-description">
                                Transforming students from passive consumers to active protagonists of their learning.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Assisted Debate:</strong> Fosters critical thinking.</li>
                                <li><strong>Guided Questions:</strong> AI guides students to discover solutions.</li>
                                <li><strong>Creation Challenges:</strong> Original projects with AI.</li>
                            </ul>
                        </div>

                        <div className="feature-card ecosystem-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Teacher Command Center</h3>
                            <p className="feature-description">
                                Advanced tools for pedagogical management and regaining the mentor role.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Class Climate Dashboard:</strong> Real-time Deep Work analytics.</li>
                                <li><strong>Classroom Recovery:</strong> Delegates leveling to focus on mentorship.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section benefits">
                <div className="container">
                    <div className="benefits-content">
                        <div className="benefits-image-wrapper">
                            <img src="/images/teacher-student.jpg" alt="Teachers and students with AuLock"
                                className="benefit-image" />
                        </div>
                        <div className="benefits-text">
                            <span className="section__tag">Proven Benefits</span>
                            <h2 className="section__title">Use AuLock and Earn Rewards!</h2>
                            <p className="benefits__description">
                                Accumulate focus hours using AuLock in class with your peers.
                                The top course wins bonus evaluation points!
                            </p>
                            <ul className="benefits-list">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>Blocks 2G-5G / Wi-Fi / Bluetooth signal</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>Durable and secure for daily classroom use</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>Compatible with all smartphone models</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>Certified educational use</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="section about-us" id="nosotros">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">About Us</span>
                        <h2 className="section__title">Purposeful Engineering</h2>
                        <p className="section__description">
                            From high industrial security to educational innovation.
                        </p>
                    </div>

                    <div className="about-grid">
                        <div className="about-history">
                            <div className="history-content">
                                <h3>Our Trajectory</h3>
                                <p>
                                    Our trajectory began under <strong>Comercializadora Kadosh Ltda.</strong>, leading high-complexity technical engineering projects such as security systems for <strong>Carabineros (National Police Eighth Zone)</strong>. In 2016, we expanded to industrial safety innovation with <strong>Celulosa Arauco</strong>.
                                </p>
                                <p>
                                    As <strong>Seguridad y Tecnología Chile</strong>, we consolidated our expertise collaborating with <strong>Pesquera Camanchaca</strong>.
                                </p>
                                <p>
                                    Since 2025, we channel this technical precision into <strong>AuLock</strong>, evolving from mobile addiction prevention to a complete educational ecosystem.
                                </p>
                            </div>

                            <div className="institutional-logos">
                                <div className="logo-item">
                                    <div className="logo-placeholder">Carabineros Security</div>
                                </div>
                                <div className="logo-item">
                                    <div className="logo-placeholder">Arauco Industrial</div>
                                </div>
                                <div className="logo-item">
                                    <div className="logo-placeholder">Camanchaca Maritime</div>
                                </div>
                            </div>
                        </div>

                        <div className="mission-vision-wrapper">
                            <div className="mv-card mission">
                                <div className="mv-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        <path d="M2 12h20" />
                                    </svg>
                                </div>
                                <h3>Mission</h3>
                                <p>
                                    To combat digital dependency in adolescents, transforming classrooms into distraction-free spaces. We elevate academic performance and restore the ability to focus.
                                </p>
                            </div>

                            <div className="mv-card vision">
                                <div className="mv-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h3>Vision</h3>
                                <p>
                                    We aspire to transform education, fostering critical thinking and human creativity.
                                </p>
                                <blockquote className="vision-highlight">
                                    "In a world where AI handles technical tasks, one capability remains irreplaceable: human creativity. Our vision is to empower generations to master the tools of the future without being mastered by them."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section contact" id="contacto">
                <div className="container">
                    <div className="contact__card">
                        <div className="contact__content">
                            <h2 className="contact__title">Ready to Transform Learning?</h2>
                            <p className="contact__description">
                                Join thousands of students and educators who are already elevating their focus with AuLock.
                            </p>

                            <form className="contact__form" id="contactForm" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <input type="text" placeholder="Full Name" readOnly />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" placeholder="Institutional Email" readOnly />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-full" onClick={() => setIsModalOpen(true)}>
                                    <span>Request Institutional Demo</span>
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <div className="contact__info">
                            <div className="info-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <div>
                                    <div className="info-label">Email</div>
                                    <div className="info-value"><a href="mailto:gonzalo@aulock.cl">gonzalo@aulock.cl</a></div>
                                    <div className="info-value"><a href="mailto:contacto@aulock.cl">contacto@aulock.cl</a></div>
                                </div>
                            </div>

                            <div className="info-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                    <div className="info-label">WhatsApp</div>
                                    <div className="info-value"><a href="https://wa.me/56974379993" target="_blank" rel="noopener noreferrer">+569 7437 9993</a></div>
                                </div>
                            </div>

                            <div className="info-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor"
                                        strokeWidth="2" />
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <div>
                                    <div className="info-label">Location</div>
                                    <div className="info-value">Concepción, Chile (Global Coverage)</div>
                                </div>
                            </div>

                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M22.46 6c-.85.38-1.78.64-2.75.76a4.86 4.86 0 002.11-2.67c-.94.56-1.98.96-3.09 1.18a4.82 4.82 0 00-8.21 4.4A13.68 13.68 0 013.16 4.9a4.82 4.82 0 001.49 6.43 4.8 4.8 0 01-2.18-.6v.06a4.82 4.82 0 003.86 4.73 4.86 4.86 0 01-2.17.08 4.82 4.82 0 004.5 3.35 9.67 9.67 0 01-5.98 2.06c-.39 0-.77-.02-1.15-.07a13.65 13.65 0 007.4 2.17c8.88 0 13.73-7.36 13.73-13.74 0-.21 0-.42-.01-.62a9.8 9.8 0 002.41-2.5z" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 011.25 1.25A1.25 1.25 0 0117.25 8 1.25 1.25 0 0116 6.75a1.25 1.25 0 011.25-1.25M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer__content">
                        <div className="footer__brand">
                            <div className="nav__logo">
                                <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z"
                                        stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
                                    <path d="M20 15V20L23 23" stroke="url(#logoGradient)" strokeWidth="2.5"
                                        strokeLinecap="round" />
                                    <circle cx="20" cy="20" r="2" fill="url(#logoGradient)" />
                                </svg>
                                <span className="logo-text">Au<span className="logo-accent">Lock</span></span>
                            </div>
                            <p className="footer__tagline">Transforming learning through verified concentration.</p>
                        </div>

                        <div className="footer__links">
                            <div className="footer__column">
                                <h4>Product</h4>
                                <a href="#solucion">Features</a>
                                <a href="#ciencia">Science</a>
                                <a href="#">Pricing</a>
                                <a href="#">FAQ</a>
                            </div>

                            <div className="footer__column">
                                <h4>Company</h4>
                                <a href="#nosotros">About Us</a>
                                <a href="#">Blog</a>
                                <a href="#">Careers</a>
                                <a href="#contacto">Contact</a>
                            </div>

                            <div className="footer__column">
                                <h4>Legal</h4>
                                <a href="#">Privacy</a>
                                <a href="#">Terms</a>
                                <a href="#">Cookies</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <p>&copy; 2026 AuLock. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Modal */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="contactModal" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                <div className="modal">
                    <button className="modal-close" id="modalClose" onClick={() => setIsModalOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="modal-content">
                        <h2 className="modal-title">Request Information</h2>
                        <p className="modal-subtitle">Leave us your contact details and our team will reach out promptly.</p>

                        <form className="contact__form" id="modalForm" onSubmit={handleModalSubmit}>
                            <div className="form-group">
                                <label htmlFor="modalName">Full Name *</label>
                                <input type="text" id="modalName" name="name" required placeholder="e.g. Sarah Jenkins" value={modalForm.name} onChange={handleInputChange} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="modalEmail">Institutional Email *</label>
                                    <input type="email" id="modalEmail" name="email" required placeholder="name@school.edu" value={modalForm.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="modalPhone">Contact Phone *</label>
                                    <input type="tel" id="modalPhone" name="phone" required placeholder="+1 555 123 4567" value={modalForm.phone} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="modalRegion">Region / State *</label>
                                <input type="text" id="modalRegion" name="region" required placeholder="State / Province / Region" value={modalForm.region} onChange={handleInputChange} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="modalCity">City *</label>
                                    <input type="text" id="modalCity" name="city" required placeholder="e.g. Concepción" value={modalForm.city} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="modalAddress">Entity Address *</label>
                                    <input type="text" id="modalAddress" name="address" required placeholder="Street Name and Number" value={modalForm.address} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="modalInstitutionType">Institution Type *</label>
                                <select id="modalInstitutionType" name="institutionType" required value={modalForm.institutionType} onChange={handleInputChange}>
                                    <option value="">Select Type</option>
                                    <option value="Public School / District">Public School / District</option>
                                    <option value="Charter / Subsidized School">Charter / Subsidized School</option>
                                    <option value="Private K-12 Academy">Private K-12 Academy</option>
                                    <option value="Educational Board / Ministry">Educational Board / Ministry</option>
                                    <option value="Higher Education / University">Higher Education / University</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="modalMessage">Additional Comments (Optional)</label>
                                <textarea id="modalMessage" name="message" rows="3" placeholder="Any specific requirements or questions?" value={modalForm.message} onChange={handleInputChange}></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full">
                                Submit Request
                            </button>
                            <p className="form-note">
                                Upon submission, your request will be assigned to an institutional specialist.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

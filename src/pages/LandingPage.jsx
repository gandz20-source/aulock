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
            // Open Contact Modal instead of login for new visitors
            setIsModalOpen(true);
        }
    };

    const handleLogin = () => {
        navigate('/portal');
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Form submitted:', modalForm);
        alert('Gracias por tu interés. Nos pondremos en contacto contigo a la brevedad para potenciar la educación en ' + (modalForm.city || 'tu ciudad') + '.');
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
        const { id, value } = e.target;
        // Map id to state key (remove 'modal' prefix if present or match id)
        const key = id.replace('modal', '').toLowerCase();
        // Since IDs in my HTML were like modalName, modalEmail etc. I'll map them carefully or just use name attribute.
        // Let's use name attribute in inputs for easier handling
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
                        <li className="nav__item"><a href="#solucion" className="nav__link">Solución</a></li>
                        <li className="nav__item"><a href="#ciencia" className="nav__link">Ciencia</a></li>
                        <li className="nav__item"><a href="#nosotros" className="nav__link">Nosotros</a></li>
                        <li className="nav__item"><a href="#contacto" className="nav__link">Contacto</a></li>
                    </ul>

                    <button className="nav__toggle" id="navToggle" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={handleLogin} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                            {user ? 'Ir al Dashboard' : 'Ingresar'}
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
                            <span>Tecnología NFC & Ecosistema Google Workspace</span>
                        </div>

                        <h1 className="hero__title">
                            <span className="title-line">AuLock: Transformando el</span>
                            <span className="title-line title-gradient">Enfoque en Éxito Académico</span>
                        </h1>

                        <p className="hero__description">
                            En la era de la distracción digital, AuLock llega para equilibrar la tecnología con la disciplina. No estamos aquí para prohibir el uso de dispositivos, sino para convertirlos en herramientas de alta productividad y aprendizaje profundo.
                        </p>

                        <div className="hero__cta">
                            <button className="btn btn-primary" id="ctaButton" onClick={() => navigate('/login')}>
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                                </svg>
                                <span>Conectar con Google Classroom</span>
                            </button>
                            <a href="https://youtube.com/shorts/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <svg className="btn-icon-left" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
                                </svg>
                                <span>Ver Demo</span>
                            </a>
                        </div>

                        <div className="hero__stats">
                            <div className="stat">
                                <div className="stat__number">95%</div>
                                <div className="stat__label">Mejora en Concentración</div>
                            </div>
                            <div className="stat">
                                <div className="stat__number">Beta 🚀</div>
                                <div className="stat__label">Etapa de Desarrollo // Buscando Primeros Usuarios</div>
                            </div>
                            <div className="stat">
                                <div className="stat__number">4.9★</div>
                                <div className="stat__label">Valoración Promedio</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero__visual">
                        <div className="visual-card">
                            <div className="card-glow"></div>
                            <img src="/images/students-hero.jpg" alt="Estudiantes usando AuLock" className="product-image" />
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
                                <span>En Vivo</span>
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

            {/* SECTION 1: ¿POR QUÉ ELEGIR AULOCK? (CARDS SECTION) */}
            <section className="section solution" id="solucion">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🌟 ¿Por qué elegir AuLock?</span>
                        <h2 className="section__title">Tres Pilares que Redefinen el Aprendizaje</h2>
                        <p className="section__description">
                            Diseñado específicamente para instituciones educativas que buscan disciplina sin privación y automatización transparente.
                        </p>
                    </div>

                    <div className="features-grid">
                        {/* CARD 1: ENFOQUE GAMIFICADO */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h3 className="feature-title">Enfoque Gamificado</h3>
                            <p className="feature-description">
                                Transformamos el control de asistencia y atención en un juego motivador. Los alumnos mantienen su "puntuación de enfoque" (100 PS) y ganan beneficios semanales por su constancia.
                            </p>
                        </div>

                        {/* CARD 2: INTEGRACIÓN TOTAL GOOGLE */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span className="text-2xl">🌐</span>
                            </div>
                            <h3 className="feature-title">Integración Total con Google</h3>
                            <p className="feature-description">
                                AuLock vive dentro de tu ecosistema escolar. Sincronizamos tus clases de Google Classroom, tus horarios de Google Calendar y generamos reportes automáticos en PDF en Google Drive.
                            </p>
                        </div>

                        {/* CARD 3: IA SOCRÁTICA */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="feature-title">Inteligencia Artificial Socrática</h3>
                            <p className="feature-description">
                                Nuestro motor de IA no da respuestas fáciles; guía al estudiante mediante el método socrático, estimulando el razonamiento profundo y el pensamiento crítico.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: MÓDULOS DESTACADOS (TEASISTO & MOTOR DE ENFOQUE ACTIVO) */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🚀 Módulos Destacados</span>
                        <h2 className="section__title">Tutoría Inteligente & Supervisión No Invasiva</h2>
                        <p className="section__description">
                            Herramientas diseñadas para acompañar al estudiante y dar visibilidad pedagógica al docente en tiempo real.
                        </p>
                    </div>

                    <div className="features-grid">
                        {/* MÓDULO TEASISTO */}
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
                            <h3 className="feature-title">🤖 TeAsisto: Tu Compañero de Aprendizaje</h3>
                            <p className="feature-description">
                                El módulo TeAsisto es nuestro tutor inteligente impulsado por IA. Funciona como un apoyo constante para el alumno durante la clase:
                            </p>
                            <ul className="module-list">
                                <li><strong>✓ Apoyo proactivo:</strong> Resuelve dudas conceptuales sin dar la respuesta final.</li>
                                <li><strong>✓ Personalización:</strong> Se adapta al ritmo y perfil de cada estudiante.</li>
                                <li><strong>✓ Conexión en tiempo real:</strong> El profesor monitorea interacciones para saber en qué conceptos fallan los alumnos.</li>
                            </ul>
                        </div>

                        {/* MÓDULO MOTOR DE ENFOQUE ACTIVO */}
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">🛡️ Motor de Enfoque Activo</h3>
                            <p className="feature-description">
                                Detectamos automáticamente cambios de pantalla o distracciones mediante el <strong>Page Visibility API</strong>. Esto permite al profesor tener una visión real de quién sigue la clase sin necesidad de vigilancia invasiva.
                            </p>
                            <div className="module-highlight-badge">
                                📈 <strong>Lógica Transparente:</strong> Inicia en 100 PS. La salida de pantalla descuenta 3 puntos y muestra un aviso en vivo; la participación correcta en preguntas del profesor recupera +2 puntos.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: BENEFICIOS INSTITUCIONALES */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">📊 Impacto Educativo</span>
                        <h2 className="section__title">Lo que AuLock puede hacer por tu colegio</h2>
                        <p className="section__description">
                            Resultados tangibles para la gestión institucional, el bienestar estudiantil y la automatización docente.
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
                            <h3 className="feature-title">Reducir Distracciones</h3>
                            <p className="feature-description">
                                Elimina el uso inapropiado del teléfono celular en el aula virtual y presencial de forma autorregulada.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Automatizar Gestión</h3>
                            <p className="feature-description">
                                Automatiza la toma de asistencia y la generación de reportes, ahorrando horas de trabajo administrativo al docente.
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
                            <h3 className="feature-title">Métricas Reales</h3>
                            <p className="feature-description">
                                Provee datos precisos sobre el compromiso estudiantil con tableros de control intuitivos para directivos.
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
                            <h3 className="feature-title">Evidencias en Drive</h3>
                            <p className="feature-description">
                                Genera informes automáticos en formato PDF en Google Drive para fortalecer el portafolio docente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: COMPROMISO DE PRIVACIDAD & SECURITY BADGE */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">🔒 Compromiso de Privacidad</span>
                        <h2 className="section__title">Tu Data es Sagrada</h2>
                        <p className="section__description">
                            Sabemos que la información académica es sensible. En AuLock, la privacidad no es una opción; es nuestro pilar fundamental.
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
                            <h3 className="feature-title">1. Propiedad del Colegio</h3>
                            <p className="feature-description">
                                Toda la información generada (datos de alumnos, notas y métricas) es exclusiva propiedad del colegio y del estudiante.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">2. Cero Comercio de Datos</h3>
                            <p className="feature-description">
                                AuLock jamás vende, comparte ni comercializa información personal para fines publicitarios.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M6 12h4m4 0h4" />
                                </svg>
                            </div>
                            <h3 className="feature-title">3. Seguridad de Grado Bancario</h3>
                            <p className="feature-description">
                                Utilizamos encriptación de estándar bancario en Supabase para asegurar el acceso exclusivo de usuarios autorizados.
                            </p>
                        </div>
                    </div>

                    {/* SECURITY BADGE AT BOTTOM */}
                    <div className="security-badge-wrapper">
                        <div className="security-badge">
                            <svg className="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span>Datos 100% privados y protegidos por Encriptación Institucional Supabase & Google Suite Security</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="section solution" id="solucion">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">Nuestra Solución</span>
                        <h2 className="section__title">Tecnología que Potencia el Enfoque</h2>
                        <p className="section__description">
                            AuLock combina hardware NFC con software inteligente para crear
                            un ecosistema completo de gestión de concentración.
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
                            <h3 className="feature-title">Verificación NFC</h3>
                            <p className="feature-description">
                                Estuche inteligente que verifica automáticamente cuando el estudiante
                                está en modo concentración.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Bloques de Estudio</h3>
                            <p className="feature-description">
                                Sistema de intervalos optimizados basado en investigación científica
                                sobre concentración.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M7 16l4-4 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Analytics Avanzados</h3>
                            <p className="feature-description">
                                Dashboard completo con métricas de rendimiento, tendencias y
                                recomendaciones personalizadas.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"
                                        strokeWidth="2" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"
                                        strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Gestión Institucional y DAEM</h3>
                            <p className="feature-description">
                                Plataforma integral para Direcciones y DAEM: obtenga datos precisos para la gestión educativa y
                                tome decisiones basadas en evidencia.
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
                            <h3 className="feature-title">Inclusión Real (TEA/NEEP)</h3>
                            <p className="feature-description">
                                Entorno libre de distracciones ideal para estudiantes con necesidades especiales (TEA/TDAH),
                                facilitando la autorregulación y el foco.
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
                            <span className="section__tag">Respaldado por Ciencia</span>
                            <h2 className="section__title">Fundamentos Neurocientíficos</h2>
                            <p className="science__description">
                                AuLock está basado en décadas de investigación sobre atención,
                                concentración y aprendizaje efectivo.
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
                                        <h4>Principio de la Técnica Pomodoro</h4>
                                        <p><strong>El concepto:</strong> AuLock utiliza el bloqueo de dispositivos para estructurar el aprendizaje en intervalos, fomentando ciclos de alta concentración seguidos de descansos.</p>
                                        <p><strong>Beneficio:</strong> Evita el agotamiento cognitivo y mejora la retención a largo plazo.</p>
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
                                        <h4>Psicología del "Deep Work"</h4>
                                        <p><strong>El concepto:</strong> Al eliminar la posibilidad física de acceder a notificaciones (NFC), se suprime la "interrupción constante".</p>
                                        <p><strong>Beneficio:</strong> Permite al cerebro alcanzar estados de flujo (flow) para resolver problemas complejos.</p>
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
                                        <h4>Aprendizaje Socrático Mediante IA</h4>
                                        <p><strong>El concepto:</strong> La IA de AuLock actúa como un tutor que guía mediante preguntas (Método Socrático).</p>
                                        <p><strong>Beneficio:</strong> Fuerza al estudiante a razonar, logrando un aprendizaje significativo no memorístico.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="science__visual">
                            <div className="science-image-wrapper">
                                {/* Data Preview Card */}
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
                                        <div className="preview-label">Nivel de Concentración</div>
                                    </div>
                                </div>
                                <img src="/images/science-lab.jpg" alt="Innovación educativa con AuLock" className="science-image" style={{ opacity: 0.5, mixBlendMode: 'overlay' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Intelligence Section */}
            <section className="section data-intelligence" id="datos">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">Inteligencia Educativa</span>
                        <h2 className="section__title">Datos para la Gestión Directiva</h2>
                        <p className="section__description">
                            AuLock convierte la interacción en el aula en información accionable para la toma de decisiones estratégicas.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M2 12h5l3 5 4-11 5 9h5" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Monitoreo del Clima Escolar</h3>
                            <p className="feature-description">
                                Métricas en tiempo real sobre niveles de concentración y ansiedad digital. Identifique dificultades de enfoque por jornada o nivel.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 21v-2a4 4 0 0 0-3-3.87M15.73 6.64a4 4 0 0 0-5.46 0l-3.35 3.35a4 4 0 0 0 0 5.66L9 17.76a4 4 0 0 0 5.66 0l3.35-3.35a4 4 0 0 0 0-5.66" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Reportes Predictivos</h3>
                            <p className="feature-description">
                                IA adaptativa que detecta "lagunas cognitivas" y patrones de aprendizaje antes de las evaluaciones.
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
                            <h3 className="feature-title">Evidencia para DAEM</h3>
                            <p className="feature-description">
                                Dashboard automatizado que justifica la inversión con datos de uso, mejora en tiempos efectivos y progreso en nivelación académica.
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
                            <h3 className="feature-title">Seguimiento Inclusión (PIE/TEA)</h3>
                            <p className="feature-description">
                                Datos específicos sobre el progreso de alumnos con NEEP, facilitando informes precisos para equipos multidisciplinarios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="section ecosystem" id="ecosistema">
                <div className="container">
                    <div className="section__header">
                        <span className="section__tag">Ecosistema AuLock</span>
                        <h2 className="section__title">Un Ecosistema de Acompañamiento Integral</h2>
                        <p className="section__description">
                            Transformamos la interacción educativa mediante tres pilares fundamentales que potencian el aprendizaje activo.
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
                            <h3 className="feature-title">IA Adaptativa y Tutores Especializados</h3>
                            <p className="feature-description">
                                Sistema de Tutores IA diseñados bajo el método socrático, no un buscador genérico.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Squads de Especialidad:</strong> Acompañamiento específico en Matemáticas, Ciencias, Lenguaje e Historia.</li>
                                <li><strong>Nivelación Personalizada:</strong> Ajuste automático de complejidad.</li>
                            </ul>
                        </div>

                        <div className="feature-card ecosystem-card">
                            <div className="feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Metodología de Interacción Activa</h3>
                            <p className="feature-description">
                                Transformamos al estudiante de receptor pasivo a protagonista de su aprendizaje.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Debate Asistido:</strong> Fomenta el pensamiento crítico.</li>
                                <li><strong>Preguntas Guía:</strong> La IA guía al alumno a descubrir la solución.</li>
                                <li><strong>Desafíos de Creación:</strong> Proyectos originales con IA.</li>
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
                            <h3 className="feature-title">El "Control de Mando" para el Docente</h3>
                            <p className="feature-description">
                                Herramientas avanzadas para la gestión pedagógica y recuperación del rol mentor.
                            </p>
                            <ul className="ecosystem-list">
                                <li><strong>Dashboard de Clima:</strong> Datos en tiempo real sobre "Deep Work".</li>
                                <li><strong>Recuperación del Aula:</strong> Delega la nivelación para enfocarse en la mentoría.</li>
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
                            <img src="/images/teacher-student.jpg" alt="Profesores y estudiantes con AuLock"
                                className="benefit-image" />
                        </div>
                        <div className="benefits-text">
                            <span className="section__tag">Beneficios Comprobados</span>
                            <h2 className="section__title">¡Usa AuLock y Gana Puntos!</h2>
                            <p className="benefits__description">
                                Acumula horas usando AuLock en clase junto a tus compañeros.
                                ¡El curso con más horas ganará un punto extra en la próxima evaluación!
                            </p>
                            <ul className="benefits-list">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"
                                            strokeWidth="2" />
                                    </svg>
                                    <span>Bloquea señal 2G-5G / Wi-Fi / Bluetooth</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"
                                            strokeWidth="2" />
                                    </svg>
                                    <span>Seguro y resistente para uso diario</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"
                                            strokeWidth="2" />
                                    </svg>
                                    <span>Compatible con todos los teléfonos</span>
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"
                                            strokeWidth="2" />
                                    </svg>
                                    <span>Uso educativo certificado</span>
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
                        <span className="section__tag">Quiénes Somos</span>
                        <h2 className="section__title">Experiencia con Propósito</h2>
                        <p className="section__description">
                            Desde la alta seguridad industrial hacia la innovación educativa.
                        </p>
                    </div>

                    <div className="about-grid">
                        <div className="about-history">
                            <div className="history-content">
                                <h3>Nuestra Trayectoria</h3>
                                <p>
                                    Nuestra trayectoria nace bajo el alero de <strong>Comercializadora Kadosh Ltda.</strong>,
                                    donde lideramos proyectos de alta complejidad técnica, destacando la implementación de
                                    sistemas de seguridad para la <strong>Octava Zona de Carabineros</strong>. En 2016, a la innovación en seguridad industrial con <strong>Celulosa Arauco</strong>.
                                </p>
                                <p>
                                    Como <strong>Seguridad y Tecnología Chile</strong>, hemos consolidado nuestra experiencia colaborando con <strong>Pesquera Camanchaca</strong>.
                                </p>
                                <p>
                                    Desde 2025, volcamos esta experiencia técnica en <strong>AuLock</strong>, evolucionando de una respuesta a la adicción móvil a un ecosistema educativo.
                                </p>
                            </div>

                            <div className="institutional-logos">
                                <div className="logo-item">
                                    <div className="logo-placeholder">Logo Carabineros</div>
                                </div>
                                <div className="logo-item">
                                    <div className="logo-placeholder">Logo Arauco</div>
                                </div>
                                <div className="logo-item">
                                    <div className="logo-placeholder">Logo Camanchaca</div>
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
                                <h3>Misión</h3>
                                <p>
                                    Combatir la dependencia digital en adolescentes, transformando el aula en un espacio libre de distracciones. Elevamos el rendimiento académico y devolvemos la capacidad de enfocarse.
                                </p>
                            </div>

                            <div className="mv-card vision">
                                <div className="mv-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h3>Visión</h3>
                                <p>
                                    Aspiramos a transformar la educación, fomentando el pensamiento crítico y la creatividad.
                                </p>
                                <blockquote className="vision-highlight">
                                    "En un mundo donde la IA asume tareas técnicas, existe una capacidad que no puede replicar: la creación humana. Nuestra visión es formar generaciones que dominen las herramientas del futuro sin ser dominadas por ellas."
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
                            <h2 className="contact__title">¿Listo para Transformar el Aprendizaje?</h2>
                            <p className="contact__description">
                                Únete a miles de estudiantes y educadores que ya están mejorando
                                su concentración con AuLock.
                            </p>

                            <form className="contact__form" id="contactForm" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
                                {/* Simplified form that just opens modal on submit/click */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <input type="text" placeholder="Nombre completo" readOnly />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" placeholder="Email" readOnly />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-full" onClick={() => setIsModalOpen(true)}>
                                    <span>Solicitar Demostración</span>
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
                                    <div className="info-label">Ubicación</div>
                                    <div className="info-value">Concepción, Chile (Cobertura Nacional)</div>
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
                            <p className="footer__tagline">Transformando el aprendizaje a través de la concentración verificada.</p>
                        </div>

                        <div className="footer__links">
                            <div className="footer__column">
                                <h4>Producto</h4>
                                <a href="#solucion">Características</a>
                                <a href="#ciencia">Ciencia</a>
                                <a href="#">Precios</a>
                                <a href="#">FAQ</a>
                            </div>

                            <div className="footer__column">
                                <h4>Empresa</h4>
                                <a href="#">Sobre Nosotros</a>
                                <a href="#">Blog</a>
                                <a href="#">Carreras</a>
                                <a href="#contacto">Contacto</a>
                            </div>

                            <div className="footer__column">
                                <h4>Legal</h4>
                                <a href="#">Privacidad</a>
                                <a href="#">Términos</a>
                                <a href="#">Cookies</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <p>&copy; 2024 AuLock. Todos los derechos reservados.</p>
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
                        <h2 className="modal-title">Solicitar Información</h2>
                        <p className="modal-subtitle">Déjanos tus datos y te contactaremos a la brevedad.</p>

                        <form className="contact__form" id="modalForm" onSubmit={handleModalSubmit}>
                            {/* 1. Identificación */}
                            <div className="form-group">
                                <label htmlFor="modalName">Nombre Completo *</label>
                                <input type="text" id="modalName" name="name" required placeholder="Ej: Juan Pérez" value={modalForm.name} onChange={handleInputChange} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="modalEmail">Correo Institucional *</label>
                                    <input type="email" id="modalEmail" name="email" required placeholder="nombre@institucion.cl" value={modalForm.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="modalPhone">Teléfono de Contacto *</label>
                                    <input type="tel" id="modalPhone" name="phone" required placeholder="+56 9 XXXXXXXX" value={modalForm.phone} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* 2. Información Geográfica */}
                            <div className="form-group">
                                <label htmlFor="modalRegion">Región *</label>
                                <select id="modalRegion" name="region" required value={modalForm.region} onChange={handleInputChange}>
                                    <option value="">Seleccione una Región</option>
                                    <option value="Arica y Parinacota">Arica y Parinacota</option>
                                    <option value="Tarapacá">Tarapacá</option>
                                    <option value="Antofagasta">Antofagasta</option>
                                    <option value="Atacama">Atacama</option>
                                    <option value="Coquimbo">Coquimbo</option>
                                    <option value="Valparaíso">Valparaíso</option>
                                    <option value="Metropolitana">Metropolitana</option>
                                    <option value="O'Higgins">O'Higgins</option>
                                    <option value="Maule">Maule</option>
                                    <option value="Ñuble">Ñuble</option>
                                    <option value="Biobío">Biobío</option>
                                    <option value="Araucanía">Araucanía</option>
                                    <option value="Los Ríos">Los Ríos</option>
                                    <option value="Los Lagos">Los Lagos</option>
                                    <option value="Aysén">Aysén</option>
                                    <option value="Magallanes">Magallanes</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="modalCity">Ciudad *</label>
                                    <input type="text" id="modalCity" name="city" required placeholder="Ej: Concepción" value={modalForm.city} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="modalAddress">Dirección de la Entidad *</label>
                                    <input type="text" id="modalAddress" name="address" required placeholder="Calle y Número" value={modalForm.address} onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* 3. Caracterización de la Entidad */}
                            <div className="form-group">
                                <label htmlFor="modalInstitutionType">Tipo de Institución *</label>
                                <select id="modalInstitutionType" name="institutionType" required value={modalForm.institutionType} onChange={handleInputChange}>
                                    <option value="">Seleccione Tipo</option>
                                    <option value="Colegio Municipal / SLEP">Colegio Municipal / SLEP</option>
                                    <option value="Colegio Particular Subvencionado">Colegio Particular Subvencionado</option>
                                    <option value="Colegio Particular Pagado">Colegio Particular Pagado</option>
                                    <option value="DAEM / Corporación Municipal">DAEM / Corporación Municipal</option>
                                    <option value="Otra entidad">Otra entidad</option>
                                </select>
                            </div>

                            {/* 4. Mensaje Adicional */}
                            <div className="form-group">
                                <label htmlFor="modalMessage">Comentarios Adicionales (Opcional)</label>
                                <textarea id="modalMessage" name="message" rows="3" placeholder="¿Alguna duda específica?" value={modalForm.message} onChange={handleInputChange}></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full">
                                Enviar Solicitud
                            </button>
                            <p className="form-note">
                                Al enviar, sus datos serán recibidos por nuestro equipo comercial.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

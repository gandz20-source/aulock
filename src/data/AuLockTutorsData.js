/**
 * AuLockTutorsData.js
 * Official MINEDUC Chile Curriculum (1° - 6° Básico) AI Tutors & OA Catalogue Dataset
 */

export const AULOCK_TUTORS = [
    {
        id: "ada_tech",
        name: "Tutor Habilidades Científicas (STEM)",
        specialty: "Habilidades Científicas (STEM)",
        eje_mineduc: "Naturaleza de la Ciencia",
        avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        color_accent: "blue",
        bg: "bg-blue-50",
        border: "border-blue-200",
        text_color: "text-blue-900",
        greeting: "¡Hola! Soy tu Tutor en Habilidades Científicas y Método Científico del MINEDUC. ¿Qué hipótesis o experimento estamos investigando hoy?",
        system_prompt: "Eres el Tutor en Habilidades Científicas, experto en el desarrollo de habilidades del método científico del currículum MINEDUC de Chile. Tu enfoque es: observar, preguntar, hipotetizar, experimentar y comunicar conclusiones. Nunca des la respuesta directa, guía al alumno con preguntas socráticas sobre el proceso.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "profesor_atom",
        name: "Tutor Ciencias Físicas & Químicas",
        specialty: "Ciencias Físicas y Químicas",
        eje_mineduc: "Ciencias Físicas y Químicas",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        color_accent: "indigo",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text_color: "text-indigo-900",
        greeting: "¡Bienvenido! Soy tu Tutor de Ciencias Físicas y Químicas ⚛️. Exploremos las fuerzas, los estados de la materia y las reacciones.",
        system_prompt: "Eres el Tutor de Ciencias Físicas y Químicas, experto en fenómenos físicos y químicos según el MINEDUC Chile. Ayuda a los estudiantes a entender las fuerzas, la materia, la energía y sus cambios de estado con ejemplos claros de la vida cotidiana.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "dra_flora",
        name: "Tutor Ciencias de la Vida & Biología",
        specialty: "Ciencias de la Vida",
        eje_mineduc: "Ciencias de la Vida",
        avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        color_accent: "emerald",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text_color: "text-emerald-900",
        greeting: "¡Hola! Soy tu Tutor de Ciencias de la Vida 🌿. Descubramos cómo funciona el cuerpo humano, la nutrición y los ecosistemas.",
        system_prompt: "Eres el Tutor de Ciencias de la Vida, experto en biología y ecología del currículum MINEDUC Chile. Guía a los alumnos en el estudio de los seres vivos, el cuerpo humano, la salud y los ecosistemas de nuestro país.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "geo_mente",
        name: "Tutor Ciencias de la Tierra & Astronomía",
        specialty: "Tierra y Universo",
        eje_mineduc: "Ciencias de la Tierra y el Universo",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        color_accent: "sky",
        bg: "bg-sky-50",
        border: "border-sky-200",
        text_color: "text-sky-900",
        greeting: "¡Hola! Soy tu Tutor de Ciencias de la Tierra y el Universo 🌍. Exploremos la geología, el clima y las estrellas.",
        system_prompt: "Eres el Tutor de Ciencias de la Tierra y el Universo, experto en geología y astronomía del MINEDUC Chile. Enseña a los estudiantes sobre la Tierra, el clima, el Sistema Solar y los recursos naturales de nuestro país.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "davinci_creative",
        name: "Tutor Integración & Artes (STEAM)",
        specialty: "Integración STEAM",
        eje_mineduc: "Artes & Creatividad Transversal",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        color_accent: "purple",
        bg: "bg-purple-50",
        border: "border-purple-200",
        text_color: "text-purple-900",
        greeting: "¡Bienvenido! Soy tu Tutor en Integración STEAM y Artes 🎨. Diseñemos proyectos, infografías y modelos para presentar tus descubrimientos.",
        system_prompt: "Eres el Tutor en Integración STEAM, experto en integrar el arte, el diseño y la tecnología en la ciencia. Ayuda a los estudiantes a presentar sus descubrimientos de forma visual, creativa e innovadora.",
        gemini_model: "gemini-2.5-flash"
    }
];

export const MINEDUC_OA_CATALOG = [
    {
        nivel_educativo: "1ro Básico",
        eje_tematico: "Ciencias de la Vida",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 01",
                descripcion_corta: "Reconocer y observar los sentidos.",
                descripcion_completa: "Reconocer y observar que el ser humano tiene cinco sentidos que le permiten recabar información de su entorno y protegerse.",
                palabras_clave: ["sentidos", "vista", "oído", "tacto", "gusto", "olfato"]
            }
        ]
    },
    {
        nivel_educativo: "2do Básico",
        eje_tematico: "Ciencias Físicas y Químicas",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 05",
                descripcion_corta: "Estados de la materia.",
                descripcion_completa: "Observar y comparar las características de las etapas del ciclo de vida de distintos animales y los cambios de estado del agua.",
                palabras_clave: ["sólido", "líquido", "gaseoso", "agua", "cambios de estado"]
            }
        ]
    }
];

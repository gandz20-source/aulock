/**
 * AuLockTutorsData.js
 * Official MINEDUC Chile Curriculum (1° - 6° Básico) AI Tutors & OA Catalogue Dataset
 */

export const TUTOR_SUBJECT_AVATARS = {
    tech: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2306B6D4' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23164E63' stroke='%2322D3EE' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='24' fill='%2322D3EE' text-anchor='middle'>%3C/%3E</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='18' fill='%23A5F3FC' text-anchor='middle'>1 0 1 0 1</text></svg>",
    chemistry: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2310B981' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23064E3B' stroke='%2334D399' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='18' fill='%2334D399' text-anchor='middle'>H%E2%82%82O %E2%80%A2 CO%E2%82%82</text><text x='60' y='78' font-family='sans-serif' font-weight='900' font-size='22' fill='%23A7F3D0' text-anchor='middle'>%E2%9A%97%EF%B8%8F NaCl</text></svg>",
    biology: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%23059669' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23065F46' stroke='%236EE7B7' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='20' fill='%236EE7B7' text-anchor='middle'>%F0%9F%A9%AC DNA</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='18' fill='%23FCD34D' text-anchor='middle'>A-T G-C</text></svg>",
    earth: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2338BDF8' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23075985' stroke='%237DD3FC' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='22' fill='%237DD3FC' text-anchor='middle'>%F0%9F%8D%8D %F0%9F%8C%8D</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='16' fill='%23BAE6FD' text-anchor='middle'>TIERRA %E2%80%A2 N2</text></svg>",
    steam: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%23A855F7' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23581C87' stroke='%23C084FC' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='22' fill='%23C084FC' text-anchor='middle'>%F0%9F%8C%A8%EF%B8%8F STEAM</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='16' fill='%23F472B6' text-anchor='middle'>ART %E2%80%A2 CODE</text></svg>"
};

export const AULOCK_TUTORS = [
    {
        id: "ada_tech",
        name: "Tutor Habilidades Científicas (STEM)",
        specialty: "Habilidades Científicas (STEM)",
        eje_mineduc: "Naturaleza de la Ciencia",
        avatar_url: TUTOR_SUBJECT_AVATARS.tech,
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
        avatar_url: TUTOR_SUBJECT_AVATARS.chemistry,
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
        avatar_url: TUTOR_SUBJECT_AVATARS.biology,
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
        avatar_url: TUTOR_SUBJECT_AVATARS.earth,
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
        avatar_url: TUTOR_SUBJECT_AVATARS.steam,
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

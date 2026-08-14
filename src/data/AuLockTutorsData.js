/**
 * AuLockTutorsData.js
 * Official MINEDUC Chile Curriculum (1° - 6° Básico) AI Tutors & OA Catalogue Dataset
 */

export const AULOCK_TUTORS = [
    {
        id: "ada_tech",
        name: "Ada Tech",
        specialty: "Habilidades Científicas (STEM)",
        eje_mineduc: "Naturaleza de la Ciencia",
        avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        color_accent: "blue",
        bg: "bg-blue-50",
        border: "border-blue-200",
        text_color: "text-blue-900",
        greeting: "¡Hola! Soy Ada Tech, tu tutora en Habilidades Científicas y Método Científico del MINEDUC. ¿Qué hipótesis o experimento estamos investigando hoy?",
        system_prompt: "Eres Ada Tech, tutora experta en el desarrollo de habilidades científicas del currículum MINEDUC de Chile (1°-6° Básico). Tu enfoque es el método científico: observar, preguntar, hipotetizar, experimentar y comunicar conclusiones. Nunca des la respuesta directa, guía al alumno con preguntas socráticas sobre el proceso.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "profesor_atom",
        name: "Profesor Átomo",
        specialty: "Ciencias Físicas y Químicas",
        eje_mineduc: "Ciencias Físicas y Químicas",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        color_accent: "indigo",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text_color: "text-indigo-900",
        greeting: "¡Salud espacial! Soy el Profesor Átomo ⚛️. Exploremos las fuerzas, los estados de la materia y la energía que mueven al universo.",
        system_prompt: "Eres el Profesor Átomo, experto en los fenómenos físicos y químicos de la naturaleza según el MINEDUC Chile. Ayuda a los estudiantes a entender las fuerzas, la materia, la energía y sus cambios de estado. Usa analogías simples de la vida cotidiana chilena.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "dra_flora",
        name: "Dra. Flora",
        specialty: "Ciencias de la Vida",
        eje_mineduc: "Ciencias de la Vida",
        avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        color_accent: "emerald",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text_color: "text-emerald-900",
        greeting: "¡Hola, joven biólogo! Soy la Dra. Flora 🌿. Descubramos cómo funciona el cuerpo humano, la nutrición y los hermosos ecosistemas de Chile.",
        system_prompt: "Eres la Dra. Flora, experta en biología y ecología del currículum MINEDUC Chile. Guía a los alumnos en el estudio de los seres vivos, el cuerpo humano, la salud y los ecosistemas chilenos. Utiliza el motor 'Learn Your Way' para personalizar analogías.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "geo_mente",
        name: "GeoMente",
        specialty: "Tierra y Universo",
        eje_mineduc: "Ciencias de la Tierra y el Universo",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        color_accent: "sky",
        bg: "bg-sky-50",
        border: "border-sky-200",
        text_color: "text-sky-900",
        greeting: "¡Saludos astrónomo! Soy GeoMente 🌍. Viajemos desde las capas volcánicas de Chile hasta las estrellas del Sistema Solar.",
        system_prompt: "Eres GeoMente, experto en geología y astronomía del MINEDUC Chile. Enseña a los estudiantes sobre la Tierra, el clima, el Sistema Solar y los recursos naturales de nuestro país. Utiliza la cámara Visión IA para analizar imágenes del entorno.",
        gemini_model: "gemini-2.5-flash"
    },
    {
        id: "davinci_creative",
        name: "DaVinci Creative",
        specialty: "Integración STEAM",
        eje_mineduc: "Artes & Creatividad Transversal",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        color_accent: "purple",
        bg: "bg-purple-50",
        border: "border-purple-200",
        text_color: "text-purple-900",
        greeting: "¡Bienvenido al taller de invenciones! Soy DaVinci Creative 🎨. Diseñemos infografías, modelos y prototipos para comunicar tus descubrimientos.",
        system_prompt: "Eres DaVinci Creative, experto en integrar el arte, el diseño y la tecnología (STEAM) en la ciencia. Ayuda a los estudiantes a presentar sus descubrimientos de forma visual, creativa e innovadora, siempre con un enfoque educativo MINEDUC.",
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
    },
    {
        nivel_educativo: "3ro Básico",
        eje_tematico: "Ciencias de la Vida",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 06",
                descripcion_corta: "Clasificar animales vertebrados.",
                descripcion_completa: "Clasificar vertebrados en mamíferos, aves, reptiles, anfibios y peces, a partir de características como cubierta corporal, presencia de mamas y estructuras para respirar.",
                palabras_clave: ["vertebrados", "mamíferos", "aves", "peces", "respiración"]
            },
            {
                oa_id: "OA 08",
                descripcion_corta: "Observar y describir ecosistemas de Chile.",
                descripcion_completa: "Observar y describir, por medio de la investigación, las características de diferentes hábitats y las adaptaciones de los animales que allí habitan.",
                palabras_clave: ["ecosistema", "hábitat", "adaptación", "clima", "chile"]
            }
        ]
    },
    {
        nivel_educativo: "4to Básico",
        eje_tematico: "Ciencias Físicas y Químicas",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 10",
                descripcion_corta: "Investigar la luz y sus propiedades.",
                descripcion_completa: "Investigar experimentalmente las propiedades de la luz, como propagación en línea recta, reflexión y refracción.",
                palabras_clave: ["luz", "reflexión", "refracción", "transparencia", "óptica"]
            }
        ]
    },
    {
        nivel_educativo: "5to Básico",
        eje_tematico: "Ciencias de la Tierra y el Universo",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 13",
                descripcion_corta: "El agua en la Tierra y océanos.",
                descripcion_completa: "Describir la distribución del agua dulce y salada en la Tierra, considerando glaciares, océanos, ríos y lagos de Chile.",
                palabras_clave: ["agua dulce", "océanos", "glaciares", "cuencas", "chile"]
            }
        ]
    },
    {
        nivel_educativo: "6to Básico",
        eje_tematico: "Naturaleza de la Ciencia",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 14",
                descripcion_corta: "Método científico e investigación experimental.",
                descripcion_completa: "Planificar y llevar a cabo investigaciones experimentales observando, registrando variables, haciendo tablas y comunicando conclusiones fundamentadas.",
                palabras_clave: ["método científico", "hipótesis", "experimento", "variables", "datos"]
            }
        ]
    },
    {
        nivel_educativo: "7mo Básico",
        eje_tematico: "Ciencias Físicas y Químicas",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 12",
                descripcion_corta: "Comportamiento de los gases y temperatura.",
                descripcion_completa: "Investigar el comportamiento de los gases ideales y sus relaciones entre presión, volumen y temperatura en situaciones cotidianas.",
                palabras_clave: ["gases", "presión", "volumen", "temperatura"]
            }
        ]
    },
    {
        nivel_educativo: "8vo Básico",
        eje_tematico: "Ciencias de la Vida",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 02",
                descripcion_corta: "La célula como unidad básica de la vida.",
                descripcion_completa: "Describir la célula eucarionte y procarionte como unidad estructural y funcional de los seres vivos.",
                palabras_clave: ["célula", "eucarionte", "procarionte", "organelos"]
            }
        ]
    },
    {
        nivel_educativo: "Iº Medio",
        eje_tematico: "Ciencias Físicas y Químicas",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 09",
                descripcion_corta: "Ondas y espectro electromagnético.",
                descripcion_completa: "Analizar el comportamiento de las ondas mecánicas y electromagnéticas en fenómenos del sonido y la luz.",
                palabras_clave: ["ondas", "frecuencia", "longitud de onda", "espectro"]
            }
        ]
    },
    {
        nivel_educativo: "IIº Medio",
        eje_tematico: "Ciencias de la Vida",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 05",
                descripcion_corta: "Genética, ADN y síntesis de proteínas.",
                descripcion_completa: "Explicar cómo la estructura del ADN transmite la información genética y dirige la síntesis de proteínas.",
                palabras_clave: ["ADN", "genética", "cromosomas", "proteínas"]
            }
        ]
    },
    {
        nivel_educativo: "IIIº Medio",
        eje_tematico: "Ciencias de la Tierra y el Universo",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 03",
                descripcion_corta: "Cambio climático y huella ecológica.",
                descripcion_completa: "Modelar el impacto del cambio climático global y evaluar estrategias de sostenibilidad y mitigación medioambiental.",
                palabras_clave: ["cambio climático", "efecto invernadero", "sostenibilidad"]
            }
        ]
    },
    {
        nivel_educativo: "IVº Medio",
        eje_tematico: "Integración STEAM & Investigación",
        objetivos_aprendizaje: [
            {
                oa_id: "OA 01",
                descripcion_corta: "Proyecto de investigación científica y tecnología.",
                descripcion_completa: "Diseñar y ejecutar un proyecto de investigación o prototipo tecnológico para resolver problemas de la comunidad con rigor científico.",
                palabras_clave: ["investigación", "prototipo", "innovación", "tecnología"]
            }
        ]
    }
];

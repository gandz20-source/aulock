/**
 * AuLockMineducStandards.js
 * Official MINEDUC / Agencia de Calidad de la Educación Chile
 * Estándares Indicativos de Desempeño para Establecimientos Educacionales
 */

export const MINEDUC_QUALITY_STANDARDS = [
    {
        ambito_id: "gestion_pedagogica",
        nombre_ambito: "Gestión Pedagógica",
        badge_color: "bg-blue-100 text-blue-900 border-blue-300",
        icon_name: "BookOpen",
        cumplimiento_colegio: 94,
        estandares: [
            {
                estandar_id: "GP1",
                nombre_estandar: "Enseñanza para el aprendizaje de todos los estudiantes",
                descripcion: "El equipo directivo y docente asegura una planificación y práctica pedagógica orientada a garantizar aprendizajes significativos en la totalidad de los alumnos.",
                dimensiones: [
                    "Preparación de la enseñanza",
                    "Acción docente en el aula",
                    "Evaluación y retroalimentación adaptativa"
                ],
                acciones_clave_sugeridas: [
                    "Utilizar variedad de estrategias didácticas con tecnología socrática y Learn Your Way.",
                    "Retroalimentar oportuna y constructivamente cada evaluación con seguimiento AuLock.",
                    "Monitorear la cobertura curricular de los Objetivos de Aprendizaje (OA) del MINEDUC."
                ]
            },
            {
                estandar_id: "GP2",
                nombre_estandar: "Apoyo al desarrollo de los estudiantes",
                descripcion: "El establecimiento implementa mecanismos de apoyo académico, vocacional y afectivo para atender las necesidades diversas.",
                dimensiones: [
                    "Atención a la diversidad e inclusión",
                    "Orientación vocacional temprana",
                    "Soporte psicopedagógico"
                ],
                acciones_clave_sugeridas: [
                    "Acompañar a estudiantes con rendimiento descendido mediante tutorías socráticas IA.",
                    "Ejecutar el test de perfilamiento vocacional de Holland en 3° y 4° Medio."
                ]
            }
        ]
    },
    {
        ambito_id: "liderazgo_escolar",
        nombre_ambito: "Liderazgo Escolar",
        badge_color: "bg-amber-100 text-amber-900 border-amber-300",
        icon_name: "Trophy",
        cumplimiento_colegio: 91,
        estandares: [
            {
                estandar_id: "LE1",
                nombre_estandar: "Liderazgo del Director y Equipo Directivo",
                descripcion: "El director y el equipo directivo conducen la gestión institucional hacia la mejora continua de los aprendizajes y la cultura escolar.",
                dimensiones: [
                    "Visión estratégica y PME",
                    "Conducción de la gestión pedagógica UTP",
                    "Desarrollo de capacidades profesionales"
                ],
                acciones_clave_sugeridas: [
                    "Revisar tableros en tiempo real de asistencia y atención en aula.",
                    "Fomentar comunidades de aprendizaje entre profesores y mentores de Squads."
                ]
            }
        ]
    },
    {
        ambito_id: "formacion_convivencia",
        nombre_ambito: "Formación y Convivencia",
        badge_color: "bg-rose-100 text-rose-900 border-rose-300",
        icon_name: "Heart",
        cumplimiento_colegio: 96,
        estandares: [
            {
                estandar_id: "FC1",
                nombre_estandar: "Convivencia Escolar y Clima de Aula",
                descripcion: "El colegio promueve un ambiente de respeto, inclusión, seguridad emocional y resolución pacífica de conflictos.",
                dimensiones: [
                    "Ambiente de respeto y buen trato",
                    "Resolución pacífica de conflictos",
                    "Sentido de pertenencia e identidad escolar"
                ],
                acciones_clave_sugeridas: [
                    "Monitorear diariamente el barómetro emocional previo al inicio de clases.",
                    "Mantener activo el canal de denuncia confidencial y encriptada (ShieldAlert).",
                    "Promover frases diarias de convivencia y empatía en los paneles de los estudiantes."
                ]
            }
        ]
    },
    {
        ambito_id: "gestion_recursos",
        nombre_ambito: "Gestión de Recursos",
        badge_color: "bg-emerald-100 text-emerald-900 border-emerald-300",
        icon_name: "ShieldCheck",
        cumplimiento_colegio: 88,
        estandares: [
            {
                estandar_id: "GR1",
                nombre_estandar: "Gestión del Personal y Recursos Educativos",
                descripcion: "La institución administra eficientemente los recursos humanos, de infraestructura tecnológica y financiera para el aprendizaje.",
                dimensiones: [
                    "Administración de personal docente",
                    "Infraestructura y tecnología (Dispositivos AuLock NFC)",
                    "Uso de recursos educativos digitales"
                ],
                acciones_clave_sugeridas: [
                    "Garantizar la operatividad de los estuches de bloqueo NFC en cada aula.",
                    "Evaluar anualmente la satisfacción docente mediante el sistema de calificación secreta."
                ]
            }
        ]
    }
];

export const MineducStandardsRegistry = {
    gestion_pedagogica: {
        id: "GP1",
        nombre_estandar: "Enseñanza para el aprendizaje de todos los estudiantes",
        dimensiones: ["Preparación de la enseñanza", "Acción docente en el aula", "Evaluación y retroalimentación"],
        palabras_clave: ["motivación", "estrategias", "participación", "clima"]
    },
    liderazgo_escolar: {
        id: "LE1",
        nombre_estandar: "Liderazgo del Director y Equipo Directivo",
        dimensiones: ["Visión estratégica y PME", "Conducción de la gestión pedagógica UTP", "Desarrollo de capacidades"],
        palabras_clave: ["liderazgo", "visión", "UTP", "PME", "gestión"]
    },
    formacion_convivencia: {
        id: "FC1",
        nombre_estandar: "Convivencia Escolar y Clima de Aula",
        dimensiones: ["Ambiente de respeto", "Resolución pacífica de conflictos", "Sentido de pertenencia"],
        palabras_clave: ["convivencia", "respeto", "conflictos", "pertenencia", "empatía"]
    },
    gestion_recursos: {
        id: "GR1",
        nombre_estandar: "Gestión del Personal y Recursos Educativos",
        dimensiones: ["Administración de personal docente", "Infraestructura y tecnología (AuLock NFC)", "Uso de recursos digitales"],
        palabras_clave: ["recursos", "nfc", "funda", "tecnología", "infraestructura"]
    }
};

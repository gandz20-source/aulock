/**
 * AuLockMineducConvivenciaDataset.js
 * Recursos Educativos y de Convivencia Escolar del MINEDUC Chile
 */

export const MINEDUC_CONVIVENCIA_RESOURCES = [
    {
        tipo_recurso: "mensaje_bienestar",
        frecuencia: "diario",
        audiencia: "alumno",
        contenido: {
            titulo: "El Valor del Mes: La Empatía",
            cita: "“Trata a los demás como te gustaría ser tratado.”",
            reflexion_corta: "¿Cómo demostraste empatía hoy con un compañero que estaba solo?",
            accion_sugerida: "Invita a alguien nuevo a tu grupo en el recreo."
        },
        vinculo_mineduc_id: "recurso_empatia_mayo_mineduc"
    },
    {
        tipo_recurso: "consejo_convivencia",
        frecuencia: "semanal",
        audiencia: "alumno_profesor",
        contenido: {
            titulo: "Acuerdo de Sala: Escucha Activa",
            descripcion: "Recordemos levantar la mano y esperar nuestro turno para hablar. Respetar al que habla es respetar el aprendizaje de todos.",
            icono_visual: "✋"
        }
    },
    {
        tipo_recurso: "efemeride_ciudadana",
        frecuencia: "especifica_fecha",
        fecha: "2026-05-21",
        contenido: {
            titulo: "Día de las Glorias Navales",
            mensaje: "Hoy recordamos un hito de nuestra historia. Más allá de la batalla, valoremos el diálogo y la paz como herramientas para resolver conflictos.",
            imagen_referencia: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
        }
    }
];

export const WEEKLY_CLASSROOM_AGREEMENTS = [
    {
        id_semana: "2026_W20",
        fecha_inicio: "2026-05-20",
        fecha_fin: "2026-05-24",
        tipo_contenido: "acuerdo_de_sala",
        audiencia: "alumno",
        contenido: {
            titulo: "Nuestro Acuerdo Semanal: La Escucha Activa",
            mensaje_corto: "Pedimos la palabra y esperamos nuestro turno para hablar.",
            descripcion_larga: "Para que todos podamos aprender, es fundamental respetar los tiempos de los demás. Esta semana nos concentraremos en no interrumpir.",
            icono_emoji: "🤫"
        },
        fuente_mineduc_url: "https://convivenciaparaelaprendizaje.mineduc.cl/acuerdos-de-sala"
    },
    {
        id_semana: "2026_W21",
        fecha_inicio: "2026-05-27",
        fecha_fin: "2026-05-31",
        tipo_contenido: "acuerdo_de_sala",
        audiencia: "alumno",
        contenido: {
            titulo: "Nuestro Acuerdo Semanal: Cuidado del Entorno",
            mensaje_corto: "Mantenemos nuestro espacio de trabajo limpio y ordenado.",
            descripcion_larga: "Un aula limpia beneficia la concentración y el bienestar de todos nuestros compañeros.",
            icono_emoji: "🧹"
        },
        fuente_mineduc_url: "https://convivenciaparaelaprendizaje.mineduc.cl/cuidados"
    }
];

/**
 * AuLockMineducActivitiesDataset.js
 * Dataset de Actividades y Controles Vinculados al Currículum MINEDUC Chile
 */

export const MINEDUC_ACTIVITIES_REGISTRY = [
    {
        actividad_id: "ACT_12345",
        profesor_id: "PROF_001",
        profesor_nombre: "Prof. Roberto Silva",
        titulo: "Control: Propiedades de la Luz y de la Materia",
        estado: "lanzada", // 'borrador' | 'lanzada' | 'cerrada'
        vinculacion_curricular: {
            asignatura: "Ciencias Naturales",
            nivel: "4° Básico",
            eje: "Ciencias Físicas y Químicas",
            oa_codigo: "OA 08",
            oa_descripcion: "Investigar experimentalmente y explicar las propiedades de la luz (propagación rectilínea, reflexión y refracción)."
        },
        configuracion: {
            tipo: "cuestionario_vivo",
            usa_rubrica_ia: true,
            permite_entrega_tardia: false,
            tiempo_limite_minutos: 15
        },
        preguntas: [
            {
                id: "q1",
                texto: "¿Qué fenómeno ocurre cuando la luz cambia de dirección al pasar del aire al agua?",
                tipo: "alternativa",
                opciones: ["A) Reflexión total", "B) Refracción de la luz", "C) Difracción", "D) Absorción térmica"],
                correcta: "B) Refracción de la luz"
            },
            {
                id: "q2",
                texto: "Explica la diferencia entre un cuerpo transparente, translúcido y opaco dando un ejemplo cotidiano.",
                tipo: "abierta",
                rubrica_id: "RUB_MINEDUC_INVESTIGAR",
                rubrica_criterios: ["Precisión conceptual", "Ejemplificación realista", "Claridad sintáctica"]
            }
        ],
        fecha_creacion: "2026-05-20T10:00:00Z"
    },
    {
        actividad_id: "ACT_67890",
        profesor_id: "PROF_002",
        profesor_nombre: "Dra. Flora",
        titulo: "Evaluación de Campo: Ecosistemas y Biodiversidad Nativa",
        estado: "borrador",
        vinculacion_curricular: {
            asignatura: "Ciencias Naturales",
            nivel: "5° Básico",
            eje: "Ciencias de la Vida",
            oa_codigo: "OA 10",
            oa_descripcion: "Analizar el rol de los actores comunitarios en la conservación del agua y cuencas hidrográficas de Chile."
        },
        configuracion: {
            tipo: "investigacion_grupal",
            usa_rubrica_ia: true,
            permite_entrega_tardia: true,
            tiempo_limite_minutos: 45
        },
        preguntas: [
            {
                id: "q1_bio",
                texto: "¿Cuáles son las 3 principales amenazas antropogénicas a las cuencas del Maule y Biobío?",
                tipo: "abierta",
                rubrica_id: "RUB_MINEDUC_BIODIVERSIDAD"
            }
        ],
        fecha_creacion: "2026-05-22T14:30:00Z"
    }
];

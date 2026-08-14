/**
 * EstandaresMinEducMock.js
 * Simulación de datos en memoria para desarrollo (Registro de Estándares MINEDUC Chile)
 */

export const MineducStandardsRegistry = {
    gestion_pedagogica: {
        id: "GP1",
        nombre_estandar: "Enseñanza para el aprendizaje de todos los estudiantes",
        dimensiones: [
            "Preparación de la enseñanza", 
            "Acción docente en el aula", 
            "Evaluación y retroalimentación"
        ],
        palabras_clave: ["motivación", "estrategias", "participación", "clima", "retroalimentación"]
    },
    liderazgo_escolar: {
        id: "LE1",
        nombre_estandar: "Liderazgo del Director y Equipo Directivo",
        dimensiones: [
            "Visión estratégica y PME", 
            "Conducción de la gestión pedagógica UTP", 
            "Desarrollo de capacidades profesionales"
        ],
        palabras_clave: ["liderazgo", "visión", "UTP", "PME", "gestión"]
    },
    formacion_convivencia: {
        id: "FC1",
        nombre_estandar: "Convivencia Escolar y Clima de Aula",
        dimensiones: [
            "Ambiente de respeto", 
            "Resolución pacífica de conflictos", 
            "Sentido de pertenencia"
        ],
        palabras_clave: ["convivencia", "respeto", "conflictos", "pertenencia", "empatía"]
    },
    gestion_recursos: {
        id: "GR1",
        nombre_estandar: "Gestión del Personal y Recursos Educativos",
        dimensiones: [
            "Administración de personal docente", 
            "Infraestructura y tecnología (AuLock NFC)", 
            "Uso de recursos educativos digitales"
        ],
        palabras_clave: ["recursos", "nfc", "funda", "tecnología", "infraestructura"]
    }
};

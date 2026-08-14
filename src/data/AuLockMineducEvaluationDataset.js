/**
 * AuLockMineducEvaluationDataset.js
 * Official MINEDUC Evaluation Indicators & Suggested Rubrics Dataset
 */

export const MINEDUC_EVALUATION_DATASET = [
    {
        ciclo: "Educación Básica",
        nivel: "1º Básico",
        asignatura: "Ciencias Naturales",
        oa_catalogo: [
            {
                oa_id: "OA 01",
                oa_descripcion: "Reconocer y observar que el ser humano tiene cinco sentidos.",
                indicadores_evaluacion_mineduc: [
                    {
                        indicador_id: "IND01_A",
                        descripcion: "Identifican los 5 sentidos y los órganos asociados (ojos, oídos, piel, lengua, nariz).",
                        nivel_esperado: "Intermedio"
                    },
                    {
                        indicador_id: "IND01_B",
                        descripcion: "Describen situaciones donde los sentidos previenen riesgos en el entorno cotidiano.",
                        nivel_esperado: "Avanzado"
                    }
                ],
                rubrica_sugerida_mineduc: {
                    dimensiones: ["Identificación sensorial", "Cuidado personal", "Comunicación verbal"],
                    niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
                }
            }
        ]
    },
    {
        ciclo: "Educación Básica",
        nivel: "3º Básico",
        asignatura: "Ciencias Naturales",
        oa_catalogo: [
            {
                oa_id: "OA 06",
                oa_descripcion: "Clasificar animales vertebrados en mamíferos, aves, reptiles, anfibios y peces.",
                indicadores_evaluacion_mineduc: [
                    {
                        indicador_id: "IND06_A",
                        descripcion: "Clasifican animales vertebrados según su cubierta corporal y forma de respiración.",
                        nivel_esperado: "Intermedio"
                    },
                    {
                        indicador_id: "IND06_B",
                        descripcion: "Comparan las etapas de desarrollo entre mamíferos y peces con vocabulario preciso.",
                        nivel_esperado: "Avanzado"
                    }
                ],
                rubrica_sugerida_mineduc: {
                    dimensiones: ["Taxonomía de vertebrados", "Análisis comparativo", "Expresión científica"],
                    niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
                }
            },
            {
                oa_id: "OA 08",
                oa_descripcion: "Observar y describir características de diferentes hábitats y ecosistemas de Chile.",
                indicadores_evaluacion_mineduc: [
                    {
                        indicador_id: "IND08_A",
                        descripcion: "Identifican factores bióticos y abióticos en ecosistemas de la zona central y sur de Chile.",
                        nivel_esperado: "Intermedio"
                    },
                    {
                        indicador_id: "IND08_B",
                        descripcion: "Explican las adaptaciones morfofisiológicas de especies nativas frente al clima.",
                        nivel_esperado: "Destacado"
                    }
                ],
                rubrica_sugerida_mineduc: {
                    dimensiones: ["Comprensión ecológica", "Relación clima-adaptación", "Conciencia medioambiental"],
                    niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
                }
            }
        ]
    },
    {
        ciclo: "Educación Básica",
        nivel: "5º Básico",
        asignatura: "Ciencias Naturales",
        oa_catalogo: [
            {
                oa_id: "OA 10",
                oa_descripcion: "Analizar la participación y el rol de los actores en la conservación de la biodiversidad y el agua.",
                indicadores_evaluacion_mineduc: [
                    {
                        indicador_id: "IND10_A",
                        descripcion: "Explican con sus palabras la importancia de la conservación de las cuencas hidrográficas en Chile.",
                        nivel_esperado: "Intermedio"
                    },
                    {
                        indicador_id: "IND10_B",
                        descripcion: "Distinguen las responsabilidades de los diferentes actores comunitarios e industriales en el uso del agua.",
                        nivel_esperado: "Avanzado"
                    }
                ],
                rubrica_sugerida_mineduc: {
                    dimensiones: ["Conocimiento conceptual", "Análisis crítico", "Comunicación de ideas"],
                    niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
                }
            }
        ]
    },
    {
        ciclo: "Educación Media",
        nivel: "IVº Medio",
        asignatura: "Ciencias Naturales & Biología",
        oa_catalogo: [
            {
                oa_id: "OA 01",
                oa_descripcion: "Diseñar y ejecutar proyectos de investigación científica o innovación tecnológica.",
                indicadores_evaluacion_mineduc: [
                    {
                        indicador_id: "IND01_IV_A",
                        descripcion: "Formulan preguntas investigables e hipótesis sustentadas en evidencia bibliográfica reciente.",
                        nivel_esperado: "Avanzado"
                    },
                    {
                        indicador_id: "IND01_IV_B",
                        descripcion: "Proponen un prototipo tecnológico sustentable resolviendo una problemática local.",
                        nivel_esperado: "Destacado"
                    }
                ],
                rubrica_sugerida_mineduc: {
                    dimensiones: ["Rigor en el Método Científico", "Innovación y Prototipado", "Sustentabilidad y Ética"],
                    niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
                }
            }
        ]
    }
];

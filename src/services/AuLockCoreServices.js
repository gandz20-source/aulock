/**
 * AuLockCoreServices.js
 * Servicios Centrales de Inteligencia Curricular MINEDUC Chile
 */

import { MINEDUC_OA_CATALOG } from '../data/AuLockTutorsData';
import { MINEDUC_EVALUATION_DATASET } from '../data/AuLockMineducEvaluationDataset';

export async function searchCurriculumAPI(searchTerm, nivelId = '4° Básico', asignaturaId = 'Ciencias Naturales') {
    // Simulación de delay de consulta a DB curricular en tiempo real
    await new Promise(res => setTimeout(res, 200));

    const termLower = searchTerm.toLowerCase();

    // Map all OAs across datasets
    const catalogOAs = MINEDUC_OA_CATALOG.flatMap(item => {
        const oas = item.objetivos_aprendizaje || item.oa_catalogo || [];
        return oas.map(oa => ({
            oa_id: oa.oa_id || oa.codigo || 'OA 08',
            codigo: oa.oa_id || oa.codigo || 'OA 08',
            eje_aprendizaje: item.eje_tematico || item.eje || item.asignatura || 'Ciencias Físicas y Químicas',
            descripcion: oa.descripcion_completa || oa.oa_descripcion || oa.descripcion_corta || 'Objetivo de Aprendizaje',
            nivelId: item.nivel_educativo || item.nivel || '4° Básico',
            asignaturaId: item.eje_tematico || item.asignatura || 'Ciencias Naturales'
        }));
    });

    const datasetOAs = MINEDUC_EVALUATION_DATASET.flatMap(item => {
        const oas = item.oa_catalogo || [];
        return oas.map(oa => ({
            oa_id: oa.oa_id || oa.codigo || 'OA 10',
            codigo: oa.oa_id || oa.codigo || 'OA 10',
            eje_aprendizaje: item.asignatura || 'Ciencias Naturales',
            descripcion: oa.oa_descripcion || oa.descripcion || 'Objetivo de Aprendizaje MINEDUC',
            nivelId: item.nivel || '5° Básico',
            asignaturaId: item.asignatura || 'Ciencias Naturales'
        }));
    });

    const allOAs = [...catalogOAs, ...datasetOAs];

    return allOAs.filter(oa => 
        oa.codigo.toLowerCase().includes(termLower) ||
        oa.descripcion.toLowerCase().includes(termLower) ||
        oa.eje_aprendizaje.toLowerCase().includes(termLower)
    ).slice(0, 5);
}

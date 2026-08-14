/**
 * SynergyManager.js
 * Lógica de Ganancia de Puntos por Misión y Canje de Décimas Académicas MINEDUC (Backend API & Local Storage)
 */

class SynergyManager {
    constructor() {
        this.STORAGE_KEY = 'aulock_student_synergy';
        this.VALOR_PUNTO_A_DECIMA = 500; // 500 Monedas = +0.1 décimas
    }

    getStudentSynergy(studentId = 'STUDENT_001') {
        const saved = localStorage.getItem(`${this.STORAGE_KEY}_${studentId}`);
        return saved ? JSON.parse(saved) : {
            id: studentId,
            nombre: "Ryo",
            synergyPoints: 750,
            misionesCompletadas: {
                "AI_M_MAT01": "2026-10-27T10:00:00Z",
                "AI_M_FIS01": "2026-10-28T15:30:00Z"
            },
            historialCanje: [
                { fecha: "2026-08-06T14:20:00Z", puntos: 500, bono: 0.1, materia: "Matemáticas" }
            ]
        };
    }

    saveStudentSynergy(studentId, data) {
        localStorage.setItem(`${this.STORAGE_KEY}_${studentId}`, JSON.stringify(data));
    }

    // 1. Otorgar puntos por misión completada (con validación de duplicados y transacción)
    async otorgarPuntosPorMision(studentId = 'STUDENT_001', misionId = 'AI_M_BIO01', puntosOtorgados = 100) {
        const studentData = this.getStudentSynergy(studentId);

        if (!studentData.misionesCompletadas) {
            studentData.misionesCompletadas = {};
        }

        if (studentData.misionesCompletadas[misionId]) {
            throw new Error('La misión ya fue completada');
        }

        studentData.synergyPoints += puntosOtorgados;
        studentData.misionesCompletadas[misionId] = new Date().toISOString();

        this.saveStudentSynergy(studentId, studentData);

        return {
            puntosOtorgados,
            synergyPoints: studentData.synergyPoints
        };
    }

    // Alias para compatibilidad con llamadas existentes
    async completeMisionDeCampo(studentId = 'STUDENT_001', misionId = 'AI_M_BIO01', dificultadAcademica = 'medio') {
        const puntosBase = {
            'basico': 50,
            'medio': 100,
            'avanzado': 200
        };
        const pts = puntosBase[dificultadAcademica] || 100;
        const res = await this.otorgarPuntosPorMision(studentId, misionId, pts);
        return {
            pointsEarned: res.puntosOtorgados,
            totalPoints: res.synergyPoints
        };
    }

    // 2. Canjear puntos por bono de décimas (conecta con el libro de clases del profe)
    async canjearPuntosPorNota(studentId = 'STUDENT_001', materia = 'Matemáticas', notaId = 'EVAL_MAT_01', decimasBono = 0.1) {
        const costoPuntos = (decimasBono / 0.1) * this.VALOR_PUNTO_A_DECIMA; // Cálculo automático (0.1 -> 500 pts)
        const studentData = this.getStudentSynergy(studentId);

        // Verificación de fondos
        if (studentData.synergyPoints < costoPuntos) {
            throw new Error(`Puntos insuficientes. Requieres ${costoPuntos} PS (tienes ${studentData.synergyPoints} PS).`);
        }

        // Ejecutar canje
        studentData.synergyPoints -= costoPuntos;
        if (!studentData.historialCanje) studentData.historialCanje = [];
        studentData.historialCanje.push({
            fecha: new Date().toISOString(),
            puntos: costoPuntos,
            bono: decimasBono,
            materia: materia
        });

        this.saveStudentSynergy(studentId, studentData);

        // *** CONEXIÓN CRÍTICA ***
        await this._inyectarBonoAlProfesor(studentId, notaId, decimasBono);

        return {
            success: true,
            newTotalPoints: studentData.synergyPoints,
            message: `Canje realizado con éxito. Se han sumado +${decimasBono} décimas a la evaluación seleccionada.`
        };
    }

    // Alias para compatibilidad
    async redeemPointsForBonusNota(studentId = 'STUDENT_001', notaId = 'EVAL_MAT_01', puntosACanjea = 500, decimasABono = 0.1, materia = 'Matemáticas') {
        try {
            const res = await this.canjearPuntosPorNota(studentId, materia, notaId, decimasABono);
            return res;
        } catch (e) {
            return {
                success: false,
                message: e.message
            };
        }
    }

    // Método privado para comunicarse con el módulo del profesor
    async _inyectarBonoAlProfesor(studentId, notaId, decimasBono) {
        console.log(`[SISTEMA DE GESTIÓN ACADÉMICA] Inyectando bono de +${decimasBono} al estudiante ${studentId} en la nota ${notaId}`);
        
        const savedBonuses = localStorage.getItem('aulock_teacher_redeemed_bonuses');
        const bonuses = savedBonuses ? JSON.parse(savedBonuses) : [];
        bonuses.push({
            studentId,
            notaId,
            decimasBono,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('aulock_teacher_redeemed_bonuses', JSON.stringify(bonuses));
    }

    // Método para sumar estrellas colectivas al curso (Sinergia Social)
    sumarEstrellasCurso(classId = '4_MEDIO_A', amount = 10) {
        const saved = localStorage.getItem(`aulock_class_stars_${classId}`);
        const current = saved ? parseInt(saved, 10) : 120;
        const updated = current + amount;
        localStorage.setItem(`aulock_class_stars_${classId}`, updated.toString());
        console.log(`⭐ [SINERGIA SOCIAL] Curso ${classId} acumuló +${amount} estrellas. Total: ${updated}`);
        return updated;
    }
}

export const synergyManager = new SynergyManager();

/**
 * reportExportUtils.js
 * Client-side RFC 4180 CSV & Professional PDF Document Generation
 * High-Stakes Public Education Pilot (SLEP Andalién Sur / MINEDUC Chile)
 */

/**
 * 1. Export structured data to RFC 4180 CSV with UTF-8 BOM for Microsoft Excel compatibility
 */
export function exportReportToCSV({ title = 'Reporte_AuLock', headers = [], rows = [], filename = '' }) {
    if (!headers.length && !rows.length) {
        console.warn('No hay datos para exportar a CSV');
        return;
    }

    // Escape CSV fields according to RFC 4180
    const escapeField = (field) => {
        if (field === null || field === undefined) return '""';
        const stringField = String(field);
        if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes(';')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return `"${stringField}"`;
    };

    const headerLine = headers.map(escapeField).join(';');
    const rowLines = rows.map(row => {
        if (Array.isArray(row)) {
            return row.map(escapeField).join(';');
        } else if (typeof row === 'object') {
            return headers.map(h => escapeField(row[h] || '')).join(';');
        }
        return escapeField(row);
    });

    const csvContent = [headerLine, ...rowLines].join('\r\n');
    // Prepend UTF-8 BOM (\uFEFF) so Excel respects accents and special characters
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const finalName = filename || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', finalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 2. Generate and open a sleek, official printable PDF report
 * Formatted for the SLEP Andalién Sur / MINEDUC pilot with AuLock Watermark
 */
export function exportReportToPDF({
    title = 'REPORTE ANALÍTICO DE RENDIMIENTO Y TELEMETRÍA',
    subtitle = 'Auditoría Académica y Telemetría de Aula en Vivo',
    teacherName = 'Prof. Carlos Rivas',
    course = '4° Medio A',
    date = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    headers = [],
    rows = [],
    summaryNotes = ''
}) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor permite las ventanas emergentes (popups) para exportar el documento PDF.');
        return;
    }

    const tableHeadersHtml = headers.map(h => `<th style="padding: 10px 14px; background: #0f172a; color: #38bdf8; font-size: 11px; text-transform: uppercase; border: 1px solid #1e293b; text-align: left;">${h}</th>`).join('');

    const tableRowsHtml = rows.map((row, idx) => {
        const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        let cells = '';
        if (Array.isArray(row)) {
            cells = row.map(cell => `<td style="padding: 9px 14px; border: 1px solid #e2e8f0; font-size: 11px; color: #1e293b;">${cell}</td>`).join('');
        } else if (typeof row === 'object') {
            cells = headers.map(h => `<td style="padding: 9px 14px; border: 1px solid #e2e8f0; font-size: 11px; color: #1e293b;">${row[h] !== undefined ? row[h] : ''}</td>`).join('');
        }
        return `<tr style="background: ${bg};">${cells}</tr>`;
    }).join('');

    const docHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${title} - ${course}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 24px;
            background: #ffffff;
            position: relative;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 64px;
            font-weight: 900;
            color: rgba(6, 182, 212, 0.045);
            pointer-events: none;
            z-index: 0;
            white-space: nowrap;
            letter-spacing: 6px;
            text-transform: uppercase;
        }
        .header-table {
            width: 100%;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .institution-title {
            font-size: 14px;
            font-weight: 800;
            color: #0369a1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .report-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            margin: 4px 0;
        }
        .report-subtitle {
            font-size: 12px;
            color: #64748b;
        }
        .meta-box {
            background: #f1f5f9;
            border-left: 4px solid #0284c7;
            padding: 10px 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
        }
        .meta-item {
            margin: 3px 0;
        }
        .meta-item strong {
            color: #334155;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            page-break-inside: auto;
        }
        table.data-table tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        .summary-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 16px;
            font-size: 11px;
            line-height: 1.5;
            color: #334155;
        }
        .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
        }
        .no-print {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        .btn-print {
            background: #0284c7;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
        }
        .btn-print:hover {
            background: #0369a1;
        }
        @media print {
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="watermark">AuLock Data Intelligence</div>

    <div class="no-print">
        <button class="btn-print" onclick="window.print()">🖨️ Guardar como PDF / Imprimir</button>
    </div>

    <table class="header-table">
        <tr>
            <td>
                <div class="institution-title">Servicio Local de Educación Pública Andalién Sur • MINEDUC Chile</div>
                <div class="report-title">${title}</div>
                <div class="report-subtitle">${subtitle} • Sistema de Telemetría AuLock</div>
            </td>
            <td style="text-align: right; vertical-align: top;">
                <div style="font-size: 11px; font-weight: bold; color: #0284c7; border: 1px solid #0284c7; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                    PILOTO OFICIAL 2026
                </div>
            </td>
        </tr>
    </table>

    <div class="meta-box">
        <div>
            <div class="meta-item"><strong>Docente Titular:</strong> ${teacherName}</div>
            <div class="meta-item"><strong>Curso / Cohorte:</strong> ${course}</div>
        </div>
        <div style="text-align: right;">
            <div class="meta-item"><strong>Fecha de Emisión:</strong> ${date}</div>
            <div class="meta-item"><strong>Seguridad de Datos:</strong> Ley 19.628 / SLEP</div>
        </div>
    </div>

    <table class="data-table">
        <thead>
            <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
            ${tableRowsHtml}
        </tbody>
    </table>

    ${summaryNotes ? `
    <div class="summary-box">
        <strong style="color: #0284c7; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase;">
            📌 Síntesis Analítica del Asistente Pedagógico IA:
        </strong>
        ${summaryNotes.replace(/\n/g, '<br/>')}
    </div>
    ` : ''}

    <div class="footer">
        <div>AuLock Data Intelligence Engine • ID de Auditoría: AL-${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        <div>Página 1 de 1 • Documento Oficial Generado para uso Académico Interno</div>
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(docHtml);
    printWindow.document.close();
}

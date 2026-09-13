import React, { useEffect, useState, useMemo } from 'react';

/**
 * MathRenderer.jsx
 * Professional LaTeX Math & Physics Formula Renderer for AuLock AI Tutors
 * 
 * Automatically parses and renders:
 * - Block formulas: $$...$$ or \[...\]
 * - Inline formulas: $...$ or \(...\)
 * - Uses window.katex when available with zero crashes
 * - Features high-fidelity fallback rendering when KaTeX is loading or offline
 */

export default function MathRenderer({ content, className = '' }) {
    const [katexLoaded, setKatexLoaded] = useState(() => typeof window !== 'undefined' && !!window.katex);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.katex) {
            setKatexLoaded(true);
            return;
        }

        // Poll briefly in case CDN script loads asynchronously
        const interval = setInterval(() => {
            if (window.katex) {
                setKatexLoaded(true);
                clearInterval(interval);
            }
        }, 150);

        const timeout = setTimeout(() => clearInterval(interval), 5000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    const renderedSegments = useMemo(() => {
        if (!content || typeof content !== 'string') return null;
        return parseAndRenderMath(content, katexLoaded);
    }, [content, katexLoaded]);

    return (
        <div className={`math-content leading-relaxed select-text ${className}`}>
            {renderedSegments}
        </div>
    );
}

/**
 * Parses markdown text with LaTeX expressions into structured React segments.
 */
function parseAndRenderMath(text, useKatex) {
    // Regular expression to match $$...$$, \[...\], $...$, or \(...\)
    // Avoids matching solitary currency dollar signs like $100
    const mathRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$(?!\s)[^$\n]+(?<!\s)\$|\\\([\s\S]*?\\\))/g;

    const parts = text.split(mathRegex);

    return parts.map((part, index) => {
        if (!part) return null;

        // Block math: $$ ... $$ or \[ ... \]
        if (part.startsWith('$$') && part.endsWith('$$')) {
            const rawMath = part.slice(2, -2).trim();
            return <BlockMath key={index} math={rawMath} useKatex={useKatex} />;
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
            const rawMath = part.slice(2, -2).trim();
            return <BlockMath key={index} math={rawMath} useKatex={useKatex} />;
        }

        // Inline math: $ ... $ or \( ... \)
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
            const rawMath = part.slice(1, -1).trim();
            return <InlineMath key={index} math={rawMath} useKatex={useKatex} />;
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
            const rawMath = part.slice(2, -2).trim();
            return <InlineMath key={index} math={rawMath} useKatex={useKatex} />;
        }

        // Normal formatted text segment
        return <span key={index}>{renderFormattedText(part)}</span>;
    });
}

/**
 * Block Display LaTeX Formula with professional STEM container
 */
function BlockMath({ math, useKatex }) {
    if (useKatex && window.katex) {
        try {
            const html = window.katex.renderToString(math, {
                displayMode: true,
                throwOnError: false
            });
            return (
                <div 
                    className="my-3 py-2 px-3 overflow-x-auto bg-slate-900/80 border border-cyan-500/30 rounded-xl shadow-inner text-cyan-200 text-center text-sm md:text-base font-serif"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        } catch (err) {
            console.warn("[MathRenderer] KaTeX block render error:", err);
        }
    }

    // Fallback block display
    return (
        <div className="my-3 py-2.5 px-4 overflow-x-auto bg-slate-900/90 border border-amber-500/40 rounded-xl shadow-inner text-amber-200 text-center font-mono text-xs md:text-sm tracking-wide">
            <div className="text-[10px] text-amber-400/80 font-bold uppercase tracking-widest mb-1">// Expresión Matemática:</div>
            {formatFallbackMath(math)}
        </div>
    );
}

/**
 * Inline LaTeX Formula
 */
function InlineMath({ math, useKatex }) {
    if (useKatex && window.katex) {
        try {
            const html = window.katex.renderToString(math, {
                displayMode: false,
                throwOnError: false
            });
            return (
                <span 
                    className="inline-block px-1 text-cyan-200 font-serif align-middle"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        } catch (err) {
            console.warn("[MathRenderer] KaTeX inline render error:", err);
        }
    }

    return (
        <span className="inline-block px-1.5 py-0.5 mx-0.5 bg-slate-900 border border-cyan-800/60 rounded text-cyan-300 font-mono text-xs">
            {formatFallbackMath(math)}
        </span>
    );
}

/**
 * High-fidelity fallback parser for LaTeX syntax when KaTeX CDN is loading or offline.
 * Handles fractions, square roots, exponents, and physics symbols.
 */
function formatFallbackMath(latex) {
    if (!latex) return '';

    let formatted = latex
        .replace(/\\pm/g, '±')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\cdot/g, '·')
        .replace(/\\neq/g, '≠')
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\approx/g, '≈')
        .replace(/\\infty/g, '∞')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\gamma/g, 'γ')
        .replace(/\\theta/g, 'θ')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\pi/g, 'π')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\omega/g, 'ω')
        .replace(/\\Omega/g, 'Ω')
        .replace(/\\mu/g, 'µ')
        .replace(/\\to/g, '→')
        .replace(/\\rightarrow/g, '→')
        .replace(/\\sum/g, '∑')
        .replace(/\\int/g, '∫');

    // Handle simple \frac{a}{b} -> (a / b)
    formatted = formatted.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
    // Handle simple \sqrt{a} -> √(a)
    formatted = formatted.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

    return formatted;
}

/**
 * Formats bold **text** and code `snippets` inside non-math chunks
 */
function renderFormattedText(text) {
    if (!text) return null;
    
    // Split bold text **...**
    const boldRegex = /(\*\*.*?\*\*)/g;
    const parts = text.split(boldRegex);

    return parts.map((chunk, idx) => {
        if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return <strong key={idx} className="font-bold text-white">{chunk.slice(2, -2)}</strong>;
        }
        return chunk;
    });
}

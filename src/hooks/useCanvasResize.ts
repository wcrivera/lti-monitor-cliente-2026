// src/hooks/useCanvasResize.ts
// ============================================================================
// HOOK: AUTO-RESIZE IFRAME EN CANVAS LMS - VERSIÓN SIN RESIZE OBSERVER
// ============================================================================

import { useEffect, useRef } from 'react';

/**
 * Hook para enviar la altura del contenido a Canvas y ajustar el iframe automáticamente
 * 
 * ESTRATEGIA: Solo enviar altura cuando cambien las dependencias (navegación/contenido)
 * NO usar ResizeObserver para evitar loops infinitos
 * 
 * @param dependencies - Array de dependencias que pueden cambiar la altura (ej: [capitulos, temas])
 */
export const useCanvasResize = (dependencies: any[] = []) => {
    const lastHeightRef = useRef<number>(0);
    const hasInitializedRef = useRef<boolean>(false);

    useEffect(() => {
        const sendHeightToCanvas = () => {
            // Obtener altura total del documento
            const body = document.body;
            const html = document.documentElement;

            const height = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );

            // Solo enviar si cambió más de 50px
            const heightDiff = Math.abs(height - lastHeightRef.current);
            
            // En la primera carga, siempre enviar
            if (!hasInitializedRef.current) {
                hasInitializedRef.current = true;
            } else if (heightDiff < 50) {
                console.log('📏 Cambio de altura < 50px, ignorar');
                return;
            }

            // Enviar mensaje a Canvas
            if (window.parent && window.parent !== window) {
                lastHeightRef.current = height;
                
                window.parent.postMessage(
                    {
                        subject: 'lti.frameResize',
                        height: height + 100, // +100px de buffer
                    },
                    '*'
                );

                console.log('📏 Altura enviada:', height + 100, `(real: ${height}px, diff: ${heightDiff}px)`);
            } else {
                console.warn('⚠️ No está en iframe');
            }
        };

        // Enviar después de un delay para que el contenido se renderice
        const timer = setTimeout(sendHeightToCanvas, 300);

        return () => {
            clearTimeout(timer);
        };
    }, dependencies); // ⭐ SOLO se ejecuta cuando cambien las dependencias
};
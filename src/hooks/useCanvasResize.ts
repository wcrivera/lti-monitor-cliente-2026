// src/hooks/useCanvasResize.ts
// ============================================================================
// HOOK: AUTO-RESIZE IFRAME EN CANVAS LMS
// ============================================================================

import { useEffect } from 'react';

/**
 * Hook para enviar la altura del contenido a Canvas y ajustar el iframe automáticamente
 * 
 * Canvas escucha mensajes postMessage con el formato:
 * { subject: 'lti.frameResize', height: number }
 * 
 * @param dependencies - Array de dependencias que pueden cambiar la altura (ej: [capitulos, temas])
 */
export const useCanvasResize = (dependencies: any[] = []) => {
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

            // Enviar mensaje a Canvas (parent window)
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(
                    {
                        subject: 'lti.frameResize',
                        height: height + 50, // +50px de padding extra para evitar scroll
                    },
                    '*' // Canvas maneja la seguridad internamente
                );

                console.log('📏 Altura enviada a Canvas:', height);
            }
        };

        // Enviar altura inmediatamente
        sendHeightToCanvas();

        // Enviar altura después de que las imágenes/contenido carguen
        const timer = setTimeout(sendHeightToCanvas, 500);

        // Observar cambios en el tamaño del contenido
        const resizeObserver = new ResizeObserver(() => {
            sendHeightToCanvas();
        });

        // Observar el body completo
        resizeObserver.observe(document.body);

        // Cleanup
        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, dependencies); // Re-ejecutar cuando cambien las dependencias

    // También enviar al cambiar el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            const height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );

            if (window.parent && window.parent !== window) {
                window.parent.postMessage(
                    {
                        subject: 'lti.frameResize',
                        height: height + 50,
                    },
                    '*'
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
};
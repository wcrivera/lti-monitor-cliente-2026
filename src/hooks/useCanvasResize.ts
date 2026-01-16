// src/hooks/useCanvasResize.ts
// ============================================================================
// HOOK: AUTO-RESIZE IFRAME EN CANVAS LMS - VERSIÓN ESTABLE
// ============================================================================

import { useEffect, useRef } from 'react';

/**
 * Hook para enviar la altura del contenido a Canvas y ajustar el iframe automáticamente
 * 
 * Canvas escucha mensajes postMessage con el formato:
 * { subject: 'lti.frameResize', height: number }
 * 
 * @param dependencies - Array de dependencias que pueden cambiar la altura (ej: [capitulos, temas])
 */
export const useCanvasResize = (dependencies: any[] = []) => {
    const lastHeightRef = useRef<number>(0);
    const timeoutRef = useRef<number | null>(null);
    const sendCountRef = useRef<number>(0);

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

            // ⭐ PROTECCIÓN 1: Solo enviar si la diferencia es mayor a 20px
            const heightDiff = Math.abs(height - lastHeightRef.current);
            if (heightDiff < 20) {
                console.log('📏 Altura sin cambios significativos, no enviar');
                return;
            }

            // ⭐ PROTECCIÓN 2: Límite de envíos por minuto (máximo 30)
            sendCountRef.current += 1;
            if (sendCountRef.current > 30) {
                console.warn('⚠️ Límite de envíos alcanzado, deteniendo');
                return;
            }

            // Resetear contador después de 1 minuto
            setTimeout(() => {
                sendCountRef.current = 0;
            }, 60000);

            // Enviar mensaje a Canvas (parent window)
            if (window.parent && window.parent !== window) {
                lastHeightRef.current = height;
                
                window.parent.postMessage(
                    {
                        subject: 'lti.frameResize',
                        height: height + 50, // +50px de padding extra
                    },
                    '*'
                );

                console.log('📏 Altura enviada a Canvas:', height + 50, `(diff: ${heightDiff}px)`);
            }
        };

        // ⭐ DEBOUNCED VERSION: Esperar 200ms antes de enviar
        const debouncedSend = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                sendHeightToCanvas();
            }, 200);
        };

        // Enviar altura inmediatamente al montar
        sendHeightToCanvas();

        // Enviar altura después de que las imágenes/contenido carguen
        const initialTimer = setTimeout(sendHeightToCanvas, 500);

        // ⭐ OBSERVAR CAMBIOS CON DEBOUNCING
        const resizeObserver = new ResizeObserver(() => {
            debouncedSend();
        });

        resizeObserver.observe(document.body);

        // Cleanup
        return () => {
            clearTimeout(initialTimer);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            resizeObserver.disconnect();
        };
    }, dependencies);

    // ⭐ WINDOW RESIZE también con debouncing
    useEffect(() => {
        let resizeTimeout: number;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                const height = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                );

                // Solo enviar si hay diferencia significativa
                const heightDiff = Math.abs(height - lastHeightRef.current);
                if (heightDiff < 20) return;

                if (window.parent && window.parent !== window) {
                    lastHeightRef.current = height;
                    
                    window.parent.postMessage(
                        {
                            subject: 'lti.frameResize',
                            height: height + 50,
                        },
                        '*'
                    );
                    
                    console.log('🪟 Window resize - Altura:', height + 50);
                }
            }, 300);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
};


// // src/hooks/useCanvasResize.ts
// // ============================================================================
// // HOOK: AUTO-RESIZE IFRAME EN CANVAS LMS
// // ============================================================================

// import { useEffect } from 'react';

// /**
//  * Hook para enviar la altura del contenido a Canvas y ajustar el iframe automáticamente
//  * 
//  * Canvas escucha mensajes postMessage con el formato:
//  * { subject: 'lti.frameResize', height: number }
//  * 
//  * @param dependencies - Array de dependencias que pueden cambiar la altura (ej: [capitulos, temas])
//  */
// export const useCanvasResize = (dependencies: any[] = []) => {
//     useEffect(() => {
//         const sendHeightToCanvas = () => {
//             // Obtener altura total del documento
//             const body = document.body;
//             const html = document.documentElement;

//             const height = Math.max(
//                 body.scrollHeight,
//                 body.offsetHeight,
//                 html.clientHeight,
//                 html.scrollHeight,
//                 html.offsetHeight
//             );

//             // Enviar mensaje a Canvas (parent window)
//             if (window.parent && window.parent !== window) {
//                 window.parent.postMessage(
//                     {
//                         subject: 'lti.frameResize',
//                         height: height + 50, // +50px de padding extra para evitar scroll
//                     },
//                     '*' // Canvas maneja la seguridad internamente
//                 );

//                 console.log('📏 Altura enviada a Canvas:', height);
//             }
//         };

//         // Enviar altura inmediatamente
//         sendHeightToCanvas();

//         // Enviar altura después de que las imágenes/contenido carguen
//         const timer = setTimeout(sendHeightToCanvas, 500);

//         // Observar cambios en el tamaño del contenido
//         const resizeObserver = new ResizeObserver(() => {
//             sendHeightToCanvas();
//         });

//         // Observar el body completo
//         resizeObserver.observe(document.body);

//         // Cleanup
//         return () => {
//             clearTimeout(timer);
//             resizeObserver.disconnect();
//         };
//     }, dependencies); // Re-ejecutar cuando cambien las dependencias

//     // También enviar al cambiar el tamaño de la ventana
//     useEffect(() => {
//         const handleResize = () => {
//             const height = Math.max(
//                 document.body.scrollHeight,
//                 document.documentElement.scrollHeight
//             );

//             if (window.parent && window.parent !== window) {
//                 window.parent.postMessage(
//                     {
//                         subject: 'lti.frameResize',
//                         height: height + 50,
//                     },
//                     '*'
//                 );
//             }
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
// };
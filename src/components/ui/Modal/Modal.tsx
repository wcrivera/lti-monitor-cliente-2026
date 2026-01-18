// src/components/ui/Modal/Modal.tsx
// ============================================================================
// MODAL COMPONENT - VERSIÓN CON FULL CONTENT
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ModalProps {
    /** Si el modal está abierto o cerrado */
    isOpen: boolean;

    /** Función que se ejecuta al cerrar el modal */
    onClose: () => void;

    /** Título del modal (opcional) */
    title?: string;

    /** Descripción/subtítulo (opcional) */
    description?: string;

    /** Contenido del modal */
    children: React.ReactNode;

    /** Footer del modal (botones, acciones) */
    footer?: React.ReactNode;

    /** Tamaño del modal */
    size?: ModalSize;

    /** Permitir cerrar con ESC */
    closeOnEscape?: boolean;

    /** Permitir cerrar clickeando fuera */
    closeOnClickOutside?: boolean;

    /** Mostrar botón X de cerrar */
    showCloseButton?: boolean;

    /** Centrar verticalmente */
    centered?: boolean;

    /** Clases CSS adicionales para el contenedor */
    className?: string;

    /** Clases CSS adicionales para el contenido */
    contentClassName?: string;

    /** Animación de entrada */
    animation?: 'fade' | 'scale' | 'slide';

    /** Z-index personalizado */
    zIndex?: number;

    // ⭐ NUEVAS PROPS PARA FULL CONTENT

    /** 
     * Modo full content - Elimina padding, header y footer automáticos
     * El contenido ocupa todo el espacio disponible
     * Ideal para: iframes, editores, visores de imágenes
     */
    fullContent?: boolean;

    /**
     * Header personalizado cuando fullContent = true
     * Útil para agregar tu propio header flotante
     */
    customHeader?: React.ReactNode;

    /**
     * Altura del modal (solo aplica cuando fullContent = true)
     */
    height?: string;
}

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

const SIZE_CLASSES: Record<ModalSize, string> = {
    xs: 'max-w-xs',      // 320px
    sm: 'max-w-sm',      // 384px
    md: 'max-w-md',      // 448px
    lg: 'max-w-lg',      // 512px
    xl: 'max-w-xl',      // 576px
    '2xl': 'max-w-2xl',  // 672px
    full: 'max-w-full mx-4', // Full width con margen
};

// ============================================================================
// ANIMATION CLASSES
// ============================================================================

const ANIMATION_CLASSES: Record<string, { overlay: string; content: string }> = {
    fade: {
        overlay: 'animate-fadeIn',
        content: 'animate-fadeIn',
    },
    scale: {
        overlay: 'animate-fadeIn',
        content: 'animate-scaleIn',
    },
    slide: {
        overlay: 'animate-fadeIn',
        content: 'animate-slideIn',
    },
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnEscape = true,
    closeOnClickOutside = true,
    showCloseButton = true,
    centered = true,
    className = '',
    contentClassName = '',
    animation = 'scale',
    zIndex = 50,
    fullContent = false,
    customHeader,
    height,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // ============================================================================
    // CLOSE ON ESCAPE
    // ============================================================================

    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // ============================================================================
    // LOCK BODY SCROLL
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    // ============================================================================
    // CLOSE ON CLICK OUTSIDE
    // ============================================================================

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnClickOutside && e.target === overlayRef.current) {
            onClose();
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (!isOpen) return null;

    const animationClasses = ANIMATION_CLASSES[animation];

    // ============================================================================
    // MODO FULL CONTENT
    // ============================================================================

    if (fullContent) {
        return (
            <>
                <div
                    ref={overlayRef}
                    onClick={handleOverlayClick}
                    className={`
            fixed inset-0 bg-black/60 backdrop-blur-sm
            flex ${centered ? 'items-center' : 'items-start pt-16'}
            justify-center
            p-4
            overflow-y-auto
            ${animationClasses.overlay}
            ${className}
          `}
                    style={{ zIndex }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        ref={modalRef}
                        className={`
              relative
              w-full
              ${SIZE_CLASSES[size]}
              bg-white
              rounded-xl
              shadow-2xl
              overflow-hidden
              ${animationClasses.content}
              ${contentClassName}
            `}
                        style={{ height: height || 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Custom Header o Botón de cierre flotante */}
                        {(customHeader || showCloseButton) && (
                            <div className="absolute top-0 left-0 right-0 z-10">
                                {customHeader || (
                                    <div className="flex justify-end p-4">
                                        <button
                                            onClick={onClose}
                                            className="
                        p-2
                        rounded-lg
                        bg-black/20
                        backdrop-blur-sm
                        text-white
                        hover:bg-black/40
                        transition-colors
                        focus:outline-none
                        focus:ring-2
                        focus:ring-white
                      "
                                            aria-label="Cerrar modal"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contenido sin padding - ocupa todo el espacio */}
                        <div className="w-full h-full">
                            {children}
                        </div>
                    </div>
                </div>

                {/* CSS Animations */}
                <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
            </>
        );
    }

    // ============================================================================
    // MODO NORMAL (CON HEADER Y FOOTER)
    // ============================================================================

    return (
        <>
            <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm
          flex ${centered ? 'items-center' : 'items-start pt-16'}
          justify-center
          p-4
          overflow-y-auto
          ${animationClasses.overlay}
          ${className}
        `}
                style={{ zIndex }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                <div
                    ref={modalRef}
                    className={`
            relative
            w-full
            ${SIZE_CLASSES[size]}
            bg-white
            rounded-xl
            shadow-2xl
            ${animationClasses.content}
            ${contentClassName}
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200">
                            <div className="flex-1">
                                {title && (
                                    <h2
                                        id="modal-title"
                                        className="text-2xl font-bold text-gray-900 mb-1"
                                    >
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="
                    ml-4
                    p-2
                    rounded-lg
                    text-gray-400
                    hover:text-gray-600
                    hover:bg-gray-100
                    transition-colors
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                  "
                                    aria-label="Cerrar modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-6">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
};

export default Modal;
// src/components/ui/Modal/Modal.tsx
// ============================================================================
// MODAL COMPONENT - APARECE A LA ALTURA DEL BOTÓN ACTIVADOR
// ============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

// ============================================================================
// TYPES
// ============================================================================

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: ModalSize;
    closeOnEscape?: boolean;
    closeOnClickOutside?: boolean;
    showCloseButton?: boolean;
    centered?: boolean;
    className?: string;
    contentClassName?: string;
    animation?: 'fade' | 'scale' | 'slide';
    zIndex?: number;
    fullContent?: boolean;
    customHeader?: React.ReactNode;
    height?: string;
    // ⭐ NUEVO: Referencia al elemento que activó el modal
    triggerElement?: HTMLElement | null;
}

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

const SIZE_CLASSES: Record<ModalSize, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
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
    zIndex = 10000,
    fullContent = false,
    customHeader,
    height,
    triggerElement, // ⭐ NUEVO
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [triggerPosition, setTriggerPosition] = useState<{ top: number; left: number } | null>(null);

    // ============================================================================
    // CALCULAR POSICIÓN DEL BOTÓN ACTIVADOR
    // ============================================================================

    useEffect(() => {
        if (isOpen && triggerElement) {
            // Obtener la posición del botón que activó el modal
            const rect = triggerElement.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            setTriggerPosition({
                top: rect.top + scrollY,
                left: rect.left + scrollX,
            });

            console.log('📍 Posición del botón:', {
                top: rect.top + scrollY,
                left: rect.left + scrollX,
                scrollY,
                rectTop: rect.top,
            });
        }
    }, [isOpen, triggerElement]);

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
    // PREVENT BACKGROUND SCROLL
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
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

    // ⭐ Calcular estilos según si hay triggerElement o no
    const overlayStyles = triggerPosition
        ? {
              // Con triggerElement: overlay cubre desde arriba hasta abajo
              position: 'fixed' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              zIndex,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'block',
              overflow: 'auto',
          }
        : {
              // Sin triggerElement: comportamiento normal (centrado)
              position: 'fixed' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: centered ? 'center' : 'flex-start',
              justifyContent: 'center',
              padding: centered ? '16px' : '64px 16px 16px 16px',
              overflow: 'auto',
          };

    const modalContentStyles = triggerPosition
        ? {
              // ⭐ Posicionar a la altura del botón
              position: 'absolute' as const,
              top: `${triggerPosition.top}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '20px', // Espacio debajo del botón
          }
        : {
              // Comportamiento normal
              margin: 'auto',
          };

    // ============================================================================
    // MODAL CONTENT
    // ============================================================================

    const modalContent = (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            style={overlayStyles}
            className={`${animationClasses.overlay} ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            {/* ============= MODO FULL CONTENT ============= */}
            {fullContent ? (
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
                    style={{
                        ...modalContentStyles,
                        height: height || '90vh',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
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

                    <div className="w-full h-full overflow-auto">
                        {children}
                    </div>
                </div>
            ) : (
                /* ============= MODO NORMAL ============= */
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
                    style={{
                        ...modalContentStyles,
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {(title || showCloseButton) && (
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
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
                                        flex-shrink-0
                                    "
                                    aria-label="Cerrar modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="p-6 overflow-y-auto flex-1">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
                            {footer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return <ModalPortal>{modalContent}</ModalPortal>;
};

export default Modal;
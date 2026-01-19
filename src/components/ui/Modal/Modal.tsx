// src/components/ui/Modal/Modal.tsx
// ============================================================================
// MODAL COMPONENT - SOLUCIÓN DEFINITIVA PARA IFRAME CANVAS
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
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [viewportTop, setViewportTop] = useState(0);

    // ============================================================================
    // CALCULAR POSICIÓN DE VIEWPORT AL ABRIR
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            // ⭐ Capturar la posición actual del scroll
            const currentScrollY = window.scrollY || window.pageYOffset;
            setViewportTop(currentScrollY);

            console.log('📍 Modal abierto - Scroll Y:', currentScrollY);
            console.log('📍 Window inner height:', window.innerHeight);
        }
    }, [isOpen]);

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
    // LOCK BODY SCROLL (SIN POSITION FIXED)
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            // ⭐ Solo bloquear scroll, NO fijar position
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

    // ============================================================================
    // MODAL CONTENT
    // ============================================================================

    const modalContent = (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className={`${animationClasses.overlay} ${className}`}
            style={{
                // ⭐⭐⭐ CRÍTICO: Position ABSOLUTE con top calculado
                position: 'absolute',
                top: `${viewportTop}px`, // ⭐ Posicionar en el scroll actual
                left: 0,
                width: '100vw',
                height: '100vh', // ⭐ Solo cubrir el viewport visible
                zIndex,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: centered ? 'center' : 'flex-start',
                justifyContent: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
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
                        overflow-hidden
                        ${animationClasses.content}
                        ${contentClassName}
                    `}
                    style={{
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

    // ⭐ RENDERIZAR EN PORTAL (dentro de #modal-root)
    return <ModalPortal>{modalContent}</ModalPortal>;
};

export default Modal;
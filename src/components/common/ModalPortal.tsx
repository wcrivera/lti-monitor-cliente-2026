// src/components/ui/Modal/ModalPortal.tsx
// ============================================================================
// MODAL PORTAL - Renderiza modales en #modal-root aislado
// ============================================================================

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
    children: ReactNode;
}

export const ModalPortal = ({ children }: ModalPortalProps) => {
    const [mounted, setMounted] = useState(false);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Buscar o crear el contenedor modal-root
        let root = document.getElementById('modal-root');
        
        if (!root) {
            console.warn('⚠️ #modal-root no existe, creándolo...');
            root = document.createElement('div');
            root.id = 'modal-root';
            document.body.appendChild(root);
        }

        setModalRoot(root);
        setMounted(true);

        return () => {
            setMounted(false);
        };
    }, []);

    // No renderizar hasta que esté montado y tengamos el contenedor
    if (!mounted || !modalRoot) return null;

    // Renderizar dentro de #modal-root usando createPortal
    return createPortal(children, modalRoot);
};
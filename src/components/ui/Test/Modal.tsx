import React, { useState, useEffect, ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer del modal */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de ejemplo para demostrar el uso
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = (): void => {
    alert('¡Confirmado!');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200"
      >
        Abrir Modal
      </button>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Título del Modal"
        onConfirm={handleConfirm}
        confirmText="Aceptar"
        cancelText="Cerrar"
      >
        <p className="text-gray-600 mb-4">
          Este es un ejemplo de modal creado con React, TypeScript y Tailwind CSS. Puedes personalizar el contenido como necesites.
        </p>
        <p className="text-gray-600">
          El modal se cierra al hacer clic en el botón X, en el botón Cerrar, o al hacer clic fuera del contenido.
        </p>
      </Modal>
    </div>
  );
}
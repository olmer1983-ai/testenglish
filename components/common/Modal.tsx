
import React from 'react';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <div className="mt-4 text-gray-600">
                        {children}
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

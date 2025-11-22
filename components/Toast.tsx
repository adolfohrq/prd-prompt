
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 ease-out ${bgColor} ${
        visible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
      }`}
    >
      {message}
    </div>
  );
};

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded font-medium transition-colors duration-200 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-[#0b0b45] text-white hover:bg-[#ff9933] disabled:bg-gray-400",
    secondary: "bg-[#ff9933] text-white hover:bg-[#0b0b45]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border-2 border-[#0b0b45] text-[#0b0b45] hover:bg-[#0b0b45] hover:text-white"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", value, onChange, placeholder, multiline = false }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {multiline ? (
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff9933] focus:border-transparent"
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff9933] focus:border-transparent"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-[#0b0b45]">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

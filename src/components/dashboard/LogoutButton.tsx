'use client';

import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, className = '' }) => {
  return (
    <button
      onClick={onLogout}
      type="button"
      title="Se déconnecter du Tableau de Bord"
      className={`group relative flex items-center justify-start h-9 w-9 hover:w-36 rounded-full bg-warm-dark hover:bg-[#342F2B] border border-border-subtle/50 overflow-hidden shadow-xs hover:shadow-editorial transition-all duration-300 ease-out active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 ${className}`}
    >
      {/* Icône de déconnexion SVG exacte */}
      <div className="w-full group-hover:w-[30%] h-full flex items-center justify-center transition-all duration-300 group-hover:pl-2 shrink-0">
        <svg
          viewBox="0 0 512 512"
          className="w-3.5 h-3.5 fill-[#FAF7F2] transition-transform duration-300 group-hover:scale-95"
          aria-hidden="true"
        >
          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
        </svg>
      </div>

      {/* Libellé Déconnexion qui apparaît au survol */}
      <span className="absolute right-0 w-0 group-hover:w-[70%] opacity-0 group-hover:opacity-100 font-sans text-[10px] font-semibold tracking-editorial uppercase text-[#FAF7F2] transition-all duration-300 pr-3 whitespace-nowrap overflow-hidden text-center select-none">
        Déconnexion
      </span>
    </button>
  );
};

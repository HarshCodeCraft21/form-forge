import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`text-xs select-none ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-1.5">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="text-xs font-semibold opacity-70 hover:opacity-100 text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Dashboard
          </Link>
        </li>
        
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          
          return (
            <li key={idx} className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0 mx-1" />
              {isLast ? (
                <span className="text-xs font-semibold text-[#0F172A]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-xs font-semibold opacity-70 hover:opacity-100 text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

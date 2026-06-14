import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between px-5 py-3.5 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] ${className}`}>
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center px-3.5 py-1.5 border border-[#E2E8F0] bg-white rounded-md text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center px-3.5 py-1.5 border border-[#E2E8F0] bg-white rounded-md text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-40 ml-3"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-[#64748B] font-medium">
            Page <span className="font-semibold text-[#0F172A]">{currentPage}</span> of{' '}
            <span className="font-semibold text-[#0F172A]">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex rounded-md shadow-sm gap-1" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center p-1.5 border border-[#E2E8F0] bg-white rounded-md text-[#64748B] hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`inline-flex items-center justify-center px-3 py-1.5 border text-xs font-semibold rounded-md ${
                    isActive 
                      ? 'bg-[#4F46E5] border-[#4F46E5] text-white' 
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center p-1.5 border border-[#E2E8F0] bg-white rounded-md text-[#64748B] hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

import React from 'react';

// --- UI Icons ---

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21.0031 12.8199 20.6951 14.1272 20.1003 15.3188C19.5056 16.5103 18.6406 17.5539 17.574 18.3666C16.5074 19.1793 15.269 19.739 13.9566 19.9998C12.6441 20.2606 11.2941 20.2155 10.0135 19.868C8.73286 19.5205 7.55621 18.8802 6.5771 18.0053C5.59799 17.1303 4.84364 16.0401 4.37346 14.8211C3.90329 13.6022 3.73147 12.2871 3.87157 10.9818C4.01167 9.67652 4.45988 8.41723 5.17992 7.31001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 7L11 17L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const FoldIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const ListIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChromeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C8.21 0 4.83 1.76 2.66 4.54L6.92 11.92C7.03 8.35 9.94 5.37 13.5 5.37H23.44C21.6 2.19 17.26 0 12 0Z" />
    <path d="M12 6.75C9.1 6.75 6.75 9.1 6.75 12C6.75 14.9 9.1 17.25 12 17.25C14.9 17.25 17.25 14.9 17.25 12C17.25 9.1 14.9 6.75 12 6.75Z" />
    <path d="M18.81 12.56L14.55 19.94H4.56C4.56 19.94 4.56 19.94 4.56 19.94C6.39 23.11 10.74 25.31 16 25.31C16.92 25.31 17.81 25.19 18.66 24.97L23.53 16.53C22.28 15.65 20.73 14.63 18.81 12.56Z" />
    <path d="M2.28 5.19L0.59 8.13C0.21 9.35 0 10.65 0 12C0 17.5 3.71 22.13 8.78 23.63L13.04 16.25C10.46 16.14 8.25 14.15 8.25 11.62V5.19H2.28Z" />
  </svg>
);
// components/MobileNavbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Clapperboard, Settings  } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const MobileNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    setActiveButton(pathname);
  }, [pathname]);

  const handleButtonClick = (path: string) => {
    setActiveButton(path);
    router.push(path);
  };

  const getButtonClass = (path: string) => (
    path === activeButton
      ? "flex flex-col items-center text-white hover:text-black"
      : "flex flex-col items-center text-gray-600 hover:text-black"
  );

  return (
    <div className="fixed mb-2 bottom-0 bg-black left-0 right-0 shadow-lg p-4 md:hidden flex justify-between items-center">
      <button onClick={() => handleButtonClick('/')} className={getButtonClass('/')}>
        <Bookmark className="w-6 h-6" />
      </button>
      <button onClick={() => handleButtonClick('/search')} className={getButtonClass('/search')}>
        <Clapperboard className="w-6 h-6" />
      </button>
      <button onClick={() => handleButtonClick('/profile')} className={getButtonClass('/profile')}>
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileNavbar;

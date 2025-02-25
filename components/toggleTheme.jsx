'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeToggle=()=>{
    const {theme,setTheme}=useTheme()
    const [mounted,setMounted]=useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted)  return null

    return (
        <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
        {theme === 'dark' ? (
            <Sun  className="h-5 w-6 text-gray-400" />
        ) : (
            <Moon className="h-5 w-6 text-gray-400" />
        )}
        </button>
    );

}
export default ThemeToggle
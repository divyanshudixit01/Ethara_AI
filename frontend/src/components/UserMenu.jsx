import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl p-1.5 transition-all hover:bg-[var(--bg-primary)]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/20">
          <User size={20} />
        </div>
        <div className="hidden text-left md:block">
          <p className="text-sm font-bold leading-none">{user?.name}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] opacity-70">
            {user?.role}
          </p>
        </div>
        <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-2 shadow-2xl animate-fade-in z-50">
          <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Account</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-primary)]">
            <UserCircle size={18} />
            Profile Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-[var(--bg-primary)]">
            <Settings size={18} />
            Preferences
          </button>
          
          <div className="my-1 border-t border-[var(--border-color)]"></div>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

import React from 'react';

const GroupTabs = ({ groups, currentGroupId, onGroupChange }) => {
  return (
    <div className="bg-slate-100/50 p-1.5 rounded-[2rem] flex overflow-x-auto gap-1 mb-8 no-scrollbar">
      {groups.map((group) => {
        const isActive = currentGroupId === group.id;
        return (
          <button
            key={group.id}
            onClick={() => onGroupChange(group.id)}
            className={`relative px-8 py-3.5 rounded-[1.6rem] text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            {group.Nom}
            
            {/* Petit point indicateur stylé */}
            {isActive && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default GroupTabs;
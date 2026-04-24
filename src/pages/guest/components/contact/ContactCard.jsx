import React from 'react';

const ContactCard = ({ icon: Icon, title, content, colorClass, hoverClass }) => {
  return (
    <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex items-start gap-4">
      <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors duration-300 ${colorClass} ${hoverClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <p className="text-slate-600 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ContactCard;

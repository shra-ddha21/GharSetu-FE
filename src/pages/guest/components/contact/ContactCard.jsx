import React from 'react';

const ContactCard = ({ icon: Icon, title, content, colorClass, hoverClass, link }) => {
  const card = (
    <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-slate-100 flex items-start gap-4 h-full cursor-pointer">
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

  if (link) {
    const isMailto = link.startsWith('mailto:');
    const isExternal = link.startsWith('http');

    return (
      <a 
        href={link} 
        target={isExternal ? "_blank" : undefined} 
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block h-full"
        onClick={(e) => {
          if (isMailto) {
            e.preventDefault();
            window.location.href = link;
          }
        }}
      >
        {card}
      </a>
    );
  }

  return card;
};

export default ContactCard;

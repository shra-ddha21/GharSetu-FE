import React from 'react';

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const SocialSection = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Connect With Us</h3>
        <div className="flex justify-center gap-6">
          {[
            { icon: TwitterIcon, label: 'Twitter', hoverColor: 'hover:text-sky-500 hover:border-sky-200 hover:shadow-sky-100' },
            { icon: LinkedinIcon, label: 'LinkedIn', hoverColor: 'hover:text-blue-700 hover:border-blue-200 hover:shadow-blue-100' },
            { icon: GithubIcon, label: 'GitHub', hoverColor: 'hover:text-slate-900 hover:border-slate-300 hover:shadow-slate-200' }
          ].map((social, idx) => {
            const Icon = social.icon;
            return (
              <a 
                key={idx}
                href="#"
                className={`group w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${social.hoverColor}`}
                aria-label={social.label}
              >
                <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default SocialSection;

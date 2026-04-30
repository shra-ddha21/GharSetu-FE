import React from 'react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SocialSection = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Connect With Us</h3>
        <div className="flex justify-center gap-6">
          {[
            { icon: InstagramIcon, label: 'Instagram', url: 'https://www.instagram.com/gharsetu_?igsh=MW9zZW1xdWY3NjNhbg==', hoverColor: 'hover:text-pink-500 hover:border-pink-200 hover:shadow-pink-100' },
            { icon: FacebookIcon, label: 'Facebook', url: 'https://www.facebook.com/share/17bnsbFdCF/', hoverColor: 'hover:text-blue-600 hover:border-blue-200 hover:shadow-blue-100' },
            { icon: EmailIcon, label: 'Email', url: 'gharsetu03@gmail.com', hoverColor: 'hover:text-indigo-600 hover:border-indigo-200 hover:shadow-indigo-100' },
          ].map((social, idx) => {
            const Icon = social.icon;
            return (
              <a
                key={idx}
                href={social.url}
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


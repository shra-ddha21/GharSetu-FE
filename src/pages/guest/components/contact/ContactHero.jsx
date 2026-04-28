import React from 'react';

const ContactHero = () => {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mt-10">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Us</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          We&apos;d love to hear from you. Reach out anytime.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;

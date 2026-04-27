import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import ContactCard from './ContactCard';
import InputField from './InputField';
import Button from './Button';

const ContactContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      e.target.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className={`py-16 bg-white transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT SIDE */}
          <div className="space-y-8 lg:mt-8">
            <div className="space-y-6">
              <ContactCard 
                icon={MapPin} 
                title="Our Address" 
                content="Linkcode Technologies, Barve Complex, Pune" 
                colorClass="bg-emerald-50 text-emerald-600"
                hoverClass="group-hover:bg-emerald-600 group-hover:text-white"
                link="https://www.google.com/maps/search/?api=1&query=Linkcode+Technologies+Barve+Complex+Pune"
              />
              <ContactCard 
                icon={Mail} 
                title="Email Us" 
                content="support@gharsetu.com" 
                colorClass="bg-blue-50 text-blue-600"
                hoverClass="group-hover:bg-blue-600 group-hover:text-white"
                link="https://mail.google.com/mail/?view=cm&fs=1&to=support@gharsetu.com"
              />
              <ContactCard 
                icon={Phone} 
                title="Call Us" 
                content="+1 (555) 123-4567" 
                colorClass="bg-amber-50 text-amber-600"
                hoverClass="group-hover:bg-amber-600 group-hover:text-white"
                link="tel:+15551234567"
              />
            </div>
            
            <div className="w-full h-64 bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner relative group isolate">
              <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
              
              <iframe
                title="GharSetu Location"
                src="https://maps.google.com/maps?q=Linkcode%20Technologies,%20Barve%20Complex,%20Pune&output=embed"
                className="w-full h-full border-0 grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Floating overlay before hover */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500 transform group-hover:scale-110">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center animate-bounce">
                    <MapPin className="w-7 h-7 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Contact Form */}
          <div className="bg-slate-50 hover:bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm hover:shadow-2xl hover:shadow-slate-200 border border-slate-100 transition-all duration-300 relative group">
             {/* Decorative element like in reviews */}
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900">Send a Message</h3>
              <p className="text-slate-600 mt-2">Fill out the form below and we&apos;ll get back to you shortly.</p>
            </div>
            
            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start gap-3 transition-all relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">✓</div>
                <p className="text-sm font-medium pt-0.5">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <InputField label="Full Name" id="name" placeholder="John Doe" required />
              <InputField label="Email Address" type="email" id="email" placeholder="john@example.com" required />
              <InputField label="Subject" id="subject" placeholder="How can we help?" required />
              <InputField label="Message" id="message" isTextArea placeholder="Write your message here..." required />
              
              <div className="pt-2">
                <Button type="submit" isLoading={isLoading}>
                  Send Message <Send className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactContent;

import React from 'react';
import { Quote } from 'lucide-react';

import reviewer1 from '../../../assets/images/reviewer_1.png';
import reviewer2 from '../../../assets/images/reviewer_2.png';
import reviewer3 from '../../../assets/images/reviewer_3.png';

const reviewsData = [
  {
    name: 'Sarah Jenkins',
    role: 'Homeowner',
    image: reviewer1,
    content: "The cleaning service I booked through GharSetu was phenomenal! The professional arrived on time, was extremely polite, and left my house spotless. Highly recommended.",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Real Estate Developer',
    image: reviewer2,
    content: "As someone who deals with properties constantly, finding reliable plumbers and electricians is tough. This platform made it effortless. The quality of work is outstanding.",
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Small Business Owner',
    image: reviewer3,
    content: "Needed an emergency electrical fix for my office. Booked a professional in minutes, and the issue was resolved smoothly. Fantastic interface and amazing customer support.",
    rating: 5,
  }
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Testimonials</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">What Our Clients Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((review, idx) => (
            <div 
              key={idx} 
              className="group bg-slate-50 hover:bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200 border border-slate-100 transition-all duration-300 relative mt-8"
            >
              {/* Floating Avatar */}
              <div className="absolute -top-10 left-8">
                <div className="w-20 h-20 outline outline-8 outline-white rounded-full overflow-hidden bg-indigo-100 shadow-md">
                  <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-50 transition-colors">
                <Quote className="w-12 h-12 fill-current" />
              </div>

              <div className="mt-12">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed italic mb-6">
                  "{review.content}"
                </p>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{review.name}</h4>
                  <p className="text-sm font-medium text-indigo-600">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

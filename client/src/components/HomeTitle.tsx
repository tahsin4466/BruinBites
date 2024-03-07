import React from 'react';
import backgroundImage from './backgroundImage.jpg';

export default function Hero() {
  const sectionStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6" style={sectionStyle}>
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">

        {/* Section header */}
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">BruinBites</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">Welcome to the nation's number 1 college dining. </p>
          </div>
        </div>

      </div>
    </section>
  );
}


  /* return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20"> */

        /* {Section header} */
        /* <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">BruinBites</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">Welcome to the nation's number 1 college dining. </p>
          </div>
        </div>

      </div>
    </section>
  )
} */
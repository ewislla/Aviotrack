import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, MapPin, Clock, Shield, Globe2, Star, Mail, Users, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SearchParams } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchType, setSearchType] = useState<'number' | 'route'>('number');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    type: 'number' as const,
    flightNumber: '',
    origin: '',
    destination: ''
  });
  const [email, setEmail] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/status', { state: searchParams });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const carouselSlides = [
    {
      image: "https://images.pexels.com/photos/379419/pexels-photo-379419.jpeg",
      title: t('home.carousel.slide1.title'),
      description: t('home.carousel.slide1.description')
    },
    {
      image: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg",
      title: t('home.carousel.slide2.title'),
      description: t('home.carousel.slide2.description')
    },
    {
      image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
      title: t('home.carousel.slide3.title'),
      description: t('home.carousel.slide3.description')
    }
  ];

  const features = [
    {
      icon: <Globe2 className="h-8 w-8 text-blue-600" />,
      title: t('home.features.globalCoverage.title'),
      description: t('home.features.globalCoverage.description'),
      stats: t('home.features.globalCoverage.stats')
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: t('home.features.realTimeUpdates.title'),
      description: t('home.features.realTimeUpdates.description'),
      stats: t('home.features.realTimeUpdates.stats')
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: t('home.features.secureBooking.title'),
      description: t('home.features.secureBooking.description'),
      stats: t('home.features.secureBooking.stats')
    }
  ];

  const testimonials = [
    {
      name: t('home.testimonials.testimonial1.name'),
      role: t('home.testimonials.testimonial1.role'),
      comment: t('home.testimonials.testimonial1.comment'),
      rating: 5
    },
    {
      name: t('home.testimonials.testimonial2.name'),
      role: t('home.testimonials.testimonial2.role'),
      comment: t('home.testimonials.testimonial2.comment'),
      rating: 5
    },
    {
      name: t('home.testimonials.testimonial3.name'),
      role: t('home.testimonials.testimonial3.role'),
      comment: t('home.testimonials.testimonial3.comment'),
      rating: 5
    }
  ];

  const destinations = [
    {
      name: t('home.destinations.paris.name'),
      image: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg",
      price: t('home.destinations.paris.price')
    },
    {
      name: t('home.destinations.tokyo.name'),
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
      price: t('home.destinations.tokyo.price')
    },
    {
      name: t('home.destinations.newYork.name'),
      image: "https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg",
      price: t('home.destinations.newYork.price')
    }
  ];

  const howItWorks = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: t('home.howItWorks.searchFlights.title'),
      description: t('home.howItWorks.searchFlights.description')
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: t('home.howItWorks.bookSecurely.title'),
      description: t('home.howItWorks.bookSecurely.description')
    },
    {
      icon: <Plane className="h-8 w-8 text-blue-600" />,
      title: t('home.howItWorks.travelWithConfidence.title'),
      description: t('home.howItWorks.travelWithConfidence.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Carousel */}
      <div className="relative h-[500px] mb-8">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          navigation
          className="h-full"
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl">{slide.description}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Section */}
      <div id="check-status" className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 mb-16">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{t('home.search.title')}</h1>
            <p className="text-gray-600">{t('home.search.subtitle')}</p>
          </div>
          
          <div className="flex mb-8">
            <button
              className={`flex-1 py-3 text-center transition-colors duration-200 ${
                searchType === 'number' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } rounded-l-lg flex items-center justify-center space-x-2`}
              onClick={() => {
                setSearchType('number');
              setSearchParams({ type: 'number' as const, flightNumber: '' });
              }}
            >
              <Plane className="h-5 w-5" />
              <span>{t('home.search.flightNumber')}</span>
            </button>
            <button
              className={`flex-1 py-3 text-center transition-colors duration-200 ${
                searchType === 'route' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } rounded-r-lg flex items-center justify-center space-x-2`}
              onClick={() => {
                setSearchType('route');
                setSearchParams({ type: 'route', origin: '', destination: '' });
              }}
            >
              <MapPin className="h-5 w-5" />
              <span>{t('home.search.route')}</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {searchType === 'number' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('home.search.flightNumberLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('home.search.flightNumberPlaceholder')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors duration-200"
                  value={searchParams.flightNumber}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, flightNumber: e.target.value })
                  }
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('home.search.fromLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('home.search.fromPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors duration-200"
                    value={searchParams.origin}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, origin: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('home.search.toLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('home.search.toPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors duration-200"
                    value={searchParams.destination}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, destination: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>{t('home.search.searchButton')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.howItWorks.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.features.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="text-2xl font-bold text-blue-600">{feature.stats}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.destinations.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.destinations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                <p className="text-lg font-bold">{destination.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('home.newsletter.title')}</h2>
          <p className="text-blue-100 mb-8">
            {t('home.newsletter.subtitle')}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              className="px-6 py-3 rounded-lg flex-1 max-w-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>{t('home.newsletter.button')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
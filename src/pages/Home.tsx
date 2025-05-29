import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, MapPin, Clock, Shield, Globe2, Star, Mail, Users, CreditCard } from 'lucide-react';
import { SearchParams } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const navigate = useNavigate();
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
      title: "Explore the World",
      description: "Discover new destinations with our global flight network"
    },
    {
      image: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg",
      title: "Premium Service",
      description: "Experience comfort and luxury at 30,000 feet"
    },
    {
      image: "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg",
      title: "Safe Travel",
      description: "Your safety is our top priority"
    }
  ];

  const features = [
    {
      icon: <Globe2 className="h-8 w-8 text-blue-600" />,
      title: "Global Coverage",
      description: "Access flights to over 190+ destinations worldwide",
      stats: "190+ Destinations"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Real-time Updates",
      description: "Stay informed with instant flight status notifications",
      stats: "24/7 Support"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure Booking",
      description: "Book with confidence using our secure payment system",
      stats: "100% Secure"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      comment: "The best flight booking experience I've ever had. Real-time updates and excellent customer service!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Frequent Flyer",
      comment: "Reliable and efficient. I love how easy it is to track my flights and manage my bookings.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Family Traveler",
      comment: "Makes traveling with family so much easier. The booking process is smooth and straightforward.",
      rating: 5
    }
  ];

  const destinations = [
    {
      name: "Paris, France",
      image: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg",
      price: "From $499"
    },
    {
      name: "Tokyo, Japan",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
      price: "From $799"
    },
    {
      name: "New York, USA",
      image: "https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg",
      price: "From $299"
    }
  ];

  const howItWorks = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Search Flights",
      description: "Enter your travel details and find the perfect flight"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: "Book Securely",
      description: "Choose your preferred flight and complete your booking"
    },
    {
      icon: <Plane className="h-8 w-8 text-blue-600" />,
      title: "Travel with Confidence",
      description: "Receive instant updates and enjoy your journey"
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
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Track Your Flight</h1>
            <p className="text-gray-600">Get real-time updates on your flight status</p>
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
              <span>Flight Number</span>
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
              <span>Route</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {searchType === 'number' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number</label>
                <input
                  type="text"
                  placeholder="Enter flight number (e.g., UA123)"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    placeholder="Origin airport (e.g., SFO)"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors duration-200"
                    value={searchParams.origin}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, origin: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <input
                    type="text"
                    placeholder="Destination airport (e.g., LAX)"
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
              <span>Search Flights</span>
            </button>
          </form>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book your flight in three simple steps
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our comprehensive flight tracking and booking services
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular flight routes and destinations
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read about experiences from our satisfied customers
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
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-blue-100 mb-8">
            Stay updated with our latest offers and flight deals
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
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
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
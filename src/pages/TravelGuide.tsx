import React from 'react';
import { Compass, Luggage, Calendar, Shield, Globe2 } from 'lucide-react';

const TravelGuide = () => {
  const tips = [
    {
      title: 'Essential Packing Checklist',
      icon: <Luggage className="h-6 w-6 text-blue-600" />,
      items: [
        'Travel documents (passport, visas, tickets)',
        'Medications and prescriptions',
        'Electronics and chargers',
        'Weather-appropriate clothing',
        'Toiletries and personal care items',
        'Emergency contact information'
      ],
      image: "https://images.pexels.com/photos/1282316/pexels-photo-1282316.jpeg"
    },
    {
      title: 'Best Seasons to Travel',
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      content: {
        Spring: 'Mild weather, beautiful blooms, ideal for city exploration',
        Summer: 'Perfect for beach destinations and outdoor activities',
        Fall: 'Comfortable temperatures, fewer crowds, stunning foliage',
        Winter: 'Great for winter sports and festive destinations'
      },
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg"
    },
    {
      title: 'Safety Tips',
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      items: [
        'Research your destination thoroughly',
        'Keep important documents secure',
        'Stay aware of your surroundings',
        'Use reliable transportation',
        'Keep emergency contacts handy',
        'Get travel insurance'
      ],
      image: "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg"
    },
    {
      title: 'Cultural Awareness',
      icon: <Globe2 className="h-6 w-6 text-blue-600" />,
      items: [
        'Learn basic local phrases',
        'Research local customs and etiquette',
        'Respect local dress codes',
        'Be mindful of photography rules',
        'Try local cuisine respectfully'
      ],
      image: "https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg"
    }
  ];

  const destinations = [
    {
      name: "Spring: Cherry Blossoms in Japan",
      image: "https://images.pexels.com/photos/5220024/pexels-photo-5220024.jpeg"
    },
    {
      name: "Summer: Santorini, Greece",
      image: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg"
    },
    {
      name: "Fall: New England",
      image: "https://images.pexels.com/photos/1808329/pexels-photo-1808329.jpeg"
    },
    {
      name: "Winter: Swiss Alps",
      image: "https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Travel Guide</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Your comprehensive guide to smarter, safer travel</p>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-16">
        <img
          src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg"
          alt="Travel Guide Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="text-white max-w-2xl px-8">
            <h2 className="text-4xl font-bold mb-4">Explore the World</h2>
            <p className="text-xl">Discover amazing destinations and travel with confidence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src={tip.image}
              alt={tip.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-4">
                {tip.icon}
                <h2 className="text-xl font-semibold ml-2 text-gray-900 dark:text-white">{tip.title}</h2>
              </div>

              {'items' in tip ? (
                <ul className="space-y-2">
                  {tip.items.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                      <Compass className="h-4 w-4 mr-2 text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  {Object.entries(tip.content).map(([season, description]) => (
                    <div key={season} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{season}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Featured Destinations by Season
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white text-lg font-semibold p-4">{destination.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips Video Section */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Expert Travel Tips</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg"
              alt="Travel Tips"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelGuide;
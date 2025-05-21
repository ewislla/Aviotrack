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
        'Emergency contact information',
      ],
      image: 'https://images.pexels.com/photos/1282316/pexels-photo-1282316.jpeg',
    },
    {
      title: 'Best Seasons to Travel',
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      content: {
        Spring: 'Mild weather, beautiful blooms, ideal for city exploration',
        Summer: 'Perfect for beach destinations and outdoor activities',
        Fall: 'Comfortable temperatures, fewer crowds, stunning foliage',
        Winter: 'Great for winter sports and festive destinations',
      },
      image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg',
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
        'Get travel insurance',
      ],
      image: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg',
    },
    {
      title: 'Cultural Awareness',
      icon: <Globe2 className="h-6 w-6 text-blue-600" />,
      items: [
        'Learn basic local phrases',
        'Respect dress codes and customs',
        'Be mindful of photography rules',
        'Avoid offensive gestures or behavior',
      ],
      image: 'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
      {tips.map((tip, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            {tip.icon}
            <h3 className="text-xl font-semibold">{tip.title}</h3>
          </div>

          {/* Render items if they exist */}
          {tip.items && (
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1 mb-3">
              {tip.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {/* Render content object if it exists */}
          {tip.content && (
            <ul className="list-none pl-1 text-sm text-gray-700 space-y-1 mb-3">
              {Object.entries(tip.content).map(([season, description]) => (
                <li key={season}>
                  <strong>{season}:</strong> {description}
                </li>
              ))}
            </ul>
          )}

          {/* Optional: Render image */}
          {tip.image && (
            <img
              src={tip.image}
              alt={tip.title}
              className="mt-3 rounded-xl w-full h-48 object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TravelGuide;

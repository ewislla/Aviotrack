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
        'Learn a few basic phrases of the local language',
        'Understand local customs and etiquette',
        'Respect religious and cultural practices',
        'Dress appropriately for the culture and setting',
      ],
      image: 'https://images.pexels.com/photos/693744/pexels-photo-693744.jpeg',
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {tips.map((tip, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            {tip.icon}
            <h2 className="text-xl font-semibold">{tip.title}</h2>
          </div>

          {/* Render items if they exist */}
          {tip.items && (
            <ul className="list-disc list-inside mt-2">
              {tip.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {/* Render content if it exists */}
          {tip.content && (
            <ul className="list-disc list-inside mt-2">
              {Object.entries(tip.content).map(([season, description]) => (
                <li key={season}>
                  <strong>{season}:</strong> {description}
                </li>
              ))}
            </ul>
          )}

          <img src={tip.image} alt={tip.title} className="mt-4 w-full h-auto rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default TravelGuide;

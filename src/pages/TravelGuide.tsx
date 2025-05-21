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
        'Learn key phrases in the local language',
        'Respect local customs and traditions',
        'Dress appropriately for the culture',
        'Be mindful of body language and gestures',
        'Support local businesses and artisans',
      ],
      image: 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg',
    },
  ];

  return (
    <div className="grid gap-8 p-6">
      {tips.map((tip, index) => (
        <div key={index} className="bg-white p-4 shadow rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {tip.icon}
            <h3 className="text-lg font-bold">{tip.title}</h3>
          </div>
          {tip.items && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {tip.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {tip.content && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {Object.entries(tip.content).map(([season, desc]) => (
                <li key={season}>
                  <strong>{season}:</strong> {desc}
                </li>
              ))}
            </ul>
          )}
          <img
            src={tip.image}
            alt={tip.title}
            className="mt-3 w-full h-48 object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default TravelGuide;

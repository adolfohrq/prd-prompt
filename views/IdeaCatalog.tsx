
import React from 'react';
import type { Idea } from '../types';
import { Card } from '../components/Card';

interface IdeaCatalogProps {
  ideas: Idea[];
}

export const IdeaCatalog: React.FC<IdeaCatalogProps> = ({ ideas }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Ideias</h1>
      <p className="text-lg text-gray-600 mb-6">Precisa de inspiração? Explore algumas ideias de produtos para começar.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map(idea => (
          <Card key={idea.id}>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">{idea.category}</span>
            <h3 className="font-bold text-lg text-gray-800">{idea.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{idea.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

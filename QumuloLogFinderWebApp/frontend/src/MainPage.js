import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-green-400">Select Node</h1>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 10 }, (_, i) => (
          <Link
            key={i + 1}
            to={`/node/${i + 1}`}
            className="bg-gray-800 hover:bg-green-600 text-white px-6 py-4 rounded-lg text-center font-bold"
          >
            PMCPROD-{i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPage;

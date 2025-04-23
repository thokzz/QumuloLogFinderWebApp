import React, { useState } from 'react';
import LogResultsTable from './LogResultsTable';
import { Search, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function NodeResultsPage() {
  const { nodeId } = useParams();
  const [keyword, setKeyword] = useState('');
  const [logfile, setLogfile] = useState('');
  const [triggered, setTriggered] = useState(false);

  const handleSearch = () => {
    setTriggered(true); // Now disables input & button
  };

  const handleSearchDone = () => {
    setTriggered(false); // Re-enables input & button
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="w-full px-4">
        <Link to="/" className="text-blue-400 hover:underline">&larr; Back to nodes</Link>
        <h1 className="text-4xl font-bold my-4 text-green-400">
          Log Finder - PMCPROD-{nodeId}
        </h1>
        <div className="flex gap-4 mb-6 items-center">
          <div className="relative flex-grow">
            <input
              placeholder="Enter search keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-800 rounded-lg text-white"
              disabled={triggered}
            />
            <Search className="absolute left-3 top-3.5 text-gray-500" />
          </div>

          <div className="relative">
            <select
              value={logfile}
              onChange={(e) => setLogfile(e.target.value)}
              className="p-3 pl-10 bg-gray-800 rounded-lg text-white"
              disabled={triggered}
            >
              <option value="">qumulo.log (current)</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={`qumulo.log.${i + 1}.gz`}>
                  qumulo.log.{i + 1}.gz
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-3.5 text-gray-500" />
          </div>

          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 p-3 rounded-lg"
            disabled={triggered}
          >
            Search
          </button>
        </div>

        {triggered && (
          <LogResultsTable
            streamUrl="/api/search"
            keyword={keyword}
            logfile={logfile}
            node={nodeId}
            onSearchDone={handleSearchDone}
          />
        )}
      </div>
    </div>
  );
}

export default NodeResultsPage;


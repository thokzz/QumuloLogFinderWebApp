import React, { useEffect, useState, useMemo } from 'react';

function parseLogEntry(raw) {
  const parts = raw.split(',');
  const header = parts[0]?.trim();
  const headerParts = header.split(' ');

  let timestampIpCombo = '';
  let ip = '';

  try {
    if (headerParts.length >= 5) {
      const date = headerParts[0];
      const time = headerParts[1];
      ip = headerParts[4];
      timestampIpCombo = `${date} ${time} ${ip}`;
    }
  } catch (err) {
    console.warn('⚠️ Failed to extract timestamp/IP:', raw);
  }

  const username = parts[1]?.replace(/^"|"$/g, '');
  const protocol = parts[2];
  const action = parts.slice(3, 6).join(',');
  const actionId = parts[5];
  const filePath = parts.slice(6).join(',').replace(/^"|"$/g, '');

  return {
    ip: timestampIpCombo,
    username,
    protocol,
    action,
    actionId,
    filePath
  };
}

function LogResultsTable({ streamUrl, keyword, logfile, node }) {
  const [results, setResults] = useState([]);
  const [bufferedLines, setBufferedLines] = useState([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [isSearching, setIsSearching] = useState(true);
  const [controller, setController] = useState(null);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [isMaxResultsReached, setIsMaxResultsReached] = useState(false);
  const [isApproachingLimit, setIsApproachingLimit] = useState(false); // 🆕 warning state

  const MAX_LOGS = 250000;

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchesKeyword = Object.values(r).some(val =>
        val?.toString().toLowerCase().includes(filter.toLowerCase())
      );
      const matchesAction = actionFilter ? r.action?.includes(actionFilter) : true;
      return matchesKeyword && matchesAction;
    });
  }, [results, filter, actionFilter]);

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const pagedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController);
    setResults([]);
    setIsSearching(true);
    setPage(1);
    setProgress(0);
    setPaused(false);
    setBufferedLines([]);
    setSearchCompleted(false);
    setIsMaxResultsReached(false);
    setIsApproachingLimit(false); // reset warning

    fetch(streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, logfile, node }),
      signal: abortController.signal,
    })
      .then(res => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let lineCounter = 0;

        function readChunk() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              setIsSearching(false);
              setProgress(100);
              setSearchCompleted(true);
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            const newEntries = [];

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                if (json.node && json.log_entry) {
                  if (lineCounter >= MAX_LOGS) {
                    setIsMaxResultsReached(true);
                    setIsSearching(false);
                    setSearchCompleted(true);
                    abortController.abort();
                    return;
                  }

                  if (lineCounter >= 240000 && !isApproachingLimit) {
                    setIsApproachingLimit(true);
                  }

                  const parsed = parseLogEntry(json.log_entry);
                  const entry = { node: json.node, ...parsed };
                  lineCounter++;

                  newEntries.push(entry);
                }
              } catch (e) {
                console.warn('Invalid line:', line);
              }
            }

            if (newEntries.length > 0) {
              if (paused) {
                setBufferedLines(prev => [...prev, ...newEntries]);
              } else {
                setResults(prev => {
                  const combined = [...prev, ...newEntries];
                  const percent = Math.min(100, (combined.length / MAX_LOGS) * 100);
                  setProgress(Math.floor(percent));
                  return combined;
                });
              }
            }

            return readChunk();
          });
        }

        return readChunk();
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Stream error:', err);
        }
        setIsSearching(false);
        setSearchCompleted(true);
      });

    return () => {
      abortController.abort();
    };
  }, [streamUrl, keyword, logfile, node]);

  const exportToCSV = () => {
    const headers = ['Node', 'Date, Time, IP', 'Username', 'Protocol', 'Action', 'Action ID', 'File Path'];
    const rows = results.map(r => [r.node, r.ip, r.username, r.protocol, r.action, r.actionId, `"${r.filePath}"`]);
    const csvContent = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `log_results_${Date.now()}.csv`;
    a.click();
  };

  const handlePauseToggle = () => {
    if (paused) {
      setResults(prev => [...prev, ...bufferedLines]);
      setBufferedLines([]);
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  const handleStop = () => {
    if (controller) controller.abort();
    setIsSearching(false);
    setPaused(false);
    setBufferedLines([]);
    setSearchCompleted(true);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <button key="first" onClick={() => setPage(1)} disabled={page === 1}
        className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
        First
      </button>
    );

    if (startPage > 1) {
      buttons.push(<span key="ellipsis-start" className="px-2 text-gray-400">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => setPage(i)}
          className={`px-3 py-1 rounded ${page === i ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(<span key="ellipsis-end" className="px-2 text-gray-400">...</span>);
    }

    buttons.push(
      <button key="last" onClick={() => setPage(totalPages)} disabled={page === totalPages}
        className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
        Last
      </button>
    );

    return (
      <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-400 mr-2">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          {buttons}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl text-green-400">Search Results ({results.length})</h2>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="Filter results..." value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
            className="px-3 py-1 rounded bg-gray-700 text-white" />
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-1 rounded bg-gray-700 text-white">
            <option value="">All Actions</option>
            <option value="fs_rename">fs_rename</option>
            <option value="fs_create_directory">fs_create_directory</option>
            <option value="fs_create_file">fs_create_file</option>
            <option value="fs_write_data">fs_write_data</option>
            <option value="fs_delete">fs_delete</option>
            <option value="fs_open">fs_open</option>
            <option value="fs_list_directory">fs_list_directory</option>
            <option value="fs_read_metadata">fs_read_metadata</option>
          </select>
          <button onClick={exportToCSV}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
            Export CSV
          </button>
          <button onClick={handlePauseToggle}
            className={`${paused ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-3 py-1 rounded`}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={handleStop}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            Stop
          </button>
        </div>
      </div>

      {isApproachingLimit && !isMaxResultsReached && (
        <div className="bg-orange-800 border border-orange-600 text-orange-200 p-3 mb-4 rounded-md">
          <p className="font-medium">
            ⚠️ Your keyword is returning too many results. The maximum limit is 250,000.<br />
            Press <strong>Stop</strong>, then <strong>New Query</strong>, and try searching with a more specific keyword.
          </p>
        </div>
      )}

      {isMaxResultsReached && (
        <div className="bg-yellow-800 border border-yellow-600 text-yellow-200 p-3 mb-4 rounded-md">
          <p className="font-medium">⚠️ The maximum search threshold can only reach 250,000 results. Try searching for a more unique keyword.</p>
        </div>
      )}

      {searchCompleted && (
        <div className="text-center my-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🔄 New Query
          </button>
        </div>
      )}

      {isSearching && (
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center text-yellow-400">Progress: {progress.toFixed(0)}%</div>
        </div>
      )}

      {!isSearching && searchCompleted && !isMaxResultsReached && (
        <div className="text-center text-green-400 mb-4 font-bold">Search Complete</div>
      )}

      <div className="w-full overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <colgroup>
            <col style={{ width: "130px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "100px" }} />
            <col />
          </colgroup>
          <thead className="bg-gray-700 text-green-400">
            <tr>
              <th className="px-4 py-2 border-r border-gray-600">Node</th>
              <th className="px-4 py-2 border-r border-gray-600">Date, Time, IP</th>
              <th className="px-4 py-2 border-r border-gray-600">Username</th>
              <th className="px-4 py-2 border-r border-gray-600">Protocol</th>
              <th className="px-4 py-2 border-r border-gray-600">Action</th>
              <th className="px-4 py-2 border-r border-gray-600">Action ID</th>
              <th className="px-4 py-2">File Path</th>
            </tr>
          </thead>
          <tbody>
            {pagedResults.map((r, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2 text-green-400 font-bold border-r border-gray-600 truncate">{r.node}</td>
                <td className="px-4 py-2 border-r border-gray-600 break-words">{r.ip}</td>
                <td className="px-4 py-2 border-r border-gray-600 break-words">{r.username}</td>
                <td className="px-4 py-2 border-r border-gray-600 break-words">{r.protocol}</td>
                <td className="px-4 py-2 border-r border-gray-600 break-words">{r.action}</td>
                <td className="px-4 py-2 border-r border-gray-600 break-words">{r.actionId}</td>
                <td className="px-4 py-2 break-words whitespace-normal">{r.filePath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
}

export default LogResultsTable;


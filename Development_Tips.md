# Development Tips for Non-Programmers

This guide provides practical advice for continuing to develop and enhance the Log Finder application, especially if you're new to programming.

## Understanding the Code Base

### Backend (Python/Flask)

#### Key Files:
- **app.py**: The entry point for the Flask application that sets up routes and handles API requests
- **log_searcher.py**: Contains the logic for connecting to servers and searching log files

#### Important Concepts:
- **Routes**: Define endpoints that the frontend can call (`@app.route('/api/search')`)
- **Request Handling**: Processing data sent from the frontend (`request.json`)
- **Response Streaming**: Sending data back to the client gradually (`yield`)
- **SSH Connection**: Using Paramiko to connect to remote servers and execute commands

### Frontend (React)

#### Key Files:
- **App.js**: The main React application that defines routes
- **MainPage.js**: The node selection screen
- **NodeResultsPage.js**: The search interface for a specific node
- **LogResultsTable.js**: The component that displays search results

#### Important Concepts:
- **Components**: Reusable UI elements
- **State**: Data that can change and affect the UI (`useState`)
- **Effects**: Side effects like API calls or subscriptions (`useEffect`)
- **Props**: Data passed from parent to child components
- **Event Handlers**: Functions that respond to user actions

## Making Simple Changes

### Changing Colors and Styling

To modify the appearance of the application, look for Tailwind CSS classes:

```jsx
// Example: Changing button color from green to blue
<button 
  onClick={handleSearch}
  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
  disabled={triggered}
>
  Search
</button>
```

Common Tailwind classes:
- **Colors**: `bg-[color]-[intensity]` (backgrounds), `text-[color]-[intensity]` (text)
- **Spacing**: `p-[number]` (padding), `m-[number]` (margin)
- **Layout**: `flex`, `grid`, `w-[size]` (width), `h-[size]` (height)

### Adding a New Filter Option

To add a new filter option in the LogResultsTable component:

1. Find the select element for filtering:
```jsx
<select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
  className="px-3 py-1 rounded bg-gray-700 text-white">
  <option value="">All Actions</option>
  // Add your new option here
  <option value="new_action_type">New Action Type</option>
</select>
```

### Changing the Maximum Results Limit

To modify the maximum number of results:

1. In LogResultsTable.js, find:
```javascript
const MAX_LOGS = 250000;
```

2. Change this value to your desired limit.

3. Also update the warning thresholds:
```javascript
if (lineCounter >= 240000 && !isApproachingLimit) {
  setIsApproachingLimit(true);
}
```

## Adding New Features

### Adding a Date Filter

To add date filtering capability:

1. Add new state variables in the NodeResultsPage.js file:
```jsx
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
```

2. Add date input fields to the form:
```jsx
<div className="relative">
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="p-3 bg-gray-800 rounded-lg text-white"
    disabled={triggered}
  />
  <span className="mx-2 text-white">to</span>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="p-3 bg-gray-800 rounded-lg text-white"
    disabled={triggered}
  />
</div>
```

3. Pass these values to your LogResultsTable component:
```jsx
<LogResultsTable
  streamUrl="/api/search"
  keyword={keyword}
  logfile={logfile}
  node={nodeId}
  startDate={startDate}
  endDate={endDate}
  onSearchDone={handleSearchDone}
/>
```

4. Update the backend to handle date filtering.

### Adding User Authentication

For simple authentication:

1. Create login components (LoginPage.js)
2. Add state for authentication in App.js
3. Protect routes based on authentication status
4. Add backend routes for authentication

## Debugging Tips

### Common Frontend Issues

#### Problem: Component not rendering

Check for:
- Missing imports at the top of your file
- Missing return statement in your component
- Conditional rendering that might be evaluating to false
- Console errors in your browser's developer tools (F12)

#### Problem: API calls not working

Check for:
- Correct endpoint URL
- Proper formatting of request body
- Network errors in browser developer tools
- Backend server running and accessible
- CORS issues (visible in console)

#### Problem: State not updating

Check for:
- Improper state update (modifying state directly instead of using setter)
- Dependency arrays in useEffect hooks
- Asynchronous updates that might be overwriting each other

### Common Backend Issues

#### Problem: Flask server won't start

Check for:
- Syntax errors in Python files
- Port conflicts (another application using port 5000)
- Environment issues (virtual environment not activated)
- Missing dependencies

#### Problem: SSH connection failures

Check for:
- Correct credentials in credential.ini
- Server accessibility (can you SSH manually?)
- Firewall restrictions
- Key file permissions

#### Problem: Slow performance

Check for:
- Large log files causing delays
- Inefficient filtering
- Memory leaks in streaming code
- Network latency

## Using Browser Developer Tools

The browser's developer tools are essential for debugging:

1. Open with F12 or right-click and select "Inspect"
2. Key panels:
   - **Console**: View JavaScript errors and logs
   - **Network**: Monitor API calls and responses
   - **Elements**: Inspect and modify the DOM
   - **React DevTools**: Debug component hierarchy and props (requires browser extension)

## Adding Console Logs

Strategic console.logs can help debug issues:

```javascript
// Log state changes
useEffect(() => {
  console.log('Results changed:', results);
}, [results]);

// Log before and after operations
const handleSearch = () => {
  console.log('Starting search with:', { keyword, logfile, node });
  setTriggered(true);
  console.log('Search triggered');
};

// Log in conditional blocks
if (isMaxResultsReached) {
  console.log('Max results reached:', MAX_LOGS);
}
```

## Version Control

Even for solo development, using Git helps track changes:

Basic Git commands:
```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Description of changes"

# Create a new branch for testing features
git checkout -b new-feature

# Switch back to main branch
git checkout main
```

## Resources for Learning More

### Python/Flask
- [Python Official Documentation](https://docs.python.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Real Python Tutorials](https://realpython.com/)

### React
- [React Official Documentation](https://reactjs.org/docs/getting-started.html)
- [React Hooks Reference](https://reactjs.org/docs/hooks-reference.html)
- [Egghead.io React Courses](https://egghead.io/courses)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

### General Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [FreeCodeCamp](https://www.freecodecamp.org/)
- [CSS Tricks](https://css-tricks.com/)

## Asking for Help

When seeking help from others or AI assistants:

1. **Be specific**: Describe exactly what you're trying to do
2. **Share code**: Provide relevant code snippets
3. **Include error messages**: Copy exact error text
4. **Explain what you've tried**: List debugging steps already taken
5. **Ask clear questions**: Instead of "it doesn't work," ask "Why might this useState hook not be updating the UI?"

## Continuing Your Learning Journey

To build on what you've learned:

1. **Add small features**: Start with simple enhancements
2. **Refactor existing code**: Improve what's already working
3. **Learn one concept at a time**: Focus on understanding specific areas (state management, API design, etc.)
4. **Build similar projects**: Apply the same patterns to new problems
5. **Contribute to open source**: Once comfortable, help others with their projects

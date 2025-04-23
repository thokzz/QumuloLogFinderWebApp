# Log Finder Web Application

![Log Finder Screenshot](https://via.placeholder.com/1200x600?text=Log+Finder+Web+App)

## Project Overview

Log Finder is a full-stack web application designed to efficiently search and analyze system logs across multiple server nodes. This tool streamlines the process of filtering through large log files, presenting results in a user-friendly interface, and allowing for export capabilities.

### Key Features

- **Multi-Node Search**: Search logs across up to 10 server nodes simultaneously
- **Real-time Results**: Stream search results as they arrive
- **Advanced Filtering**: Filter search results by various parameters including action types
- **Pagination**: Navigate through large result sets with ease
- **CSV Export**: Export search results for further analysis
- **Progress Tracking**: View search progress with a real-time progress bar
- **Responsive Design**: Optimized for both desktop and mobile viewing

## Tech Stack

- **Backend**:
  - Python 3.x
  - Flask (Web framework)
  - Paramiko (SSH client)
  - SSH key-based authentication

- **Frontend**:
  - React 19
  - React Router 7
  - Tailwind CSS
  - Lucide React (Icons)

## Installation and Setup

### Prerequisites

- Python 3.x
- Node.js and npm
- SSH access to your log server(s)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/log-finder.git
   cd log-finder
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install flask flask-cors paramiko configparser
   ```

3. Create your credentials configuration file:
   ```bash
   mkdir -p /keys/credential
   touch /keys/credential/credential.ini
   ```

4. Edit the credential.ini file with your SSH connection details:
   ```ini
   [SSH]
   host=your-log-server.example.com
   user=your-username
   password=your-password
   key_path=/path/to/your/ssh/private_key
   ```

5. Create the logs directory:
   ```bash
   mkdir -p /scripts/log_finder
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install NPM dependencies:
   ```bash
   npm install
   ```

3. Update the proxy setting in `package.json` if your backend is running on a different port or host.

## Running the Application

### Start the Backend

```bash
python app.py
```

This will start the Flask server on port 5000.

### Start the Frontend

```bash
cd frontend
npm start
```

This will start the React development server on port 3000.

## Accessing the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## How to Use

1. **Select a Node**: From the main page, choose which server node you want to search
2. **Enter Search Criteria**: 
   - Enter your search keyword
   - Select which log file to search (current or rotated logs)
3. **Start Search**: Click the "Search" button to begin
4. **View Results**: Results will stream in real-time to the table
5. **Filter Results**: Use the filter box to narrow down results
6. **Export**: Click "Export CSV" to download results for further analysis

## Customization

### Log Server Configuration

- The application is configured to search logs in the `/var/log/PMCPROD-{node}/qumulo.log` directory
- You can modify the `log_searcher.py` file to change the log path pattern

### Adding More Actions

To add more action types to the filter dropdown:
1. Open `LogResultsTable.js`
2. Locate the action filter `<select>` element
3. Add additional `<option>` elements with the desired action types

## Project Structure

```
├── app.py                # Flask application entry point
├── log_searcher.py       # Log searching functionality
├── __init__.py           # Python package initialization
├── frontend/
│   ├── package.json      # Node.js dependencies
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── App.js        # Main React application
│   │   ├── MainPage.js   # Node selection page
│   │   ├── components/
│   │   │   ├── LogResultsTable.js    # Results display component
│   │   │   ├── NodeResultsPage.js    # Node-specific search page
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── postcss.config.js  # PostCSS configuration
```

## Built With AI Assistance

This project was created with no prior coding background, leveraging the power of AI language models:

- **ChatGPT 4.0** and **Claude 3.7 Sonnet** provided code generation, debugging assistance, and architectural guidance
- The development process involved an iterative approach of requesting code, understanding it, and refining it through AI collaboration

The result demonstrates that complex full-stack applications can be developed by individuals without formal programming experience by effectively utilizing AI tools as collaborative partners in the development process.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- The project uses the [Paramiko](https://www.paramiko.org/) library for SSH connections
- User interface built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons provided by [Lucide React](https://lucide.dev/)

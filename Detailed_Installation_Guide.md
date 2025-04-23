# Detailed Installation Guide

This guide provides step-by-step instructions for setting up the Log Finder web application from scratch. It's designed for individuals who may not have extensive technical background.

## System Requirements

- **Operating System**: Linux, macOS, or Windows
- **Memory**: At least 4GB RAM
- **Storage**: At least 1GB of free disk space
- **Internet Connection**: Required for downloading dependencies

## Installation Steps

### 1. Install Python

#### On Windows:
1. Download the latest Python installer from [python.org](https://www.python.org/downloads/)
2. Run the installer and check "Add Python to PATH"
3. Click "Install Now"
4. Verify installation by opening Command Prompt and typing:
   ```
   python --version
   ```

#### On macOS:
1. Install Homebrew if not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Python:
   ```bash
   brew install python
   ```

#### On Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### 2. Install Node.js and npm

#### On Windows:
1. Download the LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer with default settings
3. Verify installation:
   ```
   node --version
   npm --version
   ```

#### On macOS:
```bash
brew install node
```

#### On Linux:
```bash
sudo apt install nodejs npm
```

### 3. Set Up Project Directory

```bash
# Create project directory
mkdir -p ~/log-finder
cd ~/log-finder

# Create backend directory structure
mkdir -p keys/credential
mkdir -p scripts/log_finder/frontend
mkdir -p scripts/log_finder/log_finder
```

### 4. Set Up Python Backend

```bash
# Create and activate virtual environment
cd ~/log-finder
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install flask flask-cors paramiko configparser
```

### 5. Create Backend Files

Create `app.py` in the `~/log-finder` directory with the contents from the provided file.

Create `log_searcher.py` in the `~/log-finder` directory with the contents from the provided file.

Create an empty `__init__.py` file in the same directory.

### 6. Configure SSH Credentials

Create and edit the credential configuration file:

```bash
touch ~/log-finder/keys/credential/credential.ini
```

Open the file in a text editor and add:

```ini
[SSH]
host=your-log-server.example.com
user=your-username
password=your-password
key_path=/path/to/your/ssh/private_key
```

Replace the placeholder values with your actual SSH connection details.

### 7. Set Up React Frontend

```bash
# Navigate to frontend directory
cd ~/log-finder/scripts/log_finder/frontend

# Initialize a new React application
npx create-react-app .

# Install required dependencies
npm install react-router-dom lucide-react tailwindcss autoprefixer postcss
```

### 8. Create Frontend Files

Now create the following files in your frontend directory structure:

- `~/log-finder/scripts/log_finder/frontend/src/App.js`
- `~/log-finder/scripts/log_finder/frontend/src/MainPage.js`
- `~/log-finder/scripts/log_finder/frontend/src/components/LogResultsTable.js`
- `~/log-finder/scripts/log_finder/frontend/src/components/NodeResultsPage.js`
- `~/log-finder/scripts/log_finder/frontend/src/index.css`
- `~/log-finder/scripts/log_finder/frontend/tailwind.config.js`
- `~/log-finder/scripts/log_finder/frontend/postcss.config.js`

Copy the contents from the files provided in your project.

### 9. Configure Tailwind CSS

Initialize Tailwind CSS:

```bash
cd ~/log-finder/scripts/log_finder/frontend
npx tailwindcss init -p
```

Edit `tailwind.config.js` to match the provided file.

Add the Tailwind directives to your CSS by updating `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, sans-serif;
}
```

### 10. Update package.json

Edit your `package.json` to add:

```json
"proxy": "http://localhost:5000"
```

This will forward API requests from React to your Flask backend.

## Running the Application

### Start the Backend

```bash
# From the root directory
cd ~/log-finder
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The Flask server will start on port 5000.

### Start the Frontend

```bash
# From the frontend directory
cd ~/log-finder/scripts/log_finder/frontend
npm start
```

The React development server will start on port 3000.

## Accessing the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## Troubleshooting

### Backend Issues

- **SSH Connection Failed**: Verify your SSH credentials in the credential.ini file
- **Permission Denied**: Ensure your SSH user has permissions to read log files
- **Logs Not Found**: Check if the log path pattern in log_searcher.py matches your server setup

### Frontend Issues

- **Node Modules Error**: Try deleting the node_modules folder and running npm install again
- **API Connection Failed**: Check if the backend server is running and the proxy is set correctly
- **CSS Not Loading**: Verify that Tailwind is properly configured in your postcss.config.js

## Deployment Considerations

### For Production Use

1. Set up proper environment variables instead of hardcoded credentials
2. Consider using a production WSGI server like Gunicorn for Flask
3. Build the React app for production with `npm run build`
4. Serve the static files using a web server like Nginx

## Next Steps for Enhancement

- Add user authentication
- Implement log bookmarking
- Add dashboard analytics
- Expand search capabilities with regex support

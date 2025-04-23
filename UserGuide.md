# Log Finder User Guide

This guide explains how to effectively use the Log Finder application to search, filter, and analyze log files across your server nodes.

## Contents

1. [Getting Started](#getting-started)
2. [Searching Logs](#searching-logs)
3. [Understanding the Results](#understanding-the-results)
4. [Filtering and Sorting](#filtering-and-sorting)
5. [Exporting Data](#exporting-data)
6. [Managing Large Result Sets](#managing-large-result-sets)
7. [Tips for Effective Searching](#tips-for-effective-searching)

## Getting Started

### Accessing the Application

1. Open your web browser and navigate to the application URL (typically `http://localhost:3000` in development mode)
2. You'll be presented with the node selection screen

### Selecting a Node

The main page displays all available nodes (PMCPROD-1 through PMCPROD-10):

![Node Selection Screen](https://via.placeholder.com/800x400?text=Node+Selection+Screen)

1. Click on the node you wish to search
2. This will take you to the search page for that specific node

## Searching Logs

### Basic Search

On the node's search page:

1. Enter your search keyword in the search box
   - This can be any text string you want to find in the logs
   - The search is case-insensitive
   - Examples: username, file path, IP address, action type

2. Select the log file to search:
   - `qumulo.log (current)` - The active log file
   - `qumulo.log.1.gz` through `qumulo.log.15.gz` - Rotated (older) compressed logs

3. Click the "Search" button to begin

![Search Interface](https://via.placeholder.com/800x400?text=Search+Interface)

### Search Progress

Once a search begins:

- A progress bar displays the search completion percentage
- Results stream in real-time as they are found
- The search can be paused or stopped at any time

## Understanding the Results

The results table contains the following columns:

| Column | Description |
|--------|-------------|
| Node | The server node ID (e.g., PMCPROD-1) |
| Date, Time, IP | When the log entry was recorded and from which IP |
| Username | User who performed the action |
| Protocol | Communication protocol used (e.g., SMB, NFS) |
| Action | Type of action performed (e.g., fs_create_file) |
| Action ID | Unique identifier for the action |
| File Path | Path of the file or directory affected |

![Results Table](https://via.placeholder.com/800x400?text=Results+Table)

## Filtering and Sorting

### Text Filtering

Use the "Filter results..." text box to filter displayed results by any text value:

1. Type any text to filter across all columns
2. Results update instantly as you type
3. Filtering does not affect the underlying search results, only what's displayed

### Action Type Filtering

Use the action type dropdown to filter by specific actions:

1. Click the dropdown to see available action types
2. Select an action to show only those entries
3. Available actions include:
   - fs_rename
   - fs_create_directory
   - fs_create_file
   - fs_write_data
   - fs_delete
   - fs_open
   - fs_list_directory
   - fs_read_metadata

## Exporting Data

To export search results:

1. Click the "Export CSV" button
2. A CSV file will be downloaded to your computer
3. The filename includes a timestamp (e.g., `log_results_1650372429.csv`)
4. The exported file contains all results (not just the current page)

## Managing Large Result Sets

### Pagination

For large result sets:

1. Navigate between pages using the pagination controls at the bottom
2. First/Last buttons jump to the beginning or end of results
3. Click on specific page numbers to jump directly to that page

### Pausing and Resuming

Control the search process:

1. Click "Pause" to temporarily halt incoming results
   - Results continue to be found but are buffered
   - The interface remains responsive for exploring current results

2. Click "Resume" to continue displaying incoming results

### Stopping a Search

To end a search before completion:

1. Click the "Stop" button
2. The search will terminate immediately 
3. Click "New Query" to start a fresh search

## Tips for Effective Searching

### Better Keywords

- Use specific terms that are likely unique to what you're searching for
- For user activity, search by username
- For file operations, search by file extension or directory name
- When troubleshooting, search for error codes or message fragments

### Managing Search Limits

- The application has a limit of 250,000 results per search
- If you see the warning about approaching the limit:
  1. Stop the current search
  2. Refine your search terms to be more specific
  3. Consider narrowing your search to specific log files
  4. Try searching for a shorter time period (more recent log files)

### Recommended Workflow

For investigating incidents:

1. Start with a broad search to identify patterns
2. Export results for record-keeping
3. Refine searches based on initial findings
4. Focus on specific time periods when issues occurred
5. Compare activity across multiple nodes if needed

## Keyboard Shortcuts

| Key Combination | Action |
|-----------------|--------|
| Ctrl+F | Focus the filter input |
| Esc | Clear the filter |
| Ctrl+E | Export to CSV |
| Spacebar | Pause/Resume search |

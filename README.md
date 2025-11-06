# AI Project Management System

A comprehensive project management system for tracking AI initiatives in marketing teams, featuring an intake form, intelligent prioritization, and a card-based Kanban view.

## Features

### 📝 AI Project Intake Form
- Easy-to-use form for submitting new AI project requests
- Captures essential information: name, description, assigned person, status, priority, date
- Collects additional metrics: business impact, effort estimate, and subitems
- Smart prioritization scoring system

### 🎯 Intelligent Prioritization System
The system automatically calculates a priority score (0-10) for each project based on:
- **Priority Level** (High/Medium/Low) - Weight: 2x
- **Business Impact** (Critical/High/Medium/Low) - Weight: 3x
- **Effort Estimate** (Small/Medium/Large/X-Large) - Weight: 1x

Formula: `(Priority × 2 + Impact × 3 + Effort) / 6`

This ensures high-impact, high-priority projects with reasonable effort get the highest scores.

### 📊 Card View (Kanban Board)
Projects are organized into three status columns:
- **💡 New Ideas** - Newly submitted projects in discovery phase
- **🚀 In Progress** - Active projects being worked on
- **✅ Delivered** - Completed projects

### 🎨 Visual Priority Indicators
- 🔴 **High Priority** - Red accent and background
- 🟡 **Medium Priority** - Yellow/amber accent and background
- 🟢 **Low Priority** - Green accent and background

### 🔧 Project Management Features
- **Edit Projects** - Click any card to edit project details
- **Delete Projects** - Remove projects that are no longer relevant
- **Filter by Priority** - View only high, medium, or low priority projects
- **Sort Options** - Sort by priority score, date, or name
- **Statistics Dashboard** - Real-time metrics on total projects, priorities, and status
- **Data Export** - Export all projects as JSON for backup or analysis

### 💾 Data Persistence
All project data is stored locally in your browser using localStorage, so your data persists between sessions.

## Getting Started

### Initial Setup
1. Open `index.html` in a web browser
2. The system comes pre-loaded with your existing projects
3. Start adding new projects using the "+ New AI Project" button

### Adding a New Project
1. Click the **"+ New AI Project"** button
2. Fill in the required fields:
   - Project Name
   - Assigned To
   - Status (New ideas/In progress/Delivered)
   - Priority (High/Medium/Low)
   - Date
3. Optionally add:
   - Description
   - Subitems (comma-separated)
   - Business Impact assessment
   - Effort Estimate
4. Click **"Add Project"**

### Managing Projects
- **View Details**: Cards display all project information including priority score
- **Edit**: Click on any card to open the edit modal
- **Delete**: Open edit modal and click "Delete Project"
- **Move Status**: Edit a project and change its status to move it between columns

### Filtering and Sorting
- Use the **Filter by Priority** dropdown to show only specific priorities
- Use the **Sort by** dropdown to order projects by:
  - Priority (default) - Highest priority score first
  - Date - Most recent first
  - Name - Alphabetical order

### Export Data
Click the **"📊 Export Data"** button to download all projects as a JSON file for backup or analysis in other tools.

## Keyboard Shortcuts
- `Ctrl/Cmd + N` - Open new project form
- `Escape` - Close open modals or forms

## Pre-loaded Projects

The system comes with your existing projects:

**New Ideas:**
- Automated Nurture Cadences Updater
- SEO / Metadata validator and Scraper

**In Progress:**
- AI MKT Governance
- Website Analyst
- Marketing Content Agent

**Delivered:**
- Marky, Martech chatbot

## Technical Details

### Files
- `index.html` - Main HTML structure and forms
- `styles.css` - Complete styling with responsive design
- `app.js` - All functionality including data management, prioritization, and UI interactions

### Browser Compatibility
Works on all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- localStorage API

### Data Structure
Each project contains:
```javascript
{
  id: string,
  name: string,
  description: string,
  person: string,
  status: 'New ideas' | 'In progress' | 'Delivered',
  priority: 'High' | 'Medium' | 'Low',
  date: string (YYYY-MM-DD),
  subitems: array of strings,
  impact: 'Critical' | 'High' | 'Medium' | 'Low',
  effort: 'Small' | 'Medium' | 'Large' | 'XLarge',
  calculatedScore: number (0-10)
}
```

## Customization

### Adding Team Members
The "Assigned To" field is a text input that supports multiple names separated by commas (e.g., "Samuel Martin, Rob Woestenborghs").

### Modifying Priority Calculation
Edit the scoring weights in `app.js`:
```javascript
const PRIORITY_SCORES = { 'High': 3, 'Medium': 2, 'Low': 1 };
const IMPACT_SCORES = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
const EFFORT_SCORES = { 'Small': 4, 'Medium': 3, 'Large': 2, 'XLarge': 1 };
```

### Changing Status Categories
Modify the status options in both `index.html` (form select elements) and `app.js` (rendering functions).

## Support

For questions or issues with the system, please refer to the code comments or modify the system according to your team's needs.

## License

Created for internal use by the Marketing Team.

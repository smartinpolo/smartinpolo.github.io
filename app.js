// AI Project Management System
// Local Storage Key
const STORAGE_KEY = 'aiProjectsData';
const AUTH_KEY = 'aiProjectsAuth';
const AUTH_REMEMBER_KEY = 'aiProjectsRemember';

// ============================================
// AUTHENTICATION SYSTEM
// ============================================
// To set up your password:
// 1. Open setup-password.html in your browser
// 2. Enter your desired password and generate the hash
// 3. Copy the hash and replace the PASSWORD_HASH value below
//
// Or use the browser console after any login:
// 1. Run: await hashPassword("your-password")
// 2. Copy the resulting hash
// 3. Replace the PASSWORD_HASH value below
// ============================================

// IMPORTANT: Replace this hash with your own!
// Open setup-password.html to generate your password hash
// TEMPORARY password for setup: "admin"
// Please change this immediately using setup-password.html
const PASSWORD_HASH = '19fe7a5a1bef7973df7a6611130a9f0b27a1b0d91b0b9713d70c3491865ce414'; // SHA-256 of "admin"

// SHA-256 Hash Function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Check Authentication Status
function checkAuth() {
    // Check sessionStorage first
    const sessionAuth = sessionStorage.getItem(AUTH_KEY);
    if (sessionAuth === 'true') {
        return true;
    }

    // Check localStorage if "remember me" was checked
    const rememberAuth = localStorage.getItem(AUTH_REMEMBER_KEY);
    if (rememberAuth === 'true') {
        // Re-authenticate in session
        sessionStorage.setItem(AUTH_KEY, 'true');
        return true;
    }

    return false;
}

// Authenticate User
async function authenticate(password, rememberMe) {
    const hash = await hashPassword(password);

    if (hash === PASSWORD_HASH) {
        sessionStorage.setItem(AUTH_KEY, 'true');

        if (rememberMe) {
            localStorage.setItem(AUTH_REMEMBER_KEY, 'true');
        } else {
            localStorage.removeItem(AUTH_REMEMBER_KEY);
        }

        return true;
    }

    return false;
}

// Logout User
function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_REMEMBER_KEY);
    location.reload();
}

// Show/Hide Content Based on Auth
function updateAuthUI() {
    const isAuthenticated = checkAuth();
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');

    if (isAuthenticated) {
        authScreen.classList.add('hidden');
        mainContent.classList.add('authenticated');
    } else {
        authScreen.classList.remove('hidden');
        mainContent.classList.remove('authenticated');
    }
}

// Setup Auth Event Listeners
function setupAuthListeners() {
    const authForm = document.getElementById('authForm');
    const logoutBtn = document.getElementById('logoutBtn');

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorDiv = document.getElementById('authError');

        const success = await authenticate(password, rememberMe);

        if (success) {
            updateAuthUI();
            errorDiv.textContent = '';
            // Initialize app after successful login
            initializeApp();
            setupEventListeners();
            loadProjects();
            renderProjects();
            updateStatistics();
        } else {
            errorDiv.textContent = 'Incorrect password. Please try again.';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    });

    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
}

// ============================================
// END AUTHENTICATION SYSTEM
// ============================================

// Make hashPassword available in console for password changes
window.hashPassword = hashPassword;

// Project Data Structure
let projects = [];

// Priority Scoring System
const PRIORITY_SCORES = {
    'High': 3,
    'Medium': 2,
    'Low': 1
};

const IMPACT_SCORES = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1
};

const EFFORT_SCORES = {
    'Small': 4,    // Less effort = higher score
    'Medium': 3,
    'Large': 2,
    'XLarge': 1
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Setup auth listeners first
    setupAuthListeners();

    // Check authentication and update UI
    updateAuthUI();

    // Only initialize app if already authenticated
    if (checkAuth()) {
        initializeApp();
        setupEventListeners();
        loadProjects();
        renderProjects();
        updateStatistics();
    }
});

// Initialize with default data if empty
function initializeApp() {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
        projects = getInitialProjects();
        saveProjects();
    }
}

// Initial Projects Data (from user's provided list)
function getInitialProjects() {
    return [
        {
            id: generateId(),
            name: 'Automated Nurture Cadences Updater',
            description: '',
            person: 'Samuel Martin',
            status: 'New ideas',
            priority: 'Medium',
            date: '2025-11-04',
            subitems: [],
            impact: 'High',
            effort: 'Medium',
            calculatedScore: 0
        },
        {
            id: generateId(),
            name: 'SEO / Metadata validator and Scraper',
            description: '',
            person: 'Samuel Martin',
            status: 'New ideas',
            priority: 'Medium',
            date: '2025-11-04',
            subitems: [],
            impact: 'Medium',
            effort: 'Small',
            calculatedScore: 0
        },
        {
            id: generateId(),
            name: 'AI MKT Governance',
            description: '',
            person: 'Samuel Martin, Rob Woestenborghs',
            status: 'In progress',
            priority: 'High',
            date: '2025-11-03',
            subitems: [],
            impact: 'Critical',
            effort: 'Large',
            calculatedScore: 0
        },
        {
            id: generateId(),
            name: 'Website Analyst',
            description: '',
            person: '',
            status: 'In progress',
            priority: 'Medium',
            date: '2025-11-03',
            subitems: [],
            impact: 'Medium',
            effort: 'Medium',
            calculatedScore: 0
        },
        {
            id: generateId(),
            name: 'Marketing Content Agent',
            description: '',
            person: '',
            status: 'In progress',
            priority: 'Medium',
            date: '2025-11-03',
            subitems: [],
            impact: 'High',
            effort: 'Large',
            calculatedScore: 0
        },
        {
            id: generateId(),
            name: 'Marky, Martech chatbot',
            description: '',
            person: '',
            status: 'Delivered',
            priority: 'Low',
            date: '',
            subitems: [],
            impact: 'Medium',
            effort: 'Medium',
            calculatedScore: 0
        }
    ];
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculate Priority Score
function calculatePriorityScore(project) {
    const priorityScore = PRIORITY_SCORES[project.priority] || 2;
    const impactScore = IMPACT_SCORES[project.impact] || 2;
    const effortScore = EFFORT_SCORES[project.effort] || 3;

    // Formula: (Priority * 2 + Impact * 3 + Effort) / 6
    // This weights impact highest, then priority, then effort
    const totalScore = (priorityScore * 2 + impactScore * 3 + effortScore) / 6;

    return parseFloat(totalScore.toFixed(2));
}

// Setup Event Listeners
function setupEventListeners() {
    // Form toggle
    document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);
    document.getElementById('closeFormBtn').addEventListener('click', closeForm);
    document.getElementById('cancelFormBtn').addEventListener('click', closeForm);

    // Form submission
    document.getElementById('intakeForm').addEventListener('submit', handleFormSubmit);

    // Edit modal
    document.getElementById('closeEditModalBtn').addEventListener('click', closeEditModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    document.getElementById('deleteProjectBtn').addEventListener('click', handleDeleteProject);

    // Filter and sort
    document.getElementById('filterPriority').addEventListener('change', renderProjects);
    document.getElementById('sortBy').addEventListener('change', renderProjects);

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportData);

    // Report generation
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    document.getElementById('closeReportModalBtn').addEventListener('click', closeReportModal);
    document.getElementById('closeReportBtn').addEventListener('click', closeReportModal);
    document.getElementById('printReportBtn').addEventListener('click', printReport);
    document.getElementById('downloadReportPdfBtn').addEventListener('click', downloadReportPdf);

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('projectDate').value = today;
}

// Toggle Form
function toggleForm() {
    const formContainer = document.getElementById('intakeFormContainer');
    formContainer.classList.toggle('active');
}

function closeForm() {
    document.getElementById('intakeFormContainer').classList.remove('active');
    document.getElementById('intakeForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('projectDate').value = today;
}

// Handle Form Submit
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        id: generateId(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        person: document.getElementById('projectPerson').value,
        status: document.getElementById('projectStatus').value,
        priority: document.getElementById('projectPriority').value,
        date: document.getElementById('projectDate').value,
        subitems: document.getElementById('projectSubitems').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item),
        impact: document.getElementById('projectImpact').value,
        effort: document.getElementById('projectEffort').value,
        calculatedScore: 0
    };

    // Calculate priority score
    formData.calculatedScore = calculatePriorityScore(formData);

    projects.push(formData);
    saveProjects();
    renderProjects();
    updateStatistics();
    closeForm();

    showSuccessMessage('Project added successfully!');
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjects() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        projects = JSON.parse(stored);
        // Recalculate scores for existing projects
        projects = projects.map(project => ({
            ...project,
            calculatedScore: calculatePriorityScore(project)
        }));
        saveProjects();
    }
}

// Render Projects
function renderProjects() {
    const filterPriority = document.getElementById('filterPriority').value;
    const sortBy = document.getElementById('sortBy').value;

    // Filter projects
    let filteredProjects = projects;
    if (filterPriority !== 'All') {
        filteredProjects = projects.filter(p => p.priority === filterPriority);
    }

    // Sort projects
    filteredProjects = sortProjects(filteredProjects, sortBy);

    // Separate by status
    const newIdeas = filteredProjects.filter(p => p.status === 'New ideas');
    const inProgress = filteredProjects.filter(p => p.status === 'In progress');
    const delivered = filteredProjects.filter(p => p.status === 'Delivered');

    // Render each column
    renderColumn('newIdeasCards', newIdeas, 'countNewIdeas');
    renderColumn('inProgressCards', inProgress, 'countInProgress');
    renderColumn('deliveredCards', delivered, 'countDelivered');
}

// Sort Projects
function sortProjects(projectsList, sortBy) {
    const sorted = [...projectsList];

    switch (sortBy) {
        case 'priority':
            return sorted.sort((a, b) => {
                const scoreA = calculatePriorityScore(a);
                const scoreB = calculatePriorityScore(b);
                return scoreB - scoreA; // Highest score first
            });
        case 'date':
            return sorted.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(b.date) - new Date(a.date);
            });
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Render Column
function renderColumn(containerId, projectsList, countId) {
    const container = document.getElementById(containerId);
    const countElement = document.getElementById(countId);

    countElement.textContent = projectsList.length;

    if (projectsList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No projects in this category</div>
            </div>
        `;
        return;
    }

    container.innerHTML = projectsList.map(project => createProjectCard(project)).join('');

    // Add click listeners to cards
    container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            openEditModal(projectId);
        });
    });
}

// Create Project Card HTML
function createProjectCard(project) {
    const priorityClass = project.priority.toLowerCase();
    const priorityEmoji = getPriorityEmoji(project.priority);
    const formattedDate = project.date ? formatDate(project.date) : 'No date';
    const score = calculatePriorityScore(project);

    return `
        <div class="project-card priority-${priorityClass}" data-project-id="${project.id}">
            <div class="card-header">
                <div>
                    <div class="card-title">${escapeHtml(project.name)}</div>
                </div>
                <span class="priority-badge ${priorityClass}">
                    ${priorityEmoji} ${project.priority}
                </span>
            </div>

            ${project.description ? `<div class="card-description">${escapeHtml(project.description)}</div>` : ''}

            <div class="card-meta">
                ${project.person ? `
                    <div class="meta-row">
                        <span>👤</span>
                        <strong>${escapeHtml(project.person)}</strong>
                    </div>
                ` : ''}

                <div class="meta-row">
                    <span>📅</span>
                    <span>${formattedDate}</span>
                </div>

                <div class="meta-row">
                    <span>📊</span>
                    <span>Impact: <span class="impact-badge ${project.impact.toLowerCase()}">${project.impact}</span></span>
                </div>

                <div class="meta-row">
                    <span>⚡</span>
                    <span>Effort: ${project.effort}</span>
                </div>

                <div class="meta-row">
                    <span>🎯</span>
                    <span>Priority Score: <strong>${score}</strong>/10</span>
                </div>
            </div>

            ${project.subitems && project.subitems.length > 0 ? `
                <div class="subitems">
                    ${project.subitems.map(item => `
                        <span class="subitem">${escapeHtml(item)}</span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Get Priority Emoji
function getPriorityEmoji(priority) {
    const emojis = {
        'High': '🔴',
        'Medium': '🟡',
        'Low': '🟢'
    };
    return emojis[priority] || '⚪';
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update Statistics
function updateStatistics() {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('highPriorityCount').textContent =
        projects.filter(p => p.priority === 'High').length;
    document.getElementById('inProgressCount').textContent =
        projects.filter(p => p.status === 'In progress').length;
    document.getElementById('deliveredCount').textContent =
        projects.filter(p => p.status === 'Delivered').length;
}

// Edit Modal Functions
function openEditModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Populate form
    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editProjectName').value = project.name;
    document.getElementById('editProjectDescription').value = project.description || '';
    document.getElementById('editProjectPerson').value = project.person || '';
    document.getElementById('editProjectStatus').value = project.status;
    document.getElementById('editProjectPriority').value = project.priority;
    document.getElementById('editProjectDate').value = project.date || '';
    document.getElementById('editProjectSubitems').value = project.subitems ? project.subitems.join(', ') : '';
    document.getElementById('editProjectImpact').value = project.impact || 'Medium';
    document.getElementById('editProjectEffort').value = project.effort || 'Medium';

    // Show modal
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editForm').reset();
}

function handleEditSubmit(e) {
    e.preventDefault();

    const projectId = document.getElementById('editProjectId').value;
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) return;

    projects[projectIndex] = {
        ...projects[projectIndex],
        name: document.getElementById('editProjectName').value,
        description: document.getElementById('editProjectDescription').value,
        person: document.getElementById('editProjectPerson').value,
        status: document.getElementById('editProjectStatus').value,
        priority: document.getElementById('editProjectPriority').value,
        date: document.getElementById('editProjectDate').value,
        subitems: document.getElementById('editProjectSubitems').value
            .split(',')
            .map(item => item.trim())
            .filter(item => item),
        impact: document.getElementById('editProjectImpact').value,
        effort: document.getElementById('editProjectEffort').value
    };

    // Recalculate score
    projects[projectIndex].calculatedScore = calculatePriorityScore(projects[projectIndex]);

    saveProjects();
    renderProjects();
    updateStatistics();
    closeEditModal();

    showSuccessMessage('Project updated successfully!');
}

function handleDeleteProject() {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    const projectId = document.getElementById('editProjectId').value;
    projects = projects.filter(p => p.id !== projectId);

    saveProjects();
    renderProjects();
    updateStatistics();
    closeEditModal();

    showSuccessMessage('Project deleted successfully!');
}

// Export Data
function exportData() {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccessMessage('Data exported successfully!');
}

// Show Success Message
function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport() {
    const reportContent = document.getElementById('reportContent');
    const now = new Date();
    const reportDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Calculate statistics
    const totalProjects = projects.length;
    const newIdeas = projects.filter(p => p.status === 'New ideas').length;
    const inProgress = projects.filter(p => p.status === 'In progress').length;
    const delivered = projects.filter(p => p.status === 'Delivered').length;
    const highPriority = projects.filter(p => p.priority === 'High').length;
    const mediumPriority = projects.filter(p => p.priority === 'Medium').length;
    const lowPriority = projects.filter(p => p.priority === 'Low').length;

    // Calculate completion rate
    const completionRate = totalProjects > 0 ? ((delivered / totalProjects) * 100).toFixed(1) : 0;

    // Get top priority projects
    const topProjects = [...projects]
        .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a))
        .slice(0, 10);

    // Generate HTML report
    reportContent.innerHTML = `
        <div class="report-header">
            <h1 class="report-title">AI Projects Report</h1>
            <p class="report-subtitle">Marketing Team AI Initiatives</p>
            <p class="report-subtitle">Generated on ${reportDate}</p>
        </div>

        <!-- Executive Summary -->
        <div class="report-section">
            <h2 class="report-section-title">Executive Summary</h2>
            <div class="report-summary-grid">
                <div class="report-summary-card">
                    <div class="report-summary-label">Total Projects</div>
                    <div class="report-summary-value">${totalProjects}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">In Progress</div>
                    <div class="report-summary-value" style="color: var(--primary-light);">${inProgress}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Delivered</div>
                    <div class="report-summary-value" style="color: var(--success-color);">${delivered}</div>
                </div>
                <div class="report-summary-card">
                    <div class="report-summary-label">Completion Rate</div>
                    <div class="report-summary-value" style="color: var(--success-color);">${completionRate}%</div>
                </div>
            </div>
        </div>

        <!-- Status Breakdown -->
        <div class="report-section">
            <h2 class="report-section-title">Projects by Status</h2>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>New Ideas</td>
                        <td>${newIdeas}</td>
                        <td>${totalProjects > 0 ? ((newIdeas / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td>In Progress</td>
                        <td>${inProgress}</td>
                        <td>${totalProjects > 0 ? ((inProgress / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td>Delivered</td>
                        <td>${delivered}</td>
                        <td>${totalProjects > 0 ? ((delivered / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Priority Breakdown -->
        <div class="report-section">
            <h2 class="report-section-title">Projects by Priority</h2>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="report-priority-badge high">High</span></td>
                        <td>${highPriority}</td>
                        <td>${totalProjects > 0 ? ((highPriority / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="report-priority-badge medium">Medium</span></td>
                        <td>${mediumPriority}</td>
                        <td>${totalProjects > 0 ? ((mediumPriority / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="report-priority-badge low">Low</span></td>
                        <td>${lowPriority}</td>
                        <td>${totalProjects > 0 ? ((lowPriority / totalProjects) * 100).toFixed(1) : 0}%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Top Priority Projects -->
        <div class="report-section">
            <h2 class="report-section-title">Top 10 Priority Projects</h2>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Score</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    ${topProjects.map(project => `
                        <tr>
                            <td><strong>${escapeHtml(project.name)}</strong></td>
                            <td>${escapeHtml(project.person || 'Unassigned')}</td>
                            <td>${project.status}</td>
                            <td><span class="report-priority-badge ${project.priority.toLowerCase()}">${project.priority}</span></td>
                            <td><strong>${calculatePriorityScore(project).toFixed(2)}</strong></td>
                            <td>${project.impact}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- All Projects List -->
        <div class="report-section">
            <h2 class="report-section-title">All Projects (${totalProjects})</h2>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(project => `
                        <tr>
                            <td><strong>${escapeHtml(project.name)}</strong></td>
                            <td>${escapeHtml(project.person || 'Unassigned')}</td>
                            <td>${project.status}</td>
                            <td><span class="report-priority-badge ${project.priority.toLowerCase()}">${project.priority}</span></td>
                            <td>${project.date ? formatDate(project.date) : 'No date'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="report-footer">
            <p>This report was generated automatically by the AI Project Management System</p>
            <p>Confidential - For internal use only</p>
        </div>
    `;

    // Show modal
    document.getElementById('reportModal').classList.add('active');
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
}

function printReport() {
    window.print();
}

function downloadReportPdf() {
    // For a simple solution, we'll use the browser's print-to-PDF functionality
    alert('To download as PDF:\n\n1. Click "Print Report"\n2. Choose "Save as PDF" in the print dialog\n3. Click "Save"\n\nAlternatively, use your browser\'s print function (Ctrl/Cmd + P) and select "Save as PDF".');
    window.print();
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const editModal = document.getElementById('editModal');
    const reportModal = document.getElementById('reportModal');

    if (e.target === editModal) {
        closeEditModal();
    }
    if (e.target === reportModal) {
        closeReportModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeEditModal();
        const formContainer = document.getElementById('intakeFormContainer');
        if (formContainer.classList.contains('active')) {
            closeForm();
        }
    }

    // Ctrl/Cmd + N to open new project form
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        toggleForm();
    }
});

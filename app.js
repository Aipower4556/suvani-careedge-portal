// 1. Data Definitions & State
const state = {
    activeTab: 'dashboard',
    currentPbiPage: 'summary', // summary, details, investors
    selectedReportType: 'daily', // daily, weekly, monthly, annual
    currentUser: 'Vijay',
    currentSuggestion: '',
    
    // Team Profiles
    team: {
        Vijay: { name: 'Vijay Gurram', role: 'Power BI Dev', initials: 'VG', color: '#ec4899' },
        Rohan: { name: 'Rohan Mehta', role: 'Lead Power BI Dev', initials: 'RM', color: 'var(--accent-blue)' },
        Sneha: { name: 'Sneha Sharma', role: 'Financial Analyst', initials: 'SS', color: 'var(--accent-green)' },
        Amit: { name: 'Amit Patel', role: 'Relationship Mgr', initials: 'AP', color: 'var(--accent-purple)' },
        Priya: { name: 'Priya Nair', role: 'Data Engineer', initials: 'PN', color: 'var(--accent-blue)' },
        Vikram: { name: 'Vikram Singh', role: 'QA & Auditor', initials: 'VS', color: 'var(--accent-orange)' }
    },

    // Discussions grouped by channel/report context
    discussions: {
        daily: [
            { sender: 'Priya', message: 'Daily pipeline completed. Fetching Care Edge endpoints successfully.', timestamp: '9:15 AM' },
            { sender: 'Rohan', message: 'Thanks Priya. The Power BI report auto-refreshed successfully at 9:30 AM. Yield metrics look aligned.', timestamp: '9:40 AM' },
            { sender: 'Vijay', message: 'Wait Rohan, I\'m seeing an issue in the daily dashboard. The High Net Worth (HNI) card is displaying blank when filtering by region. Looks like a DAX filter context issue.', timestamp: '9:45 AM' },
            { sender: 'Rohan', message: 'Ah, good catch Vijay. Did you check the relationship between the Investor table and Region dimension? It might be set to single cross-filter direction instead of both.', timestamp: '9:50 AM' },
            { sender: 'Vijay', message: 'Yes, just checked. The cross-filter direction was indeed single. I\'ve updated the relationship in the Power BI model and rebuilt the layout. Pushing the new build `.pbix` to the dev workspace now.', timestamp: '9:55 AM' },
            { sender: 'Rohan', message: 'Awesome work Vijay! I will pull the latest build and run verification.', timestamp: '10:00 AM' },
            { sender: 'Vikram', message: 'Audited the Daily yields for top 10 portfolios. Standard dev calculations are spot-on. Regional filters are working now.', timestamp: '10:05 AM' }
        ],
        weekly: [
            { sender: 'Sneha', message: 'Just finished updating the weekly investor yield estimates. Let me know if the trend visualization matches.', timestamp: 'Yesterday' },
            { sender: 'Vijay', message: 'Sneha, the trend chart is matching, but the Weekly compilation is showing a build error on the Power BI service: "Resource Governor Limit Exceeded". The query is too heavy.', timestamp: 'Yesterday' },
            { sender: 'Rohan', message: 'Vijay, we probably have too many calculated columns in the weekly metrics. Let\'s push those calculations back to SQL Server or use Power Query to load pre-calculated fields.', timestamp: 'Yesterday' },
            { sender: 'Vijay', message: 'Exactly Rohan. I optimized the model by shifting the APY compound math to the SQL ETL views. The model size dropped by 40% and it refreshes in 12 seconds now.', timestamp: 'Yesterday' },
            { sender: 'Rohan', message: 'Looks perfect Sneha and Vijay. I updated the grid view component to handle the negative yields gracefully.', timestamp: 'Yesterday' }
        ],
        monthly: [
            { sender: 'Amit', message: 'Investors have requested a drilldown for high-yield corporate bonds. Can we add it in this monthly cycle?', timestamp: '2 days ago' },
            { sender: 'Vijay', message: 'I have added the drill-through page in the monthly template. Users can now right-click any asset class bar to view detailed partner-wise breakdown.', timestamp: 'Yesterday' },
            { sender: 'Rohan', message: 'Added a secondary chart page in the monthly PBI report. Let me show you details tab. Let\'s make sure we test it in the QA workspace first.', timestamp: 'Yesterday' },
            { sender: 'Priya', message: 'Re-indexed SQL views to support the high-yield drilldown without latency. Queries now resolve under 150ms.', timestamp: 'Yesterday' },
            { sender: 'Vijay', message: 'Tested Priya\'s re-indexed views. Power BI DirectQuery mode is extremely fast now. No lag whatsoever.', timestamp: 'Yesterday' }
        ],
        annual: [
            { sender: 'Amit', message: 'Care Edge Board meeting scheduled for next week. The Annual projection decks need to be locked by Friday.', timestamp: '3 days ago' },
            { sender: 'Vijay', message: 'Rohan, the annual growth projection chart has a rendering glitch when page scaling is set to 16:9 on mobile views. The legend overlaps the bar chart.', timestamp: '2 days ago' },
            { sender: 'Rohan', message: 'Vijay, try wrapping the legend in a container with fixed padding, or set it to auto-wrap. We should also check the responsiveness in Power BI mobile layout view.', timestamp: '2 days ago' },
            { sender: 'Vijay', message: 'Fixed! I created a customized mobile-optimized layout for the annual deck page. It looks clean on both iPad and mobile now.', timestamp: 'Yesterday' },
            { sender: 'Sneha', message: 'Annual reports require final QA sign-off. Vikram, when can you start auditing the CSV outputs?', timestamp: 'Yesterday' },
            { sender: 'Vikram', message: 'Starting audit tomorrow morning. Sneha, please verify if the fiscal conversions are standard.', timestamp: 'Yesterday' }
        ],
        discussion: [
            { sender: 'Amit', message: 'Welcome to Suvani-CareEdge Investor Sync Portal! Let\'s coordinate all deliverables here.', timestamp: 'July 26' },
            { sender: 'Vijay', message: 'Hi everyone, Vijay Gurram here. I\'ve taken over the Power BI reporting pipeline. Ready to collaborate!', timestamp: 'July 26' },
            { sender: 'Rohan', message: 'Welcome Vijay! Great to have you on board. Let\'s use this portal to track dashboard issues and builds.', timestamp: 'July 26' }
        ]
    },

    // Simulated Power BI Data
    pbiData: {
        daily: {
            title: 'Daily Performance Tracker',
            pages: {
                summary: {
                    metric: '₹424.5 Cr',
                    trend: '+1.4% vs Yesterday',
                    chartTitle: 'Hourly Inflow/Outflow (Cr)',
                    bars: [
                        { label: '9 AM', val: 30, pct: 30 },
                        { label: '11 AM', val: 65, pct: 65 },
                        { label: '1 PM', val: 95, pct: 95 },
                        { label: '3 PM', val: 120, pct: 120 },
                        { label: '5 PM', val: 80, pct: 80 }
                    ]
                },
                details: {
                    headers: ['Asset Class', 'Daily Inflow', 'Outflow', 'Net Change', 'Status'],
                    rows: [
                        ['Equities', '₹152.4 Cr', '₹110.2 Cr', '+₹42.2 Cr', 'UP'],
                        ['Debt Bonds', '₹85.1 Cr', '₹92.4 Cr', '-₹7.3 Cr', 'DOWN'],
                        ['Liquid Funds', '₹140.0 Cr', '₹85.0 Cr', '+₹55.0 Cr', 'UP'],
                        ['Alternative', '₹47.0 Cr', '₹47.0 Cr', '₹0.0 Cr', 'UP']
                    ]
                },
                investors: {
                    headers: ['Investor Segment', 'Active Portfolios', 'Avg Allocation', 'Active Count'],
                    rows: [
                        ['High Net Worth (HNI)', '85', '₹3.4 Cr', '42'],
                        ['Retail / Neo-investors', '1042', '₹2.1 L', '750'],
                        ['Institutional Investors', '18', '₹18.5 Cr', '14'],
                        ['Foreign Corporate', '5', '₹45.0 Cr', '4']
                    ]
                }
            }
        },
        weekly: {
            title: 'Weekly Yield Compilation',
            pages: {
                summary: {
                    metric: '7.85% APY',
                    trend: '+0.15% Avg Yield Increase',
                    chartTitle: 'Weekly Yield Trend (Avg APY)',
                    bars: [
                        { label: 'Week 1', val: 7.2, pct: 72 },
                        { label: 'Week 2', val: 7.4, pct: 74 },
                        { label: 'Week 3', val: 7.5, pct: 75 },
                        { label: 'Week 4', val: 7.8, pct: 78 }
                    ]
                },
                details: {
                    headers: ['Scheme Category', 'Weekly Yield', 'AUM Growth', 'Benchmark Diff'],
                    rows: [
                        ['Suvani Bluechip Yield', '8.12%', '+2.4%', '+0.45%'],
                        ['Suvani Balanced Debt', '6.95%', '+0.8%', '+0.12%'],
                        ['Care Edge Treasury Guard', '7.45%', '+1.1%', '+0.25%'],
                        ['Care Edge Dynamic Growth', '9.20%', '+3.5%', '+0.85%']
                    ]
                },
                investors: {
                    headers: ['Top Partner', 'Active Subscriptions', 'Weekly Outflow', 'Overall Sentiment'],
                    rows: [
                        ['Apex Capital Services', '5 Schemes', '₹12.0 Cr', 'Highly Bullish'],
                        ['Trustee Mutual Fund', '8 Schemes', '₹24.0 Cr', 'Neutral'],
                        ['Suvani Wealth Management', '12 Schemes', '₹8.5 Cr', 'Very Optimistic']
                    ]
                }
            }
        },
        monthly: {
            title: 'Monthly Investor Performance Audit',
            pages: {
                summary: {
                    metric: '₹14,842.1 Cr',
                    trend: '+8.6% AUM Growth this month',
                    chartTitle: 'Monthly Total Asset Value (Cr)',
                    bars: [
                        { label: 'Jan', val: 110, pct: 40 },
                        { label: 'Feb', val: 122, pct: 46 },
                        { label: 'Mar', val: 135, pct: 54 },
                        { label: 'Apr', val: 140, pct: 60 },
                        { label: 'May', val: 145, pct: 75 },
                        { label: 'Jun', val: 148, pct: 90 }
                    ]
                },
                details: {
                    headers: ['Month-on-Month Asset Matrix', 'AUM (Cr)', 'Net Yield', 'Active Portfolios', 'Status'],
                    rows: [
                        ['January 2026', '₹11,040 Cr', '7.12%', '1,120', 'Audited'],
                        ['February 2026', '₹12,250 Cr', '7.24%', '1,180', 'Audited'],
                        ['March 2026', '₹13,590 Cr', '7.30%', '1,240', 'Audited'],
                        ['April 2026', '₹14,020 Cr', '7.45%', '1,310', 'Audited'],
                        ['May 2026', '₹14,580 Cr', '7.62%', '1,390', 'Audited'],
                        ['June 2026', '₹14,842 Cr', '7.85%', '1,452', 'In Verification']
                    ]
                },
                investors: {
                    headers: ['Region Hub', 'Investor Count', 'Total Investment', 'Quarter Target Status'],
                    rows: [
                        ['North India (Delhi/NCR)', '412', '₹4,520 Cr', 'Achieved (105%)'],
                        ['West India (Mumbai/Gujarat)', '628', '₹6,840 Cr', 'Achieved (112%)'],
                        ['South India (Bangalore/Chennai)', '380', '₹3,210 Cr', 'On Track (94%)'],
                        ['Overseas / NRI Portfolios', '32', '₹272 Cr', 'Pending Audit']
                    ]
                }
            }
        },
        annual: {
            title: 'Annual Projections & Growth Framework',
            pages: {
                summary: {
                    metric: '₹2.12 Lakh Cr',
                    trend: 'Projected 5-Year AUM Target',
                    chartTitle: '5-Year Growth Projections (Lakh Cr)',
                    bars: [
                        { label: 'FY 2026', val: 0.15, pct: 15 },
                        { label: 'FY 2027', val: 0.35, pct: 35 },
                        { label: 'FY 2028', val: 0.75, pct: 55 },
                        { label: 'FY 2029', val: 1.45, pct: 75 },
                        { label: 'FY 2030', val: 2.12, pct: 100 }
                    ]
                },
                details: {
                    headers: ['Fiscal Year Plan', 'AUM Target', 'Operating Margin', 'Est. Return Benchmark', 'System Risk'],
                    rows: [
                        ['FY 2026 (Current)', '₹0.15 Lakh Cr', '24%', '8.2%', 'Low'],
                        ['FY 2027', '₹0.35 Lakh Cr', '26%', '8.5%', 'Low'],
                        ['FY 2028', '₹0.75 Lakh Cr', '29%', '8.8%', 'Medium'],
                        ['FY 2029', '₹1.45 Lakh Cr', '32%', '9.1%', 'Medium'],
                        ['FY 2030', '₹2.12 Lakh Cr', '35%', '9.5%', 'Medium']
                    ]
                },
                investors: {
                    headers: ['Advisory Partner Group', 'Allocation Share', 'Assigned Rep', 'Board Rating'],
                    rows: [
                        ['Care Edge Capital Markets', '45%', 'Amit Patel', 'AAA'],
                        ['Suvani Institutional Services', '35%', 'Sneha Sharma', 'AA+'],
                        ['Direct Investor Pool', '20%', 'Rohan Mehta', 'AA']
                    ]
                }
            }
        }
    }
};

// 2. DOM Elements Cache
const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    pageTitle: document.getElementById('page-title'),
    currentDate: document.getElementById('current-date'),
    
    // Panels
    dashboardTab: document.getElementById('dashboard-tab'),
    reportTab: document.getElementById('report-tab'),
    
    // Report UI
    reportTypeTitle: document.getElementById('report-type-title'),
    discussionContextTitle: document.getElementById('discussion-context-title'),
    discussionFeed: document.getElementById('report-discussion-feed'),
    commentForm: document.getElementById('comment-form'),
    commentInput: document.getElementById('comment-input'),
    senderSelect: document.getElementById('sender-select'),
    pbiVisualsContainer: document.getElementById('pbi-visuals-container'),
    pbiNavBtns: document.querySelectorAll('.pbi-nav-btn'),
    pbiLiveStatus: document.getElementById('pbi-live-status'),
    pbiConfigModal: document.getElementById('pbi-config-modal'),
    pbiUrlInput: document.getElementById('pbi-url-input'),
    pbiWrapper: document.querySelector('.powerbi-wrapper'),
    grammarCheckBar: document.getElementById('grammar-check-bar')
};

// 3. Setup Current Date
function initDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);
    elements.currentDate.textContent = dateStr;
}

// 4. Tab Switching Logic
function switchTab(targetTab) {
    state.activeTab = targetTab;
    
    // Update navigation active states
    elements.navItems.forEach(item => {
        if (item.getAttribute('data-tab') === targetTab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (targetTab === 'dashboard') {
        elements.pageTitle.textContent = "Dashboard Overview";
        elements.dashboardTab.classList.add('active');
        elements.reportTab.classList.remove('active');
    } else {
        // Prepare report data
        let reportType = targetTab;
        if (targetTab === 'discussion') {
            reportType = 'discussion';
            elements.pageTitle.textContent = "Team Board Forum";
            elements.reportTypeTitle.textContent = "General Discussion Forum";
            elements.discussionContextTitle.textContent = "Suvani Fintech Team Space";
        } else {
            elements.pageTitle.textContent = targetTab.charAt(0).toUpperCase() + targetTab.slice(1) + " Reports Platform";
            elements.reportTypeTitle.textContent = targetTab.toUpperCase() + " Investor Analysis";
            elements.discussionContextTitle.textContent = targetTab.charAt(0).toUpperCase() + targetTab.slice(1) + " Reporting Context";
        }
        
        state.selectedReportType = reportType;
        
        // Toggle view panels
        elements.dashboardTab.classList.remove('active');
        elements.reportTab.classList.add('active');
        
        // Load content
        loadPbiSimulation(reportType);
        loadDiscussionFeed(reportType);
    }
}

// Global hook for html button clicks
window.switchTab = switchTab;

// 5. Load Simulated or Real Power BI Visuals
function loadPbiSimulation(reportType) {
    elements.pbiVisualsContainer.innerHTML = '';
    
    // If it's pure discussion, show a summary guide instead of Power BI chart
    if (reportType === 'discussion') {
        if (elements.pbiLiveStatus) elements.pbiLiveStatus.classList.remove('active');
        elements.pbiVisualsContainer.innerHTML = `
            <div class="simulated-dashboard" style="display: block;">
                <div class="simulated-card" style="height: 100%; justify-content: center; align-items: center; text-align: center;">
                    <div style="font-size: 3rem; color: var(--accent-blue); margin-bottom: 20px;"><i class="fa-solid fa-comments"></i></div>
                    <h3>Suvani Fintech Team Hub</h3>
                    <p style="color: #666; max-width: 500px; margin-top: 10px;">
                        This workspace compiles team updates, comments, and reports shared across Suvani developers and Care Edge auditors. Select specific report tabs (Daily, Weekly, Monthly, Annual) to view live Power BI metrics and context-specific logs.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    // Check if there is a real Power BI embed URL configured for this report type
    const realPbiUrl = localStorage.getItem('pbi_url_' + reportType);
    const pbiNavBar = document.querySelector('.pbi-nav-bar');
    
    if (realPbiUrl) {
        if (elements.pbiLiveStatus) elements.pbiLiveStatus.classList.add('active');
        elements.pbiVisualsContainer.innerHTML = `
            <iframe class="real-pbi-iframe" src="${realPbiUrl}" allowFullScreen="true"></iframe>
        `;
        if (pbiNavBar) pbiNavBar.style.display = 'none';
        return;
    }

    // Otherwise, show the simulated report dashboard
    if (elements.pbiLiveStatus) elements.pbiLiveStatus.classList.remove('active');
    if (pbiNavBar) pbiNavBar.style.display = 'flex';

    const data = state.pbiData[reportType];
    if (!data) return;

    const pageData = data.pages[state.currentPbiPage];
    
    if (state.currentPbiPage === 'summary') {
        // Summary page layout (large KPI + Bar Chart)
        elements.pbiVisualsContainer.innerHTML = `
            <div class="simulated-dashboard">
                <div class="simulated-card">
                    <h4>${data.title} - Key KPI</h4>
                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                        <span class="simulated-metric-large">${pageData.metric}</span>
                        <span class="simulated-metric-trend"><i class="fa-solid fa-circle-arrow-up"></i> ${pageData.trend}</span>
                    </div>
                </div>
                <div class="simulated-card">
                    <h4>${pageData.chartTitle}</h4>
                    <div class="simulated-bar-chart" id="bar-chart-viewport">
                        ${pageData.bars.map(bar => `
                            <div class="simulated-bar-col">
                                <div class="simulated-bar" style="height: ${bar.pct}%" title="Value: ${bar.val}"></div>
                                <span class="simulated-bar-label">${bar.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (state.currentPbiPage === 'details') {
        // Details page layout (Table Grid)
        elements.pbiVisualsContainer.innerHTML = `
            <div class="simulated-dashboard" style="display: block;">
                <div class="simulated-card" style="height: 100%;">
                    <h4>Performance details matrix</h4>
                    <div class="simulated-table-container">
                        <table class="simulated-table">
                            <thead>
                                <tr>
                                    ${pageData.headers.map(h => `<th>${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${pageData.rows.map(row => `
                                    <tr>
                                        ${row.map((cell, index) => {
                                            if (cell.includes('UP') || cell.includes('Audited') || cell.includes('Achieved')) {
                                                return `<td><span class="badge-trend-up"><i class="fa-solid fa-circle-check"></i> ${cell}</span></td>`;
                                            }
                                            if (cell.includes('DOWN') || cell.includes('Pending')) {
                                                return `<td><span class="badge-trend-down"><i class="fa-solid fa-circle-exclamation"></i> ${cell}</span></td>`;
                                            }
                                            return `<td>${cell}</td>`;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } else if (state.currentPbiPage === 'investors') {
        // Investor list layout (Horizontal Split / Secondary Tables)
        elements.pbiVisualsContainer.innerHTML = `
            <div class="simulated-dashboard" style="display: block;">
                <div class="simulated-card" style="height: 100%;">
                    <h4>Segment allocation details</h4>
                    <div class="simulated-table-container">
                        <table class="simulated-table">
                            <thead>
                                <tr>
                                    ${pageData.headers.map(h => `<th>${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${pageData.rows.map(row => `
                                    <tr>
                                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

// 6. Navigation inside simulated Power BI Iframe
function changePbiPage(pageName) {
    state.currentPbiPage = pageName;
    
    // Update active nav button
    elements.pbiNavBtns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(pageName)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    loadPbiSimulation(state.selectedReportType);
}

window.changePbiPage = changePbiPage;

// 7. Load Discussion Feed
function loadDiscussionFeed(reportType) {
    elements.discussionFeed.innerHTML = '';
    const feed = state.discussions[reportType] || [];
    
    if (feed.length === 0) {
        elements.discussionFeed.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                <p><i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i> No messages in this context yet. Start the discussion below!</p>
            </div>
        `;
        return;
    }

    feed.forEach(chat => {
        const userDetails = state.team[chat.sender] || { name: chat.sender, role: 'Team Member', initials: 'TM', color: '#6b7280' };
        const isMe = chat.sender === 'Vijay';
        
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isMe ? 'me' : ''}`;
        
        bubble.innerHTML = `
            <div class="chat-avatar" style="background: ${isMe ? '' : userDetails.color}">
                ${userDetails.initials}
            </div>
            <div class="chat-details">
                <div class="chat-meta">
                    <strong>${userDetails.name}</strong> • ${userDetails.role} • ${chat.timestamp}
                </div>
                <div class="chat-body">
                    ${chat.message}
                </div>
            </div>
        `;
        
        elements.discussionFeed.appendChild(bubble);
    });

    // Auto scroll to bottom
    elements.discussionFeed.scrollTop = elements.discussionFeed.scrollHeight;
}

// 8. Add Comment Submission
elements.commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentText = elements.commentInput.value.trim();
    if (!commentText) return;

    const senderKey = elements.senderSelect.value;
    
    // Create new comment object
    const newComment = {
        sender: senderKey,
        message: commentText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    // Push into selected channel
    if (!state.discussions[state.selectedReportType]) {
        state.discussions[state.selectedReportType] = [];
    }
    state.discussions[state.selectedReportType].push(newComment);

    // Refresh display
    loadDiscussionFeed(state.selectedReportType);
    elements.commentInput.value = '';
    if (elements.grammarCheckBar) elements.grammarCheckBar.style.display = 'none';
});

// 9. Simulation functions
function refreshReportData() {
    // Add short reload animation
    const container = elements.pbiVisualsContainer;
    container.style.opacity = '0.3';
    setTimeout(() => {
        loadPbiSimulation(state.selectedReportType);
        container.style.opacity = '1';
    }, 400);
}

window.refreshReportData = refreshReportData;

// 10. Real Power BI Configuration Modal Functions
function openConfigModal() {
    const reportType = state.selectedReportType;
    if (reportType === 'discussion') {
        alert("Please select a specific report tab (Daily, Weekly, Monthly, or Annual) to configure its live Power BI link.");
        return;
    }
    
    // Load existing URL from localStorage
    const savedUrl = localStorage.getItem('pbi_url_' + reportType) || '';
    elements.pbiUrlInput.value = savedUrl;
    
    // Open modal
    elements.pbiConfigModal.classList.add('active');
}

function closeConfigModal() {
    elements.pbiConfigModal.classList.remove('active');
}

function saveConfigUrl() {
    const reportType = state.selectedReportType;
    const url = elements.pbiUrlInput.value.trim();
    
    if (url) {
        // Basic validation for URL structure
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }
        localStorage.setItem('pbi_url_' + reportType, url);
    } else {
        localStorage.removeItem('pbi_url_' + reportType);
    }
    
    closeConfigModal();
    loadPbiSimulation(reportType);
}

function clearConfigUrl() {
    const reportType = state.selectedReportType;
    localStorage.removeItem('pbi_url_' + reportType);
    elements.pbiUrlInput.value = '';
    closeConfigModal();
    loadPbiSimulation(reportType);
}

function toggleFullScreenReport() {
    elements.pbiWrapper.classList.toggle('fullscreen');
    
    // Toggle full screen icon
    const fsButtonIcon = document.querySelector('button[title="Full Screen"] i');
    if (fsButtonIcon) {
        if (elements.pbiWrapper.classList.contains('fullscreen')) {
            fsButtonIcon.className = 'fa-solid fa-compress';
        } else {
            fsButtonIcon.className = 'fa-solid fa-expand';
        }
    }
}

function toggleSidebarGroup(groupId, headerElement) {
    const listElement = document.getElementById(groupId);
    if (!listElement) return;
    
    listElement.classList.toggle('collapsed');
    headerElement.classList.toggle('collapsed');
}

// 11. Profile Dropdown & Login/Logout Simulation
function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profile-dropdown');
    const arrow = document.querySelector('.profile-dropdown-arrow');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        if (arrow) {
            if (dropdown.classList.contains('active')) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }
}

function simulateLogout(event) {
    event.stopPropagation();
    
    // Close dropdown
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    const arrow = document.querySelector('.profile-dropdown-arrow');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
    
    // Hide main portal, show login screen
    document.querySelector('.app-container').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function handleSimulatedLogin(event) {
    event.preventDefault();
    
    // Hide login screen, show main portal
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.app-container').style.display = 'flex';
    
    // Quick success check alert/toast in console
    console.log("Logged back in as Vijay Gurram.");
}

// Click outside dropdown to close it
window.addEventListener('click', () => {
    const dropdown = document.getElementById('profile-dropdown');
    const arrow = document.querySelector('.profile-dropdown-arrow');
    if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

// Bind to window context
window.openConfigModal = openConfigModal;
window.closeConfigModal = closeConfigModal;
window.saveConfigUrl = saveConfigUrl;
window.clearConfigUrl = clearConfigUrl;
window.toggleFullScreenReport = toggleFullScreenReport;
window.toggleSidebarGroup = toggleSidebarGroup;
window.toggleProfileDropdown = toggleProfileDropdown;
window.simulateLogout = simulateLogout;
window.handleSimulatedLogin = handleSimulatedLogin;

// 12. Client-Side Real-Time Grammar Correction Engine
const grammarRules = [
    { pattern: /\bi have check\b/gi, replacement: "I have checked", message: 'Use past participle "checked" after "have"' },
    { pattern: /\bi have write\b/gi, replacement: "I have written", message: 'Use "written" after "have"' },
    { pattern: /\bi have do\b/gi, replacement: "I have done", message: 'Use "done" after "have"' },
    { pattern: /\bunable to fetching\b/gi, replacement: "unable to fetch", message: 'Use base verb "fetch" after "unable to"' },
    { pattern: /\bunable to loading\b/gi, replacement: "unable to load", message: 'Use base verb "load" after "unable to"' },
    { pattern: /\bchating\b/gi, replacement: "chatting", message: 'Spelling mistake: "chatting"' },
    { pattern: /\benlgish\b/gi, replacement: "English", message: 'Spelling mistake: "English"' },
    { pattern: /\bautomaticially\b/gi, replacement: "automatically", message: 'Spelling mistake: "automatically"' },
    { pattern: /\brealing\b/gi, replacement: "real", message: 'Spelling mistake: "real"' },
    { pattern: /\bintigration\b/gi, replacement: "integration", message: 'Spelling mistake: "integration"' },
    { pattern: /\bissuse\b/gi, replacement: "issues", message: 'Spelling mistake: "issues"' },
    { pattern: /\bissuses\b/gi, replacement: "issues", message: 'Spelling mistake: "issues"' },
    { pattern: /\bdody\b/gi, replacement: "body", message: 'Spelling mistake: "body"' },
    { pattern: /\bsentnece\b/gi, replacement: "sentence", message: 'Spelling mistake: "sentence"' },
    { pattern: /\bany one\b/gi, replacement: "anyone", message: 'Use compound word "anyone"' },
    { pattern: /\bcan anyone any\b/gi, replacement: "can anyone see any", message: 'Add verb: "can anyone see any"' },
    { pattern: /\bpower bi\b/gi, replacement: "Power BI", message: 'Capitalization: "Power BI"' },
    { pattern: /\bcare edge\b/gi, replacement: "Care Edge", message: 'Capitalization: "Care Edge"' },
    { pattern: /\bsuvani\b/gi, replacement: "Suvani", message: 'Capitalization: "Suvani"' },
    { pattern: /(\w+)\s+\./g, replacement: "$1.", message: 'Remove space before period' },
    { pattern: /(\w+)\s+\,/g, replacement: "$1,", message: 'Remove space before comma' },
    { pattern: /\bi\b/g, replacement: "I", message: 'Always capitalize standalone pronoun "I"' },
    { pattern: /\bi'm\b/gi, replacement: "I'm", message: 'Capitalize "I\'m"' },
    { pattern: /\bim\b/gi, replacement: "I'm", message: 'Use apostrophe: "I\'m"' }
];

let grammarDebounceTimer;

function checkGrammarRealtime() {
    clearTimeout(grammarDebounceTimer);
    grammarDebounceTimer = setTimeout(() => {
        const text = elements.commentInput.value;
        const trimmedText = text.trim();
        if (!trimmedText) {
            elements.grammarCheckBar.style.display = 'none';
            return;
        }

        let correctedText = trimmedText;
        let mistakes = [];

        // Apply sentence capitalization first
        if (trimmedText && /^[a-z]/.test(trimmedText)) {
            correctedText = trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
            mistakes.push("Capitalize start of sentence");
        }

        grammarRules.forEach(rule => {
            if (rule.pattern.test(correctedText)) {
                // Reset regex pointer
                rule.pattern.lastIndex = 0;
                correctedText = correctedText.replace(rule.pattern, rule.replacement);
                mistakes.push(rule.message);
            }
        });

        if (correctedText !== trimmedText) {
            // Highlight unique mistakes
            state.currentSuggestion = correctedText;
            const uniqueMistakes = [...new Set(mistakes)];
            elements.grammarCheckBar.innerHTML = `
                <span>
                    <i class="fa-solid fa-triangle-exclamation"></i> 
                    <strong>Grammar Suggestion:</strong> 
                    Did you mean: <span class="grammar-suggestion-text" id="grammar-suggestion-click">"${correctedText}"</span>? 
                    <span style="font-size: 0.7rem; opacity: 0.8; margin-left: 6px;">(${uniqueMistakes.join(', ')})</span>
                </span>
                <button type="button" class="grammar-apply-btn" id="grammar-apply-btn-click">Fix Auto</button>
            `;
            elements.grammarCheckBar.style.display = 'flex';

            // Programmatically attach event listeners to avoid global onclick lookup errors
            const suggestionLink = document.getElementById('grammar-suggestion-click');
            const applyBtn = document.getElementById('grammar-apply-btn-click');
            if (suggestionLink) suggestionLink.addEventListener('click', applyGrammarSuggestion);
            if (applyBtn) applyBtn.addEventListener('click', applyGrammarSuggestion);
        } else {
            state.currentSuggestion = '';
            elements.grammarCheckBar.style.display = 'none';
        }
    }, 150);
}

function applyGrammarSuggestion() {
    if (state.currentSuggestion) {
        elements.commentInput.value = state.currentSuggestion;
        state.currentSuggestion = '';
    }
    elements.grammarCheckBar.style.display = 'none';
    elements.commentInput.focus();
}

window.applyGrammarSuggestion = applyGrammarSuggestion;
window.checkGrammarRealtime = checkGrammarRealtime;

// Initialize Navigation Event Handlers
elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        switchTab(tab);
    });
});

// Run Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    initDate();
    switchTab('dashboard');
    
    // Register Grammar Checking
    if (elements.commentInput) {
        elements.commentInput.addEventListener('input', checkGrammarRealtime);
    }
});

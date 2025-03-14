// Function to display results
function displayResults(results) {
    // Clear previous results
    summaryContent.innerHTML = '';
    readabilityContent.innerHTML = '';
    issuesList.innerHTML = '';
    
    // Display summary stats
    const statsHtml = `
        <div class="stat-container">
            <div class="stat-item">
                <div class="stat-value">${Math.round(results.score)}</div>
                <div class="stat-label">Overall Score</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${results.issues.length}</div>
                <div class="stat-label">Issues Found</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${results.stats.paragraphs}</div>
                <div class="stat-label">Paragraphs</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${results.stats.sentences}</div>
                <div class="stat-label">Sentences</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${results.stats.words}</div>
                <div class="stat-label">Words</div>
            </div>
        </div>
        <p>Based on Google's Technical Writing Guidelines, here's how your text measures up:</p>
    `;
    
    summaryContent.innerHTML = statsHtml;
    
    // Display readability metrics
    const readabilityHtml = `
        <div class="readability-grid">
            <div class="readability-item">
                <div class="readability-value">${results.readability.fleschReadingEase}</div>
                <div class="readability-label">Flesch Reading Ease</div>
                <div class="readability-description">
                    ${getFleschReadingEaseDescription(results.readability.fleschReadingEase)}
                </div>
            </div>
            <div class="readability-item">
                <div class="readability-value">${results.readability.fleschKincaidGrade}</div>
                <div class="readability-label">Flesch-Kincaid Grade Level</div>
                <div class="readability-description">
                    Approximate U.S. grade level required to understand the text.
                </div>
            </div>
            <div class="readability-item">
                <div class="readability-value">${results.readability.smogIndex}</div>
                <div class="readability-label">SMOG Index</div>
                <div class="readability-description">
                    Years of education needed to understand the text.
                </div>
            </div>
        </div>
        <div class="domain-info">
            <p>Detected domain: <strong>${capitalizeFirstLetter(results.domain)}</strong></p>
        </div>
    `;
    
    readabilityContent.innerHTML = readabilityHtml;
    
    // Display issues
    if (results.issues.length === 0) {
        issuesList.innerHTML = '<p>No issues found! Your text follows Google\'s Technical Writing Guidelines well.</p>';
    } else {
        // Group issues by type
        const issuesByType = {};
        results.issues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = [];
            }
            issuesByType[issue.type].push(issue);
        });
        
        // Create HTML for each issue type
        for (const [type, issues] of Object.entries(issuesByType)) {
            const issueTypeHtml = `
                <div class="issue-type">
                    <h4>${type} (${issues.length})</h4>
                    ${issues.map(issue => `
                        <div class="issue-item">
                            <div class="issue-text">${issue.text}</div>
                            <div class="issue-suggestion">${issue.suggestion}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            issuesList.innerHTML += issueTypeHtml;
        }
    }
}

// Helper function to get description for Flesch Reading Ease score
function getFleschReadingEaseDescription(score) {
    if (score >= 90) return 'Very easy to read. Easily understood by an average 11-year-old student.';
    if (score >= 80) return 'Easy to read. Conversational English for consumers.';
    if (score >= 70) return 'Fairly easy to read.';
    if (score >= 60) return 'Plain English. Easily understood by 13- to 15-year-old students.';
    if (score >= 50) return 'Fairly difficult to read.';
    if (score >= 30) return 'Difficult to read. Best understood by college graduates.';
    return 'Very difficult to read. Best understood by university graduates.';
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

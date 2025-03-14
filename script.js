document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const summaryContent = document.getElementById('summary-content');
    const issuesList = document.getElementById('issues-list');

    // Add event listener to the analyze button
    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        
        if (text.length === 0) {
            alert('Please paste some text to analyze.');
            return;
        }
        
        // Analyze the text and get results
        const results = analyzeText(text);
        
        // Display results
        displayResults(results);
        
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Function to analyze text against Google's Technical Writing Guidelines
    function analyzeText(text) {
        // Split text into sentences and paragraphs
        const paragraphs = text.split(/\n\s*\n/);
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        
        // Initialize results object
        const results = {
            stats: {
                paragraphs: paragraphs.length,
                sentences: sentences.length,
                words: text.split(/\s+/).filter(word => word.length > 0).length,
                characters: text.length
            },
            issues: []
        };
        
        // Check for passive voice
        checkPassiveVoice(text, sentences, results);
        
        // Check for long sentences
        checkLongSentences(sentences, results);
        
        // Check for complex words and jargon
        checkComplexWords(text, results);
        
        // Check for unclear pronoun references
        checkUnclearPronouns(sentences, results);
        
        // Check for use of "we" instead of "you" in instructions
        checkWeVsYou(sentences, results);
        
        // Check for ambiguous terms
        checkAmbiguousTerms(text, results);
        
        // Check for inconsistent terminology
        checkInconsistentTerminology(text, results);
        
        // Calculate overall score (simple algorithm)
        const issueCount = results.issues.length;
        const textLength = results.stats.words;
        results.score = Math.max(0, 100 - (issueCount * 100 / (textLength / 20)));
        
        return results;
    }

    // Function to check for passive voice
    function checkPassiveVoice(text, sentences, results) {
        // Common passive voice patterns
        const passivePatterns = [
            /\b(?:am|is|are|was|were|be|been|being)\s+(\w+ed|built|done|made|said|known|seen|found)\b/gi,
            /\b(?:has|have|had)\s+been\s+(\w+ed|built|done|made|said|known|seen|found)\b/gi
        ];
        
        passivePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                // Get the sentence containing this match
                const containingSentence = sentences.find(sentence => 
                    sentence.includes(match[0]));
                
                if (containingSentence) {
                    results.issues.push({
                        type: 'Passive Voice',
                        text: containingSentence.trim(),
                        suggestion: 'Use active voice instead of passive voice. Active voice is more direct and easier to read.'
                    });
                }
            }
        });
    }

    // Function to check for long sentences
    function checkLongSentences(sentences, results) {
        const wordThreshold = 25; // Sentences with more than 25 words are considered long
        
        sentences.forEach(sentence => {
            const words = sentence.split(/\s+/).filter(word => word.length > 0);
            
            if (words.length > wordThreshold) {
                results.issues.push({
                    type: 'Long Sentence',
                    text: sentence.trim(),
                    suggestion: `This sentence has ${words.length} words. Consider breaking it into smaller sentences for better readability.`
                });
            }
        });
    }

    // Function to check for complex words and jargon
    function checkComplexWords(text, results) {
        // List of complex words or jargon that could be simplified
        const complexWords = {
            'utilize': 'use',
            'implementation': 'use',
            'functionality': 'feature',
            'leverage': 'use',
            'facilitate': 'help',
            'endeavor': 'try',
            'commence': 'start',
            'terminate': 'end',
            'subsequently': 'then',
            'aforementioned': 'this',
            'transmit': 'send',
            'obtain': 'get',
            'regarding': 'about',
            'sufficient': 'enough',
            'numerous': 'many',
            'initiate': 'start',
            'additional': 'more',
            'demonstrate': 'show',
            'assist': 'help',
            'in order to': 'to'
        };
        
        for (const [complex, simple] of Object.entries(complexWords)) {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            
            if (regex.test(text)) {
                results.issues.push({
                    type: 'Complex Wording',
                    text: `"${complex}"`,
                    suggestion: `Consider using "${simple}" instead of "${complex}" for simplicity.`
                });
            }
        }
    }

    // Function to check for unclear pronoun references
    function checkUnclearPronouns(sentences, results) {
        // Check for sentences starting with pronouns that might have unclear references
        const pronounsAtStart = /^(It|This|That|These|Those|They)\b\s/i;
        
        for (let i = 0; i < sentences.length; i++) {
            if (pronounsAtStart.test(sentences[i].trim()) && i > 0) {
                results.issues.push({
                    type: 'Unclear Pronoun Reference',
                    text: sentences[i].trim(),
                    suggestion: 'Starting a sentence with a pronoun can create ambiguity. Consider clarifying what the pronoun refers to.'
                });
            }
        }
    }

    // Function to check for use of "we" instead of "you" in instructions
    function checkWeVsYou(sentences, results) {
        // Look for instructional sentences using "we" instead of "you"
        const weInstructions = /\bwe\b.*?\b(can|should|must|need to|have to)\b/i;
        
        sentences.forEach(sentence => {
            if (weInstructions.test(sentence)) {
                results.issues.push({
                    type: 'Use of "We" in Instructions',
                    text: sentence.trim(),
                    suggestion: 'For instructions, use "you" instead of "we" to directly address the reader.'
                });
            }
        });
    }

    // Function to check for ambiguous terms
    function checkAmbiguousTerms(text, results) {
        // List of potentially ambiguous terms
        const ambiguousTerms = [
            'etc', 'and so on', 'and/or', 'various', 'some', 'several', 'many', 
            'a number of', 'few', 'a lot', 'just', 'only', 'quite', 'fairly', 
            'actually', 'really', 'basically', 'simply'
        ];
        
        ambiguousTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            
            if (regex.test(text)) {
                results.issues.push({
                    type: 'Ambiguous Term',
                    text: `"${term}"`,
                    suggestion: `The term "${term}" can be ambiguous. Consider using more specific language.`
                });
            }
        });
    }

    // Function to check for inconsistent terminology
    function checkInconsistentTerminology(text, results) {
        // Common pairs of terms that are often used inconsistently
        const termPairs = [
            ['click', 'tap'],
            ['app', 'application'],
            ['login', 'log in'],
            ['setup', 'set up'],
            ['website', 'web site'],
            ['dialog', 'dialogue'],
            ['cancel', 'abort'],
            ['OK', 'okay'],
            ['ID', 'id'],
            ['e-mail', 'email']
        ];
        
        termPairs.forEach(([term1, term2]) => {
            const regex1 = new RegExp(`\\b${term1}\\b`, 'gi');
            const regex2 = new RegExp(`\\b${term2}\\b`, 'gi');
            
            const hasTerm1 = regex1.test(text);
            const hasTerm2 = regex2.test(text);
            
            if (hasTerm1 && hasTerm2) {
                results.issues.push({
                    type: 'Inconsistent Terminology',
                    text: `"${term1}" and "${term2}"`,
                    suggestion: `Use either "${term1}" or "${term2}" consistently throughout the document, not both.`
                });
            }
        });
    }

    // Function to display results
    function displayResults(results) {
        // Clear previous results
        summaryContent.innerHTML = '';
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
});

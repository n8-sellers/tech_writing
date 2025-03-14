document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const summaryContent = document.getElementById('summary-content');
    const readabilityContent = document.getElementById('readability-content');
    const issuesList = document.getElementById('issues-list');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const settingsToggleBtn = document.getElementById('settings-toggle-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const longSentenceThreshold = document.getElementById('long-sentence-threshold');
    const longSentenceValue = document.getElementById('long-sentence-value');
    
    // Settings and preferences
    let userSettings = {
        checks: {
            passiveVoice: true,
            longSentences: true,
            complexWords: true,
            pronouns: true,
            weVsYou: true,
            ambiguous: true,
            terminology: true,
            headings: true,
            bullets: true,
            acronyms: true,
            gendered: true,
            imperative: true
        },
        thresholds: {
            longSentence: 25
        },
        darkMode: false
    };
    
    // Load saved settings from localStorage if available
    loadSettings();
    
    // Initialize UI based on settings
    initializeUI();

    // Event Listeners
    analyzeBtn.addEventListener('click', analyzeTextHandler);
    themeToggleBtn.addEventListener('click', toggleTheme);
    settingsToggleBtn.addEventListener('click', toggleSettings);
    saveSettingsBtn.addEventListener('click', saveUserSettings);
    longSentenceThreshold.addEventListener('input', updateThresholdValue);
    
    // Handler for analyze button click
    function analyzeTextHandler() {
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
    }
    
    // Toggle dark/light theme
    function toggleTheme() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-theme');
        themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        
        // Save theme preference
        userSettings.darkMode = isDarkMode;
        saveSettings();
    }
    
    // Toggle settings panel
    function toggleSettings() {
        settingsPanel.classList.toggle('hidden');
    }
    
    // Update threshold value display
    function updateThresholdValue() {
        longSentenceValue.textContent = longSentenceThreshold.value;
    }
    
    // Save user settings
    function saveUserSettings() {
        // Get checkbox values
        userSettings.checks.passiveVoice = document.getElementById('check-passive-voice').checked;
        userSettings.checks.longSentences = document.getElementById('check-long-sentences').checked;
        userSettings.checks.complexWords = document.getElementById('check-complex-words').checked;
        userSettings.checks.pronouns = document.getElementById('check-pronouns').checked;
        userSettings.checks.weVsYou = document.getElementById('check-we-vs-you').checked;
        userSettings.checks.ambiguous = document.getElementById('check-ambiguous').checked;
        userSettings.checks.terminology = document.getElementById('check-terminology').checked;
        userSettings.checks.headings = document.getElementById('check-headings').checked;
        userSettings.checks.bullets = document.getElementById('check-bullets').checked;
        userSettings.checks.acronyms = document.getElementById('check-acronyms').checked;
        userSettings.checks.gendered = document.getElementById('check-gendered').checked;
        userSettings.checks.imperative = document.getElementById('check-imperative').checked;
        
        // Get threshold values
        userSettings.thresholds.longSentence = parseInt(longSentenceThreshold.value);
        
        // Save settings to localStorage
        saveSettings();
        
        // Hide settings panel
        settingsPanel.classList.add('hidden');
        
        // Show confirmation
        alert('Settings saved successfully!');
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('techWritingAnalyzerSettings', JSON.stringify(userSettings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('techWritingAnalyzerSettings');
        if (savedSettings) {
            userSettings = JSON.parse(savedSettings);
        }
    }
    
    // Initialize UI based on settings
    function initializeUI() {
        // Set theme
        if (userSettings.darkMode) {
            document.body.classList.add('dark-theme');
            themeIcon.textContent = 'light_mode';
        }
        
        // Set checkbox values
        document.getElementById('check-passive-voice').checked = userSettings.checks.passiveVoice;
        document.getElementById('check-long-sentences').checked = userSettings.checks.longSentences;
        document.getElementById('check-complex-words').checked = userSettings.checks.complexWords;
        document.getElementById('check-pronouns').checked = userSettings.checks.pronouns;
        document.getElementById('check-we-vs-you').checked = userSettings.checks.weVsYou;
        document.getElementById('check-ambiguous').checked = userSettings.checks.ambiguous;
        document.getElementById('check-terminology').checked = userSettings.checks.terminology;
        document.getElementById('check-headings').checked = userSettings.checks.headings;
        document.getElementById('check-bullets').checked = userSettings.checks.bullets;
        document.getElementById('check-acronyms').checked = userSettings.checks.acronyms;
        document.getElementById('check-gendered').checked = userSettings.checks.gendered;
        document.getElementById('check-imperative').checked = userSettings.checks.imperative;
        
        // Set threshold values
        longSentenceThreshold.value = userSettings.thresholds.longSentence;
        longSentenceValue.textContent = userSettings.thresholds.longSentence;
    }

    // Function to analyze text against Google's Technical Writing Guidelines
    function analyzeText(text) {
        // Split text into sentences, paragraphs, and lines
        const paragraphs = text.split(/\n\s*\n/);
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const lines = text.split(/\n/);
        
        // Extract headings (lines that look like headings)
        const headings = lines.filter(line => {
            // Simple heuristic: lines that are short, don't end with punctuation, and might have # or be all caps
            return (line.trim().length > 0 && 
                    line.trim().length < 100 && 
                    !line.trim().match(/[.,:;]$/) && 
                    (line.trim().startsWith('#') || 
                     line.trim().match(/^[A-Z][^a-z]*$/) ||
                     line.trim().match(/^[A-Z][a-z].*[A-Za-z]$/)));
        });
        
        // Extract bullet points
        const bulletPoints = lines.filter(line => {
            return line.trim().match(/^[\s]*[-*•][\s]+\S/);
        });
        
        // Initialize results object
        const results = {
            stats: {
                paragraphs: paragraphs.length,
                sentences: sentences.length,
                words: text.split(/\s+/).filter(word => word.length > 0).length,
                characters: text.length,
                headings: headings.length,
                bulletPoints: bulletPoints.length
            },
            readability: calculateReadabilityMetrics(text, sentences),
            domain: detectDomain(text),
            issues: []
        };
        
        // Run enabled checks based on user settings
        if (userSettings.checks.passiveVoice) {
            checkPassiveVoice(text, sentences, results);
        }
        
        if (userSettings.checks.longSentences) {
            checkLongSentences(sentences, results);
        }
        
        if (userSettings.checks.complexWords) {
            checkComplexWords(text, results);
        }
        
        if (userSettings.checks.pronouns) {
            checkUnclearPronouns(sentences, results);
        }
        
        if (userSettings.checks.weVsYou) {
            checkWeVsYou(sentences, results);
        }
        
        if (userSettings.checks.ambiguous) {
            checkAmbiguousTerms(text, results);
        }
        
        if (userSettings.checks.terminology) {
            checkInconsistentTerminology(text, results);
        }
        
        // New checks
        if (userSettings.checks.headings) {
            checkHeadingCapitalization(headings, results);
        }
        
        if (userSettings.checks.bullets) {
            checkBulletParallelism(bulletPoints, results);
        }
        
        if (userSettings.checks.acronyms) {
            checkAcronyms(text, sentences, results);
        }
        
        if (userSettings.checks.gendered) {
            checkGenderedLanguage(text, results);
        }
        
        if (userSettings.checks.imperative) {
            checkImperativeMood(sentences, results);
        }
        
        // Calculate overall score (simple algorithm)
        const issueCount = results.issues.length;
        const textLength = results.stats.words;
        results.score = Math.max(0, 100 - (issueCount * 100 / (textLength / 20)));
        
        return results;
    }
    
    // Calculate readability metrics
    function calculateReadabilityMetrics(text, sentences) {
        // Count syllables (simplified approach)
        function countSyllables(word) {
            word = word.toLowerCase();
            if (word.length <= 3) return 1;
            
            // Remove common endings
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            
            // Count vowel groups
            const syllables = word.match(/[aeiouy]{1,2}/g);
            return (syllables ? syllables.length : 1);
        }
        
        // Count total syllables in text
        const words = text.split(/\s+/).filter(word => word.match(/[a-zA-Z]/));
        const totalSyllables = words.reduce((count, word) => count + countSyllables(word), 0);
        
        // Count complex words (3+ syllables)
        const complexWords = words.filter(word => countSyllables(word) >= 3).length;
        
        // Calculate metrics
        const sentenceCount = sentences.length;
        const wordCount = words.length;
        
        // Flesch Reading Ease
        const fleschReadingEase = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount));
        
        // Flesch-Kincaid Grade Level
        const fleschKincaidGrade = (0.39 * (wordCount / sentenceCount)) + (11.8 * (totalSyllables / wordCount)) - 15.59;
        
        // SMOG Index (simplified)
        const smogIndex = 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;
        
        return {
            fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
            fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
            smogIndex: Math.round(smogIndex * 10) / 10
        };
    }
    
    // Detect likely domain of the text
    function detectDomain(text) {
        const domains = {
            programming: ['code', 'function', 'variable', 'class', 'method', 'api', 'interface', 'programming', 'developer', 'software', 'app', 'application', 'database', 'server', 'client', 'web', 'javascript', 'python', 'java', 'html', 'css'],
            healthcare: ['patient', 'doctor', 'medical', 'health', 'treatment', 'diagnosis', 'symptom', 'disease', 'hospital', 'clinic', 'physician', 'nurse', 'therapy', 'medication', 'drug', 'prescription'],
            legal: ['law', 'legal', 'court', 'judge', 'attorney', 'lawyer', 'plaintiff', 'defendant', 'contract', 'agreement', 'clause', 'statute', 'regulation', 'compliance', 'liability', 'jurisdiction'],
            finance: ['money', 'finance', 'bank', 'investment', 'stock', 'market', 'fund', 'asset', 'liability', 'credit', 'debit', 'loan', 'interest', 'mortgage', 'tax', 'revenue', 'profit', 'loss']
        };
        
        // Count domain-specific terms
        const domainCounts = {};
        const lowerText = text.toLowerCase();
        
        for (const [domain, terms] of Object.entries(domains)) {
            domainCounts[domain] = terms.reduce((count, term) => {
                const regex = new RegExp(`\\b${term}\\b`, 'gi');
                const matches = lowerText.match(regex);
                return count + (matches ? matches.length : 0);
            }, 0);
        }
        
        // Find domain with highest count
        let maxCount = 0;
        let detectedDomain = 'general';
        
        for (const [domain, count] of Object.entries(domainCounts)) {
            if (count > maxCount) {
                maxCount = count;
                detectedDomain = domain;
            }
        }
        
        // Only return a specific domain if we have enough evidence
        return maxCount > 3 ? detectedDomain : 'general';
    }

    // Function to check heading capitalization consistency
    function checkHeadingCapitalization(headings, results) {
        if (headings.length < 2) return; // Need at least 2 headings to check consistency
        
        // Detect capitalization styles
        const titleCaseHeadings = headings.filter(heading => {
            // Title case: Most words start with uppercase
            const words = heading.trim().split(/\s+/).filter(w => w.length > 0);
            const capitalizedWords = words.filter(word => /^[A-Z]/.test(word));
            return capitalizedWords.length > words.length * 0.7;
        });
        
        const sentenceCaseHeadings = headings.filter(heading => {
            // Sentence case: First word capitalized, rest lowercase (mostly)
            const words = heading.trim().split(/\s+/).filter(w => w.length > 0);
            if (words.length < 2) return false;
            return /^[A-Z]/.test(words[0]) && 
                   words.slice(1).filter(w => /^[A-Z]/.test(w)).length < words.length * 0.3;
        });
        
        // Check for inconsistency
        if (titleCaseHeadings.length > 0 && sentenceCaseHeadings.length > 0) {
            // We have a mix of title case and sentence case
            results.issues.push({
                type: 'Inconsistent Heading Capitalization',
                text: `Mixed heading styles: "${titleCaseHeadings[0].trim()}" vs "${sentenceCaseHeadings[0].trim()}"`,
                suggestion: 'Use consistent capitalization for all headings. Choose either title case (Most Words Capitalized) or sentence case (Only first word capitalized) and apply it consistently.'
            });
        }
    }
    
    // Function to check bullet point parallelism
    function checkBulletParallelism(bulletPoints, results) {
        if (bulletPoints.length < 3) return; // Need at least 3 bullet points for meaningful analysis
        
        // Extract the first word of each bullet point
        const firstWords = bulletPoints.map(bullet => {
            const content = bullet.replace(/^[\s]*[-*•][\s]+/, '').trim();
            return content.split(/\s+/)[0].toLowerCase();
        });
        
        // Check for verb tense consistency
        const verbEndings = {
            ing: 0, // gerund form
            ed: 0,  // past tense
            s: 0,   // present tense (third person)
            other: 0 // other forms (infinitive, etc.)
        };
        
        firstWords.forEach(word => {
            if (word.endsWith('ing')) verbEndings.ing++;
            else if (word.endsWith('ed')) verbEndings.ed++;
            else if (word.endsWith('s') && !word.endsWith('ss')) verbEndings.s++;
            else verbEndings.other++;
        });
        
        // Check if we have a mix of verb forms
        const forms = Object.values(verbEndings).filter(count => count > 0);
        if (forms.length > 1) {
            results.issues.push({
                type: 'Inconsistent Bullet Point Structure',
                text: `Bullet points start with different verb forms or structures`,
                suggestion: 'Make bullet points parallel by starting each with the same grammatical form (e.g., all with verbs in the same tense, all with nouns, or all complete sentences).'
            });
        }
    }
    
    // Function to check for undefined acronyms
    function checkAcronyms(text, sentences, results) {
        // Find potential acronyms (2-5 uppercase letters)
        const acronymRegex = /\b[A-Z]{2,5}\b/g;
        const matches = [...text.matchAll(acronymRegex)];
        
        if (matches.length === 0) return;
        
        // Check each acronym
        const processedAcronyms = new Set();
        
        matches.forEach(match => {
            const acronym = match[0];
            if (processedAcronyms.has(acronym)) return;
            
            processedAcronyms.add(acronym);
            
            // Look for definition pattern: "term (ACRONYM)" or "ACRONYM (term)"
            const definitionRegex1 = new RegExp(`\\w+(?:\\s+\\w+){0,5}\\s+\\(${acronym}\\)`, 'i');
            const definitionRegex2 = new RegExp(`${acronym}\\s+\\([\\w\\s]+\\)`, 'i');
            
            const isDefined = definitionRegex1.test(text) || definitionRegex2.test(text);
            
            if (!isDefined) {
                // Find the sentence containing the first occurrence
                const containingSentence = sentences.find(sentence => 
                    sentence.includes(acronym));
                
                if (containingSentence) {
                    results.issues.push({
                        type: 'Undefined Acronym',
                        text: containingSentence.trim(),
                        suggestion: `The acronym "${acronym}" is used without being defined. Define acronyms on first use, e.g., "Hypertext Markup Language (HTML)".`
                    });
                }
            }
        });
    }
    
    // Function to check for gendered language
    function checkGenderedLanguage(text, results) {
        // List of gendered terms and their neutral alternatives
        const genderedTerms = {
            'businessman': 'businessperson',
            'businesswoman': 'businessperson',
            'chairman': 'chairperson',
            'chairwoman': 'chairperson',
            'fireman': 'firefighter',
            'policeman': 'police officer',
            'stewardess': 'flight attendant',
            'mailman': 'mail carrier',
            'mankind': 'humanity',
            'manpower': 'workforce',
            'man-made': 'artificial',
            'manmade': 'artificial',
            'salesman': 'salesperson',
            'saleswoman': 'salesperson',
            'spokesman': 'spokesperson',
            'spokeswoman': 'spokesperson',
            'steward': 'flight attendant',
            'waitress': 'server',
            'waiter': 'server'
        };
        
        for (const [gendered, neutral] of Object.entries(genderedTerms)) {
            const regex = new RegExp(`\\b${gendered}\\b`, 'gi');
            
            if (regex.test(text)) {
                results.issues.push({
                    type: 'Gendered Language',
                    text: `"${gendered}"`,
                    suggestion: `Consider using the gender-neutral term "${neutral}" instead of "${gendered}".`
                });
            }
        }
        
        // Check for gendered pronouns in generic contexts
        const genderedPronouns = [
            { pattern: /\bhe or she\b/gi, alternative: 'they' },
            { pattern: /\bhis or her\b/gi, alternative: 'their' },
            { pattern: /\bhim or her\b/gi, alternative: 'them' }
        ];
        
        genderedPronouns.forEach(({ pattern, alternative }) => {
            if (pattern.test(text)) {
                results.issues.push({
                    type: 'Gendered Language',
                    text: `"${pattern.source.replace(/\\b/g, '')}"`,
                    suggestion: `Consider using the singular "${alternative}" instead of "${pattern.source.replace(/\\b/g, '')}" for inclusive language.`
                });
            }
        });
    }
    
    // Function to check for imperative mood in instructions
    function checkImperativeMood(sentences, results) {
        // Look for sentences that might be instructions but don't use imperative mood
        const instructionKeywords = ['should', 'must', 'need to', 'have to', 'it is necessary to', 'it is important to'];
        
        sentences.forEach(sentence => {
            // Check if the sentence contains instruction keywords
            const hasInstructionKeywords = instructionKeywords.some(keyword => 
                sentence.toLowerCase().includes(keyword));
            
            if (hasInstructionKeywords) {
                // Check if the sentence starts with a verb in imperative mood
                const firstWord = sentence.trim().split(/\s+/)[0].toLowerCase();
                const commonImperativeVerbs = ['click', 'select', 'choose', 'enter', 'type', 'go', 'navigate', 'open', 'close', 'save', 'delete', 'create', 'update', 'install', 'download', 'upload', 'run', 'execute', 'start', 'stop', 'restart', 'configure', 'set', 'enable', 'disable', 'check', 'verify', 'ensure', 'make', 'build', 'compile', 'deploy'];
                
                const startsWithImperative = commonImperativeVerbs.includes(firstWord);
                
                if (!startsWithImperative) {
                    results.issues.push({
                        type: 'Non-Imperative Instructions',
                        text: sentence.trim(),
                        suggestion: 'For instructions, use imperative mood (direct commands) instead of phrases like "should" or "must". For example, use "Click the button" instead of "You should click the button".'
                    });
                }
            }
        });
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
                    // Create a version of the sentence with the passive voice highlighted
                    const passiveConstruction = match[0];
                    const sentenceTrimmed = containingSentence.trim();
                    const passiveIndex = sentenceTrimmed.indexOf(passiveConstruction);
                    
                    // Create a highlighted version of the text
                    const highlightedText = 
                        sentenceTrimmed.substring(0, passiveIndex) + 
                        '<span class="highlight">' + 
                        passiveConstruction + 
                        '</span>' + 
                        sentenceTrimmed.substring(passiveIndex + passiveConstruction.length);
                    
                    // Create a suggested fix by converting to active voice (simplified approach)
                    let suggestedFix = '';
                    
                    // Try to identify subject and object for simple cases
                    const parts = sentenceTrimmed.split(passiveConstruction);
                    if (parts.length === 2) {
                        const beforePassive = parts[0].trim();
                        const afterPassive = parts[1].trim();
                        
                        // Look for "by [subject]" pattern
                        const byMatch = afterPassive.match(/\bby\s+([^,.;:]+)/i);
                        if (byMatch) {
                            const subject = byMatch[1].trim();
                            const object = beforePassive;
                            const verb = match[1]; // The verb part from the regex capture group
                            
                            suggestedFix = `${subject} ${verb} ${object}`.replace(/\s+/g, ' ').trim();
                            
                            // Clean up any remaining "by" phrase
                            suggestedFix = suggestedFix.replace(/\s+by\s+[^,.;:]+/i, '');
                        }
                    }
                    
                    // If we couldn't generate a specific fix, provide a generic message
                    if (!suggestedFix) {
                        suggestedFix = "Consider rewriting in active voice format: 'Subject verb object' instead of 'Object is verbed by subject'";
                    }
                    
                    results.issues.push({
                        type: 'Passive Voice',
                        text: sentenceTrimmed,
                        highlightedText: highlightedText,
                        suggestion: 'Use active voice instead of passive voice. Active voice is more direct and easier to read.',
                        suggestedFix: suggestedFix
                    });
                }
            }
        });
    }

    // Function to check for long sentences
    function checkLongSentences(sentences, results) {
        const wordThreshold = userSettings.thresholds.longSentence;
        
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
            
            // Find all instances of this complex word
            const matches = [...text.matchAll(regex)];
            
            if (matches.length > 0) {
                // Find a sentence containing this complex word for context
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
                const containingSentence = sentences.find(sentence => 
                    sentence.toLowerCase().includes(complex.toLowerCase()));
                
                if (containingSentence) {
                    const sentenceTrimmed = containingSentence.trim();
                    
                    // Create a highlighted version with the complex word highlighted
                    const complexRegex = new RegExp(`\\b${complex}\\b`, 'gi');
                    const highlightedText = sentenceTrimmed.replace(
                        complexRegex, 
                        match => `<span class="highlight">${match}</span>`
                    );
                    
                    // Create a suggested fix by replacing the complex word with the simple alternative
                    const suggestedFix = sentenceTrimmed.replace(
                        complexRegex,
                        simple
                    );
                    
                    results.issues.push({
                        type: 'Complex Wording',
                        text: sentenceTrimmed,
                        highlightedText: highlightedText,
                        suggestion: `Consider using "${simple}" instead of "${complex}" for simplicity.`,
                        suggestedFix: suggestedFix
                    });
                } else {
                    // If we can't find a containing sentence, just highlight the word itself
                    results.issues.push({
                        type: 'Complex Wording',
                        text: `"${complex}"`,
                        highlightedText: `"<span class="highlight">${complex}</span>"`,
                        suggestion: `Consider using "${simple}" instead of "${complex}" for simplicity.`,
                        suggestedFix: `Use "${simple}" instead`
                    });
                }
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
                        ${issues.map(issue => {
                            // Use highlighted text if available, otherwise use regular text
                            const displayText = issue.highlightedText || issue.text;
                            
                            // Create suggested fix section if available
                            const suggestedFixHtml = issue.suggestedFix ? `
                                <div class="issue-fix">
                                    <span class="issue-fix-label">Suggested fix:</span>
                                    ${issue.suggestedFix}
                                </div>
                            ` : '';
                            
                            return `
                                <div class="issue-item">
                                    <div class="issue-text">${displayText}</div>
                                    <div class="issue-suggestion">${issue.suggestion}</div>
                                    ${suggestedFixHtml}
                                </div>
                            `;
                        }).join('')}
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
});

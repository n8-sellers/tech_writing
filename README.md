# Technical Writing Guidelines Analyzer

A static webpage that analyzes text for adherence to Google's Technical Writing Guidelines.

## Overview

This tool helps technical writers improve their documentation by checking text against common guidelines from Google's Technical Writing best practices. Simply paste your text into the analyzer, and it will identify potential issues and provide suggestions for improvement.

## Features

- **Instant Analysis**: Paste your text and get immediate feedback
- **Comprehensive Checks**: Analyzes text for multiple guideline violations
- **Detailed Reports**: Provides a summary and specific text snippets to fix
- **Client-Side Only**: No server required, all processing happens in your browser

## Guidelines Checked

The analyzer checks for several common issues in technical writing:

1. **Passive Voice**: Identifies sentences written in passive voice, which can make text less direct and harder to understand.
2. **Long Sentences**: Flags sentences that exceed a recommended word count, as shorter sentences are generally easier to read.
3. **Complex Wording**: Highlights unnecessarily complex words or jargon that could be replaced with simpler alternatives.
4. **Unclear Pronoun References**: Detects sentences that start with pronouns that might have unclear references.
5. **Use of "We" in Instructions**: Identifies when instructions use "we" instead of directly addressing the reader with "you".
6. **Ambiguous Terms**: Flags vague or imprecise terms that could be replaced with more specific language.
7. **Inconsistent Terminology**: Detects when different terms are used for the same concept, which can confuse readers.

## How to Use

1. Open `index.html` in any modern web browser
2. Paste your technical writing text into the text area
3. Click the "Analyze Text" button
4. Review the summary and specific issues identified
5. Make improvements to your text based on the suggestions

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Based On

This analyzer is based on guidelines from [Google's Technical Writing Courses](https://developers.google.com/tech-writing).

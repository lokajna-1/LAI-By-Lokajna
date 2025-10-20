class LAIPlatform {
    constructor() {
        this.initEventListeners();
        this.loadRealTimeInfo();
        this.setupImageGenerator();
    }

    initEventListeners() {
        // Image Generator
        document.getElementById('generate-image-btn').addEventListener('click', () => this.generateImage());
        document.getElementById('download-image-btn').addEventListener('click', () => this.downloadImage());

        // Code Generator
        document.getElementById('generate-code-btn').addEventListener('click', () => this.generateCode());
        document.getElementById('copy-code-btn').addEventListener('click', () => this.copyCode());

        // Q&A System
        document.getElementById('ask-question-btn').addEventListener('click', () => this.answerQuestion());

        // Summarizer
        document.getElementById('summarize-btn').addEventListener('click', () => this.summarizeText());

        // Chat Bot
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    setupImageGenerator() {
        this.canvas = document.getElementById('generated-image');
        this.ctx = this.canvas.getContext('2d');
    }

    // Client-Side Image Generator
    generateImage() {
        const prompt = document.getElementById('image-prompt').value.trim();
        if (!prompt) {
            alert('Please enter an image description');
            return;
        }

        this.showLoading('image');
        
        // Simulate processing time
        setTimeout(() => {
            try {
                this.createImageFromPrompt(prompt);
                document.getElementById('image-result').classList.remove('hidden');
            } catch (error) {
                console.error('Image generation error:', error);
                alert('Error generating image');
            } finally {
                this.hideLoading('image');
            }
        }, 1000);
    }

    createImageFromPrompt(prompt) {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generate background color based on prompt
        const bgColor = this.stringToColor(prompt);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some shapes based on prompt
        this.addGeometricShapes(ctx, prompt);
        
        // Add text representation
        ctx.fillStyle = this.getContrastColor(bgColor);
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const words = prompt.split(' ').slice(0, 3);
        const displayText = words.join(' ').toUpperCase();
        
        ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
        
        // Add some decorative elements
        this.addDecorations(ctx, prompt);
    }

    stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    getContrastColor(bgColor) {
        return bgColor.includes('hsl') ? '#ffffff' : '#000000';
    }

    addGeometricShapes(ctx, prompt) {
        const shapes = ['circle', 'rectangle', 'triangle'];
        const shape = shapes[prompt.length % shapes.length];
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        switch(shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(100, 100, 50, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rectangle':
                ctx.fillRect(400, 400, 80, 80);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(400, 100);
                ctx.lineTo(450, 180);
                ctx.lineTo(350, 180);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }

    addDecorations(ctx, prompt) {
        // Add some random decorative elements based on prompt
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 30 + 10;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'lai-generated-image.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    // Code Generator with enhanced templates
    generateCode() {
        const prompt = document.getElementById('code-prompt').value.trim();
        const language = document.getElementById('code-language').value;
        
        if (!prompt) {
            alert('Please describe the code you want to generate');
            return;
        }

        const code = this.generateCodeFromPrompt(prompt, language);
        document.getElementById('generated-code').textContent = code;
        document.getElementById('code-result').classList.remove('hidden');
    }

    generateCodeFromPrompt(prompt, language) {
        const codeTemplates = {
            python: this.generatePythonCode(prompt),
            javascript: this.generateJavaScriptCode(prompt),
            html: this.generateHTMLCode(prompt),
            css: this.generateCSSCode(prompt),
            java: this.generateJavaCode(prompt)
        };
        
        return codeTemplates[language] || `// Code for: ${prompt}\n// Implementation would go here`;
    }

    generatePythonCode(prompt) {
        return `# ${prompt}
import random
import math

class Solution:
    def process_data(self, data):
        """Process the input data"""
        if not data:
            return None
        
        result = []
        for item in data:
            processed_item = self.transform_item(item)
            result.append(processed_item)
        
        return result
    
    def transform_item(self, item):
        """Transform individual item"""
        return str(item).upper()
    
    def calculate_metrics(self, data):
        """Calculate various metrics"""
        if not data:
            return {}
        
        return {
            'count': len(data),
            'sum': sum(data) if all(isinstance(x, (int, float)) for x in data) else 0,
            'average': sum(data) / len(data) if data else 0
        }

def main():
    solution = Solution()
    sample_data = [1, 2, 3, 4, 5]
    
    processed = solution.process_data(sample_data)
    metrics = solution.calculate_metrics(sample_data)
    
    print("Processed data:", processed)
    print("Metrics:", metrics)

if __name__ == "__main__":
    main()`;
    }

    generateJavaScriptCode(prompt) {
        return `// ${prompt}
class DataProcessor {
    constructor() {
        this.data = [];
        this.results = [];
    }

    processInput(input) {
        if (!input || !Array.isArray(input)) {
            throw new Error('Invalid input provided');
        }

        this.data = input;
        this.results = this.data.map(item => this.transformItem(item));
        
        return this.results;
    }

    transformItem(item) {
        // Transform based on item type
        switch (typeof item) {
            case 'string':
                return item.toUpperCase();
            case 'number':
                return item * 2;
            default:
                return JSON.stringify(item);
        }
    }

    getStatistics() {
        if (this.data.length === 0) {
            return {};
        }

        const numbers = this.data.filter(item => typeof item === 'number');
        
        return {
            totalItems: this.data.length,
            numericCount: numbers.length,
            average: numbers.length > 0 ? 
                numbers.reduce((a, b) => a + b, 0) / numbers.length : 0,
            max: numbers.length > 0 ? Math.max(...numbers) : null,
            min: numbers.length > 0 ? Math.min(...numbers) : null
        };
    }
}

// Usage example
const processor = new DataProcessor();
const sampleData = [1, 'hello', 3, 'world', 5];

try {
    const processed = processor.processInput(sampleData);
    const stats = processor.getStatistics();
    
    console.log('Processed data:', processed);
    console.log('Statistics:', stats);
} catch (error) {
    console.error('Processing error:', error.message);
}

module.exports = DataProcessor;`;
    }

    generateHTMLCode(prompt) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .content {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .feature-card {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .feature-card h3 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${prompt}</h1>
            <p>Professional Web Solution</p>
        </header>
        
        <main class="content">
            <h2>Welcome to Our Platform</h2>
            <p>This is a professionally designed web page for your needs.</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>Feature One</h3>
                    <p>Description of the first feature and its benefits.</p>
                </div>
                <div class="feature-card">
                    <h3>Feature Two</h3>
                    <p>Description of the second feature and its advantages.</p>
                </div>
                <div class="feature-card">
                    <h3>Feature Three</h3>
                    <p>Description of the third feature and its value.</p>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Interactive functionality
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded successfully');
            
            // Add interactive features here
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });
    </script>
</body>
</html>`;
    }

    generateCSSCode(prompt) {
        return `/* ${prompt} */
/* Modern CSS Stylesheet */

:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    --text-color: #1e293b;
    --background-color: #f8fafc;
    --border-color: #e2e8f0;
    --success-color: #10b981;
    --error-color: #ef4444;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header Styles */
.header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: var(--primary-color);
}

/* Button Styles */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
}

/* Card Styles */
.card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Grid Layout */
.grid {
    display: grid;
    gap: 2rem;
}

.grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Form Styles */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.mt-3 { margin-top: 3rem; }

.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 2rem; }
.mb-3 { margin-bottom: 3rem; }

.p-1 { padding: 1rem; }
.p-2 { padding: 2rem; }
.p-3 { padding: 3rem; }

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .grid-2,
    .grid-3 {
        grid-template-columns: 1fr;
    }
}

/* Animation Classes */
.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-in {
    animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}`;
    }

    generateJavaCode(prompt) {
        return `// ${prompt}
import java.util.*;
import java.time.LocalDateTime;

public class DataProcessor {
    private List<Object> data;
    private List<String> results;
    private Map<String, Object> statistics;

    public DataProcessor() {
        this.data = new ArrayList<>();
        this.results = new ArrayList<>();
        this.statistics = new HashMap<>();
    }

    public void processData(List<Object> inputData) {
        if (inputData == null || inputData.isEmpty()) {
            throw new IllegalArgumentException("Input data cannot be null or empty");
        }

        this.data = new ArrayList<>(inputData);
        this.results.clear();
        
        for (Object item : this.data) {
            String processedItem = processItem(item);
            this.results.add(processedItem);
        }
        
        calculateStatistics();
    }

    private String processItem(Object item) {
        if (item instanceof String) {
            return ((String) item).toUpperCase();
        } else if (item instanceof Number) {
            double value = ((Number) item).doubleValue();
            return String.format("%.2f", value * 2);
        } else {
            return item.toString();
        }
    }

    private void calculateStatistics() {
        List<Double> numbers = new ArrayList<>();
        
        for (Object item : data) {
            if (item instanceof Number) {
                numbers.add(((Number) item).doubleValue());
            }
        }

        statistics.put("totalItems", data.size());
        statistics.put("numericItems", numbers.size());
        statistics.put("processingTime", LocalDateTime.now().toString());

        if (!numbers.isEmpty()) {
            double sum = numbers.stream().mapToDouble(Double::doubleValue).sum();
            double average = sum / numbers.size();
            double max = numbers.stream().mapToDouble(Double::doubleValue).max().orElse(0);
            double min = numbers.stream().mapToDouble(Double::doubleValue).min().orElse(0);

            statistics.put("sum", sum);
            statistics.put("average", average);
            statistics.put("maximum", max);
            statistics.put("minimum", min);
        }
    }

    public void displayResults() {
        System.out.println("=== Processing Results ===");
        System.out.println("Input data: " + data);
        System.out.println("Processed results: " + results);
        System.out.println("Statistics: " + statistics);
    }

    public List<String> getResults() {
        return new ArrayList<>(results);
    }

    public Map<String, Object> getStatistics() {
        return new HashMap<>(statistics);
    }

    // Main method for testing
    public static void main(String[] args) {
        DataProcessor processor = new DataProcessor();
        
        List<Object> sampleData = Arrays.asList(1, "hello", 3.5, "world", 10);
        
        try {
            processor.processData(sampleData);
            processor.displayResults();
            
            System.out.println("\\nIndividual results:");
            List<String> results = processor.getResults();
            for (int i = 0; i < results.size(); i++) {
                System.out.println("Item " + i + ": " + results.get(i));
            }
            
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`;
    }

copyCode() {
        const codeElement = document.getElementById('generated-code');
        const textArea = document.createElement('textarea');
        textArea.value = codeElement.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Code copied to clipboard!');
    }

    // Q&A System with knowledge base
    answerQuestion() {
        const question = document.getElementById('question-input').value.trim().toLowerCase();
        if (!question) {
            alert('Please enter a question');
            return;
        }

        const answer = this.getAnswerFromKnowledgeBase(question);
        document.getElementById('answer-text').textContent = answer;
        document.getElementById('qa-result').classList.remove('hidden');
    }

    getAnswerFromKnowledgeBase(question) {
        const knowledgeBase = {
            'what is lai': 'LAI is an AI platform that provides various tools including image generation, code generation, text summarization, and more.',
            'how to generate code': 'Go to the Code Generator section, describe what you want to build, select your programming language, and click Generate Code.',
            'what is image generator': 'The Image Generator creates visual representations based on your text descriptions using client-side processing.',
            'how does summarizer work': 'The Summarizer analyzes your text and extracts the most important information to create a concise summary.',
            'what can chat bot do': 'The Chat Bot can answer questions, help with programming, provide information, and assist with various tasks.',
            'who created lai': 'LAI was created by B Lokajna (Lokajna2012@gmail.com).',
            'is lai free': 'Yes, LAI is completely free to use and runs entirely in your browser.',
            'how to download images': 'After generating an image, click the Download Image button to save it to your device.',
            'what languages supported': 'Code Generator supports Python, JavaScript, HTML, CSS, and Java.',
            'how to copy code': 'After generating code, click the Copy Code button to copy it to your clipboard.'
        };

        // Find the best matching question
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (question.includes(key) || key.includes(question)) {
                return value;
            }
        }

        // If no direct match, provide a general response
        const generalResponses = [
            "I understand you're asking about " + question + ". This appears to be outside my current knowledge base, but I'd be happy to help with code generation, text summarization, or other available tools.",
            "That's an interesting question about " + question + ". While I don't have a specific answer, I can assist you with generating code, creating images, or summarizing text.",
            "I'm designed to help with practical tasks like coding and content creation. For your question about " + question + ", you might find the Code Generator or Q&A system helpful."
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    // Enhanced Text Summarizer
    summarizeText() {
        const text = document.getElementById('text-to-summarize').value.trim();
        if (!text) {
            alert('Please enter text to summarize');
            return;
        }

        if (text.length < 50) {
            alert('Please enter at least 50 characters for summarization');
            return;
        }

        const summary = this.createAdvancedSummary(text);
        document.getElementById('summary-text').textContent = summary;
        document.getElementById('summary-result').classList.remove('hidden');
    }

    createAdvancedSummary(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.toLowerCase().split(/\s+/);
        
        // Simple keyword extraction
        const wordFreq = {};
        words.forEach(word => {
            if (word.length > 3) { // Ignore short words
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Score sentences based on keyword frequency and position
        const scoredSentences = sentences.map((sentence, index) => {
            let score = 0;
            const sentenceWords = sentence.toLowerCase().split(/\s+/);
            
            sentenceWords.forEach(word => {
                if (wordFreq[word]) {
                    score += wordFreq[word];
                }
            });
            
            // First sentences often contain important information
            if (index < 2) score += 2;
            
            return { sentence: sentence.trim(), score };
        });

        // Sort by score and take top 3
        scoredSentences.sort((a, b) => b.score - a.score);
        const topSentences = scoredSentences.slice(0, 3).map(item => item.sentence);
        
        return topSentences.join('. ') + '.';
    }

    // Real Time Information
    loadRealTimeInfo() {
        this.updateTime();
        this.updateBrowserInfo();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString();
        document.getElementById('time-info').textContent = timeString;
    }

    updateBrowserInfo() {
        const browserInfo = `
            Platform: ${navigator.platform}
            Language: ${navigator.language}
            Online: ${navigator.onLine ? 'Yes' : 'No'}
            Cookies: ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}
        `;
        document.getElementById('browser-info').textContent = browserInfo;
    }

    // Enhanced Chat Bot
    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addChatMessage(message, 'user');
        input.value = '';

        // Simulate thinking
        setTimeout(() => {
            const response = this.generateChatResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    generateChatResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm LAI assistant. I can help you with code generation, image creation, text summarization, and answering questions. What would you like to work on today?";
        }

        // Code related
        if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('script')) {
            return "I can help you generate code in Python, JavaScript, HTML, CSS, or Java. Just go to the Code Generator section and describe what you want to build!";
        }

        // Image related
        if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('generate image')) {
            return "The Image Generator can create visual representations based on your descriptions. Try it out in the Image Generator section!";
        }

        // Summary related
        if (lowerMessage.includes('summary') || lowerMessage.includes('summarize') || lowerMessage.includes('brief')) {
            return "I can help you summarize long texts. Paste your content in the Summarizer section and I'll create a concise version for you.";
        }

        // Question answering
        if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why') || lowerMessage.includes('?')) {
            return "That's a great question! For detailed answers, try the Q&A System section. I can also help you directly here - feel free to ask more specific questions.";
        }

        // Default responses
        const defaultResponses = [
            "I'd be happy to help with that! Which tool would you like to use: Image Generator, Code Generator, Summarizer, or Q&A System?",
            "That sounds interesting! I can assist you with various AI tools. Let me know what you'd like to create or analyze.",
            "I'm here to help! You can generate code, create images, summarize text, or get answers to questions. What would you like to try first?",
            "Great question! I specialize in practical AI tools. Would you like help with coding, content creation, or information processing?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `<p>${this.escapeHtml(message)}</p>`;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(type) {
        document.getElementById(`${type}-loading`).classList.remove('hidden');
        document.getElementById(`${type}-result`).classList.add('hidden');
        document.getElementById(`generate-${type}-btn`).disabled = true;
    }

    hideLoading(type) {
        document.getElementById(`${type}-loading`).classList.add('hidden');
        document.getElementById(`generate-${type}-btn`).disabled = false;
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LAIPlatform();
});

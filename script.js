class LAIPlatform {
    constructor() {
        this.initEventListeners();
        this.loadRealTimeInfo();
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

        // Real Time Info
        document.getElementById('update-weather-btn').addEventListener('click', () => this.getWeather());

        // Chat Bot
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    // Image Generator using public Hugging Face models
    async generateImage() {
        const prompt = document.getElementById('image-prompt').value.trim();
        if (!prompt) {
            alert('Please enter an image description');
            return;
        }

        this.showLoading('image');
        
        try {
            // Using a public model via Hugging Face Inference API
            const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                this.showImageResult(imageUrl);
            } else {
                throw new Error('Image generation failed. Please try again.');
            }
        } catch (error) {
            console.error('Image generation error:', error);
            alert('Error generating image: ' + error.message);
        } finally {
            this.hideLoading('image');
        }
    }

    showImageResult(imageUrl) {
        const resultSection = document.getElementById('image-result');
        const imageElement = document.getElementById('generated-image');
        
        imageElement.src = imageUrl;
        resultSection.classList.remove('hidden');
    }

    downloadImage() {
        const imageElement = document.getElementById('generated-image');
        const link = document.createElement('a');
        link.download = 'lai-generated-image.png';
        link.href = imageElement.src;
        link.click();
    }

    // Code Generator using public models
    async generateCode() {
        const prompt = document.getElementById('code-prompt').value.trim();
        const language = document.getElementById('code-language').value;
        
        if (!prompt) {
            alert('Please describe the code you want to generate');
            return;
        }

        this.showLoading('code');
        
        try {
            // Using a public code generation model
            const fullPrompt = `Write ${language} code for: ${prompt}`;
            const response = await this.callHuggingFaceAPI('microsoft/DialoGPT-medium', fullPrompt);
            
            document.getElementById('generated-code').textContent = response;
            document.getElementById('code-result').classList.remove('hidden');
        } catch (error) {
            console.error('Code generation error:', error);
            // Fallback to simple template
            this.showFallbackCode(prompt, language);
        } finally {
            this.hideLoading('code');
        }
    }

    showFallbackCode(prompt, language) {
        const fallbackCode = this.createFallbackCode(prompt, language);
        document.getElementById('generated-code').textContent = fallbackCode;
        document.getElementById('code-result').classList.remove('hidden');
    }

    createFallbackCode(prompt, language) {
        const templates = {
            python: `# ${prompt}\ndef solution():\n    # Your code here\n    pass\n\n# Example usage\nif __name__ == "__main__":\n    solution()`,
            javascript: `// ${prompt}\nfunction solution() {\n    // Your code here\n}\n\n// Example usage\nsolution();`,
            html: `<!-- ${prompt} -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Solution</title>\n</head>\n<body>\n    <!-- Your code here -->\n</body>\n</html>`,
            css: `/* ${prompt} */\n.container {\n    /* Your styles here */\n}`,
            java: `// ${prompt}\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`
        };
        
        return templates[language] || `// Code for: ${prompt}\n// Implementation would go here`;
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

    // Q&A System
    async answerQuestion() {
        const question = document.getElementById('question-input').value.trim();
        if (!question) {
            alert('Please enter a question');
            return;
        }

        this.showLoading('qa');
        
        try {
            const response = await this.callHuggingFaceAPI('deepset/roberta-base-squad2', question);
            document.getElementById('answer-text').textContent = response;
            document.getElementById('qa-result').classList.remove('hidden');
        } catch (error) {
            console.error('Q&A error:', error);
            document.getElementById('answer-text').textContent = this.generateFallbackAnswer(question);
            document.getElementById('qa-result').classList.remove('hidden');
        } finally {
            this.hideLoading('qa');
        }
    }

    generateFallbackAnswer(question) {
        const answers = [
            "Based on available information, this appears to be a complex topic that requires more specific context.",
            "The answer to your question depends on various factors and current understanding.",
            "This is an interesting question that touches on multiple aspects worth exploring further.",
            "Current knowledge suggests several approaches to this question, each with different considerations."
        ];
        return answers[Math.floor(Math.random() * answers.length)];
    }

    // Text Summarizer
    async summarizeText() {
        const text = document.getElementById('text-to-summarize').value.trim();
        if (!text) {
            alert('Please enter text to summarize');
            return;
        }

        if (text.length < 50) {
            alert('Please enter at least 50 characters for summarization');
            return;
        }

        this.showLoading('summary');
        
        try {
            // Simple summarization using text processing
            const summary = this.simpleSummarize(text);
            document.getElementById('summary-text').textContent = summary;
            document.getElementById('summary-result').classList.remove('hidden');
        } catch (error) {
            console.error('Summarization error:', error);
            document.getElementById('summary-text').textContent = this.createSimpleSummary(text);
            document.getElementById('summary-result').classList.remove('hidden');
        } finally {
            this.hideLoading('summary');
        }
    }

    simpleSummarize(text) {
        const sentences = text.split('. ').filter(s => s.length > 0);
        const importantSentences = sentences.slice(0, Math.min(3, sentences.length));
        return importantSentences.join('. ') + '.';
    }

    createSimpleSummary(text) {
        const words = text.split(' ');
        if (words.length <= 50) return text;
        return words.slice(0, 50).join(' ') + '...';
    }

    // Real Time Information
    async loadRealTimeInfo() {
        await this.loadNews();
        await this.loadCrypto();
    }

    async loadNews() {
        try {
            // Using a free news API
            const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=DEMO_KEY');
            const data = await response.json();
            
            const headlines = data.articles.slice(0, 3).map(article => 
                `<p><strong>${article.title}</strong></p>`
            ).join('');
            
            document.getElementById('news-info').innerHTML = headlines || 'Latest news unavailable';
        } catch (error) {
            document.getElementById('news-info').innerHTML = 'News loading failed';
        }
    }

    async loadCrypto() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
            const data = await response.json();
            
            const cryptoInfo = `
                <p>Bitcoin: $${data.bitcoin?.usd || 'N/A'}</p>
                <p>Ethereum: $${data.ethereum?.usd || 'N/A'}</p>
            `;
            
            document.getElementById('crypto-info').innerHTML = cryptoInfo;
        } catch (error) {
            document.getElementById('crypto-info').innerHTML = 'Crypto data unavailable';
        }
    }

    async getWeather() {
        const location = document.getElementById('location-input').value.trim();
        if (!location) {
            alert('Please enter a location');
            return;
        }

        try {
            // Using OpenWeatherMap free API (you might want to use your own API key)
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=YOUR_API_KEY`);
            
            if (response.ok) {
                const data = await response.json();
                const weatherInfo = `
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Condition: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                `;
                document.getElementById('weather-info').innerHTML = weatherInfo;
            } else {
                document.getElementById('weather-info').innerHTML = 'Weather data unavailable';
            }
        } catch (error) {
            document.getElementById('weather-info').innerHTML = 'Weather service error';
        }
    }

    // Chat Bot
    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addChatMessage(message, 'user');
        input.value = '';

        try {
            const response = await this.callHuggingFaceAPI('microsoft/DialoGPT-medium', message);
            this.addChatMessage(response, 'bot');
        } catch (error) {
            this.addChatMessage('I apologize, but I encountered an error. Please try again.', 'bot');
        }
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
    async callHuggingFaceAPI(model, input) {
        // This is a simplified version - in production, you might want to use a proxy
        // to avoid CORS issues and handle rate limiting
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: input }),
            });

            if (response.ok) {
                const data = await response.json();
                return this.processAPIResponse(data);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            throw new Error('Service temporarily unavailable');
        }
    }

    processAPIResponse(data) {
        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            return data[0].generated_text;
        }
        return JSON.stringify(data);
    }

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
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Chat functionality
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        
        const icon = isUser ? '<div class="user-icon">👤</div>' : '<div class="bot-icon">🌾</div>';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${icon}
                <div class="message-text">
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="bot-icon">🌾</div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return typingDiv;
    }

    // Remove typing indicator
    function removeTypingIndicator(indicator) {
        chatBox.removeChild(indicator);
    }

    // Send message to API
    async function sendMessage(message) {
        const typingIndicator = showTypingIndicator();
        
        try {
            const response = await fetch('https://cropprice400.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            removeTypingIndicator(typingIndicator);
            addMessage(data.response);
        } catch (error) {
            removeTypingIndicator(typingIndicator);
            addMessage("Sorry, I'm having trouble connecting. Please try again later.");
            console.error('Error:', error);
        }
    }

    // Handle suggested questions
    document.querySelectorAll('.suggestion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent;
            userInput.value = question;
            handleSend();
        });
    });

    // Handle send button click
    sendButton.addEventListener('click', handleSend);

    // Handle Enter key press
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Handle sending message
    function handleSend() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            sendMessage(message);
            userInput.value = '';
        }
    }
});

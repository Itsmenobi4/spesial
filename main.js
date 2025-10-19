// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add floating animation to some elements
    const elements = document.querySelectorAll('.floating');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Message form handling
    const messageForm = document.getElementById('messageForm');
    const messageList = document.getElementById('messageList');
    
    if (messageForm) {
        // Load existing messages from localStorage
        loadMessages();
        
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            
            if (name && message) {
                addMessage(name, message);
                messageForm.reset();
            }
        });
    }
    
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('heaciaMessages')) || [];
        messages.forEach((msg, index) => displayMessage(msg.name, msg.message, msg.timestamp, index));
    }
    
    function addMessage(name, message) {
        const timestamp = new Date().toLocaleString();
        const messages = JSON.parse(localStorage.getItem('heaciaMessages')) || [];
        
        const newMessage = {
            name: name,
            message: message,
            timestamp: timestamp
        };
        
        messages.push(newMessage);
        localStorage.setItem('heaciaMessages', JSON.stringify(messages));
        
        displayMessage(name, message, timestamp, messages.length - 1);
    }
    
    function displayMessage(name, message, timestamp, index) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-white p-4 rounded-xl shadow-md border-l-4 border-pink-400 message-item';
        messageElement.setAttribute('data-index', index);
        messageElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <h4 class="font-bold text-pink-500">${name}</h4>
                    <span class="text-xs text-gray-500">${timestamp}</span>
                </div>
                <button class="delete-btn text-red-400 hover:text-red-600 transition ml-2" title="Hapus pesan">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
            <p class="text-gray-700">${message}</p>
        `;
        
        if (messageList) {
            messageList.prepend(messageElement);
            
            // Add event listener to delete button
            const deleteBtn = messageElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteMessage(index);
            });
        }
    }
    
    function deleteMessage(index) {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            const messages = JSON.parse(localStorage.getItem('heaciaMessages')) || [];
            
            // Remove message at the specified index
            messages.splice(index, 1);
            
            // Update localStorage
            localStorage.setItem('heaciaMessages', JSON.stringify(messages));
            
            // Reload messages
            reloadMessages();
        }
    }
    
    function reloadMessages() {
        const messageList = document.getElementById('messageList');
        if (messageList) {
            messageList.innerHTML = '';
            loadMessages();
        }
    }
    
    // Add delete all messages functionality
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua pesan? Tindakan ini tidak dapat dibatalkan.')) {
                localStorage.removeItem('heaciaMessages');
                reloadMessages();
            }
        });
    }
});
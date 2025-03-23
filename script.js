// Form Steps Controller
function nextStep(currentStep) {
    // Validate input if not the intro step
    if (currentStep > 0) {
        const inputId = getInputIdForStep(currentStep);
        const inputValue = document.getElementById(inputId).value.trim();
        
        if (!inputValue) {
            shakeInput(inputId);
            return;
        }
    }
    
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    // Show next step
    document.getElementById(`step-${currentStep + 1}`).classList.add('active');
}

function getInputIdForStep(step) {
    switch (step) {
        case 1: return 'guest-name';
        case 2: return 'property-name';
        case 3: return 'host-name';
        default: return '';
    }
}

function shakeInput(inputId) {
    const input = document.getElementById(inputId);
    input.classList.add('shake');
    setTimeout(() => {
        input.classList.remove('shake');
    }, 500);
}

// Card Generation
function generateCard() {
    const guestName = document.getElementById('guest-name').value.trim();
    const propertyName = document.getElementById('property-name').value.trim();
    const hostName = document.getElementById('host-name').value.trim();
    
    // Validate all fields are filled
    if (!guestName || !propertyName || !hostName) {
        if (!guestName) shakeInput('guest-name');
        if (!propertyName) shakeInput('property-name');
        if (!hostName) shakeInput('host-name');
        return;
    }
    
    // Create URL with query parameters
    const url = `card.html?guestName=${encodeURIComponent(guestName)}&propertyName=${encodeURIComponent(propertyName)}&hostName=${encodeURIComponent(hostName)}`;
    
    // Redirect to card page with parameters
    window.location.href = url;
}

// Add shake animation to CSS
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            border-color: #000000 !important;
        }
    `;
    document.head.appendChild(style);
}); 
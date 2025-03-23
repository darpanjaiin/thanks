// Get URL parameters
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        guestName: params.get('guestName') || 'Guest',
        propertyName: params.get('propertyName') || 'Our Property',
        hostName: params.get('hostName') || 'Host'
    };
}

// Display the current date
function displayCurrentDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
}

// Fill card with URL parameters
function fillCard() {
    const params = getURLParams();
    document.getElementById('guest-name-display').textContent = params.guestName;
    document.getElementById('property-name-display').textContent = params.propertyName;
    document.getElementById('host-name-display').textContent = params.hostName;
}

// Download card as image
function downloadCard() {
    showProcessingMessage('Creating your image...');
    
    html2canvas(document.getElementById('capture-area'), {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'thank-you-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        hideProcessingMessage();
    }).catch(err => {
        console.error('Error generating image:', err);
        hideProcessingMessage();
        showToast('Failed to create image. Please try again.');
    });
}

// Share options
function openShareOptions() {
    const shareOptions = document.getElementById('share-options');
    shareOptions.style.display = shareOptions.style.display === 'none' ? 'flex' : 'none';
}

// Share via WhatsApp
function shareViaWhatsApp() {
    const params = getURLParams();
    const message = `Dear ${params.guestName},\n\nThank you so much for choosing to stay at ${params.propertyName}! We truly hope your time with us was both comfortable and memorable. Your visit brought warmth and joy to our home, and we're grateful for the care you showed during your stay.\n\nWarmest regards,\n${params.hostName} ❤️`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

// Share via Email
function shareViaEmail() {
    const params = getURLParams();
    const subject = `Thank You for Staying at ${params.propertyName}`;
    const body = `Dear ${params.guestName},\n\nThank you so much for choosing to stay at ${params.propertyName}! We truly hope your time with us was both comfortable and memorable. Your visit brought warmth and joy to our home, and we're grateful for the care you showed during your stay. It was our pleasure to host you, and we hope the memories you made here will be cherished for years to come.\n\nWe'd be delighted to welcome you back anytime. Until then, we wish you safe and happy travels!\n\nWarmest regards,\n${params.hostName} ❤️`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Load HTML2Canvas and jsPDF dynamically
function loadLibraries() {
    return new Promise((resolve, reject) => {
        // Load HTML2Canvas
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        html2canvasScript.onload = () => {
            resolve();
        };
        html2canvasScript.onerror = reject;
        document.body.appendChild(html2canvasScript);
    });
}

// Initialize when the page loads
window.onload = function() {
    fillCard();
    loadLibraries().catch(err => console.error('Error loading libraries:', err));
};

// Initialize the card with data
document.addEventListener('DOMContentLoaded', () => {
    // Get data from localStorage
    const guestName = localStorage.getItem('guestName');
    const propertyName = localStorage.getItem('propertyName');
    const hostName = localStorage.getItem('hostName');
    
    // If data exists, customize the card text
    if (guestName && propertyName && hostName) {
        // Update message text
        const messageText = document.querySelector('.message-text');
        messageText.textContent = `We appreciate your visit, ${guestName}, and hope you enjoyed your stay at our cozy ${propertyName} accommodation.`;
        
        // Update date info
        const dateInfoDiv = document.querySelector('.date-info');
        if (dateInfoDiv) {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = currentDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const dateElements = dateInfoDiv.querySelectorAll('p');
            if (dateElements.length >= 3) {
                dateElements[0].textContent = formattedDate;
                dateElements[1].textContent = formattedTime;
                dateElements[2].textContent = propertyName;
            }
        }
        
        // Update brand logo
        const brandLogo = document.querySelector('.brand-logo');
        if (brandLogo) {
            brandLogo.textContent = hostName.toUpperCase() + ' RENTALS';
        }
    }
    
    // Add document title
    document.title = `Thank You for Staying!`;
});

// Download as PDF
function downloadAsPDF() {
    // Using jsPDF and html2canvas
    const { jsPDF } = window.jspdf;
    
    // Create PDF with proper dimensions
    const captureArea = document.getElementById('capture-area');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Show processing indicator
    showProcessingMessage('Creating PDF...');
    
    html2canvas(captureArea, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        
        // Get property name for the filename
        const propertyName = localStorage.getItem('propertyName') || 'ThankYou';
        const filename = `Thank_You_${propertyName.replace(/\s+/g, '_')}.pdf`;
        
        // Download PDF
        pdf.save(filename);
        
        // Hide processing indicator
        hideProcessingMessage();
    });
}

// Download as Image
function downloadAsImage() {
    const captureArea = document.getElementById('capture-area');
    
    // Show processing indicator
    showProcessingMessage('Creating Image...');
    
    html2canvas(captureArea, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        
        // Convert canvas to blob
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            link.href = url;
            
            // Get property name for the filename
            const propertyName = localStorage.getItem('propertyName') || 'ThankYou';
            link.download = `Thank_You_${propertyName.replace(/\s+/g, '_')}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            hideProcessingMessage();
        }, 'image/png');
    });
}

// Copy Link (for sharing)
function copyLink() {
    // In a real application, this would generate a unique shareable link
    // For this demo, we'll just copy the current URL
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            showToast('Link copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy link: ', err);
            showToast('Failed to copy link');
        });
}

// Processing message
function showProcessingMessage(message) {
    // Create processing overlay if it doesn't exist
    let processingOverlay = document.getElementById('processing-overlay');
    
    if (!processingOverlay) {
        processingOverlay = document.createElement('div');
        processingOverlay.id = 'processing-overlay';
        processingOverlay.innerHTML = `
            <div class="processing-content">
                <div class="spinner"></div>
                <p id="processing-message"></p>
            </div>
        `;
        document.body.appendChild(processingOverlay);
        
        // Add styles for processing overlay
        const style = document.createElement('style');
        style.textContent = `
            #processing-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            
            .processing-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: var(--accent-color);
                margin: 0 auto 1rem;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update message
    document.getElementById('processing-message').textContent = message;
    processingOverlay.style.display = 'flex';
}

function hideProcessingMessage() {
    const processingOverlay = document.getElementById('processing-overlay');
    if (processingOverlay) {
        processingOverlay.style.display = 'none';
    }
}

// Toast message
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // Add styles for toast
        const style = document.createElement('style');
        style.textContent = `
            #toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            #toast.show {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update toast content and show it
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
} 
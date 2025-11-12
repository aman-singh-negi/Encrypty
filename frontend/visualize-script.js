class VisualizationApp {
    constructor() {
        this.isAnimating = false;
        this.currentKey = 13;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        // Demo elements
        this.demoText = document.getElementById('demoText');
        this.demoKey = document.getElementById('demoKey');
        this.keyValue = document.getElementById('keyValue');
        this.animateBtn = document.getElementById('animateBtn');
        
        // Visualization elements
        this.originalText = document.getElementById('originalText');
        this.encryptedText = document.getElementById('encryptedText');
        this.transformationVisual = document.getElementById('transformationVisual');
        this.byteGrid = document.getElementById('byteGrid');
        
        // Algorithm demo elements
        this.asciiDemo = document.getElementById('asciiDemo');
        this.mathDemo = document.getElementById('mathDemo');
        this.moduloDemo = document.getElementById('moduloDemo');
        this.charDemo = document.getElementById('charDemo');
        
        // File visualization elements
        this.fileSize = document.getElementById('fileSize');
        this.fileSizeValue = document.getElementById('fileSizeValue');
        this.simulateFileBtn = document.getElementById('simulateFileBtn');
        this.fileGrid = document.getElementById('fileGrid');
        this.bytesProcessed = document.getElementById('bytesProcessed');
        this.totalBytes = document.getElementById('totalBytes');
        this.fileProgressFill = document.getElementById('fileProgressFill');
        this.fileProgressText = document.getElementById('fileProgressText');
    }

    attachEventListeners() {
        this.demoText.addEventListener('input', () => this.updateDisplay());
        this.demoKey.addEventListener('input', () => this.handleKeyChange());
        this.animateBtn.addEventListener('click', () => this.animateEncryption());
        this.fileSize.addEventListener('input', () => this.handleFileSizeChange());
        this.simulateFileBtn.addEventListener('click', () => this.simulateFileEncryption());
    }

    handleKeyChange() {
        this.currentKey = parseInt(this.demoKey.value);
        this.keyValue.textContent = this.currentKey;
        this.updateDisplay();
    }

    handleFileSizeChange() {
        const size = parseInt(this.fileSize.value);
        this.fileSizeValue.textContent = `${size} KB`;
    }

    updateDisplay() {
        const text = this.demoText.value;
        this.originalText.textContent = text || 'Your text will appear here...';
        
        if (text) {
            const encrypted = this.encryptText(text, this.currentKey);
            this.encryptedText.textContent = encrypted;
            this.updateAlgorithmDemo(text.charAt(0) || 'A');
        } else {
            this.encryptedText.textContent = 'Encrypted result will appear here...';
        }
    }

    encryptText(text, key) {
        return text.split('').map(char => {
            const ascii = char.charCodeAt(0);
            const encrypted = (ascii + key) % 256;
            return String.fromCharCode(encrypted);
        }).join('');
    }

    updateAlgorithmDemo(char) {
        const ascii = char.charCodeAt(0);
        const encrypted = (ascii + this.currentKey) % 256;
        const encryptedChar = String.fromCharCode(encrypted);

        // Update ASCII demo
        this.asciiDemo.innerHTML = `
            <div class="char-item">
                <span class="char">${char}</span>
                <span class="ascii">${ascii}</span>
            </div>
        `;

        // Update math demo
        this.mathDemo.innerHTML = `
            <div class="math-item">
                <span class="formula">${ascii} + ${this.currentKey} = ${ascii + this.currentKey}</span>
            </div>
        `;

        // Update modulo demo
        this.moduloDemo.innerHTML = `
            <div class="modulo-item">
                <span class="formula">${ascii + this.currentKey} % 256 = ${encrypted}</span>
            </div>
        `;

        // Update char demo
        this.charDemo.innerHTML = `
            <div class="char-item">
                <span class="ascii">${encrypted}</span>
                <span class="char">${encryptedChar}</span>
            </div>
        `;
    }

    async animateEncryption() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animateBtn.disabled = true;
        this.animateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Animating...';

        const text = this.demoText.value;
        if (!text) {
            this.showNotification('Please enter some text first!', 'warning');
            this.isAnimating = false;
            this.animateBtn.disabled = false;
            this.animateBtn.innerHTML = '<i class="fas fa-play"></i> Animate Encryption';
            return;
        }

        // Clear previous visualization
        this.byteGrid.innerHTML = '';

        // Create byte visualization
        const bytes = text.split('').map(char => char.charCodeAt(0));
        this.createByteGrid(bytes);

        // Animate each character
        for (let i = 0; i < bytes.length; i++) {
            await this.animateByte(i, bytes[i]);
            await this.delay(300);
        }

        this.isAnimating = false;
        this.animateBtn.disabled = false;
        this.animateBtn.innerHTML = '<i class="fas fa-play"></i> Animate Encryption';
    }

    createByteGrid(bytes) {
        this.byteGrid.innerHTML = '';
        
        bytes.forEach((byte, index) => {
            const byteElement = document.createElement('div');
            byteElement.className = 'byte-item';
            byteElement.innerHTML = `
                <div class="byte-original">${byte}</div>
                <div class="byte-arrow">→</div>
                <div class="byte-encrypted">?</div>
            `;
            this.byteGrid.appendChild(byteElement);
        });
    }

    async animateByte(index, originalByte) {
        const byteElement = this.byteGrid.children[index];
        const encryptedElement = byteElement.querySelector('.byte-encrypted');
        const arrowElement = byteElement.querySelector('.byte-arrow');

        // Highlight the byte being processed
        byteElement.classList.add('processing');

        // Animate the arrow
        arrowElement.style.animation = 'pulse 0.5s ease-in-out';

        // Show the encryption process
        await this.delay(200);
        encryptedElement.textContent = originalByte + this.currentKey;
        encryptedElement.classList.add('calculating');

        await this.delay(300);
        const encrypted = (originalByte + this.currentKey) % 256;
        encryptedElement.textContent = encrypted;
        encryptedElement.classList.remove('calculating');
        encryptedElement.classList.add('encrypted');

        // Remove processing state
        byteElement.classList.remove('processing');
        arrowElement.style.animation = '';
    }

    async simulateFileEncryption() {
        const sizeKB = parseInt(this.fileSize.value);
        const totalBytes = sizeKB * 1024;
        
        this.totalBytes.textContent = totalBytes;
        this.bytesProcessed.textContent = '0';
        this.fileProgressFill.style.width = '0%';
        this.fileProgressText.textContent = '0%';

        // Create file grid
        this.fileGrid.innerHTML = '';
        const gridSize = Math.min(totalBytes, 1000); // Limit visual elements
        
        for (let i = 0; i < gridSize; i++) {
            const byteElement = document.createElement('div');
            byteElement.className = 'file-byte';
            byteElement.style.backgroundColor = this.getRandomColor();
            this.fileGrid.appendChild(byteElement);
        }

        // Simulate encryption process
        const chunkSize = Math.max(1, Math.floor(totalBytes / 100));
        
        for (let processed = 0; processed < totalBytes; processed += chunkSize) {
            const currentProcessed = Math.min(processed + chunkSize, totalBytes);
            const progress = (currentProcessed / totalBytes) * 100;
            
            this.bytesProcessed.textContent = currentProcessed;
            this.fileProgressFill.style.width = `${progress}%`;
            this.fileProgressText.textContent = `${Math.round(progress)}%`;

            // Update visual bytes
            const visualBytes = Math.floor((currentProcessed / totalBytes) * gridSize);
            for (let i = 0; i < visualBytes && i < gridSize; i++) {
                const byteElement = this.fileGrid.children[i];
                byteElement.style.backgroundColor = this.getEncryptedColor();
                byteElement.classList.add('encrypted');
            }

            await this.delay(50);
        }

        this.showNotification('File encryption simulation complete!', 'success');
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getEncryptedColor() {
        return '#6366f1';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisualizationApp();
});

// Add CSS for visualization page
const style = document.createElement('style');
style.textContent = `
    .visualization-demo {
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .demo-controls {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .demo-controls textarea {
        width: 100%;
        padding: 0.875rem;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        font-size: 1rem;
        resize: vertical;
        font-family: inherit;
    }
    
    .demo-controls textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .key-display {
        text-align: center;
        font-weight: 600;
        color: var(--primary-color);
        margin-top: 0.5rem;
    }
    
    .visualization-area {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 2rem;
        align-items: center;
    }
    
    .text-container {
        text-align: center;
    }
    
    .text-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }
    
    .text-display {
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        min-height: 100px;
        word-wrap: break-word;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        line-height: 1.4;
    }
    
    .transformation-area {
        text-align: center;
    }
    
    .transformation-visual {
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 1rem;
        min-height: 100px;
        margin-bottom: 0.5rem;
    }
    
    .transformation-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
    }
    
    .byte-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .byte-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem;
        background: var(--bg-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.3s ease;
    }
    
    .byte-item.processing {
        background: var(--primary-color);
        color: white;
        transform: scale(1.1);
    }
    
    .byte-original {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .byte-arrow {
        color: var(--primary-color);
        font-weight: bold;
    }
    
    .byte-encrypted {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .byte-encrypted.calculating {
        color: var(--warning-color);
        animation: pulse 0.5s ease-in-out;
    }
    
    .byte-encrypted.encrypted {
        color: var(--success-color);
    }
    
    .algorithm-visualization {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .algorithm-step {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: 2rem;
        text-align: center;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-light);
        position: relative;
    }
    
    .step-number {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .step-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .step-content p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .ascii-demo, .math-demo, .modulo-demo, .char-demo {
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        padding: 1rem;
    }
    
    .char-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .char-item .char {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }
    
    .char-item .ascii {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: var(--text-primary);
    }
    
    .math-item, .modulo-item {
        text-align: center;
    }
    
    .formula {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: var(--text-primary);
        font-size: 1.1rem;
    }
    
    .file-visualization-section {
        background: var(--bg-primary);
        border-radius: var(--radius-2xl);
        padding: 3rem;
        box-shadow: var(--shadow-xl);
        margin-bottom: 2rem;
    }
    
    .file-visualization {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .file-controls {
        display: flex;
        gap: 2rem;
        align-items: end;
        margin-bottom: 2rem;
    }
    
    .file-controls .control-group {
        flex: 1;
    }
    
    .size-display {
        text-align: center;
        font-weight: 600;
        color: var(--primary-color);
        margin-top: 0.5rem;
    }
    
    .file-visual-area {
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        padding: 2rem;
    }
    
    .file-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .file-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .file-stats {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: var(--text-secondary);
    }
    
    .file-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
        gap: 2px;
        margin-bottom: 1rem;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .file-byte {
        width: 20px;
        height: 20px;
        border-radius: 2px;
        transition: all 0.3s ease;
    }
    
    .file-byte.encrypted {
        transform: scale(1.1);
    }
    
    .file-progress {
        text-align: center;
    }
    
    .progress-text {
        margin-top: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .demo-controls {
            grid-template-columns: 1fr;
        }
        
        .visualization-area {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .algorithm-visualization {
            grid-template-columns: 1fr;
        }
        
        .file-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .file-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
    }
`;
document.head.appendChild(style);

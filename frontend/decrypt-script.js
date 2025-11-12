class DecryptApp {
    constructor() {
        this.selectedFile = null;
        this.decryptionKey = null;
        this.isProcessing = false;
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // File upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFile = document.getElementById('removeFile');

        // Key elements
        this.decryptionKeyInput = document.getElementById('decryptionKey');
        this.helpKeyBtn = document.getElementById('helpKey');

        // Action elements
        this.decryptBtn = document.getElementById('decryptBtn');
        this.clearBtn = document.getElementById('clearBtn');

        // Progress elements
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercent = document.getElementById('progressPercent');
        this.step1 = document.getElementById('step1');
        this.step2 = document.getElementById('step2');
        this.step3 = document.getElementById('step3');

        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.decryptAnotherBtn = document.getElementById('decryptAnotherBtn');
    }

    attachEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeFile.addEventListener('click', () => this.removeSelectedFile());

        // Key events
        this.decryptionKeyInput.addEventListener('input', () => this.handleKeyChange());
        this.helpKeyBtn.addEventListener('click', () => this.showKeyHelp());

        // Action events
        this.decryptBtn.addEventListener('click', () => this.decryptFile());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Results events
        this.downloadBtn.addEventListener('click', () => this.downloadDecryptedFile());
        this.decryptAnotherBtn.addEventListener('click', () => this.decryptAnother());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.selectFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.selectFile(files[0]);
        }
    }

    selectFile(file) {
        this.selectedFile = file;
        this.displayFileInfo();
        this.updateDecryptButton();
    }

    displayFileInfo() {
        this.fileName.textContent = this.selectedFile.name;
        this.fileSize.textContent = this.formatFileSize(this.selectedFile.size);
        this.fileInfo.style.display = 'block';
        this.uploadArea.style.display = 'none';
    }

    removeSelectedFile() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.updateDecryptButton();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleKeyChange() {
        this.decryptionKey = parseInt(this.decryptionKeyInput.value);
        this.updateDecryptButton();
    }

    showKeyHelp() {
        this.showModal('Key Help', `
            <div style="text-align: left;">
                <h4>How to find your decryption key:</h4>
                <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                    <li>Use the same key that was used to encrypt this file</li>
                    <li>Check your notes, password manager, or secure storage</li>
                    <li>If you encrypted with ENCRYPTY, check your browser history or saved settings</li>
                    <li>Keys are typically numbers between 1 and 255</li>
                </ul>
                <p style="color: var(--error-color); font-weight: 600;">
                    ⚠️ Warning: Without the correct key, the file cannot be decrypted!
                </p>
            </div>
        `);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn-primary modal-close-btn">Got it!</button>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: var(--radius-xl);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow-xl);
            animation: slideInUp 0.3s ease-out;
        `;

        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.cssText = `
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const modalBody = modal.querySelector('.modal-body');
        modalBody.style.cssText = `
            padding: 1.5rem;
        `;

        const modalFooter = modal.querySelector('.modal-footer');
        modalFooter.style.cssText = `
            padding: 1.5rem;
            border-top: 1px solid var(--border-color);
            text-align: right;
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        `;

        document.body.appendChild(modal);

        // Close modal events
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    updateDecryptButton() {
        this.decryptBtn.disabled = !this.selectedFile || !this.decryptionKey || this.isProcessing;
    }

    async decryptFile() {
        if (!this.selectedFile || !this.decryptionKey || this.isProcessing) return;

        this.isProcessing = true;
        this.updateDecryptButton();
        this.showProgress();
        
        try {
            // Step 1: Reading file
            this.updateProgress(0, 'Reading encrypted file...');
            this.activateStep(1);
            await this.delay(500);

            const fileData = await this.readFileAsArrayBuffer(this.selectedFile);
            
            // Step 2: Applying decryption
            this.updateProgress(50, 'Applying decryption...');
            this.activateStep(2);
            await this.delay(800);

            const decryptedData = this.decryptData(fileData, this.decryptionKey);
            
            // Step 3: Preparing download
            this.updateProgress(90, 'Preparing download...');
            this.activateStep(3);
            await this.delay(300);

            this.updateProgress(100, 'Decryption complete!');
            await this.delay(500);

            this.decryptedBlob = new Blob([decryptedData], { type: this.selectedFile.type });
            this.showResults();

        } catch (error) {
            console.error('Decryption failed:', error);
            this.showError('Decryption failed. Please check your key and try again.');
        } finally {
            this.isProcessing = false;
            this.updateDecryptButton();
        }
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    decryptData(data, key) {
        const uint8Array = new Uint8Array(data);
        const decrypted = new Uint8Array(uint8Array.length);
        
        for (let i = 0; i < uint8Array.length; i++) {
            decrypted[i] = (uint8Array[i] - key + 256) % 256;
        }
        
        return decrypted;
    }

    showProgress() {
        this.progressSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
    }

    updateProgress(percent, text) {
        this.progressFill.style.width = `${percent}%`;
        this.progressPercent.textContent = `${percent}%`;
        if (text) {
            document.querySelector('.progress-header h3').textContent = text;
        }
    }

    activateStep(stepNumber) {
        // Reset all steps
        [this.step1, this.step2, this.step3].forEach(step => {
            step.classList.remove('active');
        });

        // Activate current step
        if (stepNumber >= 1) this.step1.classList.add('active');
        if (stepNumber >= 2) this.step2.classList.add('active');
        if (stepNumber >= 3) this.step3.classList.add('active');
    }

    showResults() {
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }

    downloadDecryptedFile() {
        if (!this.decryptedBlob) return;

        const url = URL.createObjectURL(this.decryptedBlob);
        const link = document.createElement('a');
        link.href = url;
        
        // Remove 'encrypted_' prefix if it exists
        let fileName = this.selectedFile.name;
        if (fileName.startsWith('encrypted_')) {
            fileName = fileName.substring(10);
        }
        
        link.download = `decrypted_${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    decryptAnother() {
        this.clearAll();
        this.resultsSection.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearAll() {
        this.selectedFile = null;
        this.decryptedBlob = null;
        this.fileInput.value = '';
        this.decryptionKeyInput.value = '';
        this.decryptionKey = null;
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.updateDecryptButton();
        
        // Reset progress
        this.updateProgress(0, 'Decrypting File...');
        [this.step1, this.step2, this.step3].forEach(step => {
            step.classList.remove('active');
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DecryptApp();
});

// Add CSS animations for notifications and modals
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .error-content i {
        font-size: 1.25rem;
    }
    
    .key-info {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background: rgba(99, 102, 241, 0.1);
        border-radius: var(--radius-md);
        border-left: 3px solid var(--primary-color);
    }
    
    .key-info p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .key-info i {
        color: var(--primary-color);
    }
`;
document.head.appendChild(style);

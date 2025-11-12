class EncryptyApp {
    constructor() {
        this.selectedFile = null;
        this.encryptionKey = 13;
        this.isProcessing = false;
        this.workers = [];
        this.maxWorkers = 4;
        this.processingMode = 'balanced';
        this.timingMultiplier = 1;
        this.originalBuffer = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateKeyStrength();
        this.initializeMultiprocessing();
        // Dark theme always active
        document.body.classList.add('theme-dark');
        if (this.processingModeSelect) {
            this.processingMode = this.processingModeSelect.value;
            this.timingMultiplier = this.calculateTimingMultiplier(this.processingMode);
        }
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
        this.encryptionKeyInput = document.getElementById('encryptionKey');
        this.generateKeyBtn = document.getElementById('generateKey');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.processingModeSelect = document.getElementById('processingMode');

        // Action elements
        this.encryptBtn = document.getElementById('encryptBtn');
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
        this.encryptAnotherBtn = document.getElementById('encryptAnotherBtn');

        // Multiprocessing elements
        this.workerStatus = document.getElementById('workerStatus');
        this.workerGrid = document.getElementById('workerGrid');
        this.previewSection = document.getElementById('previewSection');
        this.previewStatus = document.getElementById('previewStatus');
        this.previewOriginal = document.getElementById('previewOriginal');
        this.previewEncrypted = document.getElementById('previewEncrypted');
    }

    initializeMultiprocessing() {
        this.createWorkerStatusDisplay();
        this.createWorkerGrid();
    }


    handleModeChange() {
        if (!this.processingModeSelect) return;
        this.processingMode = this.processingModeSelect.value;
        this.timingMultiplier = this.calculateTimingMultiplier(this.processingMode);
    }

    calculateTimingMultiplier(mode) {
        switch (mode) {
            case 'fast':
                return 0.35;
            case 'cinematic':
                return 1.8;
            default:
                return 1.0;
        }
    }

    createWorkerStatusDisplay() {
        // Create worker status display if it doesn't exist
        if (!this.workerStatus) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'workerStatus';
            statusDiv.className = 'worker-status';
            statusDiv.innerHTML = `
                <h4>🔄 Multiprocessing Status</h4>
                <div class="worker-stats">
                    <div class="stat-item">
                        <span class="stat-label">Active Workers:</span>
                        <span class="stat-value" id="activeWorkers">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Processed Chunks:</span>
                        <span class="stat-value" id="processedChunks">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Chunks:</span>
                        <span class="stat-value" id="totalChunks">0</span>
                    </div>
                </div>
            `;
            
            // Insert after progress section
            const progressSection = document.getElementById('progressSection');
            if (progressSection) {
                progressSection.insertAdjacentElement('afterend', statusDiv);
            }
        }
    }

    createWorkerGrid() {
        // Create worker grid if it doesn't exist
        if (!this.workerGrid) {
            const gridDiv = document.createElement('div');
            gridDiv.id = 'workerGrid';
            gridDiv.className = 'worker-grid';
            gridDiv.innerHTML = `
                <h4>⚡ Worker Processes</h4>
                <div class="workers-container" id="workersContainer">
                    <!-- Workers will be dynamically added here -->
                </div>
            `;
            
            // Insert after worker status
            const workerStatus = document.getElementById('workerStatus');
            if (workerStatus) {
                workerStatus.insertAdjacentElement('afterend', gridDiv);
            }
        }
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
        this.encryptionKeyInput.addEventListener('input', () => this.handleKeyChange());
        this.generateKeyBtn.addEventListener('click', () => this.generateRandomKey());
        if (this.processingModeSelect) {
            this.processingModeSelect.addEventListener('change', () => this.handleModeChange());
        }

        // Action events
        this.encryptBtn.addEventListener('click', () => this.encryptFile());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Results events
        this.downloadBtn.addEventListener('click', () => this.downloadEncryptedFile());
        this.previewBtn = document.getElementById('previewBtn');
        if (this.previewBtn) {
            this.previewBtn.addEventListener('click', () => this.previewEncryptedContent());
        }
        this.encryptAnotherBtn.addEventListener('click', () => this.encryptAnother());

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
        this.updateEncryptButton();
        this.resetPreview();
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
        this.updateEncryptButton();
        this.resetPreview();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleKeyChange() {
        this.encryptionKey = parseInt(this.encryptionKeyInput.value) || 1;
        this.updateKeyStrength();
    }

    generateRandomKey() {
        const randomKey = Math.floor(Math.random() * 255) + 1;
        this.encryptionKeyInput.value = randomKey;
        this.encryptionKey = randomKey;
        this.updateKeyStrength();
        
        // Add visual feedback
        this.generateKeyBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.generateKeyBtn.style.transform = 'scale(1)';
        }, 150);
    }

    updateKeyStrength() {
        let strength = 'Weak';
        let width = '25%';
        let color = 'var(--error-color)';

        if (this.encryptionKey >= 50 && this.encryptionKey <= 200) {
            strength = 'Medium';
            width = '50%';
            color = 'var(--warning-color)';
        } else if (this.encryptionKey > 200 || this.encryptionKey < 10) {
            strength = 'Strong';
            width = '100%';
            color = 'var(--success-color)';
        }

        this.strengthFill.style.width = width;
        this.strengthText.textContent = strength;
    }

    updateEncryptButton() {
        this.encryptBtn.disabled = !this.selectedFile || this.isProcessing;
    }

    async encryptFile() {
        if (!this.selectedFile || this.isProcessing) return;

        this.isProcessing = true;
        this.updateEncryptButton();
        this.showProgress();
        this.showMultiprocessingStatus();
        
        try {
            // Step 1: Reading file
            this.updateProgress(0, 'Reading file...');
            this.activateStep(1);
            await this.delay(500);

            const fileData = await this.readFileAsArrayBuffer(this.selectedFile);
            this.originalBuffer = new Uint8Array(fileData);
            this.updatePreview(this.originalBuffer);
            
            // Step 2: Multiprocessing encryption simulation
            this.updateProgress(20, 'Initializing multiprocessing...');
            this.activateStep(2);
            
            const encryptedData = await this.simulateMultiprocessingEncryption(fileData, this.encryptionKey);
            this.updatePreview(this.originalBuffer, encryptedData);
            
            // Step 3: Preparing download
            this.updateProgress(90, 'Preparing download...');
            this.activateStep(3);
            await this.delay(300);

            this.updateProgress(100, 'Encryption complete!');
            await this.delay(500);

            this.encryptedBlob = new Blob([encryptedData], { type: this.selectedFile.type });
            this.showResults();
            this.hideMultiprocessingStatus();

        } catch (error) {
            console.error('Encryption failed:', error);
            this.showError('Encryption failed. Please try again.');
        } finally {
            this.isProcessing = false;
            this.updateEncryptButton();
        }
    }

    async simulateMultiprocessingEncryption(data, key) {
        const chunkSize = Math.max(1024, Math.floor(data.byteLength / this.maxWorkers));
        const chunks = this.createChunks(data, chunkSize);
        
        this.updateMultiprocessingStats(0, chunks.length);
        this.createWorkerVisualizations();
        
        const encryptedChunks = [];
        const promises = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const workerId = i % this.maxWorkers;
            const promise = this.simulateWorkerProcess(chunks[i], key, workerId, i);
            promises.push(promise);
        }
        
        const results = await Promise.all(promises);
        
        // Combine results in correct order
        for (let i = 0; i < results.length; i++) {
            encryptedChunks[results[i].index] = results[i].data;
        }
        
        return this.combineChunks(encryptedChunks);
    }

    createChunks(data, chunkSize) {
        const chunks = [];
        const uint8Array = new Uint8Array(data);
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const end = Math.min(i + chunkSize, uint8Array.length);
            chunks.push(uint8Array.slice(i, end));
        }
        
        return chunks;
    }

    async simulateWorkerProcess(chunk, key, workerId, chunkIndex) {
        return new Promise((resolve) => {
            // Simulate worker processing time with progress updates
            const processingTime = (200 + Math.random() * 300) * this.timingMultiplier;
            const dispatchDelay = Math.random() * 100 * this.timingMultiplier;
            const startTime = Date.now();
            
            // Update worker to processing state immediately
            this.updateWorkerStatus(workerId, 'processing', chunkIndex);
            
            // Progress update interval
            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(100, (elapsed / processingTime) * 100);
                this.updateWorkerProgress(workerId, progress);
            }, 50);
            
            setTimeout(() => {
                // Encrypt the chunk
                const encrypted = new Uint8Array(chunk.length);
                const chunkSize = chunk.length;
                
                // Simulate byte-by-byte encryption for visual effect
                for (let i = 0; i < chunk.length; i++) {
                    encrypted[i] = (chunk[i] + key) % 256;
                    
                    // Update progress every 10% of chunk
                    if (i % Math.max(1, Math.floor(chunkSize / 10)) === 0) {
                        const byteProgress = ((i / chunkSize) * 100);
                        this.updateWorkerProgress(workerId, byteProgress);
                    }
                }
                
                clearInterval(progressInterval);
                
                // Simulate processing delay with final progress
                setTimeout(() => {
                    this.updateWorkerStatus(workerId, 'completed', chunkIndex);
                    this.updateWorkerProgress(workerId, 100);
                    this.updateProcessedChunks();
                    resolve({ data: encrypted, index: chunkIndex });
                }, processingTime * 0.3);
            }, dispatchDelay);
        });
    }
    
    updateWorkerProgress(workerId, progress) {
        const workerEl = document.getElementById(`worker-${workerId}`);
        if (!workerEl) return;
        
        const progressFill = workerEl.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
            
            // Add pulsing effect when processing
            if (progress < 100) {
                progressFill.style.animation = 'pulse-progress 1s infinite';
            } else {
                progressFill.style.animation = 'none';
            }
        }
    }

    combineChunks(chunks) {
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }

    showMultiprocessingStatus() {
        const workerStatus = document.getElementById('workerStatus');
        const workerGrid = document.getElementById('workerGrid');
        if (workerStatus) workerStatus.style.display = 'block';
        if (workerGrid) workerGrid.style.display = 'block';
    }

    hideMultiprocessingStatus() {
        const workerStatus = document.getElementById('workerStatus');
        const workerGrid = document.getElementById('workerGrid');
        if (workerStatus) workerStatus.style.display = 'none';
        if (workerGrid) workerGrid.style.display = 'none';
    }

    updateMultiprocessingStats(processed, total) {
        const activeWorkersEl = document.getElementById('activeWorkers');
        const processedChunksEl = document.getElementById('processedChunks');
        const totalChunksEl = document.getElementById('totalChunks');
        
        if (activeWorkersEl) activeWorkersEl.textContent = Math.min(this.maxWorkers, total);
        if (processedChunksEl) processedChunksEl.textContent = processed;
        if (totalChunksEl) totalChunksEl.textContent = total;
    }

    updateProcessedChunks() {
        const processedEl = document.getElementById('processedChunks');
        if (processedEl) {
            const current = parseInt(processedEl.textContent) || 0;
            processedEl.textContent = current + 1;
        }
    }

    createWorkerVisualizations() {
        const container = document.getElementById('workersContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < this.maxWorkers; i++) {
            const workerDiv = document.createElement('div');
            workerDiv.className = 'worker-item';
            workerDiv.id = `worker-${i}`;
            workerDiv.innerHTML = `
                <div class="worker-icon">⚡</div>
                <div class="worker-info">
                    <div class="worker-id">Worker ${i + 1}</div>
                    <div class="worker-status">Idle</div>
                </div>
                <div class="worker-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            `;
            container.appendChild(workerDiv);
        }
    }

    updateWorkerStatus(workerId, status, chunkIndex = null) {
        const workerEl = document.getElementById(`worker-${workerId}`);
        if (!workerEl) return;
        
        const statusEl = workerEl.querySelector('.worker-status');
        const progressFill = workerEl.querySelector('.progress-fill');
        const workerIcon = workerEl.querySelector('.worker-icon');
        
        if (statusEl) {
            let statusText = status.charAt(0).toUpperCase() + status.slice(1);
            if (status === 'processing' && chunkIndex !== null) {
                statusText = `Processing Chunk ${chunkIndex + 1}`;
            }
            statusEl.textContent = statusText;
            statusEl.className = `worker-status-text ${status}`;
        }
        
        if (workerIcon) {
            if (status === 'processing') {
                workerIcon.style.animation = 'pulse-glow 1s infinite';
                workerIcon.style.color = 'var(--primary-color)';
                workerIcon.textContent = '⚡';
            } else if (status === 'completed') {
                workerIcon.style.animation = 'none';
                workerIcon.style.color = 'var(--success-color)';
                workerIcon.textContent = '✓';
                setTimeout(() => {
                    workerIcon.textContent = '⚡';
                    workerIcon.style.color = '';
                }, 1000);
            } else {
                workerIcon.style.animation = 'none';
                workerIcon.style.color = 'var(--text-tertiary)';
                workerIcon.textContent = '⚡';
            }
        }
        
        if (progressFill) {
            if (status === 'processing') {
                progressFill.style.background = 'var(--gradient-primary)';
                progressFill.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
            } else if (status === 'completed') {
                progressFill.style.background = 'var(--gradient-success)';
                progressFill.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
            } else {
                progressFill.style.background = 'var(--bg-tertiary)';
                progressFill.style.boxShadow = 'none';
            }
        }
        
        // Add visual feedback
        workerEl.classList.remove('worker-idle', 'worker-processing', 'worker-completed');
        workerEl.classList.add(`worker-${status}`);
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    encryptData(data, key) {
        const uint8Array = new Uint8Array(data);
        const encrypted = new Uint8Array(uint8Array.length);
        
        for (let i = 0; i < uint8Array.length; i++) {
            encrypted[i] = (uint8Array[i] + key) % 256;
        }
        
        return encrypted;
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

    downloadEncryptedFile() {
        if (!this.encryptedBlob) return;

        const url = URL.createObjectURL(this.encryptedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `encrypted_${this.selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    encryptAnother() {
        this.clearAll();
        this.resultsSection.style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearAll() {
        this.selectedFile = null;
        this.encryptedBlob = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.progressSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.updateEncryptButton();
        this.originalBuffer = null;
        this.resetPreview();
        
        // Reset progress
        this.updateProgress(0, 'Encrypting File...');
        [this.step1, this.step2, this.step3].forEach(step => {
            step.classList.remove('active');
        });
    }

    updatePreview(originalBuffer, encryptedBuffer = null) {
        if (!this.previewOriginal || !this.previewEncrypted) return;

        if (!originalBuffer || originalBuffer.length === 0) {
            this.resetPreview();
            return;
        }

        const previewLimit = 512;
        const originalSnippet = originalBuffer.slice(0, previewLimit);
        const encryptedSnippet = encryptedBuffer ? encryptedBuffer.slice(0, previewLimit) : null;

        const originalText = this.decodeSnippet(originalSnippet);
        const encryptedText = encryptedSnippet ? this.decodeSnippet(encryptedSnippet) : null;

        if (originalText === null) {
            this.previewStatus.textContent = 'Preview unavailable for binary files';
            this.previewOriginal.textContent = '// Binary data preview not supported';
            this.previewEncrypted.textContent = '// Run encryption to generate output';
            return;
        }

        this.previewStatus.textContent = encryptedText
            ? `Previewing ${Math.min(previewLimit, originalBuffer.length)} bytes`
            : 'Preview ready (encrypt to view transformed output)';
        this.previewOriginal.textContent = this.formatPreviewText(originalText);
        this.previewEncrypted.textContent = encryptedText
            ? this.formatPreviewText(encryptedText)
            : '// Encryption preview will appear here';
    }

    resetPreview() {
        if (!this.previewOriginal || !this.previewEncrypted) return;
        this.previewStatus.textContent = this.selectedFile
            ? 'Ready for preview'
            : 'Waiting for file...';
        this.previewOriginal.textContent = '// Select a text-based file to preview';
        this.previewEncrypted.textContent = '// Preview will appear after encryption';
    }

    decodeSnippet(data) {
        try {
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const text = decoder.decode(data);
            if (!text) return null;

            const printable = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
            const ratio = printable.length / text.length;
            if (ratio < 0.6) {
                return null;
            }
            return text;
        } catch (error) {
            return null;
        }
    }

    formatPreviewText(text) {
        const trimmed = text.trim();
        return trimmed.length > 0 ? trimmed : '(empty file)';
    }

    delay(ms) {
        const scaled = Math.max(0, ms * this.timingMultiplier);
        return new Promise(resolve => setTimeout(resolve, scaled));
    }

    // Preview encrypted content
    previewEncryptedContent() {
        if (!this.encryptedBlob) return;

        const modal = document.createElement('div');
        modal.className = 'preview-modal active';
        modal.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h3><i class="fas fa-eye"></i> Encrypted Content Preview</h3>
                    <button class="preview-close" onclick="this.closest('.preview-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="preview-body">
                    <p>Preview of encrypted content (first 500 bytes):</p>
                    <div class="preview-text" id="previewText">Loading...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Read and display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            const previewLength = Math.min(500, uint8Array.length);
            const preview = Array.from(uint8Array.slice(0, previewLength))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
            const previewTextEl = document.getElementById('previewText');
            if (previewTextEl) {
                previewTextEl.textContent = preview;
            }
        };
        reader.readAsArrayBuffer(this.encryptedBlob);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EncryptyApp();
});

// Add CSS animations for notifications
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
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .error-content i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(style);

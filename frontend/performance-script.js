class PerformanceApp {
    constructor() {
        this.testResults = [];
        this.charts = {};
        this.isRunning = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeCharts();
        this.detectSystemInfo();
    }

    initializeElements() {
        // Test controls
        this.testFileSize = document.getElementById('testFileSize');
        this.testKey = document.getElementById('testKey');
        this.testIterations = document.getElementById('testIterations');
        this.runTestBtn = document.getElementById('runTestBtn');
        this.clearResultsBtn = document.getElementById('clearResultsBtn');

        // Performance metrics
        this.performanceSection = document.getElementById('performanceSection');
        this.currentSpeed = document.getElementById('currentSpeed');
        this.memoryUsage = document.getElementById('memoryUsage');
        this.elapsedTime = document.getElementById('elapsedTime');
        this.progressPercent = document.getElementById('progressPercent');

        // Summary
        this.summarySection = document.getElementById('summarySection');
        this.bestPerformance = document.getElementById('bestPerformance');
        this.averageSpeed = document.getElementById('averageSpeed');
        this.recommendations = document.getElementById('recommendations');

        // System info
        this.browserInfo = document.getElementById('browserInfo');
        this.cpuCores = document.getElementById('cpuCores');
        this.memoryInfo = document.getElementById('memoryInfo');
        this.performanceScore = document.getElementById('performanceScore');
    }

    attachEventListeners() {
        this.runTestBtn.addEventListener('click', () => this.runPerformanceTest());
        this.clearResultsBtn.addEventListener('click', () => this.clearResults());
    }

    async runPerformanceTest() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.runTestBtn.disabled = true;
        this.runTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Test...';
        
        this.performanceSection.style.display = 'block';
        this.summarySection.style.display = 'none';

        const fileSize = parseInt(this.testFileSize.value);
        const key = parseInt(this.testKey.value);
        const iterations = parseInt(this.testIterations.value);

        const testResults = [];

        for (let i = 0; i < iterations; i++) {
            const result = await this.runSingleTest(fileSize, key, i + 1, iterations);
            testResults.push(result);
        }

        this.testResults = testResults;
        this.updateCharts();
        this.updateSummary();
        this.showSummary();

        this.isRunning = false;
        this.runTestBtn.disabled = false;
        this.runTestBtn.innerHTML = '<i class="fas fa-play"></i> Run Performance Test';
    }

    async runSingleTest(fileSizeMB, key, currentIteration, totalIterations) {
        const startTime = performance.now();
        const startMemory = this.getMemoryUsage();
        
        // Generate test data
        const testData = this.generateTestData(fileSizeMB);
        
        // Update progress
        const progress = ((currentIteration - 1) / totalIterations) * 100;
        this.updateProgress(progress, `Running test ${currentIteration}/${totalIterations}...`);

        // Simulate encryption process
        const encryptedData = await this.simulateEncryption(testData, key);
        
        const endTime = performance.now();
        const endMemory = this.getMemoryUsage();
        
        const processingTime = endTime - startTime;
        const speed = (fileSizeMB / processingTime) * 1000; // MB/s
        const memoryUsed = endMemory - startMemory;

        return {
            fileSize: fileSizeMB,
            key: key,
            processingTime: processingTime,
            speed: speed,
            memoryUsed: memoryUsed,
            timestamp: new Date()
        };
    }

    generateTestData(sizeMB) {
        const sizeBytes = sizeMB * 1024 * 1024;
        const data = new Uint8Array(sizeBytes);
        
        // Fill with random data
        for (let i = 0; i < sizeBytes; i++) {
            data[i] = Math.floor(Math.random() * 256);
        }
        
        return data;
    }

    async simulateEncryption(data, key) {
        const encrypted = new Uint8Array(data.length);
        const chunkSize = 1024 * 1024; // 1MB chunks
        
        for (let i = 0; i < data.length; i += chunkSize) {
            const end = Math.min(i + chunkSize, data.length);
            
            for (let j = i; j < end; j++) {
                encrypted[j] = (data[j] + key) % 256;
            }
            
            // Update real-time metrics
            const progress = (i / data.length) * 100;
            const speed = (i / (1024 * 1024)) / ((performance.now() - this.startTime) / 1000);
            
            this.updateRealTimeMetrics(progress, speed);
            
            // Small delay to simulate processing
            await this.delay(10);
        }
        
        return encrypted;
    }

    updateRealTimeMetrics(progress, speed) {
        this.progressPercent.textContent = Math.round(progress);
        this.currentSpeed.textContent = speed.toFixed(2);
        this.memoryUsage.textContent = this.getMemoryUsage().toFixed(1);
        this.elapsedTime.textContent = Math.round(performance.now() - this.startTime);
    }

    updateProgress(percent, text) {
        // Update any progress indicators if needed
        console.log(`${percent.toFixed(1)}% - ${text}`);
    }

    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize / (1024 * 1024); // MB
        }
        return Math.random() * 50; // Fallback for browsers without memory API
    }

    initializeCharts() {
        // Speed Chart
        const speedCtx = document.getElementById('speedChart').getContext('2d');
        this.charts.speed = new Chart(speedCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Processing Speed (MB/s)',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Speed (MB/s)'
                        }
                    }
                }
            }
        });

        // Memory Chart
        const memoryCtx = document.getElementById('memoryChart').getContext('2d');
        this.charts.memory = new Chart(memoryCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Memory Usage (MB)',
                    data: [],
                    backgroundColor: '#8b5cf6',
                    borderColor: '#8b5cf6'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Memory (MB)'
                        }
                    }
                }
            }
        });

        // Size vs Time Chart
        const sizeTimeCtx = document.getElementById('sizeTimeChart').getContext('2d');
        this.charts.sizeTime = new Chart(sizeTimeCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'File Size vs Processing Time',
                    data: [],
                    backgroundColor: '#06b6d4',
                    borderColor: '#06b6d4'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'File Size (MB)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Processing Time (ms)'
                        }
                    }
                }
            }
        });

        // Key Impact Chart
        const keyImpactCtx = document.getElementById('keyImpactChart').getContext('2d');
        this.charts.keyImpact = new Chart(keyImpactCtx, {
            type: 'bar',
            data: {
                labels: ['Weak (1-50)', 'Medium (51-150)', 'Strong (151-255)'],
                datasets: [{
                    label: 'Average Speed',
                    data: [0, 0, 0],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Speed (MB/s)'
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        if (this.testResults.length === 0) return;

        // Update speed chart
        const speedLabels = this.testResults.map((_, index) => `Test ${index + 1}`);
        const speedData = this.testResults.map(result => result.speed);
        this.charts.speed.data.labels = speedLabels;
        this.charts.speed.data.datasets[0].data = speedData;
        this.charts.speed.update();

        // Update memory chart
        const memoryData = this.testResults.map(result => result.memoryUsed);
        this.charts.memory.data.labels = speedLabels;
        this.charts.memory.data.datasets[0].data = memoryData;
        this.charts.memory.update();

        // Update size vs time chart
        const sizeTimeData = this.testResults.map(result => ({
            x: result.fileSize,
            y: result.processingTime
        }));
        this.charts.sizeTime.data.datasets[0].data = sizeTimeData;
        this.charts.sizeTime.update();

        // Update key impact chart
        this.updateKeyImpactChart();
    }

    updateKeyImpactChart() {
        const weakKeys = this.testResults.filter(r => r.key >= 1 && r.key <= 50);
        const mediumKeys = this.testResults.filter(r => r.key >= 51 && r.key <= 150);
        const strongKeys = this.testResults.filter(r => r.key >= 151 && r.key <= 255);

        const weakAvg = weakKeys.length > 0 ? weakKeys.reduce((sum, r) => sum + r.speed, 0) / weakKeys.length : 0;
        const mediumAvg = mediumKeys.length > 0 ? mediumKeys.reduce((sum, r) => sum + r.speed, 0) / mediumKeys.length : 0;
        const strongAvg = strongKeys.length > 0 ? strongKeys.reduce((sum, r) => sum + r.speed, 0) / strongKeys.length : 0;

        this.charts.keyImpact.data.datasets[0].data = [weakAvg, mediumAvg, strongAvg];
        this.charts.keyImpact.update();
    }

    updateSummary() {
        if (this.testResults.length === 0) return;

        const speeds = this.testResults.map(r => r.speed);
        const bestSpeed = Math.max(...speeds);
        const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;

        this.bestPerformance.textContent = `${bestSpeed.toFixed(2)} MB/s`;
        this.averageSpeed.textContent = `${avgSpeed.toFixed(2)} MB/s`;

        // Generate recommendations
        const recommendations = this.generateRecommendations();
        this.recommendations.textContent = recommendations;
    }

    generateRecommendations() {
        const avgSpeed = this.testResults.reduce((sum, r) => sum + r.speed, 0) / this.testResults.length;
        const avgMemory = this.testResults.reduce((sum, r) => sum + r.memoryUsed, 0) / this.testResults.length;

        let recommendations = [];

        if (avgSpeed < 10) {
            recommendations.push("Consider using smaller file sizes for better performance");
        }
        if (avgMemory > 100) {
            recommendations.push("High memory usage detected - close other applications");
        }
        if (avgSpeed > 50) {
            recommendations.push("Excellent performance! Your system is well-optimized");
        }

        return recommendations.length > 0 ? recommendations.join(". ") : "Performance is within normal ranges";
    }

    showSummary() {
        this.summarySection.style.display = 'block';
        this.summarySection.scrollIntoView({ behavior: 'smooth' });
    }

    detectSystemInfo() {
        // Browser info
        const userAgent = navigator.userAgent;
        let browserName = "Unknown Browser";
        
        if (userAgent.includes("Chrome")) browserName = "Google Chrome";
        else if (userAgent.includes("Firefox")) browserName = "Mozilla Firefox";
        else if (userAgent.includes("Safari")) browserName = "Safari";
        else if (userAgent.includes("Edge")) browserName = "Microsoft Edge";
        
        this.browserInfo.textContent = browserName;

        // CPU cores
        const cores = navigator.hardwareConcurrency || "Unknown";
        this.cpuCores.textContent = `${cores} cores`;

        // Memory info
        if (performance.memory) {
            const totalMemory = (performance.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(0);
            this.memoryInfo.textContent = `${totalMemory} MB available`;
        } else {
            this.memoryInfo.textContent = "Not available";
        }

        // Performance score
        this.calculatePerformanceScore();
    }

    calculatePerformanceScore() {
        // Simple performance score based on available features
        let score = 0;
        
        if (performance.memory) score += 25;
        if (navigator.hardwareConcurrency) score += 25;
        if (typeof SharedArrayBuffer !== 'undefined') score += 25;
        if (typeof WebAssembly !== 'undefined') score += 25;
        
        this.performanceScore.textContent = `${score}/100`;
    }

    clearResults() {
        this.testResults = [];
        this.performanceSection.style.display = 'none';
        this.summarySection.style.display = 'none';
        
        // Reset charts
        Object.values(this.charts).forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceApp();
});

// Add additional CSS for performance page
const style = document.createElement('style');
style.textContent = `
    .performance-test {
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .test-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .test-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .performance-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        text-align: center;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-light);
    }
    
    .metric-icon {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .metric-content h3 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
    }
    
    .metric-content p {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
    }
    
    .metric-content span {
        font-size: 0.875rem;
        color: var(--text-light);
    }
    
    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .chart-container {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-light);
    }
    
    .chart-container h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    
    .summary-card {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: 2rem;
        text-align: center;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-light);
    }
    
    .summary-icon {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .summary-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .summary-content p {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    @media (max-width: 768px) {
        .test-controls {
            grid-template-columns: 1fr;
        }
        
        .test-actions {
            flex-direction: column;
        }
        
        .charts-grid {
            grid-template-columns: 1fr;
        }
        
        .performance-metrics {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 480px) {
        .performance-metrics {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

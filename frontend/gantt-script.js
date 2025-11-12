class GanttChartApp {
    constructor() {
        this.isSimulating = false;
        this.workers = [];
        this.tasks = [];
        this.timeline = [];
        this.startTime = null;
        this.maxWorkers = 4;
        this.taskId = 0;
        this.animationSpeed = 1.0;
        this.zoomLevel = 1.0;
        this.currentTime = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeWorkers();
        this.setupControls();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startSimulation');
        this.resetBtn = document.getElementById('resetSimulation');
        this.exportBtn = document.getElementById('exportChart');
        this.ganttChart = document.getElementById('ganttChart');
        this.timelineContainer = document.getElementById('timelineContainer');
        
        this.totalTimeEl = document.getElementById('totalTime');
        this.totalTasksEl = document.getElementById('totalTasks');
        this.efficiencyEl = document.getElementById('efficiency');
        this.activeWorkersEl = document.getElementById('activeWorkers');
    }

    setupControls() {
        // Add worker count control
        const controls = document.querySelector('.gantt-controls');
        if (controls && !document.getElementById('workerCountControl')) {
            const workerControl = document.createElement('div');
            workerControl.className = 'control-group';
            workerControl.innerHTML = `
                <label for="workerCount">Workers:</label>
                <input type="number" id="workerCount" min="1" max="8" value="4" 
                       style="width: 60px; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-primary);">
            `;
            controls.insertBefore(workerControl, controls.firstChild);
            
            document.getElementById('workerCount').addEventListener('change', (e) => {
                this.maxWorkers = parseInt(e.target.value) || 4;
                this.initializeWorkers();
            });
        }
    }

    initializeWorkers() {
        this.workers = [];
        for (let i = 0; i < this.maxWorkers; i++) {
            this.workers.push({
                id: i,
                name: `Worker ${i + 1}`,
                status: 'idle',
                currentTask: null,
                tasks: [],
                totalWorkTime: 0,
                tasksCompleted: 0
            });
        }
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startSimulation());
        this.resetBtn.addEventListener('click', () => this.resetSimulation());
        this.exportBtn.addEventListener('click', () => this.exportChart());
    }

    async startSimulation() {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.tasks = [];
        this.timeline = [];
        this.taskId = 0;
        
        this.startBtn.disabled = true;
        this.startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        
        // Generate more realistic tasks
        this.generateEducationalTasks();
        
        // Start real-time visualization
        await this.processTasksEducational();
        
        this.isSimulating = false;
        this.startBtn.disabled = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Simulation';
        
        this.renderGanttChart();
        this.renderTimeline();
        this.updateStatistics();
    }

    generateEducationalTasks() {
        const educationalTasks = [
            { name: 'Initialize Workers', type: 'System', duration: 500, description: 'Setting up worker processes' },
            { name: 'Load Configuration', type: 'System', duration: 400, description: 'Reading encryption settings' },
            { name: 'File Chunk 1', type: 'File Read', duration: 1500, description: 'Reading first file segment' },
            { name: 'File Chunk 2', type: 'File Read', duration: 1400, description: 'Reading second file segment' },
            { name: 'File Chunk 3', type: 'File Read', duration: 1600, description: 'Reading third file segment' },
            { name: 'File Chunk 4', type: 'File Read', duration: 1450, description: 'Reading fourth file segment' },
            { name: 'File Chunk 5', type: 'File Read', duration: 1550, description: 'Reading fifth file segment' },
            { name: 'File Chunk 6', type: 'File Read', duration: 1480, description: 'Reading sixth file segment' },
            { name: 'Encrypt Chunk 1', type: 'Encryption', duration: 2500, description: 'Caesar cipher encryption' },
            { name: 'Encrypt Chunk 2', type: 'Encryption', duration: 2400, description: 'Caesar cipher encryption' },
            { name: 'Encrypt Chunk 3', type: 'Encryption', duration: 2600, description: 'Caesar cipher encryption' },
            { name: 'Encrypt Chunk 4', type: 'Encryption', duration: 2450, description: 'Caesar cipher encryption' },
            { name: 'Encrypt Chunk 5', type: 'Encryption', duration: 2550, description: 'Caesar cipher encryption' },
            { name: 'Encrypt Chunk 6', type: 'Encryption', duration: 2480, description: 'Caesar cipher encryption' },
            { name: 'Validate Data', type: 'Validation', duration: 1200, description: 'Checking encryption integrity' },
            { name: 'Compress Result', type: 'Compression', duration: 2000, description: 'Compressing encrypted data' },
            { name: 'Write Output', type: 'File Write', duration: 1000, description: 'Saving encrypted file' },
            { name: 'Cleanup Resources', type: 'System', duration: 500, description: 'Releasing memory and handles' }
        ];
        
        educationalTasks.forEach((taskData) => {
            const task = {
                id: this.taskId++,
                name: taskData.name,
                type: taskData.type,
                description: taskData.description,
                duration: taskData.duration,
                startTime: null,
                endTime: null,
                workerId: null,
                status: 'pending',
                progress: 0
            };
            this.tasks.push(task);
        });
    }

    async processTasksEducational() {
        const availableWorkers = [...this.workers];
        const pendingTasks = [...this.tasks];
        
        await this.showEducationalMessage("🚀 Starting Multiprocessing Simulation", 
            `Initializing ${this.maxWorkers} worker processes for parallel execution`);
        await this.delay(1500);
        
        while (pendingTasks.length > 0 || availableWorkers.some(w => w.status === 'processing')) {
            // Find available workers
            const idleWorkers = availableWorkers.filter(w => w.status === 'idle');
            
            if (idleWorkers.length > 0 && pendingTasks.length > 0) {
                const tasksToAssign = Math.min(idleWorkers.length, pendingTasks.length);
                
                for (let i = 0; i < tasksToAssign; i++) {
                    const worker = idleWorkers[i];
                    const task = pendingTasks.shift();
                    
                    await this.assignTaskToWorkerEducational(worker, task);
                }
            }
            
            // Update real-time visualization
            this.currentTime = Date.now();
            this.updateTaskProgress();
            this.renderGanttChart();
            this.updateStatistics();
            
            await this.delay(100);
        }
        
        await this.showEducationalMessage("✅ Simulation Complete!", 
            `All ${this.tasks.length} tasks processed successfully by ${this.maxWorkers} workers!`);
        await this.delay(2000);
    }

    updateTaskProgress() {
        this.tasks.forEach(task => {
            if (task.status === 'processing' && task.startTime) {
                const elapsed = this.currentTime - task.startTime;
                task.progress = Math.min(100, (elapsed / task.duration) * 100);
            }
        });
    }

    async assignTaskToWorkerEducational(worker, task) {
        worker.status = 'processing';
        worker.currentTask = task;
        task.workerId = worker.id;
        task.startTime = this.currentTime || Date.now();
        task.status = 'processing';
        task.progress = 0;
        
        this.timeline.push({
            timestamp: task.startTime,
            type: 'task_start',
            workerId: worker.id,
            taskId: task.id,
            taskName: task.name
        });
        
        this.startRealTimeUpdates();
        this.renderGanttChart();
        this.updateStatistics();
        
        // Simulate processing with progress updates
        const startTime = task.startTime;
        const updateProgress = () => {
            if (task.status === 'processing') {
                const elapsed = (this.currentTime || Date.now()) - startTime;
                task.progress = Math.min(100, (elapsed / task.duration) * 100);
                
                if (task.progress >= 100) {
                    task.endTime = Date.now();
                    task.status = 'completed';
                    task.progress = 100;
                    worker.status = 'idle';
                    worker.currentTask = null;
                    worker.tasks.push(task);
                    worker.totalWorkTime += (task.endTime - task.startTime);
                    worker.tasksCompleted++;
                    
                    this.timeline.push({
                        timestamp: task.endTime,
                        type: 'task_complete',
                        workerId: worker.id,
                        taskId: task.id,
                        taskName: task.name,
                        duration: task.endTime - task.startTime
                    });
                    
                    this.renderGanttChart();
                    this.updateStatistics();
                }
            }
        };
        
        // Use requestAnimationFrame for smooth progress
        const animate = () => {
            this.currentTime = Date.now();
            updateProgress();
            if (task.status === 'processing') {
                requestAnimationFrame(animate);
            }
        };
        
        // Simulate actual processing time
        setTimeout(() => {
            if (task.status === 'processing') {
                task.endTime = Date.now();
                task.status = 'completed';
                task.progress = 100;
                worker.status = 'idle';
                worker.currentTask = null;
                worker.tasks.push(task);
                worker.totalWorkTime += (task.endTime - task.startTime);
                worker.tasksCompleted++;
                
                this.timeline.push({
                    timestamp: task.endTime,
                    type: 'task_complete',
                    workerId: worker.id,
                    taskId: task.id,
                    taskName: task.name,
                    duration: task.endTime - task.startTime
                });
            }
        }, task.duration);
        
        animate();
    }

    startRealTimeUpdates() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            if (this.isSimulating) {
                this.currentTime = Date.now();
                this.updateTaskProgress();
                this.renderGanttChart();
                this.updateTimeAxis();
                this.updateStatistics();
            }
        }, 50); // Update every 50ms for smooth animation
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async showEducationalMessage(title, description) {
        let messageEl = document.getElementById('educationalMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'educationalMessage';
            messageEl.className = 'educational-message';
            const section = document.querySelector('.gantt-section');
            if (section) {
                section.insertBefore(messageEl, section.querySelector('.gantt-controls'));
            }
        }
        
        messageEl.innerHTML = `
            <div class="message-content">
                <div class="message-title">${title}</div>
                <div class="message-description">${description}</div>
            </div>
        `;
        
        messageEl.style.display = 'block';
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageEl.style.transition = 'all 0.5s ease';
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        }, 100);
    }

    renderGanttChart() {
        if (!this.ganttChart) return;
        
        this.ganttChart.innerHTML = '';
        
        // Add time axis first
        this.renderTimeAxis();
        
        // Create worker rows
        this.workers.forEach(worker => {
            const workerRow = document.createElement('div');
            workerRow.className = 'gantt-row';
            workerRow.innerHTML = `
                <div class="gantt-row-label">
                    <div class="worker-icon-wrapper">
                        <div class="worker-icon" id="icon-${worker.id}">⚡</div>
                        <div class="worker-pulse" id="pulse-${worker.id}"></div>
                    </div>
                    <div class="worker-info">
                        <span class="worker-name">${worker.name}</span>
                        <div class="worker-stats-mini">
                            <span class="worker-tasks-count">${worker.tasksCompleted} tasks</span>
                            <span class="worker-time">${Math.round(worker.totalWorkTime)}ms</span>
                        </div>
                    </div>
                    <div class="worker-status-indicator" id="status-${worker.id}">Idle</div>
                </div>
                <div class="gantt-row-content">
                    <div class="gantt-timeline-container">
                        <div class="gantt-timeline" id="timeline-${worker.id}"></div>
                        <div class="timeline-current-marker" id="marker-${worker.id}"></div>
                    </div>
                </div>
            `;
            this.ganttChart.appendChild(workerRow);
            
            this.renderWorkerTasks(worker);
            this.updateWorkerVisuals(worker);
        });
    }

    updateWorkerVisuals(worker) {
        const icon = document.getElementById(`icon-${worker.id}`);
        const pulse = document.getElementById(`pulse-${worker.id}`);
        
        if (worker.status === 'processing') {
            if (icon) {
                icon.style.animation = 'pulse-glow 1s infinite';
                icon.style.color = 'var(--primary-color)';
            }
            if (pulse) {
                pulse.style.display = 'block';
                pulse.style.animation = 'pulse-ring 1.5s infinite';
            }
        } else {
            if (icon) {
                icon.style.animation = 'none';
                icon.style.color = worker.tasksCompleted > 0 ? 'var(--success-color)' : 'var(--text-tertiary)';
            }
            if (pulse) {
                pulse.style.display = 'none';
            }
        }
    }

    renderWorkerTasks(worker) {
        const timeline = document.getElementById(`timeline-${worker.id}`);
        if (!timeline) return;
        
        timeline.innerHTML = '';
        
        if (!this.startTime) return;
        
        const currentTime = this.currentTime || Date.now();
        const totalDuration = currentTime - this.startTime;
        const scale = Math.max(1, totalDuration / 100); // Scale factor for pixels per ms
        
        // Render completed tasks
        worker.tasks.forEach(task => {
            if (task.startTime && task.endTime) {
                const taskBar = this.createTaskBar(task, scale);
                timeline.appendChild(taskBar);
            }
        });
        
        // Render current task if processing
        if (worker.currentTask && worker.currentTask.status === 'processing') {
            const taskBar = this.createTaskBar(worker.currentTask, scale, true);
            timeline.appendChild(taskBar);
        }
        
        // Update current time marker
        const marker = document.getElementById(`marker-${worker.id}`);
        if (marker && this.startTime) {
            const position = (currentTime - this.startTime) / scale;
            marker.style.left = `${position}px`;
            marker.style.display = 'block';
        }
    }

    createTaskBar(task, scale, isProcessing = false) {
        const taskBar = document.createElement('div');
        taskBar.className = `gantt-task ${task.status} ${isProcessing ? 'processing' : ''}`;
        taskBar.dataset.taskId = task.id;
        
        if (task.startTime) {
            const startPos = (task.startTime - this.startTime) / scale;
            const duration = isProcessing 
                ? ((this.currentTime || Date.now()) - task.startTime) / scale
                : (task.endTime - task.startTime) / scale;
            
            taskBar.style.left = `${startPos}px`;
            taskBar.style.width = `${Math.max(20, duration)}px`;
            taskBar.style.backgroundColor = this.getTaskColor(task);
            
            // Add progress indicator for processing tasks
            if (isProcessing && task.progress !== undefined) {
                const progressBar = document.createElement('div');
                progressBar.className = 'task-progress-bar';
                progressBar.style.width = `${task.progress}%`;
                taskBar.appendChild(progressBar);
            }
            
            // Add task label
            const label = document.createElement('div');
            label.className = 'gantt-task-label';
            label.textContent = task.name;
            label.title = `${task.name}\nType: ${task.type}\nDuration: ${Math.round(task.duration)}ms`;
            taskBar.appendChild(label);
            
            // Add hover tooltip
            taskBar.addEventListener('mouseenter', (e) => {
                this.showTaskTooltip(e, task);
            });
        }
        
        return taskBar;
    }

    showTaskTooltip(event, task) {
        const tooltip = document.createElement('div');
        tooltip.className = 'gantt-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${task.name}</div>
            <div class="tooltip-content">
                <div><strong>Type:</strong> ${task.type}</div>
                <div><strong>Duration:</strong> ${Math.round(task.duration)}ms</div>
                <div><strong>Status:</strong> ${task.status}</div>
                ${task.progress !== undefined ? `<div><strong>Progress:</strong> ${Math.round(task.progress)}%</div>` : ''}
                <div><strong>Worker:</strong> ${this.workers[task.workerId]?.name || 'Unknown'}</div>
            </div>
        `;
        document.body.appendChild(tooltip);
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        
        setTimeout(() => tooltip.remove(), 3000);
    }

    updateWorkerStatusIndicator(worker) {
        const statusEl = document.getElementById(`status-${worker.id}`);
        if (!statusEl) return;
        
        if (worker.status === 'processing') {
            statusEl.textContent = 'Processing';
            statusEl.className = 'worker-status-indicator processing';
        } else if (worker.tasksCompleted > 0) {
            statusEl.textContent = `Completed (${worker.tasksCompleted})`;
            statusEl.className = 'worker-status-indicator completed';
        } else {
            statusEl.textContent = 'Idle';
            statusEl.className = 'worker-status-indicator idle';
        }
    }

    renderTimeAxis() {
        if (!this.startTime) return;
        
        const timeAxis = document.createElement('div');
        timeAxis.className = 'gantt-time-axis';
        timeAxis.innerHTML = `
            <div class="time-axis-label">Timeline (seconds)</div>
            <div class="time-axis-marks" id="timeAxisMarks"></div>
        `;
        
        const firstRow = this.ganttChart.querySelector('.gantt-row');
        if (firstRow) {
            this.ganttChart.insertBefore(timeAxis, firstRow);
        } else {
            this.ganttChart.appendChild(timeAxis);
        }
        
        this.updateTimeAxis();
    }

    updateTimeAxis() {
        const timeAxisMarks = document.getElementById('timeAxisMarks');
        if (!timeAxisMarks || !this.startTime) return;
        
        timeAxisMarks.innerHTML = '';
        
        const currentTime = this.currentTime || Date.now();
        const elapsed = (currentTime - this.startTime) / 1000; // in seconds
        const maxTime = Math.max(30, Math.ceil(elapsed / 5) * 5); // Round up to nearest 5 seconds, min 30
        
        const scale = Math.max(1, (currentTime - this.startTime) / 100); // pixels per ms
        
        // Create time marks every 5 seconds
        for (let i = 0; i <= maxTime; i += 5) {
            const timeMark = document.createElement('div');
            timeMark.className = 'time-mark';
            const position = (i * 1000) / scale;
            timeMark.style.left = `${position}px`;
            timeMark.textContent = `${i}s`;
            timeAxisMarks.appendChild(timeMark);
        }
    }

    getTaskColor(task) {
        const colors = {
            'System': '#6b7280',
            'File Read': '#3b82f6',
            'File Write': '#1d4ed8',
            'Encryption': '#10b981',
            'Validation': '#ef4444',
            'Compression': '#8b5cf6'
        };
        return colors[task.type] || '#6b7280';
    }

    renderTimeline() {
        if (!this.timelineContainer) return;
        
        this.timelineContainer.innerHTML = '';
        
        const sortedTimeline = [...this.timeline].sort((a, b) => a.timestamp - b.timestamp);
        
        sortedTimeline.forEach((event) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            const time = new Date(event.timestamp);
            const timeStr = time.toLocaleTimeString();
            const relativeTime = this.startTime ? ((event.timestamp - this.startTime) / 1000).toFixed(2) : '0';
            
            timelineItem.innerHTML = `
                <div class="timeline-marker">
                    <div class="timeline-dot ${event.type}"></div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-time">${timeStr} (+${relativeTime}s)</span>
                        <span class="timeline-type">${event.type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div class="timeline-details">
                        <strong>${event.taskName}</strong> on ${this.workers[event.workerId]?.name || 'Unknown'}
                        ${event.duration ? ` (${Math.round(event.duration)}ms)` : ''}
                    </div>
                </div>
            `;
            
            this.timelineContainer.appendChild(timelineItem);
        });
        
        // Auto-scroll to bottom
        this.timelineContainer.scrollTop = this.timelineContainer.scrollHeight;
    }

    updateStatistics() {
        if (!this.startTime) return;
        
        const totalTime = (this.currentTime || Date.now()) - this.startTime;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        const activeWorkers = this.workers.filter(w => w.status === 'processing').length;
        
        const totalWorkTime = this.workers.reduce((sum, worker) => sum + worker.totalWorkTime, 0);
        const efficiency = totalTime > 0 ? Math.round((totalWorkTime / (totalTime * this.maxWorkers)) * 100) : 0;
        
        if (this.totalTimeEl) this.totalTimeEl.textContent = `${(totalTime / 1000).toFixed(2)}s`;
        if (this.totalTasksEl) this.totalTasksEl.textContent = `${completedTasks}/${this.tasks.length}`;
        if (this.efficiencyEl) this.efficiencyEl.textContent = `${efficiency}%`;
        if (this.activeWorkersEl) this.activeWorkersEl.textContent = activeWorkers;
        
        // Update worker status indicators
        this.workers.forEach(worker => this.updateWorkerStatusIndicator(worker));
    }

    resetSimulation() {
        this.isSimulating = false;
        this.stopRealTimeUpdates();
        this.workers = [];
        this.tasks = [];
        this.timeline = [];
        this.startTime = null;
        this.currentTime = null;
        this.taskId = 0;
        
        this.initializeWorkers();
        if (this.ganttChart) this.ganttChart.innerHTML = '';
        if (this.timelineContainer) this.timelineContainer.innerHTML = '';
        
        if (this.totalTimeEl) this.totalTimeEl.textContent = '0s';
        if (this.totalTasksEl) this.totalTasksEl.textContent = '0/0';
        if (this.efficiencyEl) this.efficiencyEl.textContent = '0%';
        if (this.activeWorkersEl) this.activeWorkersEl.textContent = '0';
        
        if (this.startBtn) {
            this.startBtn.disabled = false;
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start Simulation';
        }
        
        const messageEl = document.getElementById('educationalMessage');
        if (messageEl) messageEl.style.display = 'none';
    }

    exportChart() {
        const exportData = {
            simulation: {
                totalTime: this.startTime ? (Date.now() - this.startTime) : 0,
                totalTasks: this.tasks.length,
                workers: this.maxWorkers
            },
            workers: this.workers.map(w => ({
                id: w.id,
                name: w.name,
                tasksCompleted: w.tasksCompleted,
                totalWorkTime: w.totalWorkTime
            })),
            tasks: this.tasks.map(task => ({
                name: task.name,
                type: task.type,
                startTime: task.startTime,
                endTime: task.endTime,
                duration: task.duration,
                workerId: task.workerId,
                status: task.status
            })),
            timeline: this.timeline
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `gantt-chart-${Date.now()}.json`;
        link.click();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GanttChartApp();
});

// To-Do List Application with Time Tracking, Local Storage, Backup & Export

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentTaskId = null;
        this.storageKey = 'todoAppTasks';
        this.maxStorageEstimate = 5000; // KB
        
        // DOM Elements
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.clearBtn = document.getElementById('clearBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Statistics Elements
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        
        // Backup Elements
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.statsBtn = document.getElementById('statsBtn');
        this.importFile = document.getElementById('importFile');
        this.storageInfo = document.getElementById('storageInfo');
        this.toast = document.getElementById('toast');
        
        // Modal Elements
        this.modal = document.getElementById('timeModal');
        this.closeBtn = document.querySelector('.close');
        this.startTimeInput = document.getElementById('startTimeInput');
        this.endTimeInput = document.getElementById('endTimeInput');
        this.saveTimesBtn = document.getElementById('saveTimes');
        this.clearTimesBtn = document.getElementById('clearTimes');
        this.durationDisplay = document.getElementById('durationDisplay');
        
        // Initialize
        this.init();
    }

    init() {
        // Load tasks from local storage
        this.loadTasks();
        
        // Add event listeners
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        
        // Backup buttons
        this.exportBtn.addEventListener('click', () => this.exportTasks());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.statsBtn.addEventListener('click', () => this.toggleStorageInfo());
        this.importFile.addEventListener('change', (e) => this.importTasksFromFile(e));
        
        // Modal buttons
        this.closeBtn.addEventListener('click', () => this.closeTimeModal());
        this.saveTimesBtn.addEventListener('click', () => this.saveTimes());
        this.clearTimesBtn.addEventListener('click', () => this.clearTaskTimes());
        this.startTimeInput.addEventListener('change', () => this.calculateDuration());
        this.endTimeInput.addEventListener('change', () => this.calculateDuration());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeTimeModal();
        });
        
        // Initial render
        this.render();
    }

    // Load tasks from local storage
    loadTasks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.tasks = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    // Save tasks to local storage
    saveTasks() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showToast('Failed to save tasks', 'error');
        }
    }

    // Add a new task
    addTask() {
        const text = this.taskInput.value.trim();
        
        if (text === '') {
            this.showToast('Please enter a task!', 'error');
            return;
        }
        
        const now = new Date().toISOString();
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: now,
            completedAt: null,
            startTime: null,
            endTime: null
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.showToast('Task added successfully! ✓', 'success');
        this.render();
    }

    // Delete a task
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            // Set completed time when marking as done
            if (task.completed) {
                task.completedAt = new Date().toISOString();
            } else {
                // Clear completed time if unchecking
                task.completedAt = null;
            }
            this.saveTasks();
            this.render();
        }
    }

    // Set active filter
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    // Clear all completed tasks
    clearCompleted() {
        const completed = this.tasks.filter(task => task.completed).length;
        if (completed === 0) {
            this.showToast('No completed tasks to clear', 'info');
            return;
        }
        
        if (confirm(`Delete ${completed} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.showToast(`${completed} task(s) cleared! ✓`, 'success');
            this.render();
        }
    }

    // Open time modal
    openTimeModal(taskId) {
        this.currentTaskId = taskId;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            this.startTimeInput.value = task.startTime ? task.startTime.slice(0, 16) : '';
            this.endTimeInput.value = task.endTime ? task.endTime.slice(0, 16) : '';
            this.calculateDuration();
            this.modal.style.display = 'flex';
        }
    }

    // Close time modal
    closeTimeModal() {
        this.modal.style.display = 'none';
        this.currentTaskId = null;
        this.durationDisplay.innerHTML = '';
    }

    // Calculate and display duration
    calculateDuration() {
        const startTime = this.startTimeInput.value;
        const endTime = this.endTimeInput.value;
        
        if (!startTime || !endTime) {
            this.durationDisplay.innerHTML = '';
            return;
        }
        
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        if (end <= start) {
            this.durationDisplay.innerHTML = '<span style="color: #ff6b6b;">⚠️ End time must be after start time</span>';
            return;
        }
        
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let durationText = '';
        if (hours > 0) durationText += `${hours}h `;
        durationText += `${minutes}m`;
        
        this.durationDisplay.innerHTML = `<strong>⏱️ Work Duration: ${durationText}</strong>`;
    }

    // Save times for task
    saveTimes() {
        const startTime = this.startTimeInput.value;
        const endTime = this.endTimeInput.value;
        
        if (!startTime || !endTime) {
            this.showToast('Please set both start and end times', 'error');
            return;
        }
        
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        if (end <= start) {
            this.showToast('End time must be after start time', 'error');
            return;
        }
        
        const task = this.tasks.find(t => t.id === this.currentTaskId);
        if (task) {
            task.startTime = new Date(startTime).toISOString();
            task.endTime = new Date(endTime).toISOString();
            this.saveTasks();
            this.showToast('Work times saved successfully! ✓', 'success');
            this.closeTimeModal();
            this.render();
        }
    }

    // Clear times for task
    clearTaskTimes() {
        const task = this.tasks.find(t => t.id === this.currentTaskId);
        if (task) {
            task.startTime = null;
            task.endTime = null;
            this.saveTasks();
            this.showToast('Work times cleared! ✓', 'success');
            this.closeTimeModal();
            this.render();
        }
    }

    // Format time for display
    formatTime(isoString) {
        if (!isoString) return null;
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Calculate duration between two times
    formatDuration(startIso, endIso) {
        if (!startIso || !endIso) return null;
        const start = new Date(startIso);
        const end = new Date(endIso);
        const diff = end - start;
        
        if (diff < 0) return 'Invalid';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    // Calculate time spent between completion and creation
    formatTimeSpent(createdAt, completedAt) {
        if (!completedAt) return null;
        const created = new Date(createdAt);
        const completed = new Date(completedAt);
        const diff = completed - created;
        
        if (diff < 0) return null;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        let result = '';
        if (days > 0) result += `${days}d `;
        if (hours > 0) result += `${hours}h `;
        result += `${minutes}m`;
        return result;
    }

    // Export tasks to JSON file
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `tasks-backup-${timestamp}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showToast(`Exported ${this.tasks.length} task(s)! 📥`, 'success');
    }

    // Import tasks from JSON file
    importTasksFromFile(event) {
        const file = event.target.files[0];
        
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format: Expected an array of tasks');
                }
                
                // Validate tasks structure
                const validTasks = imported.filter(task => 
                    task.id && task.text && task.hasOwnProperty('completed')
                );
                
                if (validTasks.length === 0) {
                    throw new Error('No valid tasks found in file');
                }
                
                // Ask user if they want to merge or replace
                const action = confirm(
                    `Found ${validTasks.length} task(s).\n\n` +
                    'Click OK to MERGE with existing tasks\n' +
                    'Click CANCEL to REPLACE all tasks'
                );
                
                if (action) {
                    // Merge
                    this.tasks = [...validTasks, ...this.tasks];
                    this.showToast(`Merged ${validTasks.length} task(s)! ✓`, 'success');
                } else {
                    // Replace
                    this.tasks = validTasks;
                    this.showToast(`Replaced with ${validTasks.length} task(s)! ✓`, 'success');
                }
                
                this.saveTasks();
                this.render();
            } catch (error) {
                console.error('Import error:', error);
                this.showToast(`Import failed: ${error.message}`, 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        this.importFile.value = '';
    }

    // Toggle storage info display
    toggleStorageInfo() {
        const isVisible = this.storageInfo.style.display !== 'none';
        
        if (isVisible) {
            this.storageInfo.style.display = 'none';
        } else {
            this.updateStorageInfo();
            this.storageInfo.style.display = 'block';
        }
    }

    // Update storage information
    updateStorageInfo() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            const sizeInBytes = new Blob([stored || '']).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);
            const percentUsed = ((sizeInKB / this.maxStorageEstimate) * 100).toFixed(1);
            
            document.getElementById('storageUsed').textContent = sizeInKB;
            document.getElementById('storageAvailable').textContent = this.maxStorageEstimate;
            document.getElementById('storagePercent').textContent = percentUsed;
            
            const storageBar = document.getElementById('storageBar');
            storageBar.style.width = percentUsed + '%';
            
            // Change color based on usage
            if (percentUsed > 80) {
                storageBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff5252 100%)';
            } else if (percentUsed > 50) {
                storageBar.style.background = 'linear-gradient(90deg, #ffb84d 0%, #ff9800 100%)';
            } else {
                storageBar.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
            }
        } catch (error) {
            console.error('Error updating storage info:', error);
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // Get filtered tasks
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    // Update statistics
    updateStats() {
        const active = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;
        
        this.totalCount.textContent = this.tasks.length;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
        
        // Show/hide clear button
        this.clearBtn.style.display = completed > 0 ? 'block' : 'none';
    }

    // Render the task list
    render() {
        const filteredTasks = this.getFilteredTasks();
        
        // Update statistics
        this.updateStats();
        
        // Clear task list
        this.taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = '<p class="empty-message">No tasks to show</p>';
            return;
        }
        
        // Render tasks
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    // Create a task element
    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Format times
        const createdTimeFormatted = this.formatTime(task.createdAt);
        const completedTimeFormatted = this.formatTime(task.completedAt);
        const startTimeFormatted = this.formatTime(task.startTime);
        const endTimeFormatted = this.formatTime(task.endTime);
        const workDuration = this.formatDuration(task.startTime, task.endTime);
        const timeSpent = this.formatTimeSpent(task.createdAt, task.completedAt);
        
        // Timeline section with all times
        let timelineHTML = '<div class="task-timeline">';
        
        // Task creation time
        if (createdTimeFormatted) {
            timelineHTML += `<div class="timeline-item"><span class="timeline-badge">📝 Added:</span> <span class="timeline-value">${createdTimeFormatted}</span></div>`;
        }
        
        // Work times (if set)
        if (startTimeFormatted || endTimeFormatted) {
            timelineHTML += '<div class="timeline-section"><strong>Work Time:</strong>';
            if (startTimeFormatted) timelineHTML += `<div class="timeline-item indent"><span class="timeline-badge">🚀 Start:</span> <span class="timeline-value">${startTimeFormatted}</span></div>`;
            if (endTimeFormatted) timelineHTML += `<div class="timeline-item indent"><span class="timeline-badge">🏁 End:</span> <span class="timeline-value">${endTimeFormatted}</span></div>`;
            if (workDuration) timelineHTML += `<div class="timeline-item indent"><span class="timeline-badge duration">⏱️ Duration:</span> <span class="timeline-value">${workDuration}</span></div>`;
            timelineHTML += '</div>';
        }
        
        // Task completion time (if completed)
        if (completedTimeFormatted) {
            timelineHTML += `<div class="timeline-item completed-item"><span class="timeline-badge completed">✅ Completed:</span> <span class="timeline-value">${completedTimeFormatted}</span></div>`;
            if (timeSpent) {
                timelineHTML += `<div class="timeline-item"><span class="timeline-badge">⏳ Time Spent:</span> <span class="timeline-value">${timeSpent}</span></div>`;
            }
        }
        
        timelineHTML += '</div>';
        
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                ${timelineHTML}
            </div>
            <div class="task-buttons">
                <button class="time-btn">⏰ Set Work Time</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        
        // Add event listeners
        div.querySelector('.checkbox').addEventListener('change', () => {
            this.toggleTask(task.id);
        });
        
        div.querySelector('.time-btn').addEventListener('click', () => {
            this.openTimeModal(task.id);
        });
        
        div.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteTask(task.id);
        });
        
        return div;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
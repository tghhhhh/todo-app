// To-Do List Application with Local Storage, Backup & Export

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
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
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
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
        
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${task.completed ? 'checked' : ''}
            >
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn">Delete</button>
        `;
        
        // Add event listeners
        div.querySelector('.checkbox').addEventListener('change', () => {
            this.toggleTask(task.id);
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
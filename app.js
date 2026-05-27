// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoAppTasks';
        
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
        }
    }

    // Add a new task
    addTask() {
        const text = this.taskInput.value.trim();
        
        if (text === '') {
            alert('Please enter a task!');
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
        if (confirm('Delete all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
        }
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
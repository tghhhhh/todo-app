# 📝 To-Do List Application

A clean, modern to-do list web application with local storage functionality. Your tasks are automatically saved to your browser's local storage, so they persist even after you close the page.

## ✨ Features

- ✅ **Add Tasks**: Quickly add new tasks with Enter key or Add button
- ✨ **Mark Complete**: Check off tasks as you complete them
- 🗑️ **Delete Tasks**: Remove tasks you no longer need
- 💾 **Local Storage**: Tasks are automatically saved to your browser
- 🔍 **Filter Tasks**: View All, Active, or Completed tasks
- 📊 **Statistics**: Track total, active, and completed tasks
- 🎨 **Modern Design**: Beautiful gradient UI with smooth animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

1. **Clone this repository**:
   ```bash
   git clone https://github.com/tghhhhh/todo-app.git
   cd todo-app
   ```

2. **Open in browser**:
   - Double-click `index.html` or
   - Right-click → Open with → Your browser or
   - Use a local server (recommended)

3. **Using a local server** (optional):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server
   ```
   Then visit `http://localhost:8000`

## 📖 How to Use

1. **Add a Task**:
   - Type your task in the input field
   - Press Enter or click "Add Task"

2. **Complete a Task**:
   - Check the checkbox next to a task

3. **Delete a Task**:
   - Click the "Delete" button

4. **Filter Tasks**:
   - Use the filter buttons to view All, Active, or Completed tasks

5. **Clear Completed**:
   - Click "Clear Completed Tasks" to remove all finished tasks

6. **Your tasks are saved automatically!** 💾

## 📁 File Structure

```
todo-app/
├── index.html      # HTML structure
├── styles.css      # Styling and animations
├─�� app.js          # JavaScript logic
├── README.md       # Documentation
└── LICENSE         # MIT License
```

## 💻 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, gradients, animations, and responsive design
- **JavaScript (ES6)**: Classes, arrow functions, and modern syntax
- **Local Storage API**: Browser-based data persistence

## 🎯 Key Features Breakdown

### Local Storage
- Automatically saves all tasks to browser storage
- Loads tasks automatically when you revisit the page
- No server or database required
- Tasks are stored under the key `todoAppTasks`

### Filter System
- **All**: Shows all tasks
- **Active**: Shows only incomplete tasks
- **Completed**: Shows only completed tasks

### Statistics
- Real-time counter for total tasks
- Counter for active (incomplete) tasks
- Counter for completed tasks

### Data Persistence
- Tasks survive browser refreshes
- Tasks persist across sessions
- Clear your browser data to reset

## 🛠️ Customization

### Change the Color Scheme
Edit the gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Try these color combinations:
- **Green**: `#667eea` → `#764ba2` (Current)
- **Orange**: `#FF6B6B` → `#FFD93D`
- **Blue**: `#4A90E2` → `#357ABD`
- **Purple**: `#9B59B6` → `#8E44AD`

### Change Storage Key
In `app.js`, modify the `storageKey`:
```javascript
this.storageKey = 'todoAppTasks'; // Change this
```

### Add More Features
Consider adding:
- Priority levels
- Due dates
- Categories/tags
- Export/import functionality
- Dark mode toggle
- Task search
- Notifications

## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Mobile browsers

## 🔐 Security

- HTML escaping prevents XSS attacks
- No external dependencies
- No data sent to servers
- 100% client-side processing

## 📝 Notes

- Task data is stored in `localStorage` with the key `todoAppTasks`
- Each task has:
  - `id`: Unique timestamp-based ID
  - `text`: The task description
  - `completed`: Boolean completion status
  - `createdAt`: ISO timestamp
- The app gracefully handles storage errors
- Maximum storage is typically 5-10MB per domain

## 🎓 Learning Resources

This project demonstrates:
- ES6 Classes and Object-Oriented Programming
- DOM manipulation and event handling
- Local Storage API usage
- Responsive web design
- CSS animations and transitions
- Data persistence patterns
- XSS prevention techniques

Perfect for learning web development fundamentals!

## 🤝 Contributing

Want to improve this project? Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Enjoy!

Start organizing your tasks today! 📋✨

---

**Made with ❤️ by tghhhhh**

For questions or suggestions, feel free to open an issue or reach out!
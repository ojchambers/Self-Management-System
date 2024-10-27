document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      editable: true,
      events: loadTasks(), // Load tasks from localStorage
      eventClick: function(info) {
        let taskId = info.event.id;
        
        if (confirm('Do you want to mark this task as completed?')) {
          completeTask(taskId, info.event);
        }
  
        if (confirm('Do you want to delete this task?')) {
          deleteTask(taskId, info.event);
        }
      },
    });
  
    calendar.render();
    synchronizeTaskList(); // Synchronize task list with calendar
    updateCompletedCount(); // Update completed tasks counter
  });
  
  function loadTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }
  
  function completeTask(id, calendarEvent) {
    let tasks = loadTasks();
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
    calendarEvent.setExtendedProp('completed', true);
    calendarEvent.setProp('editable', false);
    calendarEvent.setProp('backgroundColor', 'lightgrey');
    synchronizeTaskList();
    updateCompletedCount();
  }
  
  function deleteTask(id, calendarEvent) {
    let tasks = loadTasks().filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    calendarEvent.remove(); // Remove from calendar
    synchronizeTaskList();
    updateCompletedCount();
  }
  
  function synchronizeTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing list
    const tasks = loadTasks();
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.title;
      if (task.completed) {
        li.style.textDecoration = 'line-through';
        li.style.color = 'grey';
      }
      taskList.appendChild(li);
    });
  }
  
  function updateCompletedCount() {
    const tasks = loadTasks();
    const completedTasks = tasks.filter(task => task.completed).length;
    const completedCounter = document.getElementById('completedCount');
    completedCounter.textContent = `Completed Tasks: ${completedTasks}`;
  }
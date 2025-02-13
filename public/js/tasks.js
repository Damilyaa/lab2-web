async function loadTasks() {
    try {
        const response = await fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-content" id="task-content-${task._id}">
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
            </div>
            <div class="task-edit-form" id="task-edit-${task._id}" style="display: none;">
                <input type="text" 
                    id="edit-title-${task._id}" 
                    value="${task.title}" 
                    placeholder="Title">
                <input type="text" 
                    id="edit-description-${task._id}" 
                    value="${task.description || ''}" 
                    placeholder="Description">
                <div class="task-edit-buttons">
                    <button onclick="cancelEdit('${task._id}')" style="background: #6c757d;">Cancel</button>
                    <button onclick="saveTask('${task._id}')">Save</button>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="startEdit('${task._id}')" style="background: #28a745;">Edit</button>
                <button onclick="toggleTaskStatus('${task._id}', ${!task.completed})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="deleteTask('${task._id}')" style="background: #dc3545;">Delete</button>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

function startEdit(taskId) {
    document.getElementById(`task-content-${taskId}`).style.display = 'none';
    document.getElementById(`task-edit-${taskId}`).style.display = 'flex';
}

function cancelEdit(taskId) {
    document.getElementById(`task-content-${taskId}`).style.display = 'block';
    document.getElementById(`task-edit-${taskId}`).style.display = 'none';
}

async function saveTask(taskId) {
    const title = document.getElementById(`edit-title-${taskId}`).value;
    const description = document.getElementById(`edit-description-${taskId}`).value;

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            loadTasks();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task');
    }
}

async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function toggleTaskStatus(taskId, completed) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

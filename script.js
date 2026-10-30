document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskCourse = document.getElementById('taskCourse');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const taskSource = document.getElementById('taskSource');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Fitur: Pencet Enter di kotak tanggal langsung loncat ke kotak jam
    if (taskDate && taskTime) {
        taskDate.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                taskTime.focus();
            }
        });
    }

    // Fungsi untuk menghitung sisa waktu mundur (Countdown)
    function getCountdown(deadlineDateTime) {
        const targetTime = new Date(deadlineDateTime).getTime();
        const now = new Date().getTime();
        const timeLeft = targetTime - now;

        if (timeLeft < 0) {
            return '<span style="color: #e74c3c; font-weight: bold;">⏰ Deadline Telat / Sudah Lewat</span>';
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (days > 0) {
            return `⏳ Sisa waktu: ${days} hari ${hours} jam lagi`;
        } else {
            return `<span style="color: #e67e22; font-weight: bold;">⏳ Sisa waktu: ${hours}j ${minutes}m ${seconds}d lagi</span>`;
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: #555; padding: 10px;">Belum ada tugas. Yuk, tambah tugas baru! 🎉</p>';
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const countdownText = getCountdown(task.deadline);

            li.innerHTML = `
                <div>
                    <strong>${task.title}</strong> 
                    <span class="course-badge">${task.course}</span><br>
                    <small>📅 Deadline: ${task.deadline.replace('T', ' Jam ')} | 📌 ${task.source}</small><br>
                    <small style="display: inline-block; margin-top: 4px;">${countdownText}</small>
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})" style="cursor: pointer; transform: scale(1.2); margin-right: 10px;">
                    <button onclick="deleteTask(${index})" style="background-color: #e74c3c; padding: 5px 10px; font-size: 12px; border-radius: 4px; color: white; border: none; cursor: pointer;">Hapus</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // Tambah tugas baru
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            title: taskTitle.value,
            course: taskCourse.value,
            deadline: `${taskDate.value}T${taskTime.value}`, // Digabung otomatis tanggal dan jamnya
            source: taskSource.value,
            completed: false
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    renderTasks();

    // Jalankan update hitung mundur setiap 1 detik secara otomatis
    setInterval(renderTasks, 1000);
});
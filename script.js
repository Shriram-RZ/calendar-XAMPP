document.addEventListener('DOMContentLoaded', function () {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const currentMonthElem = document.getElementById('current-month');
    const calendar = document.querySelector('.calendar');
    const dayEventsPanel = document.getElementById('day-events-panel');
    const eventsList = document.getElementById('events-list');
    const noEventsMessage = document.getElementById('no-events-message');
    const selectedDayTitle = document.getElementById('selected-day-title');
    let eventsData = [];

    function generateCalendar(month, year) {
        calendar.innerHTML = ''; // Clear previous calendar
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();
        
        // Update current month display
        const options = { year: 'numeric', month: 'long' };
        currentMonthElem.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date(year, month));
        
        // Add blank days for the previous month
        for (let i = 0; i < firstDayIndex; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('blank');
            calendar.appendChild(blankDay);
        }

        // Add days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;

            // Highlight today's date
            if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                day.classList.add('today');
            }

            // Show events for the day
            const eventsForDay = eventsData.filter(event => new Date(event.start_date).getDate() === i && new Date(event.start_date).getMonth() === month && new Date(event.start_date).getFullYear() === year);
            if (eventsForDay.length > 0) {
                const eventIndicator = document.createElement('span');
                eventIndicator.classList.add('event-indicator');
                day.appendChild(eventIndicator);
            }

            day.onclick = () => showDayEvents(i, month, year);
            calendar.appendChild(day);
        }
    }

    function showDayEvents(day, month, year) {
        selectedDayTitle.textContent = `Events for ${day}-${month + 1}-${year}`;
        eventsList.innerHTML = ''; // Clear existing events list
        const eventsForDay = eventsData.filter(event => new Date(event.start_date).getDate() === day && new Date(event.start_date).getMonth() === month && new Date(event.start_date).getFullYear() === year);

        if (eventsForDay.length > 0) {
            noEventsMessage.style.display = 'none';
            eventsForDay.forEach(event => {
                const li = document.createElement('li');
                li.textContent = event.title;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = event.id;
                li.appendChild(checkbox);
                eventsList.appendChild(li);
            });
        } else {
            noEventsMessage.style.display = 'block';
        }

        dayEventsPanel.classList.add('open'); // Open the sliding panel
    }

    function closeDayEventsPanel() {
        dayEventsPanel.classList.remove('open');
    }

    document.getElementById('close-panel').onclick = closeDayEventsPanel;

    document.getElementById('prev-month').onclick = function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
        fetchEvents(); // Refresh events after changing month
    };

    document.getElementById('next-month').onclick = function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
        fetchEvents(); // Refresh events after changing month
    };

    document.getElementById('add-event-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('event-title').value;
        const description = document.getElementById('event-description').value;
        const startDate = document.getElementById('event-start-date').value;
        const endDate = document.getElementById('event-end-date').value;
        const startTime = document.getElementById('event-start-time').value;
        const endTime = document.getElementById('event-end-time').value;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);

        fetch('addevent.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Change to .text() for debugging
        .then(data => {
            console.log(data); // Log raw response for inspection
            try {
                const json = JSON.parse(data); // Parse manually
                alert(json.success ? "Event added!" : json.error);
            } catch (e) {
                console.error('Invalid JSON:', data);
            }
            document.getElementById('event-modal').style.display = 'none';
            fetchEvents(); // Refresh events after adding new one
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('add-event-btn').onclick = function () {
        document.getElementById('event-modal').style.display = 'block';
    };

    function fetchEvents() {
        fetch('fetchevents.php')
            .then(response => response.json())
            .then(data => {
                eventsData = data;
                generateCalendar(currentMonth, currentYear); // Refresh calendar with events
            })
            .catch(error => console.error('Error:', error));
    }

    document.getElementById('events-list').addEventListener('change', function (e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const checkedBoxes = document.querySelectorAll('#events-list input[type="checkbox"]:checked');
            document.getElementById('delete-events-btn').style.display = checkedBoxes.length > 0 ? 'inline-block' : 'none';
        }
    });

    document.getElementById('delete-events-btn').onclick = function () {
        const checkedBoxes = document.querySelectorAll('#events-list input[type="checkbox"]:checked');
        const idsToDelete = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        deleteEvents(idsToDelete);
    };

    function deleteEvents(ids) {
        const formData = new FormData();
        formData.append('ids', JSON.stringify(ids));

        fetch('deleteevents.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? "Events deleted!" : data.error);
            fetchEvents(); // Refresh events after deletion
        })
        .catch(error => console.error('Error:', error));
    }

    fetchEvents(); // Initial load of events
});

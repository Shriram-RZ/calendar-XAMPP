document.addEventListener('DOMContentLoaded', function () {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const currentMonthElem = document.getElementById('current-month');
    const calendarDays = document.querySelector('.calendar-days');
    const dayEventsPanel = document.getElementById('day-events-panel');
    const eventsList = document.getElementById('events-list');
    const noEventsMessage = document.getElementById('no-events-message');
    const selectedDayTitle = document.getElementById('selected-day-title');
    const eventModal = document.getElementById('event-modal');
    const closeModalButtons = document.querySelectorAll('.modal .close');
    let eventsData = [];
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    const clearIcon = document.getElementById('clear-search');
        
        clearIcon.addEventListener('click', () => {
            searchBar.value = '';
            searchBar.focus(); // Optionally refocus the search bar
        });
    

    function showSuggestions(events) {
        suggestionsContainer.innerHTML = '';
        if (events.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        events.forEach(event => {
            const suggestion = document.createElement('div');
            suggestion.textContent = `${event.title} (${new Date(event.start_date).toLocaleDateString()})`;
            suggestion.onclick = () => jumpToEvent(event);
            suggestionsContainer.appendChild(suggestion);
        });
        suggestionsContainer.style.display = 'block';
    }

    function fetchSuggestions(query) {
        fetch(`search_events.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                showSuggestions(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function jumpToEvent(event) {
        const eventDate = new Date(event.start_date);
        currentMonth = eventDate.getMonth();
        currentYear = eventDate.getFullYear();
        generateCalendar(currentMonth, currentYear, eventDate.getDate()); // Highlight the searched day
        fetchEvents(); // Refresh events after jumping to the date
        suggestionsContainer.style.display = 'none'; // Hide suggestions
    }

    searchBar.addEventListener('input', function () {
        const query = searchBar.value.trim();
        if (query.length > 0) {
            fetchSuggestions(query);
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchBtn.onclick = function () {
        const query = searchBar.value.trim();
        if (query.length > 0) {
            fetchSuggestions(query);
        }
    };

    function generateCalendar(month, year, highlightDay = null) {
        calendarDays.innerHTML = ''; // Clear previous calendar

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();

        // Update current month display
        const options = { year: 'numeric', month: 'long' };
        currentMonthElem.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date(year, month));

        // Add blank days for the previous month
        for (let i = 0; i < firstDayIndex; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('day', 'blank');
            calendarDays.appendChild(blankDay);
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

            // Highlight searched event day
            if (highlightDay !== null && i === highlightDay) {
                day.classList.add('selected');
            }

            // Show events for the day
            const eventsForDay = eventsData.filter(event => new Date(event.start_date).getDate() === i && new Date(event.start_date).getMonth() === month && new Date(event.start_date).getFullYear() === year);
            if (eventsForDay.length > 0) {
                const eventIndicator = document.createElement('span');
                eventIndicator.classList.add('event-indicator');
                day.appendChild(eventIndicator);
            }

            day.onclick = () => showDayEvents(i, month, year);
            calendarDays.appendChild(day);
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

    function closeModal() {
        eventModal.style.display = 'none';
    }

    function showSnackbar(message, success = true) {
        const snackbar = document.createElement('div');
        snackbar.classList.add('snackbar');
        snackbar.textContent = message;
        snackbar.style.backgroundColor = success ? '#4caf50' : '#f44336'; // Green for success, red for error
        document.body.appendChild(snackbar);

        setTimeout(() => {
            snackbar.classList.add('show');
            setTimeout(() => {
                snackbar.classList.remove('show');
                document.body.removeChild(snackbar);
            }, 3000); // Show for 3 seconds
        }, 100);
    }

    function handleModalClose(event) {
        if (event.target === eventModal || event.target === closeModalButtons[0]) {
            closeModal();
        }
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

    document.getElementById('navigate-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const monthInput = parseInt(document.getElementById('month-input').value);
        const yearInput = parseInt(document.getElementById('year-input').value);

        if (yearInput && monthInput !== null) {
            currentMonth = monthInput;
            currentYear = yearInput;
            generateCalendar(currentMonth, currentYear);
            fetchEvents(); // Refresh events after navigating to a specific month and year
        }
    });

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
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSnackbar("Event added!");
            } else {
                showSnackbar(data.error, false);
            }
            closeModal();
            fetchEvents(); // Refresh events after adding new one
        })
        .catch(error => {
            console.error('Error:', error);
            showSnackbar("Failed to add event", false);
        });
    });

    document.getElementById('add-event-btn').onclick = function () {
        eventModal.style.display = 'block';
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
            if (data.success) {
                showSnackbar("Events deleted!");
            } else {
                showSnackbar(data.error, false);
            }
            fetchEvents(); // Refresh events after deletion
        })
        .catch(error => {
            console.error('Error:', error);
            showSnackbar("Failed to delete events", false);
        });
    }

    // Attach event listener to close modal on outside click
    document.addEventListener('click', handleModalClose);

    // Fetch Events panel elements
    const fetchEventsBtn = document.getElementById('fetch-events-btn');
    const fetchEventsPanel = document.getElementById('fetch-events-panel');
    const allEventsList = document.getElementById('all-events-list');
    const noAllEventsMessage = document.getElementById('no-all-events-message');
    const closeFetchPanelBtn = document.getElementById('close-fetch-panel');

    // Fetch events and display in sliding panel
    fetchEventsBtn.onclick = function () {
        fetch('fetchevents.php')
            .then(response => response.json())
            .then(data => {
                allEventsList.innerHTML = ''; // Clear previous events
                if (data.length > 0) {
                    noAllEventsMessage.style.display = 'none';
                    data.forEach(event => {
                        const li = document.createElement('li');
                        li.className = 'styled-list-item';
                        li.textContent = `${event.title} (${new Date(event.start_date).toLocaleDateString()} - ${new Date(event.end_date).toLocaleDateString()})`;
                        allEventsList.appendChild(li);
                    });
                } else {
                    noAllEventsMessage.style.display = 'block';
                }
                fetchEventsPanel.classList.add('open'); // Open the sliding panel
            })
            .catch(error => console.error('Error:', error));
    };

    // Close the Fetch Events panel
    closeFetchPanelBtn.onclick = function () {
        fetchEventsPanel.classList.remove('open');
    };

    fetchEvents(); // Initial load of events
});

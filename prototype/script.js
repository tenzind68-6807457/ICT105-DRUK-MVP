/* ==========================================
   Smart Campus Event Hub
   script.js (Part 1)
========================================== */

// Sample Event Data
const seedEvents = [
  {
    id: "EV-001",
    eventName: "ICT Coding Workshop",
    eventCategory: "Workshop",
    location: "Building 6, Room 601",
    date: "2026-07-25",
    organizer: "ICT Department",
    description: "Learn web development fundamentals with practical coding activities.",
    status: "Open",
    contact: "ict@rsu.ac.th"
  },
  {
    id: "EV-002",
    eventName: "Career Fair 2026",
    eventCategory: "Career",
    location: "Main Auditorium",
    date: "2026-07-28",
    organizer: "Career Development Center",
    description: "Meet employers and explore internship and career opportunities.",
    status: "Open",
    contact: "career@rsu.ac.th"
  },
  {
    id: "EV-003",
    eventName: "International Student Orientation",
    eventCategory: "Orientation",
    location: "International College Hall",
    date: "2026-08-01",
    organizer: "International Office",
    description: "Orientation program for new international students.",
    status: "Registration Closed",
    contact: "international@rsu.ac.th"
  },
  {
    id: "EV-004",
    eventName: "Basketball Tournament",
    eventCategory: "Sports",
    location: "Sports Complex",
    date: "2026-08-05",
    organizer: "Sports Club",
    description: "Interfaculty basketball tournament for all students.",
    status: "Open",
    contact: "sports@rsu.ac.th"
  },
  {
    id: "EV-005",
    eventName: "Music Festival",
    eventCategory: "Entertainment",
    location: "Central Plaza",
    date: "2026-08-10",
    organizer: "Student Union",
    description: "Annual campus music festival featuring student bands.",
    status: "Open",
    contact: "union@rsu.ac.th"
  }
];


/* ==========================================
   Local Storage Functions
========================================== */

function loadEvents() {

    const saved = localStorage.getItem("smartCampusEvents");

    if(saved){
        return JSON.parse(saved);
    }

    localStorage.setItem(
        "smartCampusEvents",
        JSON.stringify(seedEvents)
    );

    return seedEvents;
}


function saveEvents(events){

    localStorage.setItem(
        "smartCampusEvents",
        JSON.stringify(events)
    );

}


/* ==========================================
   Generate Next Event ID
========================================== */

function nextEventID(events){

    return "EV-" +
        String(events.length + 1).padStart(3,"0");

}


/* ==========================================
   Dashboard Statistics
========================================== */

function renderDashboard(events){

    document.getElementById("totalEvents").textContent =
        events.length;

    document.getElementById("openEvents").textContent =
        events.filter(e=>e.status==="Open").length;

    document.getElementById("closedEvents").textContent =
        events.filter(e=>e.status==="Registration Closed").length;

    document.getElementById("workshops").textContent =
        events.filter(e=>e.eventCategory==="Workshop").length;

}

/* ==========================================
   Render Event List
========================================== */

function renderEvents() {

    const events = loadEvents();

    const search =
        document.getElementById("searchInput").value.toLowerCase();

    const category =
        document.getElementById("categoryFilter").value;

    const filtered = events.filter(event => {

        const text =
            `${event.eventName}
             ${event.location}
             ${event.organizer}
             ${event.description}
             ${event.eventCategory}`.toLowerCase();

        const matchSearch = text.includes(search);

        const matchCategory =
            category === "All" ||
            event.eventCategory === category;

        return matchSearch && matchCategory;

    });

    const list = document.getElementById("eventList");

    if(filtered.length === 0){

        list.innerHTML = `
            <p>No matching events found.</p>
        `;

    }else{

        list.innerHTML = filtered.map(event => `

            <article class="event-card">

                <div>

                    <h3>${event.eventName}</h3>

                    <p><strong>Category:</strong> ${event.eventCategory}</p>

                    <p><strong>Location:</strong> ${event.location}</p>

                    <p><strong>Date:</strong> ${event.date}</p>

                    <p><strong>Organizer:</strong> ${event.organizer}</p>

                    <span class="badge">${event.status}</span>

                </div>

                <br>

                <button
                    class="btn secondary"
                    onclick="showEvent('${event.id}')">

                    View Details

                </button>

            </article>

        `).join("");

    }

    renderDashboard(events);

}


/* ==========================================
   Show Event Details
========================================== */

function showEvent(id){

    const events = loadEvents();

    const event =
        events.find(e => e.id === id);

    if(!event) return;

    document.getElementById("detailContent").innerHTML = `

        <h2>${event.eventName}</h2>

        <p><strong>Event ID:</strong> ${event.id}</p>

        <p><strong>Category:</strong> ${event.eventCategory}</p>

        <p><strong>Organizer:</strong> ${event.organizer}</p>

        <p><strong>Location:</strong> ${event.location}</p>

        <p><strong>Date:</strong> ${event.date}</p>

        <p><strong>Status:</strong>
            <span class="badge">${event.status}</span>
        </p>

        <p>${event.description}</p>

        <p><strong>Contact:</strong> ${event.contact}</p>

    `;

    document
        .getElementById("detail")
        .scrollIntoView({
            behavior:"smooth"
        });

}

/* ==========================================
   Event Registration Form
========================================== */

function registerEvent(event){

    event.preventDefault();

    const events = loadEvents();

    const registration = {

        id: nextEventID(events),

        eventName:
            document.getElementById("eventName").value,

        eventCategory:
            document.getElementById("eventCategory").value,

        organizer:
            document.getElementById("organizer").value.trim(),

        location:
            document.getElementById("location").value.trim(),

        date:
            document.getElementById("eventDate").value,

        description:
            document.getElementById("description").value.trim(),

        contact:
            document.getElementById("contact").value.trim(),

        status: "Open"

    };


    // Validation

    if(

        registration.eventName === "" ||

        registration.eventCategory === "" ||

        registration.organizer === "" ||

        registration.location === "" ||

        registration.date === "" ||

        registration.description === "" ||

        registration.contact === ""

    ){

        document.getElementById("formMessage").innerHTML =
            "Please complete all required fields.";

        return;

    }


    events.push(registration);

    saveEvents(events);

    document.getElementById("eventForm").reset();

    document.getElementById("formMessage").innerHTML =

        `Event <strong>${registration.eventName}</strong>
         has been successfully submitted!`;

    renderEvents();

}


/* ==========================================
   Register Button
========================================== */

const form = document.getElementById("eventForm");

if(form){

    form.addEventListener("submit", registerEvent);

}

/* ==========================================
   Admin - Update Event Status
========================================== */

function updateEventStatus() {

    const eventId = document
        .getElementById("adminEventId")
        .value
        .trim()
        .toUpperCase();

    const newStatus =
        document.getElementById("adminStatus").value;

    const events = loadEvents();

    const index = events.findIndex(
        e => e.id === eventId
    );

    if (index === -1) {

        document.getElementById("adminMessage").innerHTML =
            "Event ID not found.";

        return;

    }

    events[index].status = newStatus;

    saveEvents(events);

    document.getElementById("adminMessage").innerHTML =
        `${eventId} has been updated to <strong>${newStatus}</strong>.`;

    renderEvents();

}


/* ==========================================
   Delete Event
========================================== */

function deleteEvent() {

    const eventId = document
        .getElementById("adminEventId")
        .value
        .trim()
        .toUpperCase();

    let events = loadEvents();

    const originalLength = events.length;

    events = events.filter(
        event => event.id !== eventId
    );

    if (events.length === originalLength) {

        document.getElementById("adminMessage").innerHTML =
            "Event ID not found.";

        return;

    }

    saveEvents(events);

    document.getElementById("adminMessage").innerHTML =
        `${eventId} has been deleted successfully.`;

    renderEvents();

}


/* ==========================================
   Dashboard Statistics Refresh
========================================== */

function refreshDashboard() {

    const events = loadEvents();

    renderDashboard(events);

}


/* ==========================================
   Event Listeners
========================================== */

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderEvents
    );

}

const categoryFilter =
    document.getElementById("categoryFilter");

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderEvents
    );

}

const updateButton =
    document.getElementById("updateStatusBtn");

if (updateButton) {

    updateButton.addEventListener(
        "click",
        updateEventStatus
    );

}

const deleteButton =
    document.getElementById("deleteEventBtn");

if (deleteButton) {

    deleteButton.addEventListener(
        "click",
        deleteEvent
    );

}


/* ==========================================
   Initial Page Load
========================================== */

window.onload = function () {

    renderEvents();

    refreshDashboard();

};

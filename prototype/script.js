const seedRecords = [
  {
    id: 'EV-001',
    eventType: 'Workshop',
    eventName: 'AI for Beginners',
    category: 'Technology',
    location: 'Building 11, Room 304',
    date: '2026-07-20',
    description: 'Introduction to Artificial Intelligence for first-year students.',
    status: 'Open',
    organizer: 'ICT Club'
  },
  {
    id: 'EV-002',
    eventType: 'Seminar',
    eventName: 'Career Development Talk',
    category: 'Career',
    location: 'Auditorium',
    date: '2026-07-22',
    description: 'Guest speakers share career preparation tips.',
    status: 'Open',
    organizer: 'Career Center'
  },
  {
    id: 'EV-003',
    eventType: 'Sports',
    eventName: 'Football Tournament',
    category: 'Sports',
    location: 'Football Field',
    date: '2026-07-24',
    description: 'Inter-faculty football competition.',
    status: 'Closed',
    organizer: 'Sports Club'
  },
  {
    id: 'EV-004',
    eventType: 'Cultural',
    eventName: 'International Food Festival',
    category: 'Culture',
    location: 'Student Plaza',
    date: '2026-07-26',
    description: 'Students showcase food from different countries.',
    status: 'Open',
    organizer: 'International Office'
  }
];

function loadRecords() {
  const saved = localStorage.getItem('smartCampusEvents');
  if (saved) return JSON.parse(saved);

  localStorage.setItem('smartCampusEvents', JSON.stringify(seedRecords));
  return seedRecords;
}

function saveRecords(records) {
  localStorage.setItem('smartCampusEvents', JSON.stringify(records));
}

function nextId(records) {
  return 'EV-' + String(records.length + 1).padStart(3, '0');
}

function renderDashboard(records) {
  document.getElementById('totalRecords').textContent = records.length;
  document.getElementById('openRecords').textContent =
    records.filter(r => r.status === 'Open').length;
  document.getElementById('closedRecords').textContent =
    records.filter(r => r.status === 'Closed').length;
  document.getElementById('workshopRecords').textContent =
    records.filter(r => r.eventType === 'Workshop').length;
}

function renderRecords() {

  const records = loadRecords();

  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const category = document.getElementById('categoryFilter').value;

  const filtered = records.filter(r => {

    const text =
      `${r.eventName} ${r.location} ${r.description} ${r.category}`
      .toLowerCase();

    const matchesText = text.includes(search);
    const matchesStatus = status === 'All' || r.status === status;
    const matchesCategory = category === 'All' || r.category === category;

    return matchesText && matchesStatus && matchesCategory;

  });

  const list = document.getElementById('recordList');

  list.innerHTML = filtered.map(r => `
    <article class="record">

      <div>

        <strong>${r.id} - ${r.eventName}</strong><br>

        <span class="badge">${r.eventType}</span>
        <span class="badge">${r.category}</span>
        <span class="badge">${r.status}</span>

        <p>${r.location} | ${r.date}</p>

      </div>

      <button class="btn secondary"
      onclick="showDetail('${r.id}')">
      View Details
      </button>

    </article>

  `).join('') || '<p>No events found.</p>';

  renderDashboard(records);

}

function showDetail(id) {

  const records = loadRecords();

  const r = records.find(event => event.id === id);

  if (!r) return;

  document.getElementById('detailContent').innerHTML = `

    <h3>${r.eventName}</h3>

    <p><strong>Event ID:</strong> ${r.id}</p>

    <p><strong>Type:</strong> ${r.eventType}</p>

    <p><strong>Category:</strong> ${r.category}</p>

    <p><strong>Location:</strong> ${r.location}</p>

    <p><strong>Date:</strong> ${r.date}</p>

    <p><strong>Description:</strong> ${r.description}</p>

    <p><strong>Status:</strong>
    <span class="badge">${r.status}</span></p>

    <p><strong>Organizer:</strong> ${r.organizer}</p>

  `;

  document.getElementById('detail').scrollIntoView({
    behavior: 'smooth'
  });

}

function handleSubmit(event) {

  event.preventDefault();

  const records = loadRecords();

  const record = {

    id: nextId(records),

    eventType:
      document.getElementById('eventType').value,

    category:
      document.getElementById('category').value,

    eventName:
      document.getElementById('eventName').value.trim(),

    location:
      document.getElementById('location').value.trim(),

    description:
      document.getElementById('description').value.trim(),

    organizer:
      document.getElementById('organizer').value.trim(),

    date:
      document.getElementById('eventDate').value,

    status: 'Open'

  };

  if (
      !record.eventType ||
      !record.category ||
      !record.eventName ||
      !record.location ||
      !record.description ||
      !record.organizer ||
      !record.date
  ) {

      document.getElementById('formMessage').textContent =
      'Please complete all required fields.';

      return;

  }

  records.push(record);

  saveRecords(records);

  document.getElementById('itemForm').reset();

  document.getElementById('formMessage').textContent =
  `Event created successfully. Event ID: ${record.id}`;

  renderRecords();

}

function updateStatus() {

  const id =
    document.getElementById('adminRecordId')
    .value
    .trim()
    .toUpperCase();

  const newStatus =
    document.getElementById('adminStatus').value;

  const records = loadRecords();

  const index = records.findIndex(r => r.id === id);

  if (index === -1) {

    document.getElementById('adminMessage').textContent =
    'Event ID not found.';

    return;

  }

  records[index].status = newStatus;

  saveRecords(records);

  document.getElementById('adminMessage').textContent =
  `${id} status updated to ${newStatus}.`;

  renderRecords();

}

document.getElementById('itemForm').addEventListener('submit', handleSubmit);

document.getElementById('updateStatusBtn').addEventListener('click', updateStatus);

document.getElementById('searchInput').addEventListener('input', renderRecords);

document.getElementById('statusFilter').addEventListener('change', renderRecords);

document.getElementById('categoryFilter').addEventListener('change', renderRecords);

renderRecords();

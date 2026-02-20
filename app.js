const apiBaseUrlEl = document.getElementById('apiBaseUrl');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');
const countriesList = document.getElementById('countriesList');
const statesList = document.getElementById('statesList');
const citiesList = document.getElementById('citiesList');

function setStatus(txt, isError = false) {
  statusEl.textContent = txt;
  statusEl.classList.toggle('error', isError);
}

async function fetchJson(base, path) {
  const url = base.replace(/\/+$/, '') + path; 
  console.log('Fetching', url);
  const res = await fetch(url, {mode: 'cors'});
  console.log('Response', res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error('Non-OK response body:', text);
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

function clearLists() {
  countriesList.innerHTML = '';
  statesList.innerHTML = '';
  citiesList.innerHTML = '';
}

function renderList(el, data) {
  if (!data || data.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No data found.';
    el.appendChild(li);
    return;
  }
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = (item && item.name) ? item.name : JSON.stringify(item);
    el.appendChild(li);
  });
}

loadBtn.addEventListener('click', async () => {
  const base = apiBaseUrlEl.value || 'http://127.0.0.1:5005';
  setStatus('Loading...');
  loadBtn.disabled = true;
  clearLists();

  try {
    const [countries, states, cities] = await Promise.all([
      fetchJson(base, '/countries/'), 
      fetchJson(base, '/states'),
      fetchJson(base, '/cities')
    ]);

    console.log({countries, states, cities});
    renderList(countriesList, countries);
    renderList(statesList, states);
    renderList(citiesList, cities);
    setStatus('Data loaded successfully!');
  } catch (e) {
    console.error('Fetch error:', e);
    setStatus('Error loading data: ' + e.message, true);
  } finally {
    loadBtn.disabled = false;
  }
});

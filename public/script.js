// Utility to log messages
function appendMessage(text) {
    const container = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
}

// Determine WebSocket protocol based on current page
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${window.location.host}`);

ws.onopen = () => {
    document.getElementById('status').textContent = 'WebSocket connected';
};

ws.onmessage = (event) => {
    // Append incoming messages to display
    appendMessage(event.data);
};

ws.onclose = () => {
    document.getElementById('status').textContent = 'WebSocket disconnected';
};

ws.onerror = (err) => {
    console.error('WebSocket error', err);
};

// Send slider updates
const slider = document.getElementById('slider');
slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value).toFixed(2);
    document.getElementById('sliderValue').textContent = value;
    const payload = JSON.stringify({ type: 'slider', value });
    ws.send(payload);
});

// Send color updates
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (e) => {
    const payload = JSON.stringify({ type: 'color', value: e.target.value });
    ws.send(payload);
});

// Send text messages
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    const input = document.getElementById('textInput');
    const message = input.value.trim();
    if (message) {
        const payload = JSON.stringify({ type: 'text', value: message });
        ws.send(payload);
        input.value = '';
    }
});
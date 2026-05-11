// Connect to EMQX public MQTT broker over secure WebSockets
const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

// When connected
client.on("connect", () => {
    console.log("Connected to MQTT broker");

    // Subscribe to all room status topics
    client.subscribe("home/lights/+/status");
});

// If something goes wrong
client.on("error", (err) => {
    console.error("MQTT connection error:", err);
});

// Get UI elements
const lrToggle = document.getElementById("lr-toggle");
const brToggle = document.getElementById("br-toggle");
const clToggle = document.getElementById("cl-toggle");

// Helper to publish commands
function sendCommand(room, isOn) {
    const topic = `home/lights/${room}/set`;
    const payload = isOn ? "ON" : "OFF";
    client.publish(topic, payload);
    console.log(`Sent: ${topic} = ${payload}`);
}

// Event listeners for toggles
lrToggle.addEventListener("change", () => {
    sendCommand("livingroom", lrToggle.checked);
});

brToggle.addEventListener("change", () => {
    sendCommand("bathroom", brToggle.checked);
});

clToggle.addEventListener("change", () => {
    sendCommand("closet", clToggle.checked);
});

// Status text elements
const lrStatus = document.getElementById("lr-status");
const brStatus = document.getElementById("br-status");
const clStatus = document.getElementById("cl-status");

// Handle incoming MQTT messages
client.on("message", (topic, message) => {
    const payload = message.toString(); // "ON" or "OFF"

    // Topic format: home/lights/<room>/status
    const parts = topic.split("/");
    const room = parts[2]; // livingroom, bathroom, closet

    const isOn = (payload === "ON");

    if (room === "livingroom") {
        lrToggle.checked = isOn;
        lrStatus.textContent = payload;
    }

    if (room === "bathroom") {
        brToggle.checked = isOn;
        brStatus.textContent = payload;
    }

    if (room === "closet") {
        clToggle.checked = isOn;
        clStatus.textContent = payload;
    }

    console.log(`Status update: ${room} = ${payload}`);
});

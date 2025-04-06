// static/js/car_control.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const carSelect = document.getElementById('car-select');
    const powerToggle = document.getElementById('car-power');
    const messageRateInput = document.getElementById('message-rate');
    const controlsContainer = document.getElementById('controls-container');
    const statusMessage = document.getElementById('status-message');
    const lastCommand = document.getElementById('last-command');
    const controlButtons = document.querySelectorAll('.control-btn');

    // State
    let isPoweredOn = false;
    let isCommandActive = false;
    let activeCommand = null;
    let commandInterval = null;
    let messageRate = parseInt(messageRateInput.value);

    // Event Listeners
    powerToggle.addEventListener('change', handlePowerToggle);
    messageRateInput.addEventListener('change', handleRateChange);
    carSelect.addEventListener('change', handleCarChange);

    // Setup control buttons with touch/mouse events for continuous sending
    controlButtons.forEach(button => {
        // Mouse events
        button.addEventListener('mousedown', startCommand);

        // Touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            startCommand(e);
        });
    });

    // Global document events to stop commands
    document.addEventListener('mouseup', stopCommand);
    document.addEventListener('touchend', stopCommand);

    // Functions
    function handlePowerToggle(e) {
        isPoweredOn = e.target.checked;

        if (isPoweredOn) {
            sendMQTTCommand('Publish', getSelectedCar(), 'ON', 'At most once');
            statusMessage.textContent = 'Car powered ON';
            enableControls();
        } else {
            sendMQTTCommand('Publish', getSelectedCar(), 'OFF', 'At most once');
            statusMessage.textContent = 'Car powered OFF';
            disableControls();
            stopCommand();
        }
    }

    function handleRateChange(e) {
        messageRate = parseInt(e.target.value);

        // If a command is currently active, update the interval
        if (isCommandActive && commandInterval) {
            clearInterval(commandInterval);
            sendCommandContinuously(activeCommand);
        }
    }

    function handleCarChange() {
        // Reset power state when car changes
        if (isPoweredOn) {
            sendMQTTCommand('Publish', getSelectedCar(), 'ON', 'At most once');
            statusMessage.textContent = `Connected to ${getSelectedCar()}`;
        }
    }

    function startCommand(e) {
        if (!isPoweredOn) return;

        // Get the target button or find it from the touch event
        const target = e.target.closest('.control-btn');
        if (!target) return;

        const command = target.dataset.command;
        activeCommand = command;
        isCommandActive = true;

        // Update UI
        lastCommand.textContent = `Sending: ${command}`;
        target.classList.add('active');

        // Send immediately and then start interval
        sendMQTTCommand('Publish', getSelectedCar(), command, 'At most once');
        sendCommandContinuously(command);
    }

    function stopCommand() {
        if (!isCommandActive) return;

        isCommandActive = false;
        clearInterval(commandInterval);
        commandInterval = null;

        // Update UI
        document.querySelectorAll('.control-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });

        lastCommand.textContent = 'Command stopped';

        // Send stop command (optional)
        sendMQTTCommand('Publish', getSelectedCar(), 'STOP', 'At most once');
    }

    function sendCommandContinuously(command) {
        // Clear existing interval if any
        if (commandInterval) {
            clearInterval(commandInterval);
        }

        // Create new interval based on current message rate
        commandInterval = setInterval(() => {
            sendMQTTCommand('Publish', getSelectedCar(), command, 'At most once');
        }, messageRate);
    }

    function getSelectedCar() {
        return carSelect.value;
    }

    function enableControls() {
        controlButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });
        controlsContainer.classList.remove('disabled');
    }

    function disableControls() {
        controlButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });
        controlsContainer.classList.add('disabled');
    }

    function sendMQTTCommand(operation, topic, payload, qos) {
        // Create AJAX request to send MQTT command
        fetch('/send_command', {  // Changed from '/send_mqtt_command' to '/send_command'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: operation,  // Changed from 'operation' to 'type' to match Flask route
                topic: topic,
                message: payload,  // Changed from 'payload' to 'message' to match Flask route
                qos: qos
            })
        })
        .then(response => response.json())
        .then(data => {
            // Updated to match the response format from your Flask endpoint
            if (data.status !== 'success') {
                console.error('MQTT command failed:', data.message);
                statusMessage.textContent = `Error: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error sending MQTT command:', error);
            statusMessage.textContent = 'Connection error';
        });
    }

    // Initialize - disable controls on load
    disableControls();
});
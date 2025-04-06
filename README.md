# 🚦 MQTT Controller Web App

A web-based interface built with **Flask** and **paho-mqtt (MQTTv5)** to control simulated **cars** and **traffic lights** via MQTT messaging.

This project uses multiprocessing to run an MQTT client in a separate process and allows sending commands from a control panel UI.

---

## 👥 Authors

**Andreea** and **Emanuel**

---

## 🧩 Features

- User login system with session management
- MQTTv5 client powered by `paho-mqtt`
- Separate MQTT client process using Python `multiprocessing`
- Control panel to manage:
  - Cars (Car_1, Car_2, etc.)
  - Traffic lights (TrafficLight_1, etc.)
- Real-time command dispatch via MQTT topics
- Clean Flask-based UI using HTML templates

---

## 🚀 How It Works

1. User logs in with credentials (used for MQTT authentication).
2. MQTT client starts in a separate process and connects to the broker.
3. User navigates to the control panel to interact with devices.
4. Commands (e.g., move car, toggle traffic light) are sent to MQTT topics with specified QoS levels.
5. Logout stops the MQTT client process and clears the session.

---

## 💠 Setup Instructions

### 1. Install Dependencies

```bash
pip install flask paho-mqtt
```

### 2. Set Up Environment

Ensure your MQTT broker is running (tested with IP `10.105.47.73` and port `5050`, but you can update this in the `start_mqtt_client` function).

---

### 3. Run the App

```bash
python app.py
```

Then open your browser at:  
**http://localhost:5000**

---

## 📁 Project Structure

```
.
├── static/                  # Static assets (CSS, JS, images)
├── templates/               # HTML templates (login.html, control_panel.html, etc.)
├── app.py                   # Main Flask application with MQTT controller
├── README.md
```

---

## 🔒 MQTT Details

- MQTT version: 5
- Authentication: Username & Password
- QoS Support:
  - 0: At most once
  - 1: At least once
  - 2: Exactly once

---

## 🧹 Cleanup

The MQTT client process is gracefully stopped:
- When the user logs out
- On app shutdown (`finally` block)

---

## 📌 Notes

- This project is for simulation and control UI purposes.
- You can adapt the MQTT topics and control logic to your real IoT setup.

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/97fb2a9b-95e6-48b5-b2cc-d30d5fa4a46b)

![image](https://github.com/user-attachments/assets/ae59d7e3-fcea-4560-b341-ae51be53f916)

![image](https://github.com/user-attachments/assets/3b0a6cd9-27e1-457d-b327-221252734a39)

![image](https://github.com/user-attachments/assets/306ef4a9-a08c-4e81-96d6-4e23351445d1)




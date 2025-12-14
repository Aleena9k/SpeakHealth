# 🗣️ SpeakSpace — Voice‑Driven Medical Assistant
SpeakSpace is a health‑tech platform that converts patient speech → medical summaries, extracts symptoms, recommends probable conditions (non‑diagnostic), and generates research insights.
Built for doctors, clinics, and hackathons to streamline patient intake using voice + AI.
# 🏁 Table Of Contents
- [SpeakSpace-Voice‑Driven Medical Assistant](#speakspace-voice‑driven-medical-assistant)
- [Setup Instructions](#setup-instructions)
- [How Judges Can Test](#how-judges-can-test)
- [API Endpoint URL & Authorization](#api-endpoint-url-&-endpoint)
- [SpeakSpace Action Configuration](#speakspace-action-configuration)

# 🔧 Setup Instructions
## 1.  Install Dependencies

This project uses the following key packages:

- @notionhq/client — Notion API integration
- @google/generative-ai — integrate AI capabilities 
- axios — HTTP requests  
- child_process — System commands (audio handling)  
- cors — CORS support  
- dayjs — Date/time utilities  
- docx — Generate .docx reports  
- dotenv — Environment variables  
- express — Core backend framework  
- fluent-ffmpeg — Audio format conversion  
- fs / fs-extra — File system handling  
- googleapis — Google Docs / Drive API integration  
- multer — File uploads  
- vosk — Offline speech-to-text engine  
- wav — WAV audio parsing


### 👉 Install everything with:
```
npm install
```

## 2. Environment Variables (.env)
```
PORT = 5001

# Google Gemini Key
GEMINI_API_KEY = your_secret_key

#Serper Key
SERPER_API_KEY = your_secret_key

#Notion keys
NOTION_API_KEY = your_secret_key
NOTION_DATABASE_ID =  your_secret_key (32 characters of URL)

```
### 3. ▶️ Run the Project
```
node server.js
```
Server starts at:
```
http://localhost:5001
```
## 🧪 How Judges Can Test (Deployment Guide)
Follow these simple steps to test the full workflow end‑to‑end:
### 1️⃣ Upload a Voice Recording
Prepare any short patient-style audio file (.mp3 or .wav) describing symptoms.
Example:
```
“I’ve been having headaches, mild fever, and a sore throat since yesterday.”
```
### 2️⃣ Send a Request to the Full Workflow Endpoint
Use Postman, Thunder Client, or cURL.
**Endpoint:**
```
POST /api/full-health
```
**Content-Type:**
*multipart/form-data*

**Body feilds:**
*audio: (your audio file)*

### 3️⃣ Verify the API Response
A successful run will return a JSON object that includes:
- Successful json response on postman
  ```
  {
    "status": "success",
    "message": "Workflow executed"
  }
  
- A google docs in local system

 ```
  {
  "transcript" : "....",
  "Extracted Symptoms" : "....",
  "Clinical Summary" : "....",
  "Probable Conditions" : "....",
  "Research References" : "...."
  }
```

- Notion Database
  
```
{
"PatientID" : "with clinical summanry",
"Visit Date" : "....",
"Status" : "...."
}
```

### 4️⃣ Check the Generated DOCX Report
The backend automatically creates a downloadable patient health report (.docx) in your project’s output directory.

### 5️⃣ Check the Notion Integration
A new entry is added to the Notion database.

## 🌐 API Endpoint URL & Authorization
**Endpoint**

```
POST /api/full-health
```

**Base URL**

```
https://<your-deployed-domain>
```

### Authorization
This API does not require user authentication for hackathon/demo purposes.

### Request Headers

```
Content-Type: multipart/form-data
```

### Sample Postman Request

```
curl -X POST https://localhost:5001/api/full-health \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@patient_audio.wav"
```

### Success Response

```
{
  "status": "success",
  "message": "Workflow executed"
}
```

### Error Response

```
{
  "status": "error",
  "message": "Failed to process full health check."
}

```

## 📘 SpeakSpace Action Configuration (Copy-Paste Ready)

```
{
  "name": "Full Health Check",
  "description": "Processes patient voice input to generate a clinical health summary.",
  "endpoint": "https://<your-deployed-url>/api/full-health",
  "method": "POST",
  "headers": {
    "Content-Type": "multipart/form-data"
  },
  "body": {
    "audio": "{{user_audio}}"
  },
  "response": {
    "type": "json",
    "success_key": "status"
  }
}
```

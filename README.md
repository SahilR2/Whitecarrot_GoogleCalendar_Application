# Google Calendar Events Web Application

This project allows users to log in using **Google Single Sign-On (SSO)** and view their Google Calendar events in a table. Users can also filter events by date and log out securely.

![Login_page](https://github.com/user-attachments/assets/94770a6e-40d5-471c-8c62-3f76bc76a203)

![Events Table](https://github.com/user-attachments/assets/e7ae1f01-0493-4b8b-bb2e-131bc0eff543)


---

## **Features**
- **Google SSO Login**: Authenticate users using Google OAuth2.
- **View Calendar Events**: Fetch and display events from the user's Google Calendar.
- **Filter Events by Date**: Filter events for a specific date.
- **Logout Functionality**: Securely log out and clear the session.
- **Smooth Animations**: Built with **Framer Motion** for a polished user experience.

---

## **Technologies**
- **Frontend**: React.js, Framer Motion, Axios, CSS, date-fns
- **Backend**: Node.js, Express, Passport.js, Google APIs, CORS, Express-Session
- **Authentication**: Google OAuth2
- **Environment Management**: Dotenv

---

## **Google Cloud Platform (GCP) Setup**

To enable Google OAuth2 and Google Calendar API, follow these steps:

### **Step 1: Create a Project**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown and select **New Project**.
3. Enter a project name (e.g., `New Project`) and click **Create**.

### **Step 2: Enable APIs**
1. Navigate to **APIs & Services > Library**.
2. Search for and enable the following APIs:
   - **Google Calendar API**
   - **Google OAuth2 API**

### **Step 3: Create OAuth2 Credentials**
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials** and select **OAuth client ID**.
3. Configure the OAuth consent screen:
   - Select **External** as the user type.
   - Fill in the required fields (e.g., app name, support email).
   - Add your email under **Test Users**.
4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5000/auth/google/callback
   ```
6. Click **Save** and then **Create**.
7. Save the **Client ID** and **Client Secret** for use in your `.env` file.

---

## **Environment Variables**

Create a `.env` file in the `backend` directory with the following variables:

```plaintext
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
REDIRECT_URI=http://localhost:5000/auth/google/callback
```

Replace `your_client_id`, `your_client_secret`, and `your_session_secret` with the values from GCP and your own session secret.

---

## **How to Run the Project**

### **Backend**
1. Navigate to the `app_backend`:
   ```bash
   cd app_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
   - The backend will run on `http://localhost:5000`.

### **Frontend**
1. Navigate to the `app_frontend`:
   ```bash
   cd app_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   - The frontend will run on `http://localhost:3000`.

---

## **Endpoints**

### **Backend**
- **Google OAuth2 Login**:
  - `GET /auth/google`: Initiates Google OAuth2 login.
  - `GET /auth/google/callback`: Handles the OAuth2 callback.
- **Check Login Status**:
  - `GET /api/auth/status`: Returns the user's authentication status.
- **Fetch Calendar Events**:
  - `GET /api/events`: Fetches calendar events for the authenticated user.
- **Logout**:
  - `GET /logout`: Logs out the user and clears the session.

---

## **File Structure**

### **Frontend**
```

app_frontend/src/
├── App.js               # Main component
├── App.css              # Styling for the app
├── index.js             # Entry point
└── index.css            # Global styles
```

### **Backend**
```
app_backend/
├── index.js            # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

---

## **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

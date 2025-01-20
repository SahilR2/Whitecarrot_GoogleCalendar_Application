// Here i'm using passportjs for secure authentications and sessions, google apis for fetching calendar events

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const Google_Strategy = require('passport-google-oauth20').Strategy;
const { google } = require("googleapis");
const cors = require('cors');

const app = express();

app.use(session({
    secret : process.env.SESSION,
    resave : false,
    saveUninitialized : true
})
);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true  
}));

app.use(passport.initialize());
app.use(passport.session()); // taki express session integrate hojaye



passport.use(
    new Google_Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        
        const user = {
          id: profile.id,
          displayName: profile.displayName,
          accessToken, 
        };
        return done(null, user);
      }
    )
  );



passport.serializeUser((user,done)=> done(null,user)); // serialize : saving the users data inside the session (as we want to use the user data for calendar)
passport.deserializeUser((user,done)=> done(null,user));//deserialize : retreiving the users data when needed



app.get("/auth/google",
    passport.authenticate("google",{
        scope : ["profile","email","https://www.googleapis.com/auth/calendar.readonly"],
    })
);

// This is just for authentication here and what else it can do :)
app.get("/api/auth/status", (req, res) => {
    res.json({ 
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  });


app.get("/auth/google/callback",
    passport.authenticate("google", {failureRedirect : "/"}),
    (req, res) => {
        res.redirect("http://localhost:3000"); 
    }
);


app.get("/api/events", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { date } = req.query;
  console.log("Filter Date (Backend):", date); 

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: req.user.accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: date ? new Date(date).toISOString() : new Date().toISOString(), 
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items.map((event) => ({
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
      location: event.location || "No location",
    }));

    res.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});


 
app.get("/logout", (req, res) => {
    //i used passport logOut which logouts the user and route it to base url but then for err logging im using this 
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Error logging out" });
      }
      res.json({ success: true });
    });
});
 

app.listen(5000, ()=>{
    console.log("Server is listening on Port:5000");  
});

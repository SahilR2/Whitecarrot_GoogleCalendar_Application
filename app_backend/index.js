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
    secret : "77c073843ab7da94807bcb84c6a0ad6ae94d58413a0dfb9adf5e886ad68c3e7a19ea3581f961fe6461405991325234e5c3994b067cdd99fe59b40791dfb0a7ac54d063d3f801427c1dc6e19a0ae75ced028c034520c5bd66bf2667ccecff5bfd69ff0f91641997b1673722c073f56ea6edf72a12397efe03fd944522330570",//process.env.SESSION,
    resave : false,
    saveUninitialized : true
})
);

app.use(cors({
    origin: "https://whitecarrot-google-calendar-application.vercel.app",
    credentials: true  
})); //most imp else i got error

app.use(passport.initialize());
app.use(passport.session()); // taki express session integrate hojaye



passport.use(
    new Google_Strategy(
      {
        clientID: "527040000924-t7cuvb8tg7u1cflme0lc8dl4kuuve9vi.apps.googleusercontent.com",//process.env.GOOGLE_CLIENT_ID,
        clientSecret: "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",//process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "hhttps://whitecarrot-googlecalendar-application-1.onrender.com/auth/google/callback",
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
        res.redirect("https://whitecarrot-google-calendar-application.vercel.app"); 
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

    let events = response.data.items.map((event) => ({
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
      location: event.location || "No location",
    }));

    if (date) {
      const filterDateObj = new Date(date);
      events = events.filter((event) => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        return (
          eventDate.getFullYear() === filterDateObj.getFullYear() &&
          eventDate.getMonth() === filterDateObj.getMonth() &&
          eventDate.getDate() === filterDateObj.getDate()
        );
      });
    }


    res.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});


 
app.get("/logout", (req, res) => {
    //i used passport logOut previously which logouts the user and route it to base url but then for err logging im using older method 
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
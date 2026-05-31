const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const EventSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  events: {
    type: String,
    required: true,
  },
});

const SchoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  programName: {
    type: String,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  teamNames: {
    type: [TeamSchema],
    default: [],
  },
  eventLog: {
    type: [[EventSchema]],
    default: [],
  },
});

const DatabaseSchema = new mongoose.Schema({
  users: {
    type: [UserSchema],
    default: [],
  },
  schools: {
    type: [SchoolSchema],
    default: [],
  },
});

let data;

mongoose
  .connect("mongodb+srv://NandhaPG:123@nandha.7qpquh8.mongodb.net/entercon?appName=nandha")
  .then((res) => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const entercon = mongoose.model("entercon", DatabaseSchema, "entercon");

entercon
  .find()
  .then((s) => {
    data = s;
  })
  .catch((err) => console.log(err));

app.get("/add-users", async (req, res) => {
  try {
    const { username, role, password } = req.query;

    const db = await entercon.findOne();

    db.users.push({
      name: username,
      role,
      password
    });

    await db.save();

    res.send(db.users);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/update-users", async (req, res) => {
  try {
    const { name, password, role, i } = req.query;

    const db = await entercon.findOne();

    if (!db) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    const index = Number(i);

    if (
      isNaN(index) ||
      index < 0 ||
      index >= db.users.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user index",
      });
    }

    db.users[index].name = name;
    db.users[index].password = password;
    db.users[index].role = role;

    await db.save();

    res.send(db.users);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/delete-users", async (req, res) => {
  try {
    const { i } = req.query;

    const db = await entercon.findOne();

    db.users.splice(Number(i), 1);

    await db.save();

    res.send(db.users);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/update-school", async (req, res) => {
  try {
    const {
      i,
      schoolName,
      programName,
      numberOfDays,
      participants,
      startDate,
      endDate,
      selectedTeams,
    } = req.query;

    const db = await entercon.findOne();

    if (!db) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    const index = Number(i);

    if (
      isNaN(index) ||
      index < 0 ||
      index >= db.schools.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid school index",
      });
    }

    const oldSchool = db.schools[index];

    // Keep existing event log
    const eventLog = oldSchool.eventLog;

    // Keep scores for existing teams, new teams start with 0
    const teamNames = selectedTeams.split(",").map((team) => ({
      name: team,
      score:
        oldSchool.teamNames.find((t) => t.name === team)?.score || 0,
    }));

    db.schools[index].schoolName = schoolName;
    db.schools[index].programName = programName;
    db.schools[index].numberOfDays = Number(numberOfDays);
    db.schools[index].participants = Number(participants);
    db.schools[index].startDate = startDate;
    db.schools[index].endDate = endDate;
    db.schools[index].teamNames = teamNames;
    db.schools[index].eventLog = eventLog;

    await db.save();

    res.send(db.schools);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/add-school", async (req, res) => {
  try {
    const db = await entercon.findOne();

    let teamNames = [];

    for (let i = 0; i < req.query.selectedTeams.split(",").length; i++) {
      teamNames.push({
        name: req.query.selectedTeams.split(",")[i],
        score: 0,
      });
    }

    let numberOfDays = Number(req.query.numberOfDays);

    let eventLog = [];

    for (let i = 0; i < numberOfDays; i++) {
      eventLog.push([]);
    }

    const entry = {
      schoolName: req.query.schoolName,
      programName: req.query.programName,
      numberOfDays: numberOfDays,
      participants: Number(req.query.participants),
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      teamNames,
      eventLog,
    };

    db.schools.push(entry);

    await db.save();

    res.send(db.schools);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/delete-school", async (req, res) => {
  try {
    const { i } = req.query;

    const db = await entercon.findOne();

    if (!db) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    const index = Number(i);

    if (
      isNaN(index) ||
      index < 0 ||
      index >= db.schools.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid school index",
      });
    }

    db.schools.splice(index, 1);

    await db.save();

    res.send(db.schools);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/add-points", async (req, res) => {
  try {
    const dayIndex = Number(req.query.dayIndex);
    const teamName = req.query.teamName;
    const points = Number(req.query.points);
    const event = req.query.event;
    const time = req.query.time;
    const schoolIndex = Number(req.query.schoolIndex);

    const db = await entercon.findOne();

    if (!db) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    const school = db.schools[schoolIndex];

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Add event to the selected day
    school.eventLog[dayIndex].push({
      time,
      team: teamName,
      points,
      events: event,
    });

    // Update team score
    const team = school.teamNames.find(
      (t) => t.name === teamName
    );

    if (team) {
      team.score += points;
    }

    await db.save();

    res.send(db.schools);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/undo-points", async (req, res) => {
  try {
    const dayIndex = Number(req.query.dayIndex);
    const schoolIndex = Number(req.query.matchingIndex);
    const index = Number(req.query.index);

    const db = await entercon.findOne();

    if (!db) {
      return res.status(404).json({
        success: false,
        message: "Database not found",
      });
    }

    const school = db.schools[schoolIndex];

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    const dayEvents = school.eventLog[dayIndex - 1];

    if (!dayEvents || !dayEvents[index]) {
      return res.status(400).json({
        success: false,
        message: "Event not found",
      });
    }

    const deletedEvent = dayEvents[index];

    const team = school.teamNames.find(
      (t) => t.name === deletedEvent.team
    );

    if (team) {
      team.score -= deletedEvent.points;
    }

    dayEvents.splice(index, 1);

    await db.save();

    res.send(db.schools);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/", (req, res) => {
  entercon.find().then((s) => res.send(s)).catch((err) => console.log(err));
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const data = {
    users: [
        {
            name: "Admin",
            role: "Admin",
            password: "admin"
        },
        {
            name: "Nandha",
            role: "Trainer",
            password: "123",
        }
    ],
    schools: [
        {
            schoolName: "SIS",
            programName: "SSFUP",
            numberOfDays: 5,
            participants: 50,
            startDate: "2026-01-01",
            endDate: "2026-01-05",
            status: "completed",
            teamNames: [{name: "Humble Hyenas", score: 85}, {name: "Brave Bisons", score: 75}, {name: "Resilient Rhinos", score: 80}, {name: "Truthful Tigers", score: 90}, {name: "Disciplined Dragons", score: 85}, {name: "Kind Kangaroos", score: 70}, {name: "Compassionate Cobras", score: 85}, {name: "Grateful Gorillas", score: 90}, {name: "Positive Peacocks", score: 80}, {name: "Loyal Lions", score: 85},  {name: "Fierce Falcons", score: 90}],
            eventLog: [
                [
                    { time: "12.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "12.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "12.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "12.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "12.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "12.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "1.00 PM", team: "Compassionate Cobras", points: 10, events: "Answering in mic" },
                    { time: "1.10 PM", team: "Disciplined Dragons", points: 30, events: "Hunt the Wolf" },
                    { time: "1.20 PM", team: "Fierce Falcons", points: 10, events: "Answering in mic" },
                    { time: "1.30 PM", team: "Comapssionate Cobras", points: 40, events: "Hunt the Wolf" },
                    { time: "1.40 PM", team: "Fierce Falcons", points: 10, events: "Answering in mic" },
                    { time: "1.50 PM", team: "Disciplined Dragons", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "2.00 PM", team: "Truthful Tigers", points: 10, events: "Answering in mic" },
                    { time: "2.10 PM", team: "Loyal Lions", points: 30, events: "Hunt the Wolf" },
                    { time: "2.20 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "2.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "2.40 PM", team: "Truthful Tigers", points: 10, events: "Answering in mic" },
                    { time: "2.50 PM", team: "Loyal Lions", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "3.00 PM", team: "Compassionate Cobras", points: 10, events: "Answering in mic" },
                    { time: "3.10 PM", team: "Grateful Gorillas", points: 30, events: "Hunt the Wolf" },
                    { time: "3.20 PM", team: "Positive Peacocks", points: 10, events: "Answering in mic" },
                    { time: "3.30 PM", team: "Grateful Gorillas", points: 40, events: "Hunt the Wolf" },
                    { time: "3.40 PM", team: "Compassionate Cobras", points: 10, events: "Answering in mic" },
                    { time: "3.50 PM", team: "Positive Peacocks", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "4.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "4.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "4.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "4.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "4.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "4.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                ]
            ]
        },
    ]
}

app.get("/add-users", (req, res) => {
    data.users.push({ name: req.query.username, password: req.query.password, role: req.query.role })
    res.send(data.users)
})

app.get("/update-users", (req, res) => {
    data.users[req.query.i] = { name: req.query.name, password: req.query.password, role: req.query.role }
    res.send(data.users)
})

app.get("/delete-users", (req, res) => {
    data.users.splice(req.query.i, 1)
    res.send(data.users)
})

app.get("/update-school", (req, res) => {
    const eventLog = data.schools[req.query.i].eventLog
    var selectedTeams = req.query.selectedTeams.split(",")
    var sendingTeamData = [];
    selectedTeams.map((t) => (sendingTeamData.push({ name: t, points: data.schools[req.query.i].teamNames.find((tn) => tn.name === t)?.points || 0 })));
    console.log(sendingTeamData)
    data.schools[req.query.i] = { schoolName: req.query.schoolName, programName: req.query.programName, numberOfDays: Number(req.query.numberOfDays), participants: Number(req.query.participants), startDate: req.query.startDate, endDate: req.query.endDate, teamNames: sendingTeamData, eventLog: eventLog }
    res.send(data.schools)
})


app.get('/add-school', (req, res) => {

    var teamNames = []
    for (let i = 0; i < req.query.selectedTeams.split(",").length; i++) {
        teamNames.push({ name: req.query.selectedTeams.split(",")[i], score: 0 })
    }

    const entry = {
        schoolName: req.query.schoolName,
        programName: req.query.programName,
        numberOfDays: Number(req.query.numberOfDays),
        participants: Number(req.query.participants),
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        teamNames: teamNames,
        eventLog: [],
    }
    data.schools.push(entry)
    res.send(data.schools)
})

app.get("/delete-school", (req, res) => {
    data.schools.splice(req.query.i, 1)
    res.send(data.schools)
})

app.get("/add-points", (req, res) => {
    const dayIndex = Number(req.query.dayIndex)
    const teamName = req.query.teamName
    const points = Number(req.query.points)
    const event = req.query.event
    const time = req.query.time
    const schoolIndex = Number(req.query.schoolIndex)

    data.schools[schoolIndex].eventLog[dayIndex].push({ time: time, team: teamName, points: points, events: event })
    res.send(data.schools);
})
app.get('/', (req, res) => {
    res.send(data)
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})
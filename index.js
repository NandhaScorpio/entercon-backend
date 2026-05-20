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
            teamNames: ["Humble Hyenas", "Brave Bisons", "Resilient Rhinos", "Truthful Tigers", "Disciplined Dragons", "Kind Kangaroos", "Compassionate Cobras", "Grateful Gorillas", "Positive Peacocks", "Loyal Lions", "Friendly Foxes", "Fierce Falcons"],
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
                    { time: "12.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "12.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "12.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "12.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "12.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "12.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "12.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "12.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "12.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "12.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "12.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "12.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "12.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "12.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "12.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "12.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "12.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "12.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                ],
                [
                    { time: "12.00 PM", team: "Humble Hyenas", points: 10, events: "Answering in mic" },
                    { time: "12.10 PM", team: "Brave Bisons", points: 30, events: "Hunt the Wolf" },
                    { time: "12.20 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
                    { time: "12.30 PM", team: "Humble Hyenas", points: 40, events: "Hunt the Wolf" },
                    { time: "12.40 PM", team: "Brave Bisons", points: 10, events: "Answering in mic" },
                    { time: "12.50 PM", team: "Resilient Rhinos", points: 10, events: "Answering in mic" },
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
    data.schools[req.query.i] = { schoolName: req.query.schoolName, programName: req.query.programName, numberOfDays: Number(req.query.numberOfDays), participants: Number(req.query.participants), startDate: req.query.startDate, endDate: req.query.endDate, teamNames: req.query.selectedTeams.split(","), eventLog: eventLog }
    res.send(data.schools)
})


app.get('/add-school', (req, res) => {
    const entry = {
        schoolName: req.query.schoolName,
        programName: req.query.programName,
        numberOfDays: Number(req.query.numberOfDays),
        participants: Number(req.query.participants),
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        teamNames: req.query.selectedTeams.split(","),
        eventLog: [],
    }
    data.schools.push(entry)
    res.send(data.schools)
})

app.get("/delete-school", (req, res) => {
    data.schools.splice(req.query.i, 1)
    res.send(data.schools)
})

app.get('/', (req, res) => {
    res.send(data)
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})

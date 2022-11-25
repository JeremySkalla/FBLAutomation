const express = require("express");
const reader = require("xlsx");

const PORT = process.env.PORT || 3001;
const app = express();

class Player{
    constructor(name, cost, position) {
        this.name = name;
        this.cost = cost;
        this.position = position;
    }

    jsonify() {
        const temp = {
            'name': this.name,
            'cost': this.cost,
            'position': this.position
        }
        return temp
    }
}

app.get("/api", (req, res) => {
    res.json({ message: "FBL Automation in progress" });
});

app.get("/processFile", (req, res) => {
    const wb = reader.readFile(__dirname + '/week1.xlsx');
    const sheet = wb.Sheets[wb.SheetNames[1]];
    const data = reader.utils.sheet_to_json(sheet);

    const week = Object.keys(data[0])[0];

    var teamList = [];
    var teamList2 = [];
    var playerList = [];
    var playerList2 = [];
    var endData = {};

    for (var v in data[2]) {
        let temp = data[2][v].trim();
        if (temp != "VS" && temp != "") {
            teamList.push(temp);
            endData[temp] = [];
        }
    }
    teamList2.push(data[17]['WEEK 1'].trim());
    endData[data[17]['WEEK 1'].trim()] = [];
    teamList2.push(data[17]['__EMPTY_5'].trim());
    endData[data[17]['__EMPTY_5'].trim()] = [];

    for (var i=4; i<12; i++) {
        let keys = Object.keys(data[i]);
        for (const k of keys) {
            if (data[i][k] != " ") {
                playerList.push(data[i][k]);
            }
        }
    }

    for (var i=19; i<27; i++) {
        let keys = Object.keys(data[i]);
        for (const k of keys) {
            if (data[i][k] != " ") {
                playerList2.push(data[i][k]);
            }
        }
    }

    for (i=0; i<playerList.length; i += 3) {
        let temp = new Player(playerList[i], playerList[i+1], playerList[i+2]);
        let j = (i/3) % 6;
        endData[teamList[j]].push(temp.jsonify())
    }

    for (i=0; i<playerList2.length; i += 3) {
        let temp = new Player(playerList2[i], playerList2[i+1], playerList2[i+2]);
        let j = (i/3) % 2;
        endData[teamList2[j]].push(temp.jsonify())
    }

    console.log(endData);
    res.json(endData);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
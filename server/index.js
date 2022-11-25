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

function getPlayers(data, x, y) {
    var playerList = []
    for (var i=x; i<y; i++) {
        let keys = Object.keys(data[i])
        for (const k of keys) {
            if (data[i][k] != " ") {
                playerList.push(data[i][k])
            }
        }
    }

    return playerList
}

function processFile(file_name) {
    const wb = reader.readFile(__dirname + '/' + file_name);
    const sheet = wb.Sheets[wb.SheetNames[1]];
    const data = reader.utils.sheet_to_json(sheet);

    const week = Object.keys(data[0])[0];

    var teamList = [];
    var teamList2 = [];
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

    let playerList1 = getPlayers(data, 4, 12);
    let playerList2 = getPlayers(data, 19, 27);

    for (i=0; i<playerList1.length; i += 3) {
        let temp = new Player(playerList1[i], playerList1[i+1], playerList1[i+2]);
        let j = (i/3) % 6;
        endData[teamList[j]].push(temp.jsonify())
    }

    for (i=0; i<playerList2.length; i += 3) {
        let temp = new Player(playerList2[i], playerList2[i+1], playerList2[i+2]);
        let j = (i/3) % 2;
        endData[teamList2[j]].push(temp.jsonify())
    }

    return endData
}

app.get("/processFile", (req, res) => {
    let data = processFile(req.query.file);
    console.log(data);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
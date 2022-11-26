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

function pushToData(data, players, teams, x) {
    for (var i=0; i<players.length; i+=3) {
        let temp = new Player(players[i], players[i+1], players[i+2]);
        let j = (i/3) % x;
        data[teams[j]].push(temp.jsonify());
    }

    return data;
}

function processFile(file_name) {
    const wb = reader.readFile(__dirname + '/' + file_name);
    const data = reader.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]]);

    var teamList1 = [];
    var teamList2 = [];
    let endData = {};

    for (var v in data[2]) {
        let temp = data[2][v].trim();
        if (temp != "VS" && temp != "") {
            teamList1.push(temp);
            endData[temp] = [];
        }
    }

    teamList2.push(data[17]['WEEK 1'].trim());
    endData[data[17]['WEEK 1'].trim()] = [];
    teamList2.push(data[17]['__EMPTY_5'].trim());
    endData[data[17]['__EMPTY_5'].trim()] = [];

    let playerList1 = getPlayers(data, 4, 12);
    let playerList2 = getPlayers(data, 19, 27);

    endData = pushToData(endData, playerList1, teamList1, 6);
    endData = pushToData(endData, playerList2, teamList2, 2);

    return endData
}

app.get("/processFile", (req, res) => {
    const data = processFile(req.query.file);
    console.log(data);
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
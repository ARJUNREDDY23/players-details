const express = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializingDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started running");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializingDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
        *
    FROM 
        cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postPlayerQuery = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES
        ('${playerName}','${jerseyNumber}','${role}');`;
  await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `
    SELECT *
    FROM 
        cricket_team
    WHERE player_id=${playerId};`;
  const player = await db.get(getPlayersQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE cricket_team
    SET player_name='${playerName}',
        jersey_number='${jerseyNumber}',
        role='${role}'
    WHERE player_id='${playerId}';`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id='${playerId}'`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;

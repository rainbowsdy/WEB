const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
// pour lancer la bdd sur mon ordi
// sudo -u postgres psql
// \c velov
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "alexis",
  host: "localhost",
  database: "velov",
  password: "moi123",
  port: 5432,
});

app.get("/nb_total", async (req, res) => {
  const result = await pool.query(`
  SELECT ns.nom,nv.num_station,nv.velo_normal + nv.velo_elec AS total_velos
  FROM nb_velos nv
  JOIN nom_stations ns ON nv.num_station = ns.id_station
  WHERE nv.horodatage = (
    SELECT MAX(horodatage)
    FROM nb_velos nv2
    WHERE nv2.num_station = nv.num_station);`);
  res.json(result.rows);
});

app.get("/nb_elec", async (req, res) => {
  const result = await pool.query(`
  SELECT ns.nom, nv.num_station, nv.velo_elec
FROM nb_velos nv
JOIN nom_stations ns ON nv.num_station = ns.id_station
WHERE nv.horodatage = (
  SELECT MAX(horodatage)
  FROM nb_velos nv2
  WHERE nv2.num_station = nv.num_station);`);
  res.json(result.rows);
});

app.get("/nb_normal", async (req, res) => {
  const result = await pool.query(`
  SELECT ns.nom, nv.num_station, nv.velo_normal
FROM nb_velos nv
JOIN nom_stations ns ON nv.num_station = ns.id_station
WHERE nv.horodatage = (
  SELECT MAX(horodatage)
  FROM nb_velos nv2
  WHERE nv2.num_station = nv.num_station);`);
  res.json(result.rows);
});

app.listen(3001, "0.0.0.0", () => {
  console.log("API running on port 3001");
});
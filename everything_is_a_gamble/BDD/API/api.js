const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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
  const result = await pool.query("SELECT (nom,velo_normal + velo_elec) FROM nb_velos WHERE nb_velos.num_station==nom_stations.id_station");
  res.json(result.rows);
});

app.get("/nb_elec", async (req, res) => {
  const result = await pool.query("SELECT (velo_normal + velo_elec) FROM nb_velos WHERE nb_velos.num_station==nom_stations.id_station");
  res.json(result.rows);
});

app.get("/nb_total", async (req, res) => {
  const result = await pool.query("SELECT (velo_normal + velo_elec) FROM nb_velos WHERE nb_velos.num_station==nom_stations.id_station");
  res.json(result.rows);
});

app.listen(3001, "0.0.0.0", () => {
  console.log("API running on port 3001");
});
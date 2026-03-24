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
    WHERE nv2.num_station = nv.num_station)
  ORDER BY nv.num_station ASC;`);
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
  WHERE nv2.num_station = nv.num_station)
ORDER BY nv.num_station ASC;`);
  res.json(result.rows);
});

app.get("/nb_normal", async (req, res) => {
  try {
    const num_station = req.query.num_station; // facultatif

    // Requête SQL principale
    let query = `
      SELECT ns.nom, nv.num_station, nv.velo_normal
      FROM nb_velos nv
      JOIN nom_stations ns ON nv.num_station = ns.id_station
      WHERE nv.horodatage = (
        SELECT MAX(horodatage)
        FROM nb_velos nv2
        WHERE nv2.num_station = nv.num_station
      )
    `;

    const values = [];
    if (num_station) {
      query += ` AND nv.num_station = $1`;
      values.push(parseInt(num_station));
    }

    query += ` ORDER BY nv.num_station ASC`; // tri par station

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/stations/:id/:type", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const type = req.params.type;
    const limit = req.query;

    let column,nom;
    if (type === "normal") column = "velo_normal",nom="velo_normal";
    else if (type === "elec") column = "velo_elec",nom="velo_elec";
    else if (type === "total") column = "velo_normal + velo_elec", nom="velo_total";
    else return res.status(400).json({ error: "type inconnu,\n (types valides: 'normal','elec','total')"});

    let query = `
      SELECT 
        ns.nom,nv.num_station,nv.horodatage,nv.velo_normal, ${column} AS valeur
      FROM nb_velos nv
      JOIN nom_stations ns ON nv.num_station = ns.id_station
      WHERE nv.num_station = $1
      LIMIT 500
    `;

    const values = [id];

    const result = await pool.query(query, values);

    res.json({
      nom: result.rows[0]?.nom,
      num_station: id,
      historique: result.rows.map(row => ({
        horodatage: row.horodatage,
        [nom]: row.valeur
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});


app.listen(3001, "0.0.0.0", () => {
  console.log("API running on port 3001");
});
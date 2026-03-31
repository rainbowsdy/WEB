const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
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



app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password,money) VALUES ($1, $2,1000) RETURNING user_id, username",
      [username, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Utilisateur inconnu" });
    }

    // vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    res.json({ money: user.money, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });;
  }
});

app.post("/update_money", async (req, res) => {
  try {
    const { username, money } = req.body;

    const result = await pool.query(
      "UPDATE users SET money = $1 WHERE username = $2 RETURNING money",
      [money, username]
    );

    res.json({ money: result.rows[0].money });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });;
  }
});

app.get("/nb_total", async (req, res) => {
  const result = await pool.query(`
  SELECT ns.nom,nv.num_station,nv.velo_normal + nv.velo_elec AS total_velos
  FROM nb_velos nv
  JOIN info_station ns ON nv.num_station = ns.id_station
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
JOIN info_station ns ON nv.num_station = ns.id_station
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
      JOIN info_station ns ON nv.num_station = ns.id_station
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
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/info_statique", async (req, res) => {
  const result = await pool.query(`
  SELECT *
  FROM info_station
  ORDER BY id_station ASC;`);
  res.json(result.rows);
});

app.get("/moyennes", async (req, res) => {
  try {
  const result = await pool.query(`
  SELECT ns.nom, nv.num_station, ROUND(AVG(nv.velo_normal) + AVG(nv.velo_elec), 2) AS moyenne_velos
  FROM nb_velos nv
  JOIN info_station ns ON nv.num_station = ns.id_station
  GROUP BY ns.nom, nv.num_station
  ORDER BY nv.num_station ASC
  LIMIT 864;`);
  res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
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
      JOIN info_station ns ON nv.num_station = ns.id_station
      WHERE nv.num_station = $1
      LIMIT 864
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
    res.status(500).json({ error: "Erreur serveur" });;
  }
});


app.listen(3001, "0.0.0.0", () => {
  console.log("API running on port 3001");
});
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 9500;
const validTypes = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water",
];
const POKEDEX = require("./pokedex.json");

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "dev";

//middleware
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

app.get("/types", handleGetTypes);
app.get("/pokemon", handleGetPokemon);

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }
  next();
}

function handleGetTypes(req, res) {
  res.send(validTypes);
}

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  if (req.query.name) {
    response = response.filter((pokemon) => {
      return pokemon.name
        .toLocaleLowerCase()
        .includes(req.query.name.toLocaleLowerCase());
    });
  }

  if (req.query.type) {
    response = response.filter((pokemon) => {
      return pokemon.type.includes(req.query.type);
    });
  }

  res.json(response);
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

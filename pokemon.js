const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

// Populate Team
const pokemonTeam = [
    {
        pokemonId: uuidv4(),
        name: "Pikachu",
        level: 20,
        totalHp: 200,
        currentHp: 200,
        nextLevelExpThreshold: 20,
        currentExp: 0,
        speciesName: "rat"
    },
    {
        pokemonId: uuidv4(),
        name: "Pichu",
        level: 1,
        totalHp: 100,
        currentHp: 100,
        nextLevelExpThreshold: 10,
        currentExp: 0,
        speciesName: "rat"
    },
    {
        pokemonId: uuidv4(),
        name: "Bulbasaur",
        level: 15,
        totalHp: 200,
        currentHp: 200,
        nextLevelExpThreshold: 30,
        currentExp: 0,
        speciesName: "turtle"
    }

];

// Get all pokemon
router.get('/', (req, res, next) => { 
    if (req.query.species) {
        return next();
    }
    res.status(200).send(pokemonTeam)
});

// Add new pokemon
router.post('/', (req, res) => {
    const body = req.body;
    const pokemonId = uuidv4();

    pokemonTeam.push({
        pokemonId,
        name: body.name,
        level: body.level,
        totalHp: body.totalHp,
        currentHp: body.currentHp,
        nextLevelExpThreshold: body.nextLevelExpThreshold,
        currentExp: body.currentExp,
        speciesName: body.speciesName
    });
    res.status(200).send({
        message: "Pokemon added",
        pokemonId: pokemonId
    });
})

// Modify pokemon
// If specified, will call "next()" for taking damage and gaining experience
router.put('/:pokemonId', (req, res, next) => {
    if (req.query.takeDamage || req.query.gainExp) {
        console.log(req.query);
        return next();
    }
    const pokemonId = req.params.pokemonId;
    const body = req.body;
    let specifiedPokemon = pokemonTeam.find(
        (pokemon) => pokemon.pokemonId === pokemonId
    );

    if (!specifiedPokemon) {
        res.status(404);
        return res.send({error: "There is no such pokemon in your team!"});
    }

    specifiedPokemon.name = body.name;
    specifiedPokemon.level = body.level;
    specifiedPokemon.totalHp = body.totalHp;
    specifiedPokemon.currentHp = body.currentHp;
    specifiedPokemon.nextLevelExpThreshold = body.nextLevelExpThreshold;
    specifiedPokemon.currentExp = body.currentExp;
    specifiedPokemon.speciesName = body.speciesName;

    res.status(200);
    return res.send("Success!")
})


// Taking damage and gaining experience.
router.put('/:pokemonId', (req, res) => {
    const specifiedPokemonId =  req.params.pokemonId;
    let specifiedPokemon = pokemonTeam.find(
        (pokemon) => pokemon.pokemonId === specifiedPokemonId
    );

    const damageTaken = req.query.takeDamage;
    const expGained = req.query.gainExp;

    if (damageTaken && specifiedPokemon.currentHp > 0) {
        specifiedPokemon.currentHp -= parseInt(damageTaken);
    }

    if (expGained) {
        specifiedPokemon.currentExp += parseInt(expGained);
        while (specifiedPokemon.currentExp >= specifiedPokemon.nextLevelExpThreshold) {
            specifiedPokemon.currentExp -= parseInt(specifiedPokemon.nextLevelExpThreshold);
            specifiedPokemon.level += 1;
        }
    }

    res.status(200).send(specifiedPokemon);
})

// Getting a specific pokemon
router.get('/:pokemonId', (req, res) => {
    const specifiedPokemonId =  req.params.pokemonId;
    let specifiedPokemon = pokemonTeam.find(
        (pokemon) => pokemon.pokemonId === specifiedPokemonId
    );

    if (specifiedPokemon) {
        return res.send(specifiedPokemon);
    }

    res.status(404);
    res.send({error: "There is no such pokemon in your team!"})    
})

// Releasing a pokemon
router.delete('/:pokemonId', (req, res) => {
    const specifiedPokemonId = req.params.pokemonId;
    for (let i = 0; i < pokemonTeam.length; i++) {
        if (pokemonTeam[i].pokemonId === specifiedPokemonId) {
            pokemonTeam.splice(i, 1);
        }
    }

    res.status(200).send('Success!');
})

// Getting pokemon of a specific species
router.get('/', (req, res) => {
    const species = req.query.species;
    console.log(req.query)
    const returnPokemon = [];

    for (let i = 0; i < pokemonTeam.length; i++) {
        if (pokemonTeam[i].speciesName === species) {
            returnPokemon.push(pokemonTeam[i]);
        }
    }

    return res.status(200).send(returnPokemon);
})

module.exports = router;
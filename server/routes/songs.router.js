const express = require('express');
const router = express.Router();
// imports pool from module
const pool = require('../modules/pool');

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log('Error in GET query:', error);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    // songs.push(req.body);
    // res.sendStatus(200);
    const newSong = req.body;
    const queryText = `
    INSERT INTO "songs" ("artist", "track", "published", "rank")
    VALUES ($1, $2, $3, $4)
    `;
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank])
    .then((result) => {
        res.sendStatus(201);
    })
    .catch((error) => {
        console.log('Error in POST query to db:', error);
        res.sendStatus(500);
    })
});

module.exports = router;
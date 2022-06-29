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
    // const idToGet = req.params.id;
    let queryText = 'SELECT * FROM "songs" ORDER BY "rank";'; // WHERE "id" = $1;';
    pool.query(queryText) // [idToGet]
    .then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error in GET query:', error);
        res.sendStatus(500);
    });
});

// // example: /songs/3
// router.get('/:id', (req, res) => {
//     // res.send(songs);
//     const idToGet = req.params.id;
//     let queryText = 'SELECT * FROM "songs" WHERE "id" = $1;';
//     pool.query(queryText, [idToGet])
//     .then((result) => {
//         res.send(result.rows);
//     }).catch((error) => {
//         console.log('Error in GET query:', error);
//         res.sendStatus(500);
//     });
// });

// example: /songs/artist/mahmoud
// router.get('/artist/:artist', (req, res) => {
//     // res.send(artist);
//     const artistToGet = req.params.artist;
//     let queryText = 'SELECT * FROM "songs" WHERE "artist" = $1;';
//     pool.query(queryText, [artistToGet])
//     .then((result) => {
//         res.send(result.rows);
//     }).catch((error) => {
//         console.log('Error in GET query:', error);
//         res.sendStatus(500);
//     });
// });


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

router.delete('/:id', (req, res) => {
    let reqId = req.params.id;
    console.log('Delete request sent for id:', reqId);
    let queryText = 'DELETE FROM "songs" WHERE "id" = $1;';
    pool.query(queryText, [reqId])
    .then(() => {
        console.log('Song deleted successfully')
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('Error in DELETE query from db:', queryText, error);
        res.sendStatus(500);
    })
})

// change the rank on a song
router.put('/rank/:id', (req, res) => {
    let songId = req.params.id;
    // expect direction to be up or down
    let direction = req.body.direction;
    let queryText;
    if (direction === 'up') {
        queryText = 'UPDATE "songs" SET rank = rank-1 WHERE id = $1;';
    } else if (direction === 'down') {
        queryText = 'UPDATE "songs" SET rank = rank+1 WHERE id = $1;';
    } else {
        // if we don't have an expected direction
        res.sendStatus(500);
        return;
    }
    pool.query(queryText, [songId])
    .then((dbResponse) => {
        res.send(dbResponse.rows);
    })
    .catch((error) => {
        console.log(`Error UPDATEing with query ${queryText}: ${error}`);
        res.sendStatus(500);
    });
});

module.exports = router;

// C - Create -- INSERT (pg), POST (ajax)
// R - Read -- SELECT (pg), GET (ajax)
// U - Update -- UPDATE (pg), PUT (ajax)
// D - Delete -- DELETE (pg), DELETE (ajax)
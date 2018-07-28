//db.all
const { printQueryResults } = require('./utils');
// require the 'sqlite3' package here
const sqlite3 = require('sqlite3');
// open up the SQLite database in './db.sqlite'
const db = new sqlite3.Database('./db.sqlite');

db.all('SELECT * FROM TemperatureData ORDER BY year', (error, rows) => {
    if (error) {
        throw error;
    }
    printQueryResults(rows);
});



//db.get
const { printQueryResults } = require('./utils');
const sqlite = require('sqlite3');

const db = new sqlite.Database('./db.sqlite');

// Your code below:
db.get("Select * from TemperatureData where  year = 1998", (error, row) => {
    printQueryResults(row);
})


//placeholders
const { printQueryResults } = require('./utils');
const sqlite = require('sqlite3');

const db = new sqlite.Database('./db.sqlite');

const ids = [1, 25, 45, 100, 360, 382];
// your code below:
ids.forEach((id) => {
    db.get("SELECT * FROM TemperatureData WHERE id = $id", {
            $id: id
        },
        (error, rows) => {
            printQueryResults(rows);
        })
})



//db.run

const sqlite = require('sqlite3');

const db = new sqlite.Database('./db.sqlite');

const newRow = {
        location: 'Istanbul, Turkey',
        year: 1976,
    }
    // Your code below!

db.run('INSERT INTO TemperatureData (location, year) VALUES ($location, $year)', {
    $location: newRow.location,
    $year: newRow.year
}, function(error) {
    // handle errors here!

    console.log(this.lastID);
});



//get average temperature for every year


const { printQueryResults, calculateAverages, addClimateRowToObject } = require('./utils');
const sqlite = require('sqlite3');

const db = new sqlite.Database('./db.sqlite');

const temperaturesByYear = {};

db.run('DROP TABLE IF EXISTS Average', error => {
    if (error) {
        throw error;
    }
    db.each('SELECT * FROM TemperatureData',
        (error, row) => {
            if (error) {
                throw error;
            }
            addClimateRowToObject(row, temperaturesByYear);
        },
        error => {
            if (error) {
                throw error;
            }
            const averageTemperatureByYear = calculateAverages(temperaturesByYear);
            printQueryResults(averageTemperatureByYear);
        }
    );
});




//serial querry


const { calculateAverages, addClimateRowToObject, logNodeError, printQueryResults } = require('./utils');
const sqlite = require('sqlite3');

const db = new sqlite.Database('./db.sqlite');

const temperaturesByYear = {};

// start by wrapping all the code below in a serialize method
db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Average', error => {
        if (error) {
            throw error;
        }
    })
    db.run('CREATE TABLE Average (id INTEGER PRIMARY KEY, year INTEGER NOT NULL, temperature REAL NOT NULL)', logNodeError);
    db.each('SELECT * FROM TemperatureData',
        (error, row) => {
            if (error) {
                throw error;
            }
            addClimateRowToObject(row, temperaturesByYear);
        },
        error => {
            if (error) {
                throw error;
            }
            const averageTemperatureByYear = calculateAverages(temperaturesByYear);
            averageTemperatureByYear.forEach(row => {
                db.run('INSERT INTO Average (year, temperature) VALUES ($year, $temp)', {
                    $year: row.year,
                    $temp: row.temperature
                }, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            db.all('SELECT * FROM Average',
                (error, row) => {
                    printQueryResults(row)
                })
        });
});
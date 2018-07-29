//1)The query in the workspace is going to return an error! Log the error to the console if it exists, otherwise log the retrieved rows.
const db = require('./db');

db.all('SELECT * from NonexistentTable', (err, rows) => {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});


//2)Use db.each() to find the totalPrice if you bought every shirt from the Clothing database. 
//Select the price from each row where item is 'shirt' and add the prices to totalPrice. 
//Log totalPrice after they have all been added. Each row's price property is already a number, so you do not need to use Number() to convert it.

const db = require('./db');

let totalPrice = 0;
db.each("SELECT price FROM Clothing WHERE item='shirt'", (err, row) => {
    totalPrice += Number(row.price);
}, (err, numRows) => {
    console.log(totalPrice);
});


//3)Find a way to wrap the queries in the workspace so that they run synchronously.


const db = require('./db');

db.serialize(() => {
    db.run('CREATE TABLE Popcorn (id INTEGER PRIMARY KEY, type TEXT)');
    db.run('INSERT INTO POPCORN (type) VALUES ("cheddar")');
    db.run('INSERT INTO POPCORN (type) VALUES ("kettle corn")');
})



//4)Find and print the quantity column of the spice 'paprika' in a table called SpiceRack based on its name. 
//names are unique, so you only need to retrieve one row.

const db = require('./db');

db.get("SELECT quantity FROM SpiceRack WHERE name='paprika'", (err, row) => {
    console.log(row.quantity);
});


//5)Use the genre parameter in the function to find the title of every song in the Song database matching the genre.


const db = require('./db');

const selectByGenre = genre => {
    // Add your code in here
    db.all("select title from Song where genre = $genre", {
            $genre: genre
        },
        (err, rows) => {
            printQueryResults(rows);
        })
};

//6)Use db.each() to print the height of every character from the CartoonCharacter database where the species is 'mouse'.


const db = require('./db');

db.each("select height from CartoonCharacter where species = 'mouse'", (err, rows) => {

    console.log(`${rows.height}`);
});


//7)Write a function called logCaffeineLevel that takes the name of a tea and logs its caffeine_level from the Tea table.

const db = require('./db');

const getCaffeineLevel = tea_name => {
    db.get("SELECT * FROM Tea WHERE name=$name;", { $name: tea_name }, (err, row) => {
        console.log(row.caffeine_level);
    })
}


//8)Use the parameter to find the number_of_floors column from the Building table at the user-given address.


const db = require('./db');

const logFloorsForAddress = address => {
    db.get("SELECT number_of_floors FROM Building WHERE address=$address", { $address: address }, (err, row) => {
        console.log(row.number_of_floors);
    });
}


//9)Add a row to the BirdOfParadise table with scientific_name Cicinnurus regius and with king bird-of-paradise as its common_name


const db = require('./db');

db.run("INSERT INTO BirdOfParadise (scientific_name, common_name) VALUES ('Cicinnurus regius', 'king bird-of-paradise');");


//10)Complete the addMovie function to inserts a movie into the Movie table with columns named title, publication_year, and director. 
//Use the style of placeholders using named parameter and an object as the second argument of db.run()

const db = require('./db');
const addMovie = (title, publicationYear, director) => {
    db.run('INSERT INTO Movie (title, publication_year, director) VALUES ($title, $pubYear, $director)', {
        $title: title,
        $pubYear: publicationYear,
        $director: director
    });
};
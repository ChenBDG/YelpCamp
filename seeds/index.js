if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose'); //importing data base
const cities = require('./cities');
const authors = require('./authors');
const photos = require('./photos');
const descriptions = require('./descriptions');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const { compile } = require('ejs');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
console.log(dbUrl);
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0; i<300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const random5 = Math.floor(Math.random() * 4);
        const random14 = Math.floor(Math.random() * 13);

        const camp = new Campground({
            author: `${authors[random5]}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point', 
                coordinates: [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [{
                url: photos[random14].url,
                filename: photos[random14].filename 
            }

            ],
            description: `${descriptions[random5]}`,
            price, 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
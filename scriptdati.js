const { MongoClient } = require("mongodb"); 
const fs = require('fs'); 

const MONGODB_URI = "mongodb://mongosrv:27017";
const DB_NAME = "aste"

async function loadData(){
    const client = new MongoClient(MONGODB_URI); 
    try{
        await client.connect(); 
        const db = client.db(DB_NAME); 
        const auctions = db.collection("auctions"); 
        const users = db.collection("users"); 
        const bids = db.collection("bids");
        
        await auctions.deleteMany({});
        await users.deleteMany({});
        await bids.deleteMany({});

        const auctionsFile = JSON.parse(fs.readFileSync("./data/aste.auctions.json", "utf-8")); 
        const usersFile = JSON.parse(fs.readFileSync("./data/aste.users.json", "utf-8")); 
        const bidsFile = JSON.parse(fs.readFileSync("./data/aste.bids.json", "utf-8")); 

        await auctions.insertMany(auctionsFile); 
        await users.insertMany(usersFile);
        await bids.insertMany(bidsFile);

        console.log("Dati caricati con successo."); 
    } catch(error){
        console.error("Errore nel caricamento dei dati: ", error); 
    } finally {
        await client.close();
        console.log("Connessione chiusa.");
    }
}

loadData(); 
const MongoClient = require("mongodb").MongoClient;
const mongo_username = process.env["MONGO_USERNAME"];
const mongo_password = process.env["MONGO_PASSWORD"];

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@listing-genius.sbganwz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = {
  client,
};

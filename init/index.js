const mongoose=require("mongoose");
const   data=require("./data.js")
const Listing=require("../models/listing.js")

main()
.then(()=>{console.log("Connected to db")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb =async()=>{
    await Listing.deleteMany({});
    data.data=data.data.map((obj)=>({
      ...obj,
      owner:'6786045cdf8f0b4744d9a594'
    }))
    await Listing.insertMany(data.data);
} 

initdb();
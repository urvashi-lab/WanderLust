const express=require("express");
const app=express();
const ExpressError=require("./ExpressError")

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});

app.use("/api",(req,res,next)=>{
    let {token}=req.query;
    if(token=="giveaccess"){
        next();
    }
    throw new ExpressError(401,"Access Denied");
})
app.use((err,req,res,next)=>{
    let {status=200,message}=err
    res.send(message);
})

app.get("/api",(req,res)=>{
    res.send() ;
 });

 app.get("/err",(req,res)=>{
    abcd=abcd ;
 });
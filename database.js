const MongoClient = require('mongodb').MongoClient;


var uri = "MONGODB_URI";

var dbName = "Bot_data"; //database name
var collectionName = "users"  // collection name




async function ConnectDB (DB_NAME){


    try {
        const client = await MongoClient.connect(uri);
        const db =  client.db(DB_NAME);

        return [db , client];
        
      } catch (err) {
        console.error('Error reading data:', err);
      }



}

async function ReadCl(coll_name){
  const [db , client ] = await ConnectDB(dbName);

    const collection =  db.collection(coll_name);
    const cursor = await collection.find({}).toArray();
    console.log(cursor);
    await client.close();

}


async function CheckData(coll_name,data){
    const [db , client ] = await ConnectDB(dbName);
    const collection =  db.collection(coll_name);
    const documents = await collection.find(data).toArray();

    // console.log(data); 

    if(documents.length ==  1 ){
        var res = true;
    }
    else if(documents.length > 1){
        // duplicate data exists
        console.log("There is duplicate doc.");
        // await logError("NOTICE: Data is duplicate for user id: "+ documents[0]['user_id']);
        var res = true;
    }
    else{
        var res = false;
    }

    await client.close();
    // console.log("done till here")
    // console.log(documents[0])

    return [res , documents[0]];


}


async function WriteDoc (coll_name , data){

const [db , client ] = await ConnectDB(dbName);
const collection =  db.collection(coll_name);
const write = await collection.insertOne(data)

console.log(`Document inserted with ID: ${write.insertedId}`);



// close db
await client.close();
return write.acknowledged;

}





async function CheckAndRegister (user_dtl,callback_func){
    // console.log(user_dtl)
    user_id = user_dtl.id;
    
var query = {user_id : user_id.toString()};

// first we will look into our colection whether we have that user id registered.
var [response , data ] = await CheckData("users",query);

if(response ){
    console.log("user is already registered.");
  
}else{
   console.log("user is not registered , let's do it now");

var data_import = {
    "user_id" : user_id.toString(),
    "user_name" : user_dtl.username,
    "name": user_dtl.first_name,
    "registration_time": new Date().toISOString()
}

var response_write = await WriteDoc("users",data_import);
if(response_write){
    console.log(
        "user is registered succesfully"
    );
}else{
    logError("couldn't register user with user id:"+user_id)
}

}


}

module.exports = {CheckAndRegister };

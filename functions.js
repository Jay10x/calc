
async function parseInput(inputString) {


    // Remove the "other line |" part (assuming it's always present)
   try{
   
    const cleanedInput = inputString.split("|")[1].trim();

  
    // Split the remaining string by commas, separating variable assignments
    const variableAssignments = cleanedInput.split(",");
  
    // Create an object to store variable values
    var values = {};
  
    // Loop through each assignment, extract variable and value
    for (const assignment of variableAssignments) {
      var [variable, value] = assignment.trim().split("=");
      values[variable.trim()] = parseFloat(value.trim()); // Parse value as a number
    }
   }
   catch(error){

    console.log(error.message);
    var values = null;
   }
    return values;
  }



 async  function FirstPart(inputString){
    var json = inputString.split("|");
   return json[0];
}



module.exports = {parseInput,FirstPart };

// inline calculator bot 


//grammy lib
const {Bot,Keyboard, session, HttpError ,InlineKeyboard, InlineQueryResultBuilder } = require('grammy');
const { conversations } = require('@grammyjs/conversations')
const { hydrateReply, parseMode } = require("@grammyjs/parse-mode");
const math = require('mathjs');
const {parseInput,FirstPart } = require('./functions.js');

const {CheckAndRegister} = require('./database.js');


 
const bot = new Bot('BOT_TOKEN'); 

bot.use(hydrateReply);

bot.command('start', ctx => {
    
  var user_dtl = ctx.update.message.from;

  if(ctx.update.message.chat.type == "private"){
  CheckAndRegister(user_dtl,null); // user registration if user started bot in dm
  } 

     ctx.replyWithHTML(`Hi there! Welcome. \n\n<b>How to use me ? Here are the examples.</b>\n <pre>@Mathyx_bot 3+5-3*5/5 \n\n@Mathyx_bot 1000 g to kg \n\n@Mathyx_bot a+b*c | a=4,b=5,c=2 </pre>\n\nThese commands can be used anywhere in telegram [inline method].`
     );

    
})




bot.on('inline_query', async (ctx) => {
    const query = ctx.inlineQuery.query;
   console.log(query); // test purpose

   
   if (query){
    var u = "Error";
    try{
      var u = math.evaluate(query);
      } catch(error){
        // it is throwing error, in one case user might have inserted | and given variables, if it so let's solve it.
        if(query.includes("|")){
        // console.log("user has inserted | and he want to solve variables math")

        var expr = await FirstPart(query);
        var scope = await parseInput(query);
        // console.log(query);

        // console.log(expr + " yahi hai apna expression.");
        // console.log("let me try printing scope ");
        // console.log(scope);
        try{
        var u = math.evaluate(expr,scope);
        console.log(u);
        } 
        catch(err){
          // console.log("Here is the error we are facing while solving expr" + err.message);
          var u= "Invalid"
        }
        }else{
          // then yeah , user actually did something wrong
          var u = "Invalid"
        }
      }



 


    // sending response to user
    const result = {
      type: 'article',
      id: 'unique_result_id', // Unique identifier for your result
      title: `${query} => ${u}`,
      thumb_url: 'https://cdn.pixabay.com/photo/2016/03/31/22/26/black-1297034_1280.png',
      input_message_content: {
        message_text: `${query} => ${u}` // Text content
      }
    };
    await ctx.answerInlineQuery([result]);

  
} 

// if there is empty input
else{
    console.log("empty");

      const result = {
      type: 'article',
      id: 'unique_result_id', // Unique identifier for your result
      title: 'Write it.',
      description:'Write down what you need to solve.',
      thumb_url: 'https://cdn.pixabay.com/photo/2016/03/31/22/26/black-1297034_1280.png',
      input_message_content: {
        message_text: `Examples: \n @Mathyx_bot 4-2*7 \n @Mathyx_bot 1000 g to kg \n @Mathyx_bot a+b | a=4 , b=5` // Text content
      }
    };
    await ctx.answerInlineQuery([result]);

}
  });







bot.start();

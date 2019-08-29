// process-message.js

const Dialogflow = require("dialogflow");
const Pusher = require("pusher");

// You can find your project ID in your Dialogflow agent settings
const projectId = "apa-citations-agent-rxcjhm"; //https://dialogflow.com/docs/agents#settings
const sessionId = "123456";
const languageCode = "en-US";

const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

const sessionClient = new Dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const processMessage = message => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      // console.log(
      //   "responses[0].queryResult.fulfillmentMessages",
      //   responses[0].queryResult.fulfillmentMessages
      // );
      // console.log("responses[0].queryResult", responses[0].queryResult);
      const result = responses[0].queryResult;
      for (let i = 0; i < result.fulfillmentMessages.length; i++) {
        let textResponse = result.fulfillmentMessages[i];
        let delayTimer = i;
        setTimeout(() => {
          return pusher.trigger("bot", "bot-response", {
            message: textResponse.text.text[0]
          });
        }, delayTimer * 450);
      }
      // result.fulfillmentMessages.forEach(textResponse => {
      //   // console.log(textResponse);
      //   return pusher.trigger("bot", "bot-response", {
      //     message: textResponse.text.text[0]
      //   });
      // });
      // return pusher.trigger("bot", "bot-response", {
      //   message: result.fulfillmentText
      // });
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
};

module.exports = processMessage;

// // process-message.js
// const Dialogflow = require("dialogflow");
// const Pusher = require("pusher");
// const getWeatherInfo = require("./weather");

// // You can find your project ID in your Dialogflow agent settings
// const projectId = "apa-citations-agent-rxcjhm"; //https://dialogflow.com/docs/agents#settings
// const sessionId = "123456";
// const languageCode = "en-US";

// const config = {
//   credentials: {
//     private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
//     client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
//   }
// };

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
//   encrypted: true
// });

// const sessionClient = new Dialogflow.SessionsClient(config);

// const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// const processMessage = message => {
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: message,
//         languageCode
//       }
//     }
//   };

//   sessionClient
//     .detectIntent(request)
//     .then(responses => {
//       //CHECK THIS OUT
//       // console.log(responses[0])

//       const result = responses[0].queryResult;

//       // If the intent matches 'detect-city'
//       if (result.intent.displayName === "detect-city") {
//         const city = result.parameters.fields["geo-city"].stringValue;

//         // fetch the temperature from openweather map
//         return getWeatherInfo(city).then(temperature => {
//           return pusher.trigger("bot", "bot-response", {
//             message: `The weather in ${city} is ${temperature}°C`
//           });
//         });
//       } else {
//         return pusher.trigger("bot", "bot-response", {
//           message: result.fulfillmentText
//         });
//       }
//     })
//     .catch(err => {
//       console.error("ERROR:", err);
//     });
// };

// module.exports = processMessage;

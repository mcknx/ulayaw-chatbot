const { WebhookClient } = require("dialogflow-fulfillment");
const mongoose = require("mongoose");
// const Thought = mongoose.model("thought");

module.exports = (app) => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    console.log("agent", agent);
    function snoopy(agent) {
      agent.add(`Welcome to my Snoopy fulfillment!`);
    }
    // async
    function ask_thought_more(agent) {
      agent.add(`halloooooo`);
      // Thought.findOne(
      //   { course: agent.parameters.courses },
      //   function (err, course) {
      //     if (course !== null) {
      //       course.counter++;
      //       course.save();
      //     } else {
      //       const thought = new Thought({ course: agent.parameters.courses });
      //       thought.save();
      //     }
      //   }
      // );
      // let responseText = `You want to learn about ${agent.parameters.courses}.
      //         Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;
      // let coupon = await Coupon.findOne({ course: agent.parameters.courses });
      // if (coupon !== null) {
      //   responseText = `You want to learn about ${agent.parameters.courses}.
      //             Here is a link to the course: ${coupon.link}`;
      // }
      // agent.add(responseText);
    }

    function fallback(agent) {
      agent.add(`Hindi ko naintindihan.`);
      agent.add(`I'm sorry, pwede pa ulit?`);
    }
    let intentMap = new Map();
    intentMap.set("snoopy", snoopy);
    intentMap.set("ulayaw.abc.ask_thought_more", ask_thought_more);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
    console.log("meowww");
  });
};

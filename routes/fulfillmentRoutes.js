const { WebhookClient } = require("dialogflow-fulfillment");
const mongoose = require("mongoose");
// const Thought = mongoose.model("thought");

module.exports = (app) => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    console.log("intent:" + agent.intent);
    console.log("parameters:" + JSON.stringify(agent.parameters));
    console.log("contexts:" + JSON.stringify(agent.contexts));
    console.log("messages:" + JSON.stringify(agent.consoleMessages));
    // console.log("agent", agent);
    function snoopy(agent) {
      agent.add(`Welcome to my Snoopy fulfillment!`);
    }
    // async
    function abc_welcome(agent) {
      agent.add(
        `Bago tayo mag umpisa, simulan muna natin sa paghinga ng malalim. 😑😤💨`
      );
      agent.add(
        `Mas nakabubuti kung maikli lamang na pahiwatig upang aking lubos na maintindihan ang iyong saloobin.`
      );

      let loop = true;
      while (loop) {
        agent.setFollowupEvent("ABC_ASK_MORE_THOUGHT");
      }
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
    intentMap.set("ulayaw.abc.welcome", abc_welcome);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
    console.log("meowww");
  });
};

// const User = require('../models/auth.model');
// const expressJwt = require('express-jwt');
const { translate } = require("@paiva/translation-google");
// const { translate } = require("bing-translate-api");
// const translate = require("@vitalets/google-translate-api");
// const translate = require("@asmagin/google-translate-api");
// const translate = require("@imlinhanchao/google-translate-api");
// const translate = require("@plainheart/google-translate-api");

// const { translate } = require("./mckeen");
// const { HttpsProxyAgent } = require("https-proxy-agent");
// const translate = require("google-translate-api");
// const translate = require("translate-google");

const cookie = require("universal-cookie-express");
var Sentiment = require("sentiment");
const express = require("express");
const router = express.Router();
var tensify = require("tensify");
// const chatbot = require("../chatbot/chatbot");

// exports.showPDFController = (req, res) => {
//   return
// }

exports.googleTranslate = async (req, res) => {
  const inputData = req.params.words;

  console.log(inputData);

  // @paiva/translation-google

  return await translate(inputData, {
    from: "tl",
    to: "en",
  })
    .then((r) => {
      // console.log("@paiva/translation-google");
      console.log(r.text, "res.text");
      return res.json({
        success: true,
        data: r.text,
      });
      // return res.text;
    })
    .catch((err) => {
      console.error(err);
      // return res.json({
      //   errors: errorHandler(err),
      // });
    });
};

exports.understandUserInputController = async (req, res) => {
  const OpenAI = require("openai-api");

  // Load your key from an environment variable or secret management service
  // (do not include your key directly in your code)
  const config = require("../config/keys");
  // const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_API_KEY = config.OPENAI_API_KEY;

  // mckeenasmarvmz@gmail.com
  // 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

  // mckeenasma123@gmail.com and asmamckeen@gmail.com (disgrasya)
  // "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";

  // masma_180000002118@uic.edu.ph
  // "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";

  const openai = new OpenAI(OPENAI_API_KEY);
  const emotionData = req.params.emotion;
  const inputData = req.params.words;
  // let inputData = "nagsimula akong magalit sa kanya kanina";
  // let inputData = "nagsimula akong nagalit sa kanya kanina";
  // let inputData =
  //   "nagsimula akong maging malunkgot sa palikoran kahapon noong akoy naninigarilyo";
  // const inputData =
  //   "nagsimula akong maging malungkot kahapon habang ako ay nasa bahay";
  // const inputData =
  //   "nagsimula akong maging di mapakali ngayon lang dito sa bahay";
  // let inputData =
  //   "nagsimula akong hindi mapakali dahil sa capstone dahil kay maam";
  // malungot ako dahil wala akong trabaho ngayon at naghihirap ang pamilya ko sa hirap ng buhay
  // Malungkot ako dahil wala akong girlfriend at nag iisa lang sa buhay, para bang wala ng nag mamahal sa akin.

  console.log(inputData);
  console.log(emotionData);
  let translated;

  // @paiva/translation-google
  await translate(inputData, {
    from: "tl",
    to: "en",
  })
    .then(async (res1) => {
      // Completion API call
      const topic = async () => {
        return await openai.complete({
          engine: "davinci",
          // prompt:
          //   "The following is a list user inputs and the categories they fall into\n\nAt school, it feels like I've lost all my friends: loss of friends, losing a friend/s, friend problem\nI've been really weird with my sleeping patterns: sleep problems, sleep issues\nI'm going through some things with my feelings and myself: self-esteem, self-confidence, self-image\nAt cemetery, I visited my dad who lost his life: death of a loved one, death of a family member\nI feel like I am not at a good state of mind: mental health, mental illness\nI'm very unsettled in my soul. I'm not happy with myself or the decisions I make, which makes me not happy with anyone else: self-esteem, self-confidence, self-image\nI feel like a failure most of my days. I don't feel like I'm good at anything anymore. I feel like less of a person: self-esteem, self-confidence, self-image\n",
          prompt: `The following is a list of user inputs and the emotional categories to which they belong\n\nAt school, it feels like I've lost all my friends: loss of friends, losing a friend/s, friend problem\nI've been really weird with my sleeping patterns: sleep problems, sleep issues\nI'm going through some things with my feelings and myself: self-esteem, self-confidence, self-image\nAt cemetery, I visited my dad who lost his life: death of a loved one, death of a family member\nI feel like I am not at a good state of mind: mental health, mental illness\nI'm very unsettled in my soul. I'm not happy with myself or the decisions I make, which makes me not happy with anyone else: self-esteem, self-confidence, self-image\nI feel like a failure most of my days. I don't feel like I'm good at anything anymore. I feel like less of a person: self-esteem, self-confidence, self-image\nI started to get restless because of the capstone because of maam: restless about capstone, capstone class\nI started to get restless because of our project: restless about project, project class\n${emotionData}, ${res1.text}:`,

          maxTokens: 60,
          temperature: 0,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0.89,

          stop: ["\n"],
        });

        // console.log(generate_essay.data);
      };

      const topicRes = await topic();

      const second_person = async () => {
        return await openai.complete({
          engine: "davinci",
          prompt: `First-person to second-person\n\nInput: I decided to make a movie about Ada Lovelace.\nOutput: Okay, I've learned that you adore Ada Lovelace and have decided to make a movie about her.\n\nInput: My biggest fear was that I wasn't able to write the story adequately.\nOutput: Okay, I see you're worried. Your main concern seems to be that you won't be able to write a good enough story.\n\nInput: i started to feel nervous in the toilet yesterday when i was smoking because i remembered my boyfriend\nOutput: Okay, I've learned that you recently started to feel nervous in the toilet when you were smoking. You mentioned that this was because you remembered your boyfriend.\n\nInput: When I'm in large crowds I get angry and I just can't deal with people. I don't really like other people (I prefer animals) they make me nervous and scared.\nOutput: Okay, I've learned that you get angry and can't deal with people in large crowds. You prefer animals to people.\n\nInput: I'm going through some things with my feelings and myself. I barely sleep and I do nothing but think about how I'm worthless and how I shouldn't be here.\nOutput: Okay, I've learned that you're going through some things with your feelings and yourself. You don't sleep and you think about how you're worthless and how you shouldn't be here.\n\nInput: At school, it feels like I've lost all my friends\nOutput: Okay, I've learned that you feel like you've lost all your friends at school.\n\nInput: At cemetery, I visited my dad who lost his life\nOutput: Okay, I've learned that you visited your dad at a cemetery.\n\nInput: ${res1.text}\nOutput:`,

          maxTokens: 60,
          temperature: 0.3,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,

          stop: ["\n"],
        });

        // console.log(generate_essay.data);
      };

      const second_personRes = await second_person();

      // const generate_essay = async () => {
      //   return await openai.complete({
      //     engine: "davinci",
      //     prompt: `Create an essay about loss of friends, losing a friend/s, friend problem and suggest a solution: Losing a friend is one of the most painful experiences in life, and it can be even more difficult to deal with when you have lost a friend to death. When you lose someone close to you, it can leave a hole in your heart that will never heal.\n\nCreate an essay about sleep problems, sleep issues and suggest a solution: Sleep problems are one of the most common problems faced by people today. Sleep disorders can be caused by a number of factors, including stress, anxiety, depression and other physical or psychological factors.\n\nCreate an essay about self-esteem, self-confidence, self-image and suggest a solution: Self-esteem is the value that a person places on himself. It is important to have good self-esteem, because it helps you to feel good about yourself and boosts your confidence.\n\nCreate an essay about death of a loved one, death of a family member and suggest a solution: Death is one of the most painful experiences that anyone can go through. When you lose a loved one, it can leave you feeling empty and alone.\n\nCreate an essay about stress, anxiety and suggest a solution: Stress is one of the most common problems faced by people today. Stress can be caused by a number of factors, including work, school, family and other physical or psychological factors.\n\nCreate an essay about ${emotionData}, ${topicRes.data.choices[0].text} and suggest a solution:`,
      //     maxTokens: 60,
      //     temperature: 0.5,
      //     topP: 1,
      //     presencePenalty: 0,
      //     frequencyPenalty: 0.81,
      //     stop: ["\n"],
      //   });
      // };

      // const generate_essayRes = await generate_essay();

      // const generate_answer = async () => {
      //   return await openai.answers({
      //     documents: [
      //       "Have you used meditation or hypnosis? Relaxing the mind and connecting with your true self is a great way to calm your thoughts and get to peace and calm. Hypnosis and meditation have helped a lot of people with anxiety and depression. Google hypnotherapists near me or write for a while about what is going on.",
      //       "Answers about our inner lives are most successfully reached from a sense of feeling grounded in oneself.First step is to accept your nervousness and restless sleep.  As often as possible, sleep during daytimes in order for your body to catch up on its need for rest.Accept too about feeling down.  It is normal to feel down once in a while.  From this place of self-acceptance, trust any answers which come up to your mind.  Often answers about complicated topics come in small pieces, not all at once as a whole unit.Also, your description about panic attacks is also completely normal.   They often arise unrelated to particular conditions at a given moment.  They are a healthy symptom your body is trying to expel bad feelings and does this by having the anxiety erupt at times.So, self-acceptance, tolerance of being on a process of clearing out worn out emotional clutter, and sleep at odd times if possible, are all ways to stabilize yourself, which will also feel calm and good!",
      //     ],
      //     question: res1.text,
      //     search_model: "davinci",
      //     model: "davinci",
      //     examples_context:
      //       "Answers about our inner lives are most successfully reached from a sense of feeling grounded in oneself.First step is to accept your nervousness and restless sleep.  As often as possible, sleep during daytimes in order for your body to catch up on its need for rest.Accept too about feeling down.  It is normal to feel down once in a while.  From this place of self-acceptance, trust any answers which come up to your mind.  Often answers about complicated topics come in small pieces, not all at once as a whole unit.Also, your description about panic attacks is also completely normal.   They often arise unrelated to particular conditions at a given moment.  They are a healthy symptom your body is trying to expel bad feelings and does this by having the anxiety erupt at times.So, self-acceptance, tolerance of being on a process of clearing out worn out emotional clutter, and sleep at odd times if possible, are all ways to stabilize yourself, which will also feel calm and good!",
      //     examples: [
      //       [
      //         "I'm going through some things with my feelings and myself. I barely sleep and I do nothing but think about how I'm worthless and how I shouldn't be here. I've never tried or contemplated suicide. I've always wanted to fix my issues, but I never get around to it. How can I change my feeling of being worthless to everyone?",
      //         "If everyone thinks you're worthless, then maybe you need to find new people to hang out with.Seriously, the social context in which a person lives is a big influence in self-esteem.Otherwise, you can go round and round trying to understand why you're not worthless, then go back to the same crowd and be knocked down again.There are many inspirational messages you can find in social media.  Maybe read some of the ones which state that no person is worthless, and that everyone has a good purpose to their life.Also, since our culture is so saturated with the belief that if someone doesn't feel good about themselves that this is somehow terrible.Bad feelings are part of living.  They are the motivation to remove ourselves from situations and relationships which do us more harm than good.Bad feelings do feel terrible.   Your feeling of worthlessness may be good in the sense of motivating you to find out that you are much better than your feelings today.",
      //       ],
      //     ],
      //     max_tokens: 55,
      //     stop: ["\n", "<|endoftext|>"],
      //   });
      // };

      const generate_answer = async () => {
        return await openai.complete({
          engine: "davinci",
          prompt: `Create a therapist-like answer to the following:\nI'm going through some things with my feelings and myself. I barely sleep and I do nothing but think about how I'm worthless and how I shouldn't be here: If everyone thinks you're worthless, then maybe you need to find new people to hang out with. Seriously, the social context in which a person lives is a big influence in self-esteem. Otherwise, you can go round and round trying to understand why you're not worthless, then go back to the same crowd and be knocked down again.\n\nI have so many issues to address. I have a history of sexual abuse, I’m a breast cancer survivor and I am a lifetime insomniac. I have a long history of depression and I’m beginning to have anxiety. I have low self esteem but I’ve been happily married for almost 35 years: Let me start by saying there are never too many concerns that you can bring into counselling. In fact, most people who come to see me for counselling have more than one issue they would like to work on in psychotherapy and most times these are all interconnected. In counselling, we work together, collaboratively, to figure out which issues you would like to address first and then together we develop an individualized plan of care.\n\nI have been feeling more and more down for over a month. I have started having trouble sleeping due to panic attacks, but they are almost never triggered by something that I know of: First off, I would recommend seeing your doctor and getting a physical exam. If you have an underlying health problem, that needs to be addressed. If you don’t, I would recommend seeing a therapist and talking about your feelings.\n\nI’m facing severe depression and anxiety and I just feel like I’m going through a lot. This really distracts me and I cant get my mind off the things that are bothering me: If you are feeling this way, you may be at high risk for self-harm. I would recommend going to the nearest hospital and asking to see a doctor. They will be able to help you and direct you to the support you need.\n\nHow can I get to a place where I can be content from day to day?: This is a great question. First, you need to know that being content from day to day is a skill that can be learned. I would recommend seeing a therapist and developing this skill together.\n\n${res1.text}:`,
          maxTokens: 100,
          temperature: 0.7,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,
          stop: ["\n"],
        });
      };

      const generate_answerRes = await generate_answer();

      // Translate 1
      const filTopic = async () => {
        return await translate(topicRes.data.choices[0].text, {
          from: "en",
          to: "tl",
        })
          .then((r) => {
            // console.log("@paiva/translation-google");
            // console.log(r.text, "res.text");
            // return res.json({
            //   success: true,
            //   data: r.text,
            // });
            return r.text;
          })
          .catch((err) => {
            console.error(err);
            // return res.json({
            //   errors: errorHandler(err),
            // });
          });
      };

      // Translate 2
      const filSecondPerson = async () => {
        return await translate(second_personRes.data.choices[0].text, {
          from: "en",
          to: "tl",
        })
          .then((r) => {
            // console.log("@paiva/translation-google");
            // console.log(r.text, "res.text");
            // return res.json({
            //   success: true,
            //   data: r.text,
            // });
            return r.text;
          })
          .catch((err) => {
            console.error(err);
            // return res.json({
            //   errors: errorHandler(err),
            // });
          });
      };

      // Translate 3
      // const filEssay = async () => {
      //   return await translate(generate_essayRes.data.choices[0].text, {
      //     from: "en",
      //     to: "tl",
      //   })
      //     .then((r) => {
      //       // console.log("@paiva/translation-google");
      //       // console.log(r.text, "res.text");
      //       // return res.json({
      //       //   success: true,
      //       //   data: r.text,
      //       // });
      //       return r.text;
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //       // return res.json({
      //       //   errors: errorHandler(err),
      //       // });
      //     });
      // };

      // Translate 4
      const filAnswers = async () => {
        // generate_answerRes.data.answers
        return await translate(generate_answerRes.data.choices[0].text, {
          from: "en",
          to: "tl",
        })
          .then((r) => {
            // console.log("@paiva/translation-google");
            // console.log(r.text, "res.text");
            // return res.json({
            //   success: true,
            //   data: r.text,
            // });
            return r.text;
          })
          .catch((err) => {
            console.error(err);
            // return res.json({
            //   errors: errorHandler(err),
            // });
          });
      };

      const awaitfilTopic = await filTopic();
      const awaitfilSecondPerson = await filSecondPerson();
      // const awaitfilEssay = await filEssay();
      const awaitfilAnswers = await filAnswers();
      // Orig Query English Converted
      console.log(res1.text);
      // Topic
      console.log(topicRes.data.choices[0].text);
      // Secondary Person Explanation
      console.log(second_personRes.data.choices[0].text);
      // Essay about the topic
      // console.log(generate_essayRes.data.choices[0].text);
      // Answer
      // generate_answerRes.data.answers
      console.log(generate_answerRes.data.choices[0].text);
      // Translate to tagalog
      console.log(awaitfilTopic);
      console.log(awaitfilSecondPerson);
      // console.log(awaitfilEssay);
      console.log(awaitfilAnswers);
      return res.json({
        success: true,
        filTopic: awaitfilTopic,
        filSecondPerson: awaitfilSecondPerson,
        // filEssay: awaitfilEssay,
        filAnswers: awaitfilAnswers,
        topic: topicRes.data.choices[0].text,
        second_person: second_personRes.data.choices[0].text,
        // generate_essay: generate_essayRes.data.choices[0].text,
        generate_answer: generate_answerRes.data.choices[0].text,
      });
    })
    .catch((err) => {
      // console.error(err);
      return res.json({
        error: "Server Error",
      });
    });
  // console.log(translated);
};

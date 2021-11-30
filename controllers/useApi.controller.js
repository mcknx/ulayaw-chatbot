// const User = require('../models/auth.model');
// const expressJwt = require('express-jwt');
const { translate } = require("@paiva/translation-google");
const cookie = require("universal-cookie-express");
var Sentiment = require("sentiment");
const express = require("express");
const router = express.Router();
var tensify = require("tensify");
// const chatbot = require("../chatbot/chatbot");

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
  const { inputData } = req.params.words;
  //   const inputData = "Matagal ako makatulog.";
  console.log(inputData);
  let translated;

  // @paiva/translation-google
  await translate(inputData, {
    from: "tl",
    to: "en",
  })
    .then((res) => {
      // console.log("@paiva/translation-google");
      // console.log(res.text, "res.text");
      translated = res.text;
      // return res.json({
      //   success: true,
      //   data: res.text,
      // });
      // return res.text;
    })
    .catch((err) => {
      console.error(err);
      // return res.json({
      //   errors: errorHandler(err),
      // });
    });
  // niaging week sukad pag announce sa deadline sa capstone

  // Simple
  // Ang buhay mismo ay ang pinaka kahanga-hangang fairy tale.
  // Ang tunay na kaluwalhatian ay nagmumula sa tahimik na pananakop sa ating sarili.

  // Compound
  // Maaaring mahirap sa una, ngunit ang lahat ay mahirap sa una.
  // Alam nating nagsi sinungaling sila, alam nilang nagsisinungaling sila, alam nilang nagsisinungaling sila, alam nating alam nating nagsisinungaling sila, pero nagsisinungaling pa rin sila.

  // const StanfordCoreNLPClient = require("corenlp-client");
  // const client = new StanfordCoreNLPClient(
  //   "https://corenlp.run",
  //   "tokenize,ssplit,parse,pos"
  // );

  // JSON.stringify(result, null, 2)

  // Other containers
  let rootWordIndex;
  let rootWordPrevCon = [];
  let rootWordNextCon = [];
  let basicDep = [];
  let posTagCont = [];

  // BasicDEP containers
  // https://stackoverflow.com/questions/50431155/whats-the-tags-meaning-of-stanford-dependency-parser3-9-1

  // https://wiki.opencog.org/w/Dependency_relations

  // https://downloads.cs.stanford.edu/nlp/software/dependencies_manual.pdf
  // https://universaldependencies.org/u/dep/
  let rootWord = [];
  let nsubj = [];
  let acl = [];
  let acl_relcl = [];
  let advcl = [];
  let advmod = [];
  let advmod_emph = [];
  let advmod_lmod = [];
  let amod = [];
  let appos = [];
  let aux = [];
  let auxpass = [];
  let case1 = [];
  let cc = [];
  let cc_preconj = [];
  let ccomp = [];
  let clf = [];

  let compound = [];
  let compound_lvc = [];
  let compound_prt = [];
  let compound_redup = [];
  let compound_svc = [];
  let conj = [];
  let cop = [];
  let csubj = [];
  let csubjpass = [];
  let dep = [];
  let det_numgov = [];
  let det_nummod = [];
  let det_poss = [];
  let discourse = [];
  let dislocated = [];
  // let dobj = [];
  let expl = [];
  let expl_impers = [];
  let expl_pass = [];
  let expl_pv = [];
  // let foreign = [];
  let fixed = [];
  let flat = [];
  let flat_foreign = [];
  let flat_name = [];
  let goeswith = [];
  let iobj = [];
  let list = [];
  let mark = [];
  // let mwe = [];
  // let name = [];
  // let neg = [];
  let nmod = [];
  // let nmod_npmod = [];
  let nmod_poss = [];
  let nmod_tmod = [];
  let nsubjpass = [];
  let nummod = [];
  let nummod_gov = [];
  let obj = [];
  let obl = [];
  let obl_agent = [];
  let obl_arg = [];
  let obl_lmod = [];
  let obl_tmod = [];
  let orphan = [];
  let parataxis = [];
  let punct = [];
  // let remnant = [];
  let reparandum = [];
  let root = [];
  let vocative = [];
  let xcomp = [];

  // POS containers
  // https://stackoverflow.com/questions/1833252/java-stanford-nlp-part-of-speech-labels
  let verb = [];

  //   sentiment
  var sentiment = new Sentiment();
  var resultSentiment = sentiment.analyze(translated);

  console.dir(resultSentiment); // Score: -2, Comparative: -0.666

  //   corenlp
  const StanfordCoreNLPClient = require("corenlp-client");
  // http://localhost:9000
  const client = new StanfordCoreNLPClient(
    "https://corenlp.run",
    "tokenize,ssplit,parse,pos"
  );
  const annotatedText = await client
    .annotate(translated)
    // .annotate("I am a bad person")
    .then((result) => {
      // console.log(result.sentences[0].basicDependencies.length);
      basicDep = result.sentences[0].basicDependencies;
      posTagCont = result.sentences[0].tokens;

      result.sentences[0].basicDependencies.map((x) => {
        if (x.dep === "ROOT") {
          rootWord = x;
        }
        _handlePushContainer(x.dep, "acl", acl, x);
        _handlePushContainer(x.dep, "acl:relcl", acl_relcl, x);
        _handlePushContainer(x.dep, "advcl", advcl, x);
        _handlePushContainer(x.dep, "advmod", advmod, x);
        _handlePushContainer(x.dep, "advmod:emph", advmod_emph, x);
        _handlePushContainer(x.dep, "advmod:lmod", advmod_lmod, x);
        _handlePushContainer(x.dep, "amod", amod, x);
        _handlePushContainer(x.dep, "appos", appos, x);
        _handlePushContainer(x.dep, "aux", aux, x);
        _handlePushContainer(x.dep, "auxpass", auxpass, x);
        _handlePushContainer(x.dep, "case1", case1, x);
        _handlePushContainer(x.dep, "cc", cc, x);
        _handlePushContainer(x.dep, "cc:preconj", cc_preconj, x);
        _handlePushContainer(x.dep, "ccomp", ccomp, x);
        _handlePushContainer(x.dep, "clf", clf, x);
        _handlePushContainer(x.dep, "compound", compound, x);
        _handlePushContainer(x.dep, "compound:lvc", compound_lvc, x);
        _handlePushContainer(x.dep, "compound:prt", compound_prt, x);
        _handlePushContainer(x.dep, "compound:redup", compound_redup, x);
        _handlePushContainer(x.dep, "compound:svc", compound_svc, x);
        _handlePushContainer(x.dep, "conj", conj, x);
        _handlePushContainer(x.dep, "cop", cop, x);
        _handlePushContainer(x.dep, "csubj", csubj, x);
        _handlePushContainer(x.dep, "csubjpass", csubjpass, x);
        _handlePushContainer(x.dep, "dep", dep, x);
        _handlePushContainer(x.dep, "det:numgov", det_numgov, x);
        _handlePushContainer(x.dep, "det:nummod", det_nummod, x);
        _handlePushContainer(x.dep, "det:poss", det_poss, x);
        _handlePushContainer(x.dep, "discourse", discourse, x);
        _handlePushContainer(x.dep, "dislocated", dislocated, x);
        _handlePushContainer(x.dep, "expl", expl, x);
        _handlePushContainer(x.dep, "expl:impers", expl_impers, x);
        _handlePushContainer(x.dep, "expl:pass", expl_pass, x);
        _handlePushContainer(x.dep, "expl:pv", expl_pv, x);
        _handlePushContainer(x.dep, "fixe:", fixed, x);
        _handlePushContainer(x.dep, "flat", flat, x);
        _handlePushContainer(x.dep, "flat:foreign", flat_foreign, x);
        _handlePushContainer(x.dep, "flat:name", flat_name, x);
        _handlePushContainer(x.dep, "goeswith", goeswith, x);
        _handlePushContainer(x.dep, "iobj", iobj, x);
        _handlePushContainer(x.dep, "list", list, x);
        _handlePushContainer(x.dep, "mark", mark, x);
        _handlePushContainer(x.dep, "nmod", nmod, x);
        _handlePushContainer(x.dep, "nmod:poss", nmod_poss, x);
        _handlePushContainer(x.dep, "nmod:tmod", nmod_tmod, x);
        _handlePushContainer(x.dep, "nsubj", nsubj, x);
        _handlePushContainer(x.dep, "nsubjpass", nsubjpass, x);
        _handlePushContainer(x.dep, "nummod", nummod, x);
        _handlePushContainer(x.dep, "nummod_gov", nummod_gov, x);
        _handlePushContainer(x.dep, "obj", obj, x);
        _handlePushContainer(x.dep, "obl", obl, x);
        _handlePushContainer(x.dep, "obl:agent", obl_agent, x);
        _handlePushContainer(x.dep, "obl:arg", obl_arg, x);
        _handlePushContainer(x.dep, "obl:lmod", obl_lmod, x);
        _handlePushContainer(x.dep, "obl:tmod", obl_tmod, x);
        _handlePushContainer(x.dep, "orphan", orphan, x);
        _handlePushContainer(x.dep, "parataxis", parataxis, x);
        _handlePushContainer(x.dep, "punct", punct, x);
        _handlePushContainer(x.dep, "reparandum", reparandum, x);
        _handlePushContainer(x.dep, "root", root, x);
        _handlePushContainer(x.dep, "vocative", vocative, x);
        _handlePushContainer(x.dep, "xcomp", xcomp, x);
      });
      result.sentences[0].tokens.map((x) => {
        // getting the verbs
        if (
          x.pos === "VBG" ||
          x.pos === "VBD" ||
          x.pos === "VBN" ||
          x.pos === "VBG" ||
          x.pos === "VBP" ||
          x.pos === "VBZ"
        ) {
          if (!verb.includes(x)) {
            verb.push(x);
          }
        }
      });
      return result;
    });

  //   return [
  //     // "annotatedText",
  //     // annotatedText,
  //     "translated",
  //     translated,
  //     "resultSentiment",
  //     resultSentiment,
  //   ];
  posTagCont = posTagCont.map((item) => {
    return {
      index: item.index,
      pos: item.pos,
      word: item.word,
      originWord: item.originalText,
    };
  });
  console.log(
    "posTagCont",
    posTagCont,
    "basicDep",
    basicDep,
    "translated",
    translated,
    "resultSentiment",
    resultSentiment
  );

  let tagalogResponse;

  if (resultSentiment.positive.length != 0) {
    tagalogResponse = "I see that must be a good " + basicDep[0].dependentGloss;
    console.log("I see that must be a good ", basicDep[0].dependentGloss);
  }

  if (resultSentiment.negative.length != 0) {
    tagalogResponse = "I see that must be a bad " + basicDep[0].dependentGloss;
    console.log("I see that must be a bad ", basicDep[0].dependentGloss);
  }

  let tagalogResponseResult;
  await translate(tagalogResponse, {
    from: "en",
    to: "tl",
  }).then((res) => {
    // console.log("@paiva/translation-google");

    tagalogResponseResult = res.text;
    console.log(tagalogResponseResult, "tagalogResponseResult");
  });
  console.log(tagalogResponseResult, "tagalogResponseResult2");

  //   Case (PRP)
  return [tagalogResponseResult];
};
function _handlePushContainer(val1, val2, arr, x) {
  if (val1 === val2) {
    return arr.push(x);
  }
  // return false;
}

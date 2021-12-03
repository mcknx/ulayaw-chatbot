const { https } = require("follow-redirects");

const languages = {
  auto: "Automatic",
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese Simplified",
  "zh-tw": "Chinese Traditional",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  iw: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ma: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu",
};

function getCode(desiredLang) {
  if (!desiredLang) {
    return false;
  }

  desiredLang = desiredLang.toLowerCase();

  if (languages[desiredLang]) {
    return desiredLang;
  }

  const langKey = Object.keys(languages).find((key) => {
    if (typeof languages[key] !== "string") {
      return false;
    }

    return languages[key].toLowerCase() === desiredLang;
  });

  return langKey || false;
}

function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}

function retryPost(url, options = {}, retries = 10, backoff = 300) {
  const retryCodes = new Set([408, 429, 500, 502, 503, 504, 522, 524]);
  return new Promise((resolve, reject) => {
    try {
      https
        .request(
          url,
          {
            method: "POST",
            rejectUnauthorized: false,
            ...options,
          },
          (response) => {
            let data = "";
            const { statusCode } = response;
            if (statusCode < 200 || statusCode > 299) {
              if (retries > 0 && retryCodes.has(statusCode)) {
                setTimeout(() => {
                  resolve(retryPost(url, options, retries - 1, backoff * 2));
                }, backoff);
              } else {
                reject(new Error(response));
              }
            } else {
              response.on("data", (d) => {
                data += d;
              });
              response.on("end", () => {
                resolve(JSON.parse(data));
              });
            }
          }
        )
        .end();
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => {
          resolve(retryPost(url, options, retries - 1, backoff * 2));
        }, backoff);
      } else {
        reject(error);
      }
    }
  });
}

function translate(text, options) {
  options = options || {};

  let error;
  [options.from, options.to].forEach((lang) => {
    if (lang && !isSupported(lang)) {
      error = new Error();
      error.code = 400;
      error.message = "The language '" + lang + "' is not supported";
    }
  });
  if (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }

  options.suffix = options.suffix || "com";
  options.from = options.from || "auto";
  options.to = options.to || "en";

  options.from = getCode(options.from);
  options.to = getCode(options.to);

  const url =
    "https://translate.google." + options.suffix + "/translate_a/single";
  const searchParameters = new URLSearchParams([
    ["client", "gtx"],
    ["sl", options.from],
    ["tl", options.to],
    ["hl", options.to],
    ["dt", "at"],
    ["dt", "bd"],
    ["dt", "ex"],
    ["dt", "ld"],
    ["dt", "md"],
    ["dt", "qca"],
    ["dt", "rw"],
    ["dt", "rm"],
    ["dt", "ss"],
    ["dt", "t"],
    ["ie", "UTF-8"],
    ["oe", "UTF-8"],
    ["otf", 1],
    ["ssel", 0],
    ["tsel", 0],
    ["kc", 7],
    ["q", text],
  ]);
  return retryPost(
    url + "?" + searchParameters.toString(),
    {
      agent: options.agent,
    },
    options.retries,
    options.backoff
  )
    .then((body) => {
      const result = {
        text: "",
        from: {
          language: {
            didYouMean: false,
            iso: "",
          },
          text: {
            autoCorrected: false,
            value: "",
            didYouMean: false,
          },
        },
        raw: "",
      };

      if (options.raw) {
        result.raw = body;
      }

      body[0].forEach((o) => {
        if (o[0]) {
          result.text += o[0];
        }
      });

      if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2];
      } else {
        result.from.language.didYouMean = true;
        result.from.language.iso = body[8][0][0];
      }

      if (body[7] && body[7][0]) {
        let translatedText = body[7][0];

        translatedText = translatedText.replace(/<b><i>/g, "[");
        translatedText = translatedText.replace(/<\/i><\/b>/g, "]");

        result.from.text.value = translatedText;

        if (body[7][5] === true) {
          result.from.text.autoCorrected = true;
        } else {
          result.from.text.didYouMean = true;
        }
      }

      return result;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  translate,
  languages,
  getCode,
  isSupported,
};

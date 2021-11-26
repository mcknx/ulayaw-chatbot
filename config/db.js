const mongoose = require("mongoose");
const config = require("./keys");

const connectDB = async () => {
  // process.env.MONGO_URL
  const connection = await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDB;

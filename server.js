const app = require("./index");
const mongoose = require("mongoose");

app.listen(process.env.port, () => {
  mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
      console.log(`App listening at http://localhost:${process.env.port}`);
    })
    .catch((err) => console.log(err));
});
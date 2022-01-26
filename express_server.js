const express = require("express");
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const req = require("express/lib/request");

app.use(cookieParser())


app.use(bodyParser.urlencoded({ extended: true }));



function generateRandomString() {

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  return generateString(6)
}

console.log(generateRandomString())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { username, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies["username"]
  const templateVars = { username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6)
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`)

  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");   
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL
  res.redirect("/urls")
});


app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username)
  res.redirect("/urls")
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


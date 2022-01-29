const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const req = require("express/lib/request");
const { use } = require("express/lib/application");

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

const userAlreadyExists = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return true
    }
  } return false;
};

const emailAlreadyExists = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return true
      return users[user].id
    }
  } return false;
}

const urlsForUser = (id) => {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

//object with the short and long URLs
const urlDatabase = {
  // "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  // "9sm5xK": { longURL: "http://www.google.com", userID: "userRandomID" },
};

// object with all the users data
const users = {
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur"
  // },
  // "user2RandomID": {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk"
  // }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // const username = req.cookies["user_ID"]
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlsForUser(req.cookies["user_id"]),
  };

  res.render("urls_index", templateVars);
});

// if user is logged in, they will see a rendered HTML template of urls_new.ejs
// if not, the will be redirected back to the login page

app.get("/urls/new", (req, res) => {
  // const username = req.cookies["username"]
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  } else {
    let templateVars = {
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  // const username = req.cookies["username"]
  let templateVars = {
    // username, 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    urlUserID: urlDatabase[req.params.shortURL].userID,
    user: users[req.cookies["user_id"]],
  };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6)
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"],
  };
  res.redirect(`/urls/${shortURL}`)
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");   
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // const shortURL = req.params.shortURL
  // delete urlDatabase[shortURL]
  // res.redirect("/urls")
  const userID = req.cookies["user_id"];
  const userUrls = urlsForUser(userID);
  if (Object.keys(userUrls).includes(req.params.shortURL)) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.send(401);
  }
});

app.post("/urls/:id", (req, res) => {
  // const shortURL = req.params.id
  // const longURL = req.body.longURL
  // urlDatabase[shortURL] = longURL
  // res.redirect("/urls")
  const userID = req.cookies["user_id"];
  const userUrls = urlsForUser(userID);
  if (Object.keys(userUrls).includes(req.params.id)) {
    const shortURL = req.params.id;
    urlDatabase[shortURL].longURL = req.body.newURL;
    res.redirect('/urls');
  } else {
    res.send(401);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL === undefined) {
    res.send(302);
  } else {
    res.redirect(longURL);
  }
});

// use this template for registration form 

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_registration", templateVars)
});

app.post("/register", (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  if (!submittedEmail || !submittedPassword) {
    res.send(400, "Please include both a valid email and password");
  };

  if (userAlreadyExists(submittedEmail)) {
    res.send(400, "An account already exists for this email address");
  };

  const newUserID = generateRandomString();
  users[newUserID] = {
    id: newUserID,
    email: submittedEmail,
    password: bcrypt.hashSync(submittedPassword, 10),
  };
  res.cookie('user_id', newUserID);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  // const username = req.body.username;
  // res.cookie("username", username)
  // res.redirect("/urls")
  const email = req.body.email;
  const password = req.body.password;

  if (!emailAlreadyExists(email)) {
    res.send(403, "There is no account associated with this email address");
  } else {
    const userID = emailAlreadyExists(email);
    if (!bcrypt.compareSync(password, users[userID].password)) {
      res.send(403, "The password you entered does not match the one associated with the provided email address");
    } else {
      res.cookie('user_id', userID);
      res.redirect("/urls");
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


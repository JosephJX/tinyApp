/* Generates a random string, used for creating short URLs and userIDs */
const generateRandomString = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

// checks if email matches a user in the database
const emailHasUser = (email, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
};

// takes an email and checks the database, returns the corresponding user id
const userIdFromEmail = (email, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].id;
    }
  }
};

// returns an object of shorturls specfic to the given user id
const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

//checks if current cookie matches user in Database
const cookieHasUser = (cookie, userDatabase) => {
  for (const user in userDatabase) {
    if (cookie === user) {
      return true;
    }
  }
};

module.exports = {
  generateRandomString,
  emailHasUser,
  userIdFromEmail,
  urlsForUser,
  cookieHasUser,
};
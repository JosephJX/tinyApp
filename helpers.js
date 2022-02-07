/* Generates a random string, used for creating short URLs and userIDs */
const generateRandomString = () => {

  function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  return generateString(6)
};

// checks if email matches a user in the database
const emailHasUser = (email, userDatabase) => {
  for (const user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
  return false;
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
  cookieHasUser
};
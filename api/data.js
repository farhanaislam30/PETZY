import fs from "fs";

export const users = JSON.parse(fs.readFileSync("./data.json", "utf8"));

export const addUser = (user) => {
  const userStr = JSON.stringify([...users, user]);
  fs.writeFile("./data.json", userStr, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
};

export const removeUser = (usersAfterDelete) => {
  const userStr = JSON.stringify(usersAfterDelete);
  fs.writeFile("./data.json", userStr, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
};

export const updateUser = (updateUsers) => {
  const userStr = JSON.stringify(updateUsers);
  fs.writeFile("./data.json", userStr, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
};

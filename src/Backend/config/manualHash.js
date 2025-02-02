// run file ini untuk manual hashing password run sekali aja
const bcrypt = require("bcrypt");
const { User, sequelize } = require("./index");
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const users = await User.findAll();
    for (const user of users) {
      if (!user.password.startsWith("$2b$")) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await user.update({ password: hashedPassword });
        console.log(`Updated password for: ${user.email}`);
      }
    }
    console.log("All passwords hashed successfully!");
  } catch (error) {
    console.error("Error updating passwords:", error);
  } finally {
    await sequelize.close();
  }
})();


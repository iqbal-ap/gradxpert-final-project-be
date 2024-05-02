function authenticateDb(sequelize) {
  try {
    sequelize.authenticate()
    console.log('Successfully connect to database!');
  } catch (error) {
    console.log('Failed to connect to database!');
    console.log(error)
    process.exit(1);
  }
}

module.exports = {
  authenticateDb,
}
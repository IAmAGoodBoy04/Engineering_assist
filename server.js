const app = require('./src/app');
const connectDB = require('./src/config/db.config.js');
const fetchAccessPointURL = require('./src/utils/fetchAccessPointURL'); // Import the function

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  try {
    const accessPointURL = await fetchAccessPointURL();
    process.env.FLASK_URL = accessPointURL; // Set the environment variable

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Flask URL: ${process.env.FLASK_URL}`);
    });
  } catch (error) {
    console.error('Failed to fetch access point URL', error);
    process.exit(1);
  }
});
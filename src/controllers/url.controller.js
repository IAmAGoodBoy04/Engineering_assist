exports.getURL = (req, res) => {
    const flaskURL = process.env.FLASK_URL;
    if (flaskURL) {
      res.status(200).send({ url: flaskURL });
    } else {
      res.status(500).send({ message: 'FLASK_URL is not set' });
    }
  };
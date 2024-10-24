exports.getURL = async (req, res) => {
	const flaskURL = await fetchAccessPointURL();
	process.env.FLASK_URL = flaskURL;
	if (flaskURL) {
		res.status(200).send({ url: flaskURL });
	} else {
		res.status(500).send({ message: 'FLASK_URL is not set' });
	}
};
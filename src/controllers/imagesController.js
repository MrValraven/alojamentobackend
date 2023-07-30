const path = require('path');
const fs = require('fs');

const getImage = (request, response) => {
  const { folder, imageName } = request.params;
  const imagePath = path.join(__dirname, '..', 'posts', folder, imageName);

  if (fs.existsSync(imagePath)) {
    response.sendFile(imagePath);
  } else response.status(404).json({ message: "File doesn't exist" });
};

module.exports = { getImage };

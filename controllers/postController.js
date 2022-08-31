const Post = require("../model/Post");
const AutoCounter = require("../model/AutoCounter");
const optimizeAndUploadFiles = require("../middleware/fileOptimization");

const createPost = async (request, response) => {
  const {
    ownerId,
    publicationDate,
    type,
    title,
    price,
    description,
    typology,
    acceptedGender,
    isFurnished,
    hasKitchen,
    hasLivingRoom,
    isLgbtFriendly,
    isPetsAllowed,
    isCouplesAllowed,
    isSmokingAllowed,
    isExpensesIncluded,
    numberOfBathrooms,
    address,
    city,
    postalCode,
    contactName,
    contactNumber,
    contactEmail,
  } = request.body;
  const counterId = "630f774f2acf439177bcfec7";
  const files = request.body.photos;

  const counter = await AutoCounter.findOne({ _id: counterId });
  const currentPostNumber = counter.count;

  const folderName = `anuncio${currentPostNumber}`;

  const filesArrayLength = Object.keys(files).length;

  await optimizeAndUploadFiles(files, folderName);

  const postPhotos = [];

  for (let i = 0; i < filesArrayLength; i++) {
    postPhotos.push(`${folderName}/foto${i}.jpg`);
  }

  try {
    //create and store the new user
    const newPost = await Post.create({
      postSlug: currentPostNumber,
      ownerId,
      publicationDate,
      type,
      title,
      price,
      description,
      photos: postPhotos,
      typology,
      acceptedGender,
      isFurnished,
      hasKitchen,
      hasLivingRoom,
      isLgbtFriendly,
      isPetsAllowed,
      isCouplesAllowed,
      isSmokingAllowed,
      isExpensesIncluded,
      numberOfBathrooms,
      address,
      city,
      postalCode,
      contactName,
      contactNumber,
      contactEmail,
    });

    //increment count value
    counter.count++;

    const resultCounter = counter.save();

    response.json({ message: "Post created sucessfully" });
  } catch (error) {
    console.log("error on post creation: ", error);
    response.json({ message: "error" });
  }
};

module.exports = { createPost };

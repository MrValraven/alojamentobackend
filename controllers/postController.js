const Post = require("../model/Post");
const User = require("../model/User");
const AutoCounter = require("../model/AutoCounter");
const optimizeAndUploadFiles = require("../middleware/fileOptimization");

const createPost = async (request, response) => {
  const {
    ownerId,
    publicationDate,
    publicationDateString,
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
  const files = request.files["file"];

  const counter = await AutoCounter.findOne({ _id: counterId });
  const currentPostNumber = counter.count;

  const folderName = `anuncio${currentPostNumber}`;

  const filesArrayLength = files.length;

  await optimizeAndUploadFiles(files, folderName);

  const postPhotos = [];

  for (let i = 0; i < filesArrayLength; i++) {
    postPhotos.push(`${folderName}/foto${i}.jpg`);
  }

  const user = await User.findOne({ email: contactEmail });
  user.posts.push(currentPostNumber);

  const result = await user.save();

  try {
    //create and store the new user
    const newPost = await Post.create({
      postSlug: currentPostNumber,
      ownerId,
      publicationDate,
      publicationDateString,
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

const getAllPosts = async (request, response) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });

  if (!posts) {
    return response.status(400).send("Error! No posts available");
  }

  response.send(posts);
};

const getPostById = async (request, response) => {
  const post = await Post.findOne({ postSlug: request.params.postSlug });

  if (!post) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  response.send(post);
};

module.exports = { createPost, getAllPosts, getPostById };

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
  const files = request.files["file"];

  const counter = await AutoCounter.findOne();
  const currentPostNumber = counter.count;

  const folderName = `anuncio${currentPostNumber}`;

  const filesArrayLength = files.length;

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
  const posts = await Post.find({}).sort({ publicationDate: -1 });

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

const getPostsByOwnerId = async (request, response) => {
  const post = await Post.find({ email: request.params.owner_id });

  if (!post) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  response.status(200).send(post);
};

const deletePostBySlug = async (request, response) => {
  const post = await Post.deleteOne({
    postSlug: request.params.postSlug,
  });

  console.log(post);

  if (!post.deletedCount) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  response.status(200).json({ message: "Post deleted sucessfully" });
};

const editPost = async (request, response) => {
  try {
    const {
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
    } = request.body;

    const post = await Post.findOneAndUpdate(
      {
        postSlug: request.params.postSlug,
      },
      {
        title: title,
        price: price,
        description: description,
        typology: typology,
        acceptedGender: acceptedGender,
        isFurnished: isFurnished,
        hasKitchen: hasKitchen,
        hasLivingRoom: hasLivingRoom,
        isLgbtFriendly: isLgbtFriendly,
        isPetsAllowed: isPetsAllowed,
        isCouplesAllowed: isCouplesAllowed,
        isSmokingAllowed: isSmokingAllowed,
        isExpensesIncluded: isExpensesIncluded,
        numberOfBathrooms: numberOfBathrooms,
        address: address,
        city: city,
        postalCode: postalCode,
      },
      {
        new: true,
      }
    );

    if (!post) {
      return response.status(400).send("Error! Post doesn't exist");
    }

    response.status(200).json({ message: "Post updated sucessfully" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByOwnerId,
  deletePostBySlug,
  editPost,
};

/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const Post = require('../model/Post');
const User = require('../model/User');
const AutoCounter = require('../model/AutoCounter');
const optimizeAndUploadFiles = require('../middleware/fileOptimization');
const { sendEmail } = require('../utils/email');

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
  const files = request.files.file;

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
    // create and store the new user
    await Post.create({
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

    // increment count value
    counter.count++;
    counter.save();

    response.json({ message: 'Post created successfully' });
  } catch (error) {
    console.log('Error on post creation: ', error);
    response.json({ message: 'error' });
  }
};

const getAllPosts = async (request, response) => {
  const posts = await Post.find({}).sort({ publicationDate: -1 });

  if (!posts) {
    return response.status(400).send('Error! No posts available');
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
  const posts = await Post.find({ email: request.params.owner_id });

  if (!posts) {
    return response.status(400).send("Error! User doesn't have any posts");
  }

  response.status(200).send(posts);
};

const deletePostBySlug = async (request, response) => {
  const post = await Post.deleteOne({
    postSlug: request.params.postSlug,
  });

  if (!post.deletedCount) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  response.status(200).json({ message: 'Post deleted successfully' });
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
      },
      {
        new: true,
      },
    );

    if (!post) {
      return response.status(400).send("Error! Post doesn't exist");
    }

    response.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.log(error);
  }
};

const approvePost = async (request, response) => {
  const post = await Post.findOne({ postSlug: request.body.postSlug });

  if (!post) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  const userFoundInDatabase = await User.findOne({
    _id: request.body.userID,
  }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  const isUserAdmin = !userFoundInDatabase.roles.admin;

  if (!isUserAdmin) {
    return response.status(400).json({ message: "You don't have permissions to do that action" });
  }

  post.isApprovedByAdmin = true;
  await post.save();

  sendEmail(
    request.body.ownerEmail,
    'O seu anúncio foi aceite | Portal do Alojamento',
    request.body.messageInPlainText,
    request.body.messageInHTML,
  );

  response.status(201).json({ message: 'Post successfully approved' });
};

const rejectAndDeletePost = async (request, response) => {
  const userFoundInDatabase = await User.findOne({
    _id: request.body.userID,
  }).exec();

  if (!userFoundInDatabase) {
    return response.status(401).json({ message: "User doesn't exist" });
  }

  const isUserAnAdmin = !userFoundInDatabase.roles.admin;

  if (!isUserAnAdmin) {
    return response.status(400).json({ message: "You don't have permissions to do that action" });
  }

  const post = await Post.deleteOne({
    postSlug: request.body.postSlug,
  });

  if (!post.deletedCount) {
    return response.status(400).send("Error! Post doesn't exist");
  }

  const folderName = `anuncio${request.body.postSlug}`;
  const folderPath = path.join(__dirname, '..', 'posts', folderName);

  try {
    if (fs.existsSync(folderPath)) {
      await fsPromises.rmdir(folderPath);
    }
  } catch (error) {
    console.log(error);
  }

  sendEmail(
    request.body.ownerEmail,
    'O seu anúncio foi rejeitado | Portal do Alojamento',
    request.body.messageInPlainText,
    request.body.messageInHTML,
  );

  response.status(201).json({ message: 'Post rejected and deleted successfully' });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByOwnerId,
  deletePostBySlug,
  editPost,
  approvePost,
  rejectAndDeletePost,
};

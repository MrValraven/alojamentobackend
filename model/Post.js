const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  tipo: {
    type: String,
    required: false,
  },
  titulo: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  despesas_incluidas: {
    type: Boolean,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  fotos: {
    type: Array,
    required: true,
  },
  tipologia: {
    type: String,
    required: true,
  },
  genero_aceite: {
    type: String,
    required: true,
  },
  numero_casas_banho: {
    type: Number,
    required: false,
  },
  mobilado: {
    type: Boolean,
    required: true,
  },
  cozinha: {
    type: Boolean,
    required: true,
  },
  sala: {
    type: Boolean,
    required: true,
  },
  lgbt: {
    type: Boolean,
    required: true,
  },
  animais: {
    type: Boolean,
    required: true,
  },
  casais: {
    type: Boolean,
    required: true,
  },
  fumar: {
    type: Boolean,
    required: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  localidade: {
    type: String,
    required: true,
  },
  codigo_postal: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);

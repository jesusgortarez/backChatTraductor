const Messages = require("../models/messageModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const deepl = require('deepl-node');
require('dotenv').config();
const Token = process.env.Token_deep;

module.exports.getMessages = async (req, res, next) => {

  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, username, password, encryption, } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Error en el usuario", status: false });
    if( from != user._id.toString())
      return res.json({msg: "from y usuario no son iguales", status: false });
    if(encryption){
      if (password != user.password) 
        return res.json({ msg: "Error en la contraseña", status: false });
    }
    else{
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "Error en la contraseña", status: false });
    };

    const authKey = Token;
    const translator = new deepl.Translator(authKey, { serverUrl: 'https://api-free.deepl.com' });
    const result = await translator.translateText(message, 'es', 'en-US');
   
    const data = await Messages.create({
      message: { text: (message + " / " + result.text) },
      users: [from, to],
      sender: from,
    });
    if (data){
      return res.json({ msg: "Mensaje agregado correctamente", data:data.message.text});
    }
    else return res.json({ msg: "Erro al agregar el mensaje" });
  } catch (ex) {
    next(ex);
  }
};

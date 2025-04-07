// back/router/chatRouter.js
const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const WithAuth = require("../middleware/auth");

router.post("/chat", WithAuth, chatController.chatWithAI);

module.exports = router;
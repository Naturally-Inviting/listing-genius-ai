const { generateText } = require("./openai");

const getDescriptionText = async (req, res) => {
  try {
    const data = req.body;
    const openAIResult = await generateText(data);
    return res.status(200).json({ message: openAIResult });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getDescriptionText,
};

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env["OPEN_AI_KEY"],
});

async function generateText(data) {
  const openai = new OpenAIApi(configuration);

  let system =
    "You are a premiere Real Estate Agent. You are creative and experienced with selling homes and describing them in rich and meaningful ways. You will be provided with some JSON with home features. Using this JSON, write a description that you can use on a site like Zillow. The description should use about 600 characters. Be sure to hightlight items in `notable-features`";

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system },
        { role: "user", content: system },
        { role: "user", content: JSON.stringify(data) },
      ],
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    console.debug(response.data.choices);

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error("No response from OpenAI API.");
    }
  } catch (error) {
    console.error("Error:", error);

    throw error;
  }
}

module.exports = {
  generateText,
};

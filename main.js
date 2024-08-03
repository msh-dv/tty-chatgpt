const readline = require("node:readline");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

//Codigos de color

const blue = "\x1b[1;34m";
const green = "\x1b[1;32m";
const clear = "\x1b[0m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "User: ",
});

console.log("tty-chatGPT - v 1.0");

async function main() {
  try {
    rl.prompt()
    rl.on("line", async (input) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: input }],
        stream: true,
      });

      rl.output.write("Chat: ");
      for await (const word of completion) {
        rl.output.write(word.choices[0]?.delta?.content || "");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

main();

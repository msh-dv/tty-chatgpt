const readline = require("node:readline");
const OpenAI = require("openai");
const colors = require("colors");

require("dotenv").config();

const openai = new OpenAI();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colors.blue("User: "),
});

// const history = [];

console.log("tty-chatGPT - v 1.0\n");

async function main() {
  try {
    rl.prompt();
    rl.on("line", async (input) => {
      if (input.trim().toLowerCase() == "exit") {
        rl.output.write(colors.yellow("Hasta luego.\n"));
        rl.close();
        return;
      }
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        stream: true,
      });

      rl.output.write(colors.green("Chat: "));

      for await (const word of completion) {
        rl.output.write(word.choices[0]?.delta?.content || "");
      }

      console.log();
      rl.prompt();
    });
  } catch (error) {
    console.error("Error con la respuesta de OpenAI: " + error);
    rl.close();
  }
}

main();

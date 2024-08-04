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

const model = "gpt-3.5-turbo";
const history = [];

console.log("tty-chatgpt - v 1.0");
console.log(`modelo: ${colors.yellow(model)}\n`);

async function main() {
  try {
    rl.prompt();
    rl.on("line", async (input) => {
      if (input.trim().toLowerCase() == "exit") {
        rl.output.write(colors.yellow("Hasta luego.\n"));
        rl.close();
        return;
      }

      history.push({ role: "user", content: input.trim() });

      const mensajes = history;

      const completion = await openai.chat.completions.create({
        model: model,
        messages: mensajes,
        stream: true,
      });

      rl.output.write(colors.green("Chat: "));

      let completionText = "";

      for await (const word of completion) {
        completionText += word.choices[0]?.delta?.content || "";
        rl.output.write(word.choices[0]?.delta?.content || "");
      }

      history.push({ role: "assistant", content: completionText.trim()});
      console.log();
      rl.prompt();
    });
  } catch (error) {
    console.error("Error con la respuesta de OpenAI: " + error);
    rl.close();
  }
}

main();

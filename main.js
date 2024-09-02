const readline = require("node:readline");
const OpenAI = require("openai");
const colors = require("colors");

require("dotenv").config();

const openai = new OpenAI();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colors.brightBlue("User: "),
});

const model = "gpt-4o-mini";
const history = [];

console.log("tty-chatgpt - v 1.0");
console.log(`modelo: ${colors.brightYellow(model)}\n`);

async function main() {
  try {
    rl.prompt();
    rl.on("line", async (input) => {
      if (input.trim().toLowerCase() == "exit") {
        rl.output.write(colors.brightYellow("Hasta luego.\n"));
        rl.close();
        return;
      }

      const moderation = await openai.moderations.create({
        input: input.trim(),
      });

      const results = moderation.results[0];

      if (results.flagged) {
        // console.log(results.categories);
        // console.log(results.category_scores);
        rl.output.write(colors.bgRed("CONTENIDO SENSIBLE"));
        console.log();
        rl.prompt();
        return;
      }

      history.push({ role: "user", content: input.trim() });

      const mensajes = history;

      const completion = await openai.chat.completions.create({
        model: model,
        messages: mensajes,
        stream: true,
      });

      rl.output.write(colors.brightGreen(`${model}: `));

      let completionText = "";

      for await (const word of completion) {
        completionText += word.choices[0]?.delta?.content || "";
        rl.output.write(word.choices[0]?.delta?.content || "");
      }

      history.push({ role: "assistant", content: completionText.trim() });
      console.log();
      rl.prompt();
    });
  } catch (error) {
    console.error("Error con la respuesta de OpenAI: " + error);
    rl.close();
  }
}

main();

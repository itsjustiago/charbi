// Verificação em Chrome real: conta nós e arestas do grafo numa página.
// Uso: node scripts/check-graph.mjs http://localhost:PORT/grafo
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3000/grafo";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".react-flow__node", { timeout: 40000 });
  await new Promise((r) => setTimeout(r, 4000)); // medição + render de arestas
  const counts = await page.evaluate(() => ({
    nodes: document.querySelectorAll(".react-flow__node").length,
    edges: document.querySelectorAll(".react-flow__edge").length,
    edgePaths: document.querySelectorAll(".react-flow__edge-path").length,
    arrowheads: document.querySelectorAll(".react-flow__arrowhead").length,
  }));
  console.log("RESULT " + JSON.stringify(counts));
} catch (e) {
  console.error("ERROR", e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}

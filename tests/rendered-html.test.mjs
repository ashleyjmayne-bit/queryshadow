import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete QueryShadow judge path", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>[^<]*QueryShadow[^<]*<\/title>/i);
  assert.match(html, /Project Northstar/);
  assert.match(html, /Generate safer plan/);
  assert.match(html, /Adversary reconstruction/);
  assert.match(html, /Local analysis/);
  assert.match(html, /Synthetic demo data/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("renders the transparency boundary and no-login controls", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Transparent limitations/);
  assert.match(html, /Import trace/);
  assert.match(html, /Replay leak/);
  assert.match(html, /Export audit/);
  assert.doesNotMatch(html, /sign in|log in|api key/i);
});


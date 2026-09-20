import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.js';

test('market summary and neighborhoods endpoints are available', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const marketResponse = await fetch(`http://127.0.0.1:${port}/api/market-summary`);
    const market = await marketResponse.json();
    assert.equal(marketResponse.status, 200);
    assert.ok(Array.isArray(market.neighborhoods));
    assert.ok(typeof market.overview === 'object');

    const neighborhoodsResponse = await fetch(`http://127.0.0.1:${port}/api/neighborhoods`);
    const neighborhoods = await neighborhoodsResponse.json();
    assert.equal(neighborhoodsResponse.status, 200);
    assert.ok(Array.isArray(neighborhoods.areas));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

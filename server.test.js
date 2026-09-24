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

test('property and location APIs return database-backed coordinates for listings', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/properties`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(payload.properties));
    assert.ok(payload.properties.length > 0);
    const first = payload.properties[0];
    assert.ok(Number.isFinite(Number(first.lat)) || Number.isFinite(Number(first.latitude)));
    assert.ok(Number.isFinite(Number(first.lng)) || Number.isFinite(Number(first.longitude)));

    const locationsResponse = await fetch(`http://127.0.0.1:${port}/api/locations`);
    const locationsPayload = await locationsResponse.json();
    assert.equal(locationsResponse.status, 200);
    assert.ok(Array.isArray(locationsPayload.locations));
    assert.ok(locationsPayload.locations.length > 0);
    const location = locationsPayload.locations[0];
    assert.ok(Number.isFinite(Number(location.lat)));
    assert.ok(Number.isFinite(Number(location.lng)));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('production root route serves the built Vite app', async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /<div id="root"><\/div>|<script type="module"/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

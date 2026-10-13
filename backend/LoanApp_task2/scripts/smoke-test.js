/**
 * End-to-end smoke test for the Loan API.
 *
 *   1. Start the API:           npm run dev
 *   2. Make sure the admin exists: npm run db:seed:admin   (once)
 *   3. Run this script:         npm run test:smoke
 *
 * Needs Node 18+ (built-in fetch). It reads the same .env as the API
 * (PORT, ADMIN_EMAIL, ADMIN_PASSWORD) and creates throw-away users, so it is
 * safe to run repeatedly.
 */
require('../src/config/env');

const assert = require('node:assert/strict');

const BASE = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const ROOT = BASE.replace(/\/api$/, '');
const ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
const PASSWORD = 'Passw0rd!123';
const run = Date.now();

async function call(method, path, { token, body, raw, headers = {}, base = BASE } = {}) {
    const res = await fetch(`${base}${path}`, {
        method,
        headers: {
            ...(body !== undefined || raw !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers
        },
        body: raw !== undefined ? raw : body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    return { status: res.status, json, text, headers: res.headers };
}

const results = [];
async function test(name, fn) {
    try {
        await fn();
        results.push({ name, ok: true });
        console.log(`  PASS  ${name}`);
    } catch (err) {
        results.push({ name, ok: false });
        console.log(`  FAIL  ${name}\n        ${err.message.split('\n').join('\n        ')}`);
    }
}

const loanBody = (extra = {}) => ({
    applicant_name: 'Test Applicant',
    amount: 5000,
    tenure_months: 12,
    purpose: 'Smoke test',
    ...extra
});

(async () => {
    console.log(`\nTesting ${BASE}\n`);

    const health = await call('GET', '/', { base: ROOT }).catch(() => null);
    if (!health || health.status !== 200) {
        console.log('API is not reachable. Start it first with: npm run dev');
        process.exit(1);
    }
    await test('security headers are enabled', () => {
        assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
    });

    // ---- set up three accounts -------------------------------------------------
    const signup = async (name) => {
        const r = await call('POST', '/auth/signup', {
            body: { username: name, email: `${name}.${run}@test.com`, password: PASSWORD }
        });
        assert.equal(r.status, 201, `signup failed: ${r.text}`);
        return r.json.data;
    };
    const alice = await signup('alice');
    const bob = await signup('bob');
    const adminLogin = await call('POST', '/auth/login', { body: ADMIN });
    if (adminLogin.status !== 200) {
        console.log('Admin login failed. Run `npm run db:seed:admin` and check ADMIN_EMAIL / ADMIN_PASSWORD in .env');
        process.exit(1);
    }
    const admin = adminLogin.json.data;
    let aliceLoan; // the loan most tests work with

    console.log('Roles & loan status (trainer items 1, 2)');
    await test('signup creates a USER and login of the seeded admin returns role ADMIN', () => {
        assert.equal(alice.user.role, 'USER');
        assert.equal(admin.user.role, 'ADMIN');
    });
    await test('user cannot choose status when creating a loan (400)', async () => {
        const r = await call('POST', '/loans', { token: alice.token, body: loanBody({ status: 'APPROVED' }) });
        assert.equal(r.status, 400, r.text);
    });
    await test('a new loan is always PENDING (201)', async () => {
        const r = await call('POST', '/loans', { token: alice.token, body: loanBody() });
        assert.equal(r.status, 201, r.text);
        assert.equal(r.json.data.status, 'PENDING');
        aliceLoan = r.json.data;
    });
    await test('user cannot sneak status into an update (400)', async () => {
        const r = await call('PUT', `/loans/${aliceLoan.id}`, { token: alice.token, body: { status: 'APPROVED' } });
        assert.equal(r.status, 400, r.text);
    });
    await test('normal user cannot call the admin status route (403)', async () => {
        const r = await call('PATCH', `/loans/${aliceLoan.id}/status`, { token: alice.token, body: { status: 'APPROVED' } });
        assert.equal(r.status, 403, r.text);
    });
    await test('no token -> 401', async () => {
        const r = await call('GET', '/loans');
        assert.equal(r.status, 401);
    });
    await test('admin cannot create a loan application (403)', async () => {
        const r = await call('POST', '/loans', { token: admin.token, body: loanBody() });
        assert.equal(r.status, 403, r.text);
    });

    console.log('\nVisibility');
    await test('user list contains only their own loans', async () => {
        const r = await call('GET', '/loans', { token: bob.token });
        assert.equal(r.status, 200);
        assert.equal(r.json.data.length, 0);
        assert.equal(r.json.pagination.page, 1);
        assert.equal(r.json.pagination.limit, 10);
    });
    await test("user cannot read another user's loan (404)", async () => {
        const r = await call('GET', `/loans/${aliceLoan.id}`, { token: bob.token });
        assert.equal(r.status, 404);
    });
    await test('admin list contains all loans, including who submitted them', async () => {
        const r = await call('GET', '/loans', { token: admin.token });
        assert.equal(r.status, 200);
        const found = r.json.data.find((l) => l.id === aliceLoan.id);
        assert.ok(found, 'admin should see alice\'s loan');
        assert.equal(found.user.email, alice.user.email);
    });
    await test('loan list supports pagination and reports page totals', async () => {
        const r = await call('GET', '/loans?page=1&limit=1', { token: admin.token });
        assert.equal(r.status, 200, r.text);
        assert.equal(r.json.data.length, 1);
        assert.equal(r.json.pagination.page, 1);
        assert.equal(r.json.pagination.limit, 1);
        assert.ok(Number.isInteger(r.json.pagination.total));
        assert.ok(Number.isInteger(r.json.pagination.totalPages));
        assert.ok(r.json.pagination.total >= 1);
        assert.ok(r.json.pagination.totalPages >= 1);
    });
    await test('invalid loan pagination parameters return 400', async () => {
        for (const query of ['page=0', 'limit=101']) {
            const r = await call('GET', `/loans?${query}`, { token: admin.token });
            assert.equal(r.status, 400, r.text);
        }
    });

    console.log('\nInvalid input returns 4xx, never 500 (item 9)');
    await test('invalid UUID on GET/PUT/DELETE/PATCH -> 400 with a custom message', async () => {
        for (const [method, path, body, token] of [
            ['GET', '/loans/abc', undefined, alice.token],
            ['PUT', '/loans/abc', { amount: 10 }, alice.token],
            ['DELETE', '/loans/abc', undefined, alice.token],
            ['PATCH', '/loans/abc/status', { status: 'APPROVED' }, admin.token]
        ]) {
            const r = await call(method, path, { token, body });
            assert.equal(r.status, 400, `${method} ${path} -> ${r.status} ${r.text}`);
            assert.equal(r.json.message, 'Loan ID must be a valid UUID');
        }
    });
    await test('valid-looking UUID that does not exist -> 404', async () => {
        const r = await call('GET', '/loans/11111111-1111-4111-8111-111111111111', { token: alice.token });
        assert.equal(r.status, 404);
    });
    await test('malformed JSON body -> 400 JSON (not 500/HTML)', async () => {
        const r = await call('POST', '/auth/login', { raw: '{"email": ' });
        assert.equal(r.status, 400, r.text);
        assert.equal(r.json?.success, false);
    });
    await test('missing body -> 400 (not 500)', async () => {
        const r = await call('POST', '/auth/login');
        assert.equal(r.status, 400, r.text);
    });
    await test('unknown route -> 404 JSON', async () => {
        const r = await call('GET', '/does-not-exist', { token: alice.token });
        assert.equal(r.status, 404);
        assert.equal(r.json?.success, false);
    });
    await test('old /api/loan path is gone (404) - the collection is /api/loans', async () => {
        const r = await call('GET', '/loan', { token: alice.token });
        assert.equal(r.status, 404);
    });

    console.log('\nApproving / locking (items 1 & frontend item 2)');
    await test('admin cannot set status to PENDING or garbage (400)', async () => {
        for (const status of ['PENDING', 'NOPE']) {
            const r = await call('PATCH', `/loans/${aliceLoan.id}/status`, { token: admin.token, body: { status } });
            assert.equal(r.status, 400, `${status}: ${r.text}`);
        }
    });
    await test('user can still edit a PENDING loan', async () => {
        const r = await call('PUT', `/loans/${aliceLoan.id}`, { token: alice.token, body: { amount: 7500 } });
        assert.equal(r.status, 200, r.text);
        assert.equal(Number(r.json.data.amount), 7500);
    });
    await test('admin approves the loan (200)', async () => {
        const r = await call('PATCH', `/loans/${aliceLoan.id}/status`, { token: admin.token, body: { status: 'APPROVED' } });
        assert.equal(r.status, 200, r.text);
        assert.equal(r.json.data.status, 'APPROVED');
    });
    await test('a decision is final: deciding again -> 409', async () => {
        const r = await call('PATCH', `/loans/${aliceLoan.id}/status`, { token: admin.token, body: { status: 'REJECTED' } });
        assert.equal(r.status, 409, r.text);
    });
    await test('user cannot edit an APPROVED loan (409)', async () => {
        const r = await call('PUT', `/loans/${aliceLoan.id}`, { token: alice.token, body: { amount: 1 } });
        assert.equal(r.status, 409, r.text);
    });
    await test('user cannot delete an APPROVED loan (409)', async () => {
        const r = await call('DELETE', `/loans/${aliceLoan.id}`, { token: alice.token });
        assert.equal(r.status, 409, r.text);
    });
    await test('REJECTED loans are locked too', async () => {
        const created = await call('POST', '/loans', { token: alice.token, body: loanBody() });
        const id = created.json.data.id;
        const rej = await call('PATCH', `/loans/${id}/status`, { token: admin.token, body: { status: 'REJECTED' } });
        assert.equal(rej.status, 200, rej.text);
        assert.equal((await call('PUT', `/loans/${id}`, { token: alice.token, body: { amount: 2 } })).status, 409);
        assert.equal((await call('DELETE', `/loans/${id}`, { token: alice.token })).status, 409);
    });
    await test('user can delete a PENDING loan (204)', async () => {
        const created = await call('POST', '/loans', { token: alice.token, body: loanBody() });
        const r = await call('DELETE', `/loans/${created.json.data.id}`, { token: alice.token });
        assert.equal(r.status, 204);
    });
    await test('admin cannot edit/delete a user\'s loan through the user routes (404)', async () => {
        const created = await call('POST', '/loans', { token: bob.token, body: loanBody() });
        const id = created.json.data.id;
        assert.equal((await call('PUT', `/loans/${id}`, { token: admin.token, body: { amount: 3 } })).status, 404);
        assert.equal((await call('DELETE', `/loans/${id}`, { token: admin.token })).status, 404);
    });

    console.log('\nCORS (item 7)');
    const preflight = (origin, method) =>
        call('OPTIONS', '/loans', {
            headers: { Origin: origin, 'Access-Control-Request-Method': method, 'Access-Control-Request-Headers': 'authorization' }
        });
    await test('PATCH is allowed by CORS (the admin route needs it)', async () => {
        const r = await preflight('http://localhost:3000', 'PATCH');
        assert.match(r.headers.get('access-control-allow-methods') || '', /PATCH/);
    });
    await test('both configured frontend origins are allowed', async () => {
        const origins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((o) => o.trim());
        for (const origin of origins) {
            const r = await preflight(origin, 'GET');
            assert.equal(r.headers.get('access-control-allow-origin'), origin, `${origin} was not allowed`);
        }
    });
    await test('an unknown origin is NOT allowed', async () => {
        const r = await preflight('http://evil.example.com', 'GET');
        assert.equal(r.headers.get('access-control-allow-origin'), null);
    });

    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} checks passed${failed ? `, ${failed} FAILED` : ''}\n`);
    process.exit(failed ? 1 : 0);
})();

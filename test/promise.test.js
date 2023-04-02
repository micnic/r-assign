import { test, equal, notOk, ok } from 'tap';
import rAssign, { isPromiseOf, isString, promise } from 'r-assign';

test('isPromiseOf', ({ end }) => {

	equal(isPromiseOf, promise);

	ok(isPromiseOf()(Promise.resolve()));
	ok(isPromiseOf(isString)(Promise.resolve()));

	notOk(isPromiseOf()());

	end();
});

test('assign isPromiseOf', async ({ rejects, resolveMatch }) => {

	await resolveMatch(rAssign(isPromiseOf(), Promise.resolve()), undefined);

	await resolveMatch(rAssign(isPromiseOf(isString), Promise.resolve('')), '');

	await rejects(async () => {
		await rAssign(isPromiseOf());
	});

	await rejects(async () => {
		await rAssign(isPromiseOf(), Promise.resolve(null));
	});

	await rejects(async () => {
		await rAssign(isPromiseOf(isString));
	});

	await rejects(async () => {
		await rAssign(isPromiseOf(isString), Promise.resolve());
	});
});
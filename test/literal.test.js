import { test, equal, notOk, ok, throws } from 'tap';
import rAssign, { isLiteral, isLiteralOf, literal, literals } from 'r-assign';

test('isLiteral', ({ end }) => {

	equal(isLiteral, literal);

	ok(isLiteral()());
	ok(isLiteral(undefined)(undefined));
	ok(isLiteral(null)(null));
	ok(isLiteral(0n)(0n));
	ok(isLiteral(false)(false));
	ok(isLiteral(0)(0));
	ok(isLiteral('')(''));

	notOk(isLiteral(0)());

	throws(() => {
		// @ts-expect-error
		isLiteral({});
	}, TypeError('Invalid literal provided'));

	throws(() => {
		isLiteral(Infinity);
	}, TypeError('Invalid literal provided'));

	throws(() => {
		// @ts-expect-error
		isLiteral(() => null);
	}, TypeError('Invalid literal provided'));

	end();
});

test('assign isLiteral', ({ end }) => {

	equal(0, rAssign(isLiteral(0), 0));

	throws(() => {
		rAssign(isLiteral(0));
	});

	end();
});

test('isLiteralOf', ({ end }) => {

	equal(isLiteralOf, literals);

	ok(isLiteralOf([0])(0));
	ok(isLiteralOf([0, 1])(0));

	notOk(isLiteralOf([0, 1])(2));

	throws(() => {
		// @ts-expect-error
		isLiteralOf();
	}, TypeError('Invalid literals provided'));

	throws(() => {
		// @ts-expect-error
		isLiteralOf([]);
	}, TypeError('Not enough literals, at least one expected'));

	throws(() => {
		isLiteralOf([0, 0]);
	}, TypeError('Duplicate literal provided'));

	end();
});

test('assign isLiteralOf', ({ end }) => {

	equal(0, rAssign(isLiteralOf([0, 1]), 0));

	throws(() => {
		rAssign(isLiteralOf([0, 1]));
	});

	end();
});
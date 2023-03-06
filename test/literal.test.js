import { test, equal, notOk, ok, throws } from 'tap';
import { isLiteral, isLiteralOf, literal, literals } from 'r-assign';

test('isLiteral', ({ end }) => {

	equal(isLiteral, literal);

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

test('isLiteralOf', ({ end }) => {

	equal(isLiteralOf, literals);

	ok(isLiteralOf(['a'])('a'));
	ok(isLiteralOf(['a', 'b'])('a'));
	notOk(isLiteralOf(['a', 'b'])(0));

	throws(() => {
		// @ts-expect-error
		isLiteralOf();
	}, TypeError('Invalid literals provided'));

	throws(() => {
		// @ts-expect-error
		isLiteralOf([]);
	}, TypeError('Not enough literals, at least one expected'));

	throws(() => {
		isLiteralOf(['a', 'a']);
	}, TypeError('Duplicate literal provided'));

	end();
});
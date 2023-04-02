import { test, equal, notOk, throws } from 'tap';
import rAssign, { isNever, never } from 'r-assign';

test('isNever', ({ end }) => {

	equal(isNever, never);

	notOk(isNever());
	notOk(isNever(null));

	end();
});

test('assign isNever', ({ end }) => {

	throws(() => {
		rAssign(isNever);
	});

	end();
});
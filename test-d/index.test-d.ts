import { expectType } from 'tsd';
import rAssign from 'r-assign';

const test = () => true;

const testOptional = (value: unknown) => {

	if (typeof value === 'boolean') {
		return value;
	}

	return undefined;
};

expectType<{ test: boolean }>(rAssign({ test }));

expectType<{ testOptional?: boolean }>(rAssign({ testOptional }));

expectType<{ test: boolean; testOptional?: boolean }>(
	rAssign({ test, testOptional })
);
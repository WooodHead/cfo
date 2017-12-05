import Copy from "operation/copy.js";
import * as paths from "path/paths.js";

const path = require("path");
const { createTree, assert, assertTree } = require("./test-utils.js");

exports.testCopyFile = async function testCopyFile(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");
	const contents = "test file";

	createTree(source, contents);
	assertTree(source, contents);

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, contents);
}

exports.testCopyFileToDirectory = async function testCopyFileToDirectory(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");
	const contents = "test file";

	createTree(source, contents);
	createTree(target, {});
	assertTree(source, contents);
	assertTree(target, {});

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, {"a":contents});
}

exports.testCopyFileOverwrite = async function testCopyFileOverwrite(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");
	const contents1 = "test file 1";
	const contents2 = "test file 2";

	createTree(source, contents1);
	createTree(target, contents2);
	assertTree(source, contents1);
	assertTree(target, contents2);

	require("electron").remote.issueResolution = "abort";
	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();
	assertTree(source, contents1);
	assertTree(target, contents2);

	require("electron").remote.issueResolution = "overwrite";
	o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();
	assertTree(source, contents1);
	assertTree(target, contents1);
}

exports.testCopyFileSame = async function testCopyFileSame(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "Copy of a");
	const contents = "test file";

	createTree(source, contents);
	assertTree(source, contents);

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(source)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, contents);
}

exports.testCopyDir = async function testCopyDir(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");
	const contents = {"b": "test", "c": {}};

	createTree(source, contents);
	assertTree(source, contents);

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, contents);
}

exports.testCopyDirSame = async function testCopyDirSame(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "Copy of a");
	const contents = {"b": "test", "c": {}};

	createTree(source, contents);
	assertTree(source, contents);
	assertTree(target, null);

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(source)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, contents);
}

exports.testCopyDirSame2 = async function testCopyDirSame2(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "Copy of a");
	const contents = {"b": "test", "c": {}};

	createTree(source, contents);
	assertTree(source, contents);
	assertTree(target, null);

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(tmp)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, contents);
}

exports.testCopyDirToDir = async function testCopyDirToDir(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");
	const contents = {"b": "test", "c": {}};

	createTree(source, contents);
	createTree(target, {});
	assertTree(source, contents);
	assertTree(target, {});

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();

	assertTree(source, contents);
	assertTree(target, {"a":contents});
}

exports.testCopyGroup = async function(tmp) {
	const dir1 = path.join(tmp, "a");
	const dir2 = path.join(tmp, "b");
	const file1 = path.join(tmp, "c");
	const file2 = path.join(tmp, "d");
	const target = path.join(tmp, "target");

	createTree(dir1, {"a":"test"});
	createTree(dir2, {"a":"test"});
	createTree(file1, "aaa");
	createTree(file2, "aaa");
	createTree(target, {});

	let g = paths.group([
		paths.fromString(dir1),
		paths.fromString(file1)
	]);

	let d = new Copy(g, paths.fromString(target));
	await d.run();

	assertTree(target, {
		"a": {"a":"test"},
		"c": "aaa"
	});
}

exports.testCopyMerge = async function testCopyMerge(tmp) {
	const source = path.join(tmp, "a");
	const target = path.join(tmp, "b");

	createTree(source, {
		"file": "test",
		"dir": {
			"file": "test",
			"subdir2": {}
		}
	});
	createTree(target, {
		"a": {
			"existing": "existing",
			"dir": {
				"existing": "existing",
				"subdir1": {}
			}
		}
	});

	let o = new Copy(
		paths.fromString(source),
		paths.fromString(target)
	);
	await o.run();

	assertTree(source, {
		"file": "test",
		"dir": {
			"file": "test",
			"subdir2": {}
		}
	});
	assertTree(target, {
		"a": {
			"existing": "existing",
			"file": "test",
			"dir": {
				"existing": "existing",
				"file": "test",
				"subdir1": {},
				"subdir2": {}
			}
		}
	});
}

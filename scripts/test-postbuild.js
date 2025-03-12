const fs = require('fs');
const {exec} = require('child_process');

async function permissions(path, name = false)
{
	let f, r, w, x;

	const perm = {
		f: fs.constants.F_OK,
		r: fs.constants.R_OK,
		w: fs.constants.W_OK,
		x: fs.constants.X_OK,
	};

	if(fs.existsSync(path))
	{
		for(const key in perm)
		{
			try
			{
				fs.accessSync(path, perm[key]);
				perm[key] = true;
			}
			catch (err)
			{
				perm[key] = false;
			}
		}
	}
	else
	{
		for(const key in perm)
		{
			perm[key] = false;
		}
	}

	return new Promise(function(resolve) {

		exec('ls -l "'+path+'"', function(error, stdout, stderr) {

			const ls = stdout.match(/\s*([a-z\-]+)/)?.[1] || '';
			console.log(name+' | F:'+(perm.f ? 'OK' : '--')+' | R:'+(perm.r ? 'OK' : '--')+' | W:'+(perm.w ? 'OK' : '--')+' | X:'+(perm.x ? 'OK' : '--')+' | Exists:'+(fs.existsSync(path) ? 'OK' : '--')+' | '+ls);

			resolve();

		});

	});
}

const original = './binaries/darwin';
const darwinMas = './dist/mas-universal/electron-builder-permissions-bug.app/Contents/Resources/app.asar.unpacked/binaries/darwin';

(async function(){

	// Original
	await permissions(original+'/x64/binary', 'Original x64    ');
	await permissions(original+'/arm64/binary', 'Original arm64  ');

	// Darwin Mas
	await permissions(darwinMas+'/x64/binary', 'Darwin Mas x64  ');
	await permissions(darwinMas+'/arm64/binary', 'Darwin Mas arm64');

})()
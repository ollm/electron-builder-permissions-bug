const fs = require('fs');

function permissions(path, name = false)
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

	console.log(name+' | F:'+(perm.f ? 'OK' : '--')+' | R:'+(perm.r ? 'OK' : '--')+' | W:'+(perm.w ? 'OK' : '--')+' | X:'+(perm.x ? 'OK' : '--')+' | Exists:'+(fs.existsSync(path) ? 'OK' : '--'));
}

const original = './binaries/darwin';
const darwinMas = './dist/mas-universal/electron-builder-permissions-bug.app/Contents/Resources/app.asar.unpacked/binaries/darwin';

// Original
permissions(original+'/x64/binary', 'Original x64    ');
permissions(original+'/arm64/binary', 'Original arm64  ');

// Darwin Mas
permissions(darwinMas+'/x64/binary', 'Darwin Mas x64  ');
permissions(darwinMas+'/arm64/binary', 'Darwin Mas arm64');
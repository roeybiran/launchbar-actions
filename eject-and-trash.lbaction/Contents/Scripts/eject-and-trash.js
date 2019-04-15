// LaunchBar Action Script

function ejectAndTrash(volume) {
	LaunchBar.hide()
	var args = volume.split('\n')
	args = args.map(x => File.fileURLForPath(x))
	LaunchBar.executeAppleScriptFile('eject-and-trash.scpt', args[0], args[1])
}

function run(argument) {

	var output = []

	// disk images
	var disk_images = Plist.parse(LaunchBar.execute('/usr/bin/hdiutil', 'info', '-plist'))
	var disk_images = disk_images['images']

	if (disk_images.length == 0) {
		return [{title: 'No mounted images found', icon: 'font-awesome:warning'}]
	} else {

		disk_images.forEach( function(image) {
			// statements
	        var image_path = image['image-path']
	        var volume_path = image['system-entities']
	        volume_path = volume_path[volume_path.length - 1]['mount-point']
	        var lb_arg = volume_path + '\n' + image_path
	        output.push({
	        	title: volume_path,
	        	subtitle: image_path,
	        	path: image_path,
	        	action: 'ejectAndTrash',
	        	actionArgument: lb_arg,
	        	icon: volume_path + '/.VolumeIcon.icns',
	        	actionReturnsItems: false,
	        	actionRunsInBackground: true
	        })
			// network volumes
			// usb drives
		});
		
		return output.reverse()

	}
}


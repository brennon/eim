var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
	name: 'Emotion in Motion Server',
	description: 'Emotion in Motion Node.js Server',
	script: require('path').join(__dirname, 'server.js'),
	env: {
		name: "NODE_ENV",
		value: "production"
	}
});

// Listen for the "uninstall" event so we know when it's done
svc.on('uninstall', function() {
	console.log('Uninstall complete.');
	console.log('The service exists: ', svc.exists);
});

// Uninstall the service
svc.uninstall();
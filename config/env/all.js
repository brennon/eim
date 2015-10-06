'use strict';

module.exports = {
	app: {
		title: 'Emotion in Motion',
		description: 'Emotion in Motion Experiment Platform',
		keywords: 'Emotion, Music, Physiology'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        		'public/lib/angular-hotkeys/build/hotkeys.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-slider/angular-slider.js',
				'public/lib/socket.io-client/socket.io.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/angular-uuid-service/angular-uuid-service.js',
				'public/lib/angular-hotkeys/build/hotkeys.js',
				'public/lib/angular-gettext/dist/angular-gettext.js',
				'public/i18n/translations.js',
				'public/lib/angular-loggly-logger/angular-loggly-logger.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js',
			'public/lib/angular-socket.io-mock/angular-socket.io-mock.js'
		]
	}
};
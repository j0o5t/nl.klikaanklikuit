'use strict';
/* eslint-disable */
const config = {
	class: 'other',
	pair: {
		viewOrder: ['generic_imitate', 'generic_test_remote', 'generic_done'],
		views: [{
				template: '../lib/pair/imitate.html',
				options: {
					title: 'deviceClasses.generic_remote.views.generic_imitate.title',
					body: 'deviceClasses.generic_remote.views.generic_imitate.body',
					prepend: [],
					append: [],
					svg: '../../433_generator/assets/PA3-1000R/pair.svg',
					svgWidth: '80vw',
					svgHeight: '70vh',
					initWithDeviceData: false,
					previous: true,
					next: false
				},
				prepend: ['../../assets/433_generator/css/styles.css',
					'../../assets/433_generator/css/svg.css',
					'../../assets/433_generator/js/svghighlighter.js'
				],
				append: [],
				id: 'generic_imitate'
			},
			{
				template: '../lib/pair/test_remote.html',
				options: {
					svg: '../../433_generator/assets/PA3-1000R/test.svg',
					prepend: [],
					append: [],
					title: 'views.generic_test_remote.title',
					body: 'views.generic_test_remote.body',
					svgWidth: '80vw',
					svgHeight: '70vh',
					initWithDeviceData: false,
					previous: true,
					next: true
				},
				prepend: ['../../assets/433_generator/css/styles.css',
					'../../assets/433_generator/css/svg.css',
					'../../assets/433_generator/js/svghighlighter.js'
				],
				append: [],
				id: 'generic_test_remote'
			},
			{
				template: '../lib/pair/done.html',
				options: {
					title: 'views.generic_done.title',
					prepend: '',
					append: ''
				},
				prepend: [],
				append: [],
				id: 'generic_done'
			}
		]
	},
	images: {
		large: '../../433_generator/assets/PA3-1000R/images/large.jpg',
		small: '../../433_generator/assets/PA3-1000R/images/small.jpg'
	},
	id: 'PA3-1000R',
	triggers: [{
		id: 'PA3-1000R:received',
		title: '433_generator.generic.button_pressed',
		args: [{
				name: 'unit',
				type: 'dropdown',
				values: [{
						id: '00',
						label: '433_generator.generic.buttons.1'
					},
					{
						id: '01',
						label: '433_generator.generic.buttons.2'
					},
					{
						id: '10',
						label: '433_generator.generic.buttons.3'
					}
				]
			},
			{
				name: 'state',
				type: 'dropdown',
				values: [{
						id: '1',
						label: '433_generator.generic.on'
					},
					{
						id: '0',
						label: '433_generator.generic.off'
					}
				]
			},
			{
				name: 'device',
				type: 'device',
				filter: 'driver_id=PA3-1000R'
			}
		]
	}],
	debounceTimeout: 500,
	driver: '../../433_generator/drivers/kakuold/remote',
	signal: 'kakuold',
	name: 'devices.PA3-1000R.name',
	icon: '../../433_generator/assets/PA3-1000R/icon.svg'
};
const Driver = require(config.driver);
const driver = new Driver(config);
module.exports = Object.assign(
  {},
	driver.getExports(), 
	{ init: (devices, callback) => driver.init(module.exports, devices, callback) }
);

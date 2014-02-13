#!/usr/bin/env node


/**
 * Module dependencies
 */
var _ = require('lodash')
	, program = require('./_commander')
	, package = require('../package.json')
	, NOOP    = function(){}
	, cmd;




program
	.version(package.version, '-v, --version');


//
// Normalize version argument, i.e.
// 
// $ sails -v
// $ sails -V
// $ sails --version
// $ sails version
//


// make `-v` option case-insensitive
process.argv = _.map(process.argv,function(arg){
	return (arg === '-V') ? '-v' : arg;
});


// $ sails version (--version synonym)
program
	.command('version')
	.description('')
	.action( program.versionInformation );





program
	.option('--silent')
	.option('--verbose')
	.option('--silly')
	.unknownOption = NOOP;
program.usage('[command]');


// $ sails lift
cmd = program.command('lift');
cmd.option('--prod');
cmd.option('--port [port]');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.action( require('./sails-lift') );


// $ sails new <appname>
cmd = program.command('new [path_to_new_app]');
// cmd.option('--dry');
cmd.option('--viewEngine [viewEngine]');
cmd.option('--template [viewEngine]');
cmd.usage('[path_to_new_app]');
cmd.unknownOption = NOOP;
cmd.action(require('./sails-new'));


// $ sails generate <module>
cmd = program.command('generate [something]');
// cmd.option('--dry');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.usage('[something]');
cmd.action( require('./sails-generate') );



// $ sails console
cmd = program.command('console');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.action( require('./sails-console') );


// $ sails www
// Compile `assets` directory into a standalone `www` folder.
cmd = program.command('www');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.action( require('./sails-www') );



// $ sails debug
cmd = program.command('debug');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.action( require('./sails-debug') );


// $ sails configure
cmd = program.command('configure');
cmd.unknownOption = NOOP;
cmd.description('');
cmd.action( require('./sails-configure') );







//
// Normalize help argument, i.e.
// 
// $ sails --help
// $ sails help
// $ sails
// $ sails <unrecognized_cmd>
//


// $ sails help (--help synonym)
cmd = program.command('help');
cmd.description('');
cmd.action( program.usageMinusWildcard );




// $ sails <unrecognized_cmd>
// Mask the '*' in `help`.
program
	.command('*')
	.action( program.usageMinusWildcard );



// Don't balk at unknown options
program.unknownOption = NOOP;



// $ sails
// 
program.parse(process.argv);
var NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.usageMinusWildcard();
}


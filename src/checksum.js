var path = require('path')
var crypto = require('crypto')
var fs = require('fs')
var _ = require('lodash/fp')


// checksumFilepath :: Object -> String
var checksumFilepath = function(options) {
	return path.join(options.dest, options.fontName + '.checksum')
}


// readFile :: String -> String
var readFile = function(filePath) {
	return fs.readFileSync(filePath, 'utf8')
}


// md5 :: String -> String
var md5 = function(content) {
	var hash = crypto.createHash('md5')
	hash.update(content)
	return hash.digest('hex').substr(0, 20)
}


// calculate :: Array -> String
var calculate = _.compose(
	md5,
	_.join('|'),
	_.map(readFile)
)


// read :: Object -> String
var read = function(options) {
	try {
		return fs.readFileSync(checksumFilepath(options), 'utf8')
	} catch (e) {
		return null
	}
}


// write :: Object -> String -> ()
var write = function(options, content) {
	fs.writeFileSync(checksumFilepath(options), content)
}


module.exports = {
	calculate: calculate,
	read: read,
	write: write
}

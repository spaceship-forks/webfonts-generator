var crypto = require('crypto')
var fs = require('fs')
var _ = require('lodash/fp')


// readFile :: String -> String
var readFile = function(filePath) {
	return fs.readFileSync(filePath, 'utf8')
}


// md5 :: String -> String
var md5 = function(content) {
	var hash = crypto.createHash('md5')
	hash.update(content)
	return hash.digest('hex')
}


// calculate :: Array -> String
var calculate = _.compose(
	md5,
	_.join('|'),
	_.map(readFile)
)


module.exports = {
	calculate: calculate
}

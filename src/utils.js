// fontName :: Object -> String
var fontName = function(options) {
	return options.fontName + '.' + options.checksum
}


// fileName :: (Object, String) -> String
var fileName = function(options, type) {
	return fontName(options) + '.' + type
}


module.exports = {
	fileName: fileName,
	fontName: fontName
}

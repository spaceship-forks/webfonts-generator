var fs = require('fs')
var path = require('path')
var _ = require('lodash/fp')
var handlebars = require('handlebars')
var urlJoin = require('url-join')
var utils = require('./utils.js')


var makeUrls = function(options) {
	var baseUrl = options.cssFontsUrl && options.cssFontsUrl.replace(/\\/g, '/')
	var urls = _.map(options.types, function(type) {
		var fontName = utils.fileName(options, type)
		return baseUrl ? urlJoin(baseUrl, fontName) : fontName
	})
	return _.zipObject(options.types, urls)
}


var makeSrc = function(options, urls) {
	var templates = {
		eot: _.template('url("<%= url %>?#iefix") format("embedded-opentype")'),
		woff2: _.template('url("<%= url %>") format("woff2")'),
		woff: _.template('url("<%= url %>") format("woff")'),
		ttf: _.template('url("<%= url %>") format("truetype")'),
		svg: _.template('url("<%= url %>#<%= fontName %>") format("svg")')
	}

	// Order used types according to 'options.order'.
	var orderedTypes = _.filter(function(type) {
		return options.types.indexOf(type) !== -1
	}, options.order)

	var src = _.map(function(type) {
		return templates[type]({
			url: urls[type],
			fontName: options.fontName
		})
	}, orderedTypes).join(',\n')

	return src
}


var mapCodepointsToHex = function(codepoints) {
	return _.mapValues(function(codepoint) {
		return codepoint.toString(16)
	}, codepoints)
}


var makeCtx = function(options, urls) {
	return _.defaults({
		fontName: options.fontName,
		fontFileName: utils.fontName(options),
		src: makeSrc(options, urls),
		codepoints: mapCodepointsToHex(options.codepoints)
	}, options.templateOptions)
}


var renderCss = function(options, urls) {
	urls = urls ? urls : makeUrls(options)
	var ctx = makeCtx(options, urls)
	var source = fs.readFileSync(options.cssTemplate, 'utf8')
	var template = handlebars.compile(source)
	return template(ctx)
}


module.exports = renderCss


VERSION = 0.9

all: jquery.datetime-$(VERSION).min.js

%.min.js:	%.js
	uglifyjs $< > $@

#!/bin/sh

CSS="assets/stylesheets"
OOCSS="${CSS}/oocss/core"

cat ${OOCSS}/libraries.css ${OOCSS}/template/template.css ${OOCSS}/grid/grids.css ${OOCSS}/content.css ${OOCSS}/heading/heading.css ${OOCSS}/spacing/space.css ${CSS}/screen-dev.css > ${CSS}/screen.css
java -jar /home/oncletom/Applications/yuicompressor/build/yuicompressor-2.4.2.jar --verbose --nomunge -o ${CSS}/screen.min.css ${CSS}/screen.css
rm ${CSS}/screen.css
cat index-dev.html | sed -r '/<link rel="stylesheet"[^>]+ \/>/d' | sed -r 's/\t<title>/\t<link rel="stylesheet" media="all" type="text\/css" href="\/assets\/stylesheets\/screen.min.css" \/>\r\n\t<title>/' > index.html
# -*- coding: utf-8 -*-
from flask import Flask, url_for
import ebooklib
import re
from ebooklib import epub
from flask import render_template
import os
from googletrans import Translator
import json

app = Flask(__name__)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

@app.route('/')
def index():
	return render_template('home.html')

@app.route('/read/<bookname>/')
def book(bookname):
	booknameonly = bookname;
	bookname = "static/epubs/"+bookname+".epub"
	Book = epub.read_epub(bookname)
	FirstPage = ""
	for item in Book.get_items():
		if item.get_type() == ebooklib.ITEM_DOCUMENT:
			FirstPage = item.get_name()
			break
	return read(booknameonly, FirstPage)

@app.route('/read/<bookname>/<itemname>')
def read(bookname, itemname):
	booknameonly = bookname;
	bookname = "static/epubs/"+bookname+".epub"
	Book = epub.read_epub(bookname)
	Content = Book.get_item_with_href(itemname).get_body_content()
	Content = Content.decode('utf8')
	Content = re.sub(r'<a href="(.*?)"(.*?)>(.*?)</a>', r'<a href="\1">\3</a>', str(Content), re.MULTILINE)
	Content = re.sub(r'<img src="(.*?)"(.*?)>', r'<img src="/static/epubs/'+booknameonly+'/OEBPS/\\1">', str(Content), re.MULTILINE)
	Content = re.sub(r"\\n", "", Content)

	NextPage = ""
	PrevPage = ""
	FirstPage = ""
	IsCurrentPage = False

	for item in Book.get_items():
		if item.get_type() == ebooklib.ITEM_DOCUMENT:
			if FirstPage == "":
				FirstPage = item.get_name()

			if IsCurrentPage and NextPage == "":
				NextPage = item.get_name()

			if item.get_name() == itemname:
				IsCurrentPage = True

			if IsCurrentPage == False:
				PrevPage = item.get_name()

	return render_template('read.html', bookname=booknameonly, BookBody=Content, PrevPage=PrevPage, NextPage=NextPage, FirstPage=FirstPage)

@app.route('/translate/<text>')
def translate(text):
	translator = Translator()
	result = translator.translate(text, dest="tr", src="en")
	return json.dumps(result.__dict__);

if __name__ == "__main__":
	app.run()
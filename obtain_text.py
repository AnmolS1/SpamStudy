from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import pandas as pd

links = pd.read_csv('links.csv')
links.columns = ['l']
links = links['l'].tolist()

i = 0
for link in links:
	print(i)
	
	try:
		page = urlopen(Request(link, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30)
		souper = BeautifulSoup(page, 'html.parser')

		article = souper.find('article')
		if not article:
			article = souper.find('body')

		for fig in article.find_all('figure'):
			fig.decompose()
		for btn in article.find_all('button'):
			btn.decompose()
		for img in article.find_all('img'):
			img.decompose()
		for h1 in article.find_all('h1'):
			h1.decompose()
		for h2 in article.find_all('h2'):
			h2.decompose()
		for h3 in article.find_all('h3'):
			h3.decompose()

		out_file = open('./outputs/file_' + str(i) + '.txt', 'w')
		out_file.write(article.text.strip())
		out_file.close()
	except:
		print('link', i, 'failed')
	
	i = i + 1
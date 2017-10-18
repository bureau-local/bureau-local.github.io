from fuzzywuzzy import process
from fuzzywuzzy import fuzz
import csv

inputfile = open("all_recipients.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader) # skip headers
recipients = [row[0] for row in csv_reader]

outputfile = open("matches.csv", "wb")
csv_writer = csv.writer(outputfile)
csv_writer.writerow(["la", "best", "second", "third"])

inputfile = open("la.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader) # skip headers
for index, row in enumerate(csv_reader):
	# if index >= 10:
	# 	break
	la = row[0]
	matches = process.extract(la, recipients, limit=3, scorer=fuzz.token_set_ratio)
	matches = [match[0] for match in matches]
	row.extend(matches)
	csv_writer.writerow(row)
	


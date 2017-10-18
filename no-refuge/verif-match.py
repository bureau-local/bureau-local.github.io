import csv

inputfile = open("match-clean.csv", "rU")
csv_reader = csv.reader(inputfile)
headers = next(csv_reader)
matches = {row[0]: row[1] for row in csv_reader}

inputfile = open("la.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader)
las = {row[0]: row[1:] for row in csv_reader}

outputfile = open("covered.csv", "wb")
csv_writer = csv.writer(outputfile)
csv_writer.writerow(["la", "covered-by"])

inputfile = open("match-clean.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader)
for row in csv_reader:
	la = row[0]
	match = row[1]
	if match == "":
		if las[la][0] == "Two-Tier District":
			if matches[las[la][1]] != "":
				row[1] = "via " + matches[las[la][1]]
	# We don't want the counties
	if las[la][0] != "Two-Tier County": 
		csv_writer.writerow(row) 

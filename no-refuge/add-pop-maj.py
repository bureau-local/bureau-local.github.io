import csv

inputfile = open("pop.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader)
pop = {row[1]: row[21:] for row in csv_reader} #from 18 yo and beyond

inputfile = open("covered.csv", "rU")
csv_reader = csv.reader(inputfile)
next(csv_reader)

outputfile = open("match-f_pop_adult.csv", "wb")
csv_writer = csv.writer(outputfile)
csv_writer.writerow(["la","match","adult_f_pop"])

for i, row in enumerate(csv_reader):
	# if i > 0:
	# 	break
	la = row[0]
	pop[la] = map(int, map(float, pop[la])) #turn from string to float to int
	adult_f_pop = sum(pop[la])
	row.append(adult_f_pop)
	csv_writer.writerow(row)

import csv

tract_tier_csv_path = "./tract_tier_table.csv"
output_file = "./output.txt";
with open(tract_tier_csv_path, 'rU') as f:
    reader = csv.DictReader(f, dialect=csv.excel)
    with open(output_file, 'w') as outfile:
        output = "{"
        for row in reader:
            output += '"{}":"{}",'.format(row["Tract"], row["Tier"])
        output += "}"
        print >>outfile, output

import csv
import json
from io import StringIO

def csvtojson(csvStr):
    csvBuf = StringIO(csvStr)
    output = [] 
    reader = csv.DictReader(csvBuf)
    for row in reader:
        output.append(row)
    return json.dumps(output, indent=4)

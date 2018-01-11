from os import path
import sys
from build_utils import with_program_ids, with_requirement_function_keys, write_requirement_function_outline
from csvtojson import csvtojson
import json
import io
import csv

curr_filepath = path.realpath(__file__)

cps_programs_csv_filepath = sys.argv[1]
req_fns_output_filepath = path.abspath(path.join(__file__, "../..", "data", "hs_req_fns.json"))
cps_programs_output_filepath = path.abspath(path.join(__file__, "../..", "data", "cps_programs.json"))

if __name__ == "__main__":

    def normalize_csv(string):
        # replace non-breaking spaces (\u00a0) with normal spaces
        # (There are several requirement descriptions which are identical
        # except for an additional non-breaking space character at the end
        # or in the middle.
        # read string as csv
        inBuf = io.StringIO(string)
        reader = csv.DictReader(inBuf)
        outBuf = io.StringIO()
        writer = csv.DictWriter(outBuf, reader.fieldnames)
        writer.writeheader()
        for row in reader:
            appl_req = row["Application_Requirements"]
            appl_req = appl_req.replace("\u00a0", " ")
            appl_req = appl_req.strip()
            sel_req = row["Program_Selections"]
            sel_req = sel_req.replace("\u00a0", " ")
            sel_req = sel_req.strip()

            row["Application_Requirements"] = appl_req
            row["Program_Selections"] = sel_req  
            writer.writerow(row)

        return outBuf.getvalue()

    with open(cps_programs_csv_filepath) as cps_programs_csvfile:
        cps_programs_csv_str = cps_programs_csvfile.read()
        cps_programs_csv_str = normalize_csv(cps_programs_csv_str)

        cps_programs_json_str = csvtojson(cps_programs_csv_str) 
        cps_programs = json.loads(cps_programs_json_str)

        cps_programs = with_program_ids(cps_programs)
        cps_programs = with_requirement_function_keys(cps_programs)
        with open(cps_programs_output_filepath, "w") as f:
            json.dump(cps_programs, f, indent=2)

        req_fns = write_requirement_function_outline(cps_programs)
        with open(req_fns_output_filepath, "w") as f:
            json.dump(req_fns, f, indent=2)
            



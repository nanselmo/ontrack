from os import path
import sys
from build_utils import with_program_ids, with_requirement_function_keys, write_requirement_function_outline
from csvtojson import csvtojson
import json

curr_filepath = path.realpath(__file__)

cps_programs_csv_filepath = sys.argv[1]
req_fns_output_filepath = path.abspath(path.join(__file__, "../..", "data", "hs_req_fns.json"))
cps_programs_output_filepath = path.abspath(path.join(__file__, "../..", "data", "cps_programs.json"))

if __name__ == "__main__":
    with open(cps_programs_csv_filepath) as cps_programs_csvfile:
        cps_programs_json_str = csvtojson(cps_programs_csvfile.read()) 
        cps_programs = json.loads(cps_programs_json_str)

        cps_programs = with_program_ids(cps_programs)
        cps_programs = with_requirement_function_keys(cps_programs)
        with open(cps_programs_output_filepath, "w") as f:
            json.dump(cps_programs, f, indent=2)

        req_fns = write_requirement_function_outline(cps_programs)
        with open(req_fns_output_filepath, "w") as f:
            json.dump(req_fns, f, indent=2)
            



#!/usr/bin/python3

from hashlib import md5
import json
import sys

def add_program_id(hs_programs_json_input_path, output_path):
    hs_programs_with_id = []
    with open(hs_programs_json_input_path, "r") as hs_programs_file:
        hs_programs = json.load(hs_programs_file)
        for program in hs_programs:
            # each hs_program in the raw data is uniquely identified
            # by a combination of the program's School_ID, unique to the
            # school, and the Program_Type of the program, unique to every
            # program within a school.
            # The ID property we're going to add is a hash digest of the 
            # School_ID string and the Program_Type string.
            school_id = program["School_ID"]
            program_type = program["Program_Type"]

            hashed = md5()
            hashed.update(school_id.encode("utf-8"))
            hashed.update(program_type.encode("utf-8"))

            program_id = hashed.hexdigest()
            program["ID"] = program_id
            hs_programs_with_id.append(program)

    with open(output_path, "w") as output_file:
        json.dump(hs_programs_with_id, output_file, indent=4)

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    add_program_id(input_path, output_path)



# usr/bin/python3

from hashlib import md5
import copy
import json

def with_program_ids(programs):
    """ Takes array of cps programs and returns array of modified
    cps programs with ID property added. The value of the ID property
    is calculated from the hash of School_ID and Program_Type properties."""
    output = copy.deepcopy(programs)
    for program in output:
        school_id = program["School_ID"]
        program_type = program["Program_Type"]

        hashed = md5()
        hashed.update(school_id.encode("utf-8"))
        hashed.update(program_type.encode("utf-8"))
        program_id = hashed.hexdigest()

        program["ID"] = program_id

    return output

def with_requirement_function_keys(programs):
    """ Takes in array of cps programs and outputs dict of modified programs
    with Application_Requirements_Fn and Selection_Requirements_Fn properties
    added. These properties are keys that link the records in the 
    cps programs JSON file to their requirement functions. If the program
    has no requirement functions, the value of the properties is the empty
    string."""
    output = copy.deepcopy(programs)
    for program in output:
        if (is_highschool_program(program)):
            application_req_fn_key = get_application_req_fn_key(program)
            selection_req_fn_key = get_selection_req_fn_key(program)
            program["Application_Requirements_Fn"] = application_req_fn_key
            program["Program_Selections_Fn"] = selection_req_fn_key

        # if the school is not a high school, we won't be defining
        # requirement functions for it, because the app only handles
        # high school admissions. Write the empty string as a null value.
        else:
            program["Application_Requirements_Fn"] = ""
            program["Program_Selections_Fn"] = ""

    return output

def write_requirement_function_outline(programs):
    """ Takes in array of cps programs and outputs dict containing
        the outline for future requirement function definitions. The
        actual function definitions will need to be written manually;
        However, the keys of the dict link the requirement functions 
        to the high school programs that have them.
        The outputted dict has three properties:
            desc: The description of the requirement function (copied from
                the source cps program for programmer convenience)
            programs: A list of the cps programs which have this requirement,
                again for programmer convenience.
            fn: The placeholder for the future requirement function definition.
                When the requirement function outline is ported to a Javascript
                or Typescript file, this property should be replaced with a function
                of the type (StudentData, SchoolData) => {outcome: SuccessChance, progress?: Progress}
                See config/README.txt for more detail and config/example for example
                implementation.
            """

    output = {}
    for program in programs:
        # only create records for HS programs
        #print(is_highschool_program(program)) 
        if (is_highschool_program(program)):
            application_req_fn_key = get_application_req_fn_key(program)
            selection_req_fn_key = get_selection_req_fn_key(program)

            application_req_already_in_output = application_req_fn_key in output
            selection_req_already_in_output = selection_req_fn_key in output

            if application_req_fn_key not in output:
                output[application_req_fn_key] = {
                        "name": "",
                        "desc": program["Application_Requirements"],
                        "programs": [get_program_name(program) + " - Application"],
                        "fn": ""
                        }
            else: 
                output[application_req_fn_key]["programs"].append(get_program_name(program) + " - Application")

            if selection_req_fn_key not in output:
                output[selection_req_fn_key] = {
                        "name": "",
                        "desc": program["Program_Selections"],
                        "programs": [get_program_name(program) + " - Selection"],
                        "fn": ""
                        }
            else: 
                output[selection_req_fn_key]["programs"].append(get_program_name(program) + " - Selection")

    return output

def get_application_req_fn_key(program):
    requirement_description = program["Application_Requirements"]
    hashed = md5()
    hashed.update(requirement_description.encode("utf-8"))
    return hashed.hexdigest()

def get_selection_req_fn_key(program):
    requirement_description = program["Program_Selections"]
    hashed = md5()
    hashed.update(requirement_description.encode("utf-8"))
    return hashed.hexdigest()

def get_program_name(hs_program):
    shortname = hs_program["Short_Name"]
    program_type = hs_program["Program_Type"]
    return "{} - {}".format(shortname, program_type)

def is_highschool_program(program):
    # Academic Centers are 6th-8th grade (Middle School) programs
    # which are confusingly often held in High Schools. So when we
    # encounter Academic Centers, return false even if the
    # School_Type is 'HS'
    if (program["Primary_Category"] == "HS"):
        if (program["Program_Type"] == "Academic Center"):
            return False
        else:
            return True
    else:
        return False


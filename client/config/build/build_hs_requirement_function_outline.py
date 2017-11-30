# usr/bin/python3

from hashlib import md5
from os import path
import json

def build_hs_requirement_function_outline(hs_programs_json_path, **kwargs):
    """Takes in path to hs_programs.json and saves a .js file to the output path consisting of
        js object of shape [key]: {name: string, desc: string, fn: (StudentData, SchoolData) => boolean}"""

    output_path_req_fn_defs = kwargs.get("output_path_req_fn_defs", False)
    output_path_hs_config_data = kwargs.get("output_path_hs_config_data", False)
    if not output_path_req_fn_defs or not output_path_hs_config_data:
        raise ValueError("Missing required keyword argument output_path_req_fn_defs or output_path_hs_config_data")
    # if user specifies that output_path should overwrite already-present files. Defaults to False.
    overwrite = kwargs.get("overwrite", False)
    
    output_dict_req_fn_defs = {}
    output_arr_hs_config_data = [] 

    def get_hash(desc):
        hashed = md5()
        hashed.update(desc.encode("utf-8"))
        return hashed.hexdigest()

    with open(hs_programs_json_path, "r") as hs_programs_file:
        hs_programs = json.load(hs_programs_file)
        for program in hs_programs:
            # add new record to output_dict_req_fn_defs for each unique application requirement
            #   description and each unique selection requirement description
            application_req_description = program["Application_Requirements"]
            selection_req_description = program["Program_Selections"]

            app_req_desc_hash = get_hash(application_req_description)
            selection_req_desc_hash = get_hash(selection_req_description)

            app_req_in_output = app_req_desc_hash in output_dict_req_fn_defs
            selection_req_in_output = app_req_desc_hash in output_dict_req_fn_defs

            if not app_req_in_output:
                output_dict_req_fn_defs[app_req_desc_hash] = {
                        "name": "",
                        "desc": application_req_description,
                        "fn": ""
                        }
            if not selection_req_in_output:
                output_dict_req_fn_defs[selection_req_desc_hash] = {
                        "name": "",
                        "desc": selection_req_description,
                        "fn": ""
                        }

            # add new record to output_dict_hs_config_data with
            #   Application_Requirements_Fn and Program_Selections_Fn fields
            program["Application_Requirements_Fn"] = app_req_desc_hash
            program["Program_Selections_Fn"] = selection_req_desc_hash
            output_arr_hs_config_data.append(program)

        # write output_dict for req functions to output_path for req fns 
        if path.isfile(output_path_req_fn_defs) and not overwrite:
            raise ValueError("File {} already exists! To overwrite, pass overwrite=True keyword argument to build_hs_requirement_function_outline.")
        else:
            with open(output_path_req_fn_defs, "w") as output_file:
                json.dump(output_dict_req_fn_defs, output_file, indent=4)

        # write output_dict for hs config data to output_path for hs config data
        if path.isfile(output_path_hs_config_data) and not overwrite:
            raise ValueError("File {} already exists! To overwrite, pass overwrite=True keyword argument to build_hs_requirement_function_outline.")
        else:
            with open(output_path_hs_config_data, "w") as output_file:
                json.dump(output_arr_hs_config_data, output_file, indent=4)






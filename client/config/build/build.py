from os import path
from build_hs_requirement_function_outline import build_hs_requirement_function_outline

curr_filepath = path.realpath(__file__)

hs_programs_filepath = path.abspath(path.join(__file__, "../..", "data", "hs_programs.json"))

hs_req_fn_output_filepath = path.abspath(path.join(__file__, "../..", "data", "hs_req_fns.json"))
hs_config_data_output_filepath = path.abspath(path.join(__file__, "../..", "data", "hs_config_data.json"))

if __name__ == "__main__":
    build_hs_requirement_function_outline(hs_programs_filepath, 
            output_path_req_fn_defs=hs_req_fn_output_filepath,
            output_path_hs_config_data=hs_config_data_output_filepath,
            overwrite=True)

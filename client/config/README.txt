Build instructions for CPS Program data

1. Get program data in .csv format from Chicago Open Data Portal. The correct data source should be called 'Chicago Public Schools - School Admissions Information' It's possible that it will be named 'SY16-17' but contain updated information about the current year's programs -- that was the case this year (SY17-18). Check when the data source was last updated to confirm this.  

2. Run the script 'build.py' on the .csv program data. This script will convert the .csv to json in the format the website expects, outputting 'cps_programs.json'.  cps_programs.json is a JSON array of all programs in the original .csv data, with three added properties on each program. The three added properties are:
    - 'ID', the value of which is a hash produced from a combination of the program's School_ID and Program_Type properties. This is used to uniquely identify programs.
    - 'Application_Req_Fn', whose value is a hash produced from the program's Application_Requirements property and is used to link the program to the function in hs_req_fns.ts that implements that program's application requirements (more on that below)
    - 'Selection_Req_Fn', whose value is a hash produced from the program's Program_Selections property and, as with 'Application_Req_Fn', is used to link the program to the function in hs_req_fns.ts that implements that program's selection requirements (more on that below).
    NOTE - for all non-HS programs (any programs where the value of "School_Type" is not "HS", the values of Application_Req_Fn and Selection_Req_Fn will be blank. 

  Build.py will also create a new file in the same folder, called hs_req_fns.json. This is a json array of objects with three properties: "id", "desc", and "fn". The "id" is the hash which matches requirement functions with programs, "desc" is the original program description copied for convenience, and "fn" is a placeholder value for the implementation of the requirement function in code. This file (hs_req_fns.json) is intended to be copied into Typescript file, and then someone will have to write or copy/paste the actual function implementations into the "fn" property.

3. Once you have the two files, cps_programs.json and hs_req_fns.json, you need to
    a) copy the new cps_programs.json into src/shared/data/cps_programs.json
    b) copy the JSON object in hs_req_fns.json into a Typescript file, hs_req_fns.ts, and
      i) assign the JSON object to a variable named 'HSReqFns', and export that variable as the default export of hs_req_fns.ts
      ii) write the implementation of each requirement function, as a function of the signature (StudentData, SchoolData) => SuccessChance, Progress?. For the definitions of these types see src/shared/types/ and src/shared/enums. (SuccessChance is an enum.)
      NOTE - look in the git history for an example implementation of hs_req_fns.ts. It will take a while to do it from scratch, so it may be a good idea to reuse as much of the old implementation as possible.


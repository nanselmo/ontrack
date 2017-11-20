// import hs_programs.json
// import hs_requirement_function_lookup.js
//
// initialize new object hs_data
// for each program in hs_programs
//   look up matching requirement functions in hs_requirement_function_lookup
//   if no matching requirement found for either selection or application
//     throw error
//   else
//     extend program with application req function : appReqFn name
//     extend program with selection req function : selectionReqFn name
//     add extended program to hs_data object
//
// write hs_data.json to src/shared/data/hs_data.json
//
// copy all files in data/ folder to src/shared/data
// copy requirement_function_definitions to src/shared/data

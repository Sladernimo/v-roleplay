// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: bus.js
// DESC: Provides bus driver job functions and usage
// TYPE: Job (JavaScript)
// ===========================================================================

// Routes are divided up per-island. Smaller islands will have less routes.
// Routes will attempt to cross over into other routes whenever possible, creating transfer stops.
// All routes will start and stop at the same transit station, creating a central hub for all routes
// Routes are identified by island name and colour. Example: Portland Red Line or Los Santos Blue Line

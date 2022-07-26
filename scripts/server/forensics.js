// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: forensics.js
// DESC: Provides forensics functions and commands (bullet casings, blood, etc)
// TYPE: Server (JavaScript)
// ===========================================================================

// Forensic Types
const VRR_FORENSICS_NONE = 0;
const VRR_FORENSICS_BULLET = 1;                  // Bullet. The actual tip that hits a target. Has rifling and ballistics information of the weapon.
const VRR_FORENSICS_BLOOD = 2;                   // Blood. Automatically applied to ground and bullets that hit when somebody is shot
const VRR_FORENSICS_BODY = 3;                    // Body. A dead body lol
const VRR_FORENSICS_HAIR = 4;                    // Hair. Automatically applied to
const VRR_FORENSICS_SWEAT = 5;                   // Sweat. Automatically applied to clothing when worn
const VRR_FORENSICS_SALIVA = 6;                  // Saliva. Automatically applied to drinks when drank
const VRR_FORENSICS_BULLETCASINGS = 7;           // Bullet casings. Automatically dropped when fired from a weapon except when used in a vehicle (driveby)

// ===========================================================================
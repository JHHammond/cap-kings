import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

/*
  CAP KINGS / GO 20-0
  Complete single-file React app.
  Mobile-first sizing: the full 5x5 draft board is designed to fit on an iPhone screen.
*/

/* ============================ TEAM COLORS ============================ */
const TC = {
  SF: "#AA0000", NE: "#002244", GB: "#203731", DAL: "#003594", CHI: "#0B162A",
  DET: "#0076B6", MIA: "#008E97", MIN: "#4F2683", DEN: "#FB4F14", PIT: "#FFB612",
  BAL: "#241773", KC: "#E31837", IND: "#002C5F", LAC: "#0080C6", SD: "#0080C6",
  CIN: "#FB4F14", NO: "#D3BC8D", SEA: "#69BE28", HOU: "#03202F", LAR: "#003594",
  STL: "#003594", ARI: "#97233F", NYG: "#0B2265", NYJ: "#125740", BUF: "#00338D",
  CLE: "#311D00", TB: "#D50A0A", ATL: "#A71930", CAR: "#0085CA", JAX: "#006778",
  TEN: "#4B92DB", LV: "#000000", WAS: "#5A1414", PHI: "#004C54", FA: "#3A3F4A",
};

/* ============================ PLAYER POOLS ============================ */
/* [name, team, score, jersey, bestYear, statA, statB, statC, era|null]
   QB: pass YDS/pass TD/RTG · RB: rush YDS/rush TD/YPC · WR & TE: rec YDS/rec TD/REC
   These are best-season cards. Score and tier are scaled to the position, especially TE. */
const QB = {
  5: [
    ["Tom Brady", "NE", 99, 12, 2007, 4806, 50, 117.2, "NE/TB · 2000-22"],
    ["Peyton Manning", "DEN", 99, 18, 2013, 5477, 55, 115.1, "IND/DEN · 1998-15"],
    ["Patrick Mahomes", "KC", 98, 15, 2018, 5097, 50, 113.8, null],
    ["Aaron Rodgers", "GB", 98, 12, 2011, 4643, 45, 122.5, "GB/NYJ/PIT · 2005-"],
    ["Drew Brees", "NO", 97, 9, 2011, 5476, 46, 110.6, "NO · 2001-20"],
    ["Dan Marino", "MIA", 97, 13, 1984, 5084, 48, 108.9, "MIA · 1983-99"],
    ["Lamar Jackson", "BAL", 96, 8, 2019, 3127, 36, 113.3, null],
    ["Steve Young", "SF", 96, 8, 1994, 3969, 35, 112.8, "SF · 1985-99"],
  ],
  4: [
    ["Joe Montana", "SF", 94, 16, 1989, 3521, 26, 112.4, "SF · 1979-94"],
    ["Josh Allen", "BUF", 94, 17, 2020, 4544, 37, 107.2, null],
    ["Joe Burrow", "CIN", 93, 9, 2021, 4611, 34, 108.3, null],
    ["Matthew Stafford", "LAR", 92, 9, 2011, 5038, 41, 97.2, null],
    ["Justin Herbert", "LAC", 91, 10, 2021, 5014, 38, 97.7, null],
    ["Dak Prescott", "DAL", 90, 4, 2023, 4516, 36, 105.9, null],
    ["Brock Purdy", "SF", 90, 13, 2023, 4280, 31, 113.0, null],
    ["Jalen Hurts", "PHI", 89, 1, 2022, 3701, 22, 101.5, null],
  ],
  3: [
    ["Brett Favre", "GB", 87, 4, 1995, 4413, 38, 99.5, "GB · 1991-10"],
    ["Cam Newton", "CAR", 87, 1, 2015, 3837, 35, 99.4, "CAR · 2011-21"],
    ["Matt Ryan", "ATL", 87, 2, 2016, 4944, 38, 117.1, "ATL · 2008-21"],
    ["Jared Goff", "DET", 85, 16, 2018, 4688, 32, 101.1, null],
    ["Tua Tagovailoa", "MIA", 85, 1, 2022, 3548, 25, 105.5, null],
    ["Trevor Lawrence", "JAX", 83, 16, 2022, 4113, 25, 95.2, null],
    ["Bo Nix", "DEN", 82, 10, 2024, 3775, 29, 93.3, null],
    ["Caleb Williams", "CHI", 81, 18, 2024, 3541, 20, 87.8, null],
  ],
  2: [
    ["Geno Smith", "LV", 78, 7, 2022, 4282, 30, 100.9, null],
    ["Kirk Cousins", "ATL", 78, 18, 2020, 4265, 35, 105.0, null],
    ["Derek Carr", "NO", 77, 4, 2015, 3987, 32, 91.1, "LV/NO · 2014-24"],
    ["Jameis Winston", "NYG", 76, 5, 2019, 5109, 33, 84.3, null],
    ["Andy Dalton", "CIN", 75, 14, 2013, 4293, 33, 88.8, null],
    ["Justin Fields", "NYJ", 74, 7, 2022, 2242, 17, 85.2, null],
    ["Mac Jones", "SF", 72, 10, 2021, 3801, 22, 92.5, null],
    ["Ryan Tannehill", "FA", 72, 17, 2019, 2742, 22, 117.5, null],
  ],
  1: [
    ["Bryce Young", "CAR", 68, 9, 2024, 2877, 11, 82.2, null],
    ["Mitch Trubisky", "PIT", 68, 10, 2018, 3223, 24, 95.4, null],
    ["Aidan O'Connell", "LV", 66, 4, 2023, 2218, 12, 83.9, null],
    ["Kenny Pickett", "PHI", 65, 7, 2023, 2070, 6, 81.4, null],
    ["Zach Wilson", "MIA", 63, 2, 2022, 1688, 6, 72.8, null],
    ["Tim Tebow", "DEN", 62, 15, 2011, 1729, 12, 72.9, "DEN/NYJ · 2010-12"],
    ["Marcus Mariota", "WAS", 64, 8, 2016, 3426, 26, 95.6, null],
    ["Bailey Zappe", "NE", 61, 4, 2022, 781, 5, 100.9, null],
  ],
};

const RB = {
  5: [
    ["Barry Sanders", "DET", 99, 20, 1997, 2053, 11, 6.1, "DET · 1989-98"],
    ["Jim Brown", "CLE", 99, 32, 1963, 1863, 12, 6.4, "CLE · 1957-65"],
    ["LaDainian Tomlinson", "SD", 98, 21, 2006, 1815, 28, 5.2, "SD · 2001-11"],
    ["Adrian Peterson", "MIN", 98, 28, 2012, 2097, 12, 6.0, "MIN · 2007-19"],
    ["Eric Dickerson", "LAR", 97, 29, 1984, 2105, 14, 5.6, "LAR · 1983-93"],
    ["Derrick Henry", "BAL", 97, 22, 2020, 2027, 17, 5.4, null],
    ["Marshall Faulk", "STL", 96, 28, 2000, 1359, 18, 5.4, "IND/STL · 1994-06"],
    ["Christian McCaffrey", "SF", 96, 23, 2019, 1387, 15, 4.8, null],
  ],
  4: [
    ["Walter Payton", "CHI", 94, 34, 1977, 1852, 14, 5.5, "CHI · 1975-87"],
    ["Emmitt Smith", "DAL", 94, 22, 1995, 1773, 25, 4.7, "DAL · 1990-04"],
    ["Saquon Barkley", "PHI", 94, 26, 2024, 2005, 13, 5.8, null],
    ["Jonathan Taylor", "IND", 93, 28, 2021, 1811, 18, 5.5, null],
    ["Jamaal Charles", "KC", 92, 25, 2012, 1509, 5, 5.3, "KC · 2008-16"],
    ["Jahmyr Gibbs", "DET", 91, 26, 2024, 1412, 16, 5.6, null],
    ["De'Von Achane", "MIA", 90, 28, 2024, 907, 6, 5.7, null],
    ["Nick Chubb", "CLE", 90, 24, 2022, 1525, 12, 5.0, null],
  ],
  3: [
    ["Earl Campbell", "HOU", 88, 34, 1980, 1934, 13, 5.2, "HOU · 1978-85"],
    ["DeMarco Murray", "DAL", 88, 29, 2014, 1845, 13, 4.7, "DAL/TEN · 2011-17"],
    ["Tony Dorsett", "DAL", 87, 33, 1981, 1646, 4, 4.8, "DAL · 1977-88"],
    ["Bijan Robinson", "ATL", 87, 7, 2024, 1456, 14, 4.8, null],
    ["Josh Jacobs", "GB", 86, 8, 2022, 1653, 12, 4.9, null],
    ["Alvin Kamara", "NO", 86, 41, 2020, 932, 16, 5.0, null],
    ["Jerome Bettis", "PIT", 84, 36, 1997, 1665, 7, 4.4, "PIT · 1993-05"],
    ["Kyren Williams", "LAR", 83, 23, 2023, 1144, 12, 5.0, null],
  ],
  2: [
    ["James Cook", "BUF", 79, 4, 2023, 1122, 2, 4.7, null],
    ["Joe Mixon", "HOU", 79, 28, 2021, 1205, 13, 4.1, null],
    ["Kenneth Walker", "SEA", 78, 9, 2022, 1050, 9, 4.6, null],
    ["Travis Etienne", "JAX", 78, 1, 2023, 1008, 11, 3.8, null],
    ["Rachaad White", "TB", 76, 1, 2023, 990, 6, 3.6, null],
    ["Najee Harris", "LAC", 76, 22, 2021, 1200, 7, 3.9, null],
    ["Ezekiel Elliott", "DAL", 77, 21, 2016, 1631, 15, 5.1, null],
    ["Kareem Hunt", "KC", 78, 27, 2017, 1327, 8, 4.9, null],
  ],
  1: [
    ["Jaylen Warren", "PIT", 70, 30, 2023, 784, 4, 5.3, null],
    ["Devin Singletary", "NYG", 70, 26, 2021, 870, 7, 4.6, null],
    ["Clyde Edwards-Helaire", "KC", 68, 25, 2020, 803, 4, 4.4, null],
    ["Samaje Perine", "CIN", 67, 25, 2022, 394, 2, 4.1, null],
    ["Cam Akers", "MIN", 67, 3, 2020, 625, 2, 4.3, null],
    ["Roschon Johnson", "CHI", 66, 30, 2023, 352, 2, 4.3, null],
    ["Boston Scott", "FA", 65, 35, 2021, 373, 7, 4.3, null],
    ["Mike Alstott", "TB", 69, 40, 1999, 949, 7, 4.0, "TB · 1996-06"],
  ],
};

const WR = {
  5: [
    ["Jerry Rice", "SF", 99, 80, 1995, 1848, 15, 122, "SF · 1985-04"],
    ["Randy Moss", "NE", 99, 81, 2007, 1493, 23, 98, "MIN/NE · 1998-12"],
    ["Calvin Johnson", "DET", 98, 81, 2012, 1964, 5, 122, "DET · 2007-15"],
    ["Cooper Kupp", "LAR", 98, 10, 2021, 1947, 16, 145, null],
    ["Tyreek Hill", "MIA", 97, 10, 2023, 1799, 13, 119, null],
    ["CeeDee Lamb", "DAL", 97, 88, 2023, 1749, 12, 135, null],
    ["Ja'Marr Chase", "CIN", 97, 1, 2024, 1708, 17, 127, null],
    ["Julio Jones", "ATL", 96, 11, 2015, 1871, 8, 136, "ATL · 2011-22"],
  ],
  4: [
    ["Jaxon Smith-Njigba", "SEA", 94, 11, 2025, 1793, 10, 119, null],
    ["Puka Nacua", "LAR", 94, 17, 2025, 1715, 11, 129, null],
    ["Justin Jefferson", "MIN", 94, 18, 2022, 1809, 8, 128, null],
    ["Davante Adams", "GB", 93, 17, 2021, 1553, 11, 123, null],
    ["Marvin Harrison", "IND", 93, 88, 2002, 1722, 11, 143, "IND · 1996-08"],
    ["Larry Fitzgerald", "ARI", 92, 11, 2005, 1409, 10, 103, "ARI · 2004-20"],
    ["Terrell Owens", "SF", 92, 81, 2001, 1412, 16, 93, "SF/DAL · 1996-10"],
    ["Amon-Ra St. Brown", "DET", 92, 14, 2023, 1515, 10, 119, null],
  ],
  3: [
    ["AJ Brown", "PHI", 89, 11, 2022, 1496, 11, 88, null],
    ["Michael Irvin", "DAL", 89, 88, 1995, 1603, 10, 111, "DAL · 1988-99"],
    ["Cris Carter", "MIN", 89, 80, 1995, 1371, 17, 122, "MIN · 1987-02"],
    ["Nico Collins", "HOU", 88, 12, 2023, 1297, 8, 80, null],
    ["George Pickens", "DAL", 88, 3, 2025, 1429, 9, 93, null],
    ["Deebo Samuel", "WAS", 87, 1, 2021, 1405, 6, 77, null],
    ["Drake London", "ATL", 86, 5, 2024, 1271, 9, 100, null],
    ["Garrett Wilson", "NYJ", 86, 17, 2024, 1104, 7, 101, null],
  ],
  2: [
    ["DeVonta Smith", "PHI", 81, 6, 2022, 1196, 7, 95, null],
    ["Jaylen Waddle", "MIA", 81, 17, 2022, 1356, 8, 75, null],
    ["Ladd McConkey", "LAC", 80, 15, 2024, 1149, 7, 82, null],
    ["Terry McLaurin", "WAS", 80, 17, 2022, 1191, 5, 77, null],
    ["Keenan Allen", "LAC", 80, 13, 2017, 1393, 6, 102, null],
    ["DeAndre Hopkins", "ARI", 82, 10, 2018, 1572, 11, 115, null],
    ["Mike Evans", "TB", 81, 13, 2018, 1524, 8, 86, null],
    ["DK Metcalf", "SEA", 80, 14, 2020, 1303, 10, 83, null],
  ],
  1: [
    ["Chris Godwin", "TB", 75, 14, 2019, 1333, 9, 86, null],
    ["Jerry Jeudy", "CLE", 75, 3, 2024, 1229, 4, 90, null],
    ["Rashee Rice", "KC", 74, 4, 2023, 938, 7, 79, null],
    ["Brandin Cooks", "NO", 74, 3, 2018, 1204, 5, 80, null],
    ["Romeo Doubs", "GB", 71, 87, 2023, 674, 8, 59, null],
    ["Darnell Mooney", "ATL", 70, 11, 2021, 1055, 4, 81, null],
    ["Curtis Samuel", "BUF", 70, 10, 2020, 851, 3, 77, null],
    ["Mecole Hardman", "FA", 68, 12, 2021, 693, 2, 59, null],
  ],
};

const TE = {
  5: [
    ["Rob Gronkowski", "NE", 99, 87, 2011, 1327, 17, 90, "NE/TB · 2010-21"],
    ["Travis Kelce", "KC", 98, 87, 2020, 1416, 11, 105, null],
    ["Tony Gonzalez", "KC", 97, 88, 2004, 1258, 7, 102, "KC/ATL · 1997-13"],
    ["Jimmy Graham", "NO", 96, 80, 2011, 1310, 11, 99, "NO/SEA · 2010-21"],
    ["Mark Andrews", "BAL", 95, 89, 2021, 1361, 9, 107, null],
    ["Kellen Winslow Sr.", "SD", 95, 80, 1980, 1290, 9, 89, "SD · 1979-87"],
    ["George Kittle", "SF", 94, 85, 2018, 1377, 5, 88, null],
    ["Trey McBride", "ARI", 94, 85, 2025, 1239, 11, 126, null],
  ],
  4: [
    ["Antonio Gates", "SD", 93, 85, 2005, 1101, 10, 89, "SD · 2003-18"],
    ["Shannon Sharpe", "DEN", 92, 84, 1996, 1062, 10, 80, "DEN · 1990-03"],
    ["Jason Witten", "DAL", 91, 82, 2012, 1039, 3, 110, "DAL · 2003-20"],
    ["Brock Bowers", "LV", 91, 89, 2024, 1194, 5, 112, null],
    ["Dallas Clark", "IND", 90, 44, 2009, 1106, 10, 100, "IND · 2003-13"],
    ["Vernon Davis", "SF", 90, 85, 2009, 965, 13, 78, "SF · 2006-19"],
    ["Greg Olsen", "CAR", 89, 88, 2015, 1104, 7, 77, "CAR · 2007-20"],
    ["Zach Ertz", "PHI", 89, 86, 2018, 1163, 8, 116, null],
  ],
  3: [
    ["Kyle Pitts", "ATL", 86, 8, 2021, 1026, 1, 68, null],
    ["Sam LaPorta", "DET", 86, 87, 2023, 889, 10, 86, null],
    ["TJ Hockenson", "MIN", 85, 87, 2022, 914, 6, 86, null],
    ["Darren Waller", "LV", 85, 83, 2020, 1196, 9, 107, null],
    ["Evan Engram", "JAX", 84, 17, 2023, 963, 4, 114, null],
    ["Ben Coates", "NE", 84, 87, 1994, 1174, 7, 96, "NE · 1991-99"],
    ["Todd Heap", "BAL", 83, 86, 2005, 855, 7, 75, "BAL · 2001-12"],
    ["Keith Jackson", "PHI", 83, 88, 1988, 869, 6, 81, "PHI/GB · 1988-96"],
  ],
  2: [
    ["Dallas Goedert", "PHI", 80, 88, 2021, 830, 4, 56, null],
    ["Cole Kmet", "CHI", 79, 85, 2023, 719, 6, 73, null],
    ["Heath Miller", "PIT", 79, 83, 2012, 816, 8, 71, "PIT · 2005-15"],
    ["Jeremy Shockey", "NYG", 79, 80, 2002, 894, 2, 74, "NYG/NO · 2002-11"],
    ["Jordan Reed", "WAS", 78, 86, 2015, 952, 11, 87, "WAS · 2013-20"],
    ["Delanie Walker", "TEN", 78, 82, 2015, 1088, 6, 94, "SF/TEN · 2006-19"],
    ["Jared Cook", "NO", 77, 87, 2018, 896, 6, 68, null],
    ["Martellus Bennett", "CHI", 77, 83, 2014, 916, 6, 90, "DAL/CHI/NE · 2008-17"],
  ],
  1: [
    ["Tyler Eifert", "CIN", 73, 85, 2015, 615, 13, 52, null],
    ["Eric Ebron", "IND", 73, 85, 2018, 750, 13, 66, null],
    ["Kyle Rudolph", "MIN", 72, 82, 2016, 840, 7, 83, null],
    ["Ben Watson", "NO", 72, 82, 2015, 825, 6, 74, "NE/NO · 2004-19"],
    ["Jermichael Finley", "GB", 71, 88, 2011, 767, 8, 55, "GB · 2008-13"],
    ["Coby Fleener", "IND", 70, 80, 2014, 774, 8, 51, null],
    ["Pat Freiermuth", "PIT", 70, 88, 2022, 732, 2, 63, null],
    ["O.J. Howard", "TB", 69, 80, 2018, 565, 5, 34, null],
  ],
};

/* ============================ CONSTANTS ============================ */
const POSITIONS = ["QB", "RB", "WR", "WR", "TE"];
const POOLS = { QB, RB, WR, TE };
const STAT_LABELS = { QB: ["YDS", "TD", "RTG"], RB: ["YDS", "TD", "YPC"], WR: ["YDS", "TD", "REC"], TE: ["YDS", "TD", "REC"] };
const POS_COLORS = { QB: "#F87171", RB: "#FB923C", WR: "#FBBF24", TE: "#4ADE80" };
const TIER_COLORS = { 5: "#F59E0B", 4: "#A78BFA", 3: "#60A5FA", 2: "#34D399", 1: "#9CA3AF" };
const VARIANCE = { 5: 0.10, 4: 0.13, 3: 0.17, 2: 0.22, 1: 0.35 };
const CAP = 15;
const OPP_NAMES = ["Ironhawks", "Marauders", "Night Wolves", "Sentinels", "Vipers", "Outlaws", "Monarchs", "Rhinos", "Blizzard", "Scorpions", "Gladiators", "Renegades", "Mustangs", "Krakens", "Comets", "Jackals", "Juggernauts", "Phantoms", "Stallions", "Cyclones"];
const PLAYOFF_ROUNDS = [
  { name: "Divisional Round", opp: 74 },
  { name: "Conference Championship", opp: 79 },
  { name: "Cap Bowl", opp: 84 },
];

/* ============================ CHEMISTRY ============================ */
const PLAYER_TAGS = {
  "Lamar Jackson": ["speed", "rushing_qb"], "Jayden Daniels": ["speed", "rushing_qb"], "Josh Allen": ["power", "rushing_qb"], "Patrick Mahomes": ["creator", "modern"], "Joe Burrow": ["precision", "modern"], "Tom Brady": ["precision", "legend"], "Peyton Manning": ["precision", "legend"], "Joe Montana": ["precision", "legend"],
  "Derrick Henry": ["power"], "Bijan Robinson": ["speed", "modern"], "Jahmyr Gibbs": ["speed", "modern"], "De'Von Achane": ["speed"], "Christian McCaffrey": ["versatile", "modern"], "Jerome Bettis": ["power", "legend"], "Bo Jackson": ["power", "speed", "legend"], "Barry Sanders": ["speed", "legend"],
  "Tyreek Hill": ["speed"], "Justin Jefferson": ["precision", "modern"], "Ja'Marr Chase": ["speed", "modern"], "Amon-Ra St. Brown": ["precision", "modern"], "CeeDee Lamb": ["precision", "modern"], "AJ Brown": ["power", "modern"], "DK Metcalf": ["power"], "Cooper Kupp": ["precision"], "Jerry Rice": ["precision", "legend"], "Randy Moss": ["speed", "legend"], "Marvin Harrison": ["precision", "legend"], "Reggie Wayne": ["precision", "legend"], "Michael Irvin": ["power", "legend"], "Julio Jones": ["power", "speed", "legend"],
  "Rob Gronkowski": ["power", "legend"], "George Kittle": ["power"], "Travis Kelce": ["precision", "modern"], "Brock Bowers": ["speed", "modern"], "Tony Gonzalez": ["precision", "legend"],
};

const SPECIAL_CHEMISTRY = {
  "Joe Montana|Jerry Rice": { label: "Montana to Rice", type: "legendary", bonus: 0.08 },
  "Tom Brady|Rob Gronkowski": { label: "Brady to Gronk", type: "legendary", bonus: 0.08 },
  "Peyton Manning|Marvin Harrison": { label: "Manning to Harrison", type: "legendary", bonus: 0.07 },
  "Peyton Manning|Reggie Wayne": { label: "Manning to Wayne", type: "legendary", bonus: 0.06 },
  "Troy Aikman|Michael Irvin": { label: "Aikman to Irvin", type: "legendary", bonus: 0.06 },
  "Patrick Mahomes|Travis Kelce": { label: "Mahomes to Kelce", type: "stack", bonus: 0.07 },
  "Joe Burrow|Ja'Marr Chase": { label: "Burrow to Chase", type: "stack", bonus: 0.06 },
  "Jalen Hurts|AJ Brown": { label: "Hurts to AJ Brown", type: "stack", bonus: 0.05 },
  "Jalen Hurts|DeVonta Smith": { label: "Hurts to DeVonta", type: "stack", bonus: 0.05 },
  "Dak Prescott|CeeDee Lamb": { label: "Dak to CeeDee", type: "stack", bonus: 0.05 },
};

function tagsFor(player) {
  const tags = new Set(PLAYER_TAGS[player.name] || []);
  if (player.era) tags.add("legend");
  if (player.score >= 95) tags.add("elite");
  return tags;
}

function specialChem(a, b) {
  return SPECIAL_CHEMISTRY[`${a.name}|${b.name}`] || SPECIAL_CHEMISTRY[`${b.name}|${a.name}`] || null;
}

function getChemistry(rosterOrPicks) {
  const roster = Array.isArray(rosterOrPicks) ? rosterOrPicks : Object.values(rosterOrPicks || {});
  const links = [];
  const playerBonuses = {};

  const addLink = (a, b, label, bonus, type) => {
    const key = b ? [a.id, b.id, label].sort().join("|") : label;
    if (links.some((l) => l.key === key)) return;
    links.push({ key, a, b, label, bonus, type });
    if (a) playerBonuses[a.id] = (playerBonuses[a.id] || 0) + bonus / (b ? 2 : 5);
    if (b) playerBonuses[b.id] = (playerBonuses[b.id] || 0) + bonus / 2;
  };

  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      const a = roster[i].player;
      const b = roster[j].player;
      const special = specialChem(a, b);
      if (special) {
        addLink(a, b, special.label, special.bonus, special.type);
        continue;
      }

      const hasQB = a.pos === "QB" || b.pos === "QB";
      const hasPassCatcher = ["WR", "TE"].includes(a.pos) || ["WR", "TE"].includes(b.pos);

      if (hasQB && hasPassCatcher && a.team === b.team && a.team !== "FA") {
        addLink(a, b, `${a.team} passing stack`, 0.05, "stack");
        continue;
      }

      if (a.team === b.team && a.team !== "FA") addLink(a, b, `${a.team} team chemistry`, 0.02, "team");

      const aTags = tagsFor(a);
      const bTags = tagsFor(b);
      if (aTags.has("speed") && bTags.has("speed")) addLink(a, b, "Speed identity", 0.02, "identity");
      if (aTags.has("power") && bTags.has("power")) addLink(a, b, "Bully-ball identity", 0.02, "identity");
      if (aTags.has("precision") && bTags.has("precision")) addLink(a, b, "Timing offense", 0.02, "identity");
      if (aTags.has("legend") && bTags.has("legend")) addLink(a, b, "Legend locker room", 0.015, "era");
    }
  }

  const qb = roster.find((r) => r.player.pos === "QB");
  const rb = roster.find((r) => r.player.pos === "RB");
  const wrs = roster.filter((r) => r.player.pos === "WR");
  const te = roster.find((r) => r.player.pos === "TE");
  if (qb?.player.score >= 85 && rb?.player.score >= 85 && wrs.some((r) => r.player.score >= 88) && te?.player.score >= 85) {
    links.push({ key: "balanced-offense", label: "Balanced offense", bonus: 0.03, type: "roster" });
    roster.forEach((r) => (playerBonuses[r.player.id] = (playerBonuses[r.player.id] || 0) + 0.006));
  }

  return { links, playerBonuses, totalBonus: Math.min(0.18, links.reduce((a, l) => a + l.bonus, 0)) };
}

function getPotentialChemistry(player, picks) {
  const picked = Object.values(picks || {});
  if (!picked.length) return [];
  const fakeRoster = [...picked, { player, price: 1 }];
  return getChemistry(fakeRoster).links.filter((l) => l.a?.id === player.id || l.b?.id === player.id);
}

/* ============================ HELPERS ============================ */
const toPlayer = (arr, pos) => ({ name: arr[0], team: arr[1], score: arr[2], espnId: null, jersey: arr[3], bestYear: arr[4], s1: arr[5], s2: arr[6], s3: arr[7], era: arr[8], pos, id: pos + "·" + arr[0] });
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const fmtNum = (n) => (typeof n === "number" && n >= 1000 ? n.toLocaleString() : String(n));
const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function buildBoard(prices, pickedIds) {
  const board = Array.from({ length: 5 }, () => Array(5).fill(null));
  for (let c = 0; c < 5; c++) {
    const pos = POSITIONS[c];
    const usedInCol = new Set();
    for (let r = 0; r < 5; r++) {
      const tier = prices[r];
      let pool = POOLS[pos][tier].filter((p) => !usedInCol.has(p[0]) && !pickedIds.has(pos + "·" + p[0]));
      if (pool.length === 0) pool = POOLS[pos][tier].filter((p) => !usedInCol.has(p[0]));
      if (pool.length === 0) pool = POOLS[pos][tier];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      usedInCol.add(pick[0]);
      board[r][c] = toPlayer(pick, pos);
    }
  }
  return board;
}

function genPrices(maxAffordable) {
  const target = Array.from({ length: 5 }, () => randInt(1, 5));
  const cap = Math.max(1, Math.min(5, maxAffordable));
  if (!target.some((p) => p <= cap)) target[randInt(0, 4)] = randInt(1, cap);
  return target;
}

function shortName(name) {
  if (name.length <= 12) return name;
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

function projectedWins(roster, chemistry) {
  const avg = roster.reduce((a, r) => a + r.player.score, 0) / 5;
  const raw = 0.403 * avg - 19.9 + chemistry.totalBonus * 9;
  return Math.max(1, Math.min(18.5, Math.round(raw * 2) / 2));
}

function gradeFor(wins) {
  if (wins === 20) return { label: "Perfect Season 🏆", color: "#F59E0B" };
  if (wins >= 18) return { label: "Dynasty Material 🔥", color: "#A78BFA" };
  if (wins >= 15) return { label: "Dominant Squad 💪", color: "#60A5FA" };
  if (wins >= 12) return { label: "Playoff Bound", color: "#2DD4BF" };
  if (wins >= 10) return { label: "Winning Record", color: "#9CA3AF" };
  if (wins >= 7) return { label: "Below .500", color: "#F97316" };
  if (wins >= 4) return { label: "Dumpster Fire 💀", color: "#EF4444" };
  return { label: "Historically Bad 😂", color: "#EF4444" };
}

/* ============================ REPORTS / STATS ============================ */
function getTeamReport(roster, chemistry) {
  if (!roster) return null;
  const byPos = roster.reduce((acc, r) => { (acc[r.player.pos] ||= []).push(r); return acc; }, {});
  const avg = roster.reduce((a, r) => a + r.player.score, 0) / roster.length;
  const qb = byPos.QB?.[0], rb = byPos.RB?.[0], wrs = byPos.WR || [], te = byPos.TE?.[0];
  const strengths = [], weaknesses = [];

  if (qb?.player.score >= 92) strengths.push("Elite quarterback play"); else if (qb?.player.score < 80) weaknesses.push("Quarterback is a major question mark");
  if (rb?.player.score >= 90) strengths.push("Feature-back rushing attack"); else if (rb?.player.score < 80) weaknesses.push("Thin run game");
  const wrAvg = wrs.reduce((a, r) => a + r.player.score, 0) / Math.max(1, wrs.length);
  if (wrAvg >= 90) strengths.push("Dangerous receiver room"); else if (wrAvg < 82) weaknesses.push("Receivers may struggle to separate");
  if (te?.player.score >= 90) strengths.push("Mismatch weapon at tight end"); else if (te?.player.score < 80) weaknesses.push("Limited tight end impact");
  if (chemistry.links.length >= 3) strengths.push("Strong roster chemistry"); else if (chemistry.links.length >= 1) strengths.push("Useful chemistry boost"); else weaknesses.push("No chemistry boost active");
  if (avg >= 91) strengths.push("Top-end roster talent");
  if (avg < 84) weaknesses.push("Overall talent below contender level");
  const legends = roster.filter((r) => r.player.era).length;
  if (legends >= 3) { strengths.push("Legend-heavy roster upside"); weaknesses.push("Older roster carries durability risk"); }
  if (roster.filter((r) => r.price <= 2).length >= 3) weaknesses.push("Too many budget starters");

  const title = avg >= 91 && chemistry.links.length >= 2 ? "Loaded Contender" : chemistry.links.length >= 3 ? "Chemistry Build" : avg >= 88 ? "Balanced Playoff Team" : roster.filter((r) => r.price <= 2).length >= 3 ? "Stars-and-Scrubs Build" : "Risky Wild Card";
  return { title, strengths: strengths.slice(0, 4), weaknesses: weaknesses.slice(0, 4) };
}

function rollInjury(player) {
  let chance = 0.07;
  if (player.era) chance += 0.04;
  if (player.pos === "RB") chance += 0.03;
  if (player.score >= 95) chance -= 0.01;
  if (Math.random() > chance) return null;
  const roll = Math.random();
  if (roll < 0.55) return { type: "minor", label: "Minor injury — missed 1 game", penalty: 0.92, gamesMissed: 1 };
  if (roll < 0.88) return { type: "moderate", label: "Injury setback — missed 3 games", penalty: 0.78, gamesMissed: 3 };
  return { type: "major", label: "Major injury — missed 6 games", penalty: 0.58, gamesMissed: 6 };
}

function makePlayerSeasonStats(r, context = {}) {
  const p = r.player;
  const chemistryBonus = context.chemistryBonus || 0;
  const injuryPenalty = context.injuryPenalty || 1;
  const qbScore = context.qbScore || 85;
  const qbInjuryPenalty = context.qbInjuryPenalty || 1;

  const talent = p.score / 90;
  const priceBoost = 1 + (r.price - 3) * 0.045;
  const chemBoost = 1 + chemistryBonus;
  const luck = 1 + gauss() * VARIANCE[r.price] * 0.50;
  let mult = Math.max(0.45, talent * priceBoost * chemBoost * luck * injuryPenalty);

  if (p.pos === "QB") {
    const yds = Math.round(p.s1 * mult);
    const td = Math.max(1, Math.round(p.s2 * mult));
    const ints = Math.max(3, Math.round((23 - p.score / 6) * (1 / Math.max(0.75, mult))));
    return { yds, td, ints, fantasy: yds * 0.04 + td * 4 - ints * 2 };
  }

  if (p.pos === "RB") {
    const yds = Math.round(p.s1 * mult);
    const td = Math.max(0, Math.round(p.s2 * mult));
    const rec = Math.max(6, Math.round((16 + p.score * 0.18) * mult + Math.random() * 12));
    return { yds, td, rec, fantasy: yds * 0.1 + td * 6 + rec * 0.5 };
  }

  // WR/TE production is connected to the drafted QB. Bad QB play drags pass-catchers down;
  // elite QB play gives them more efficient volume. QB injuries also hurt WR/TE output.
  const qbMultiplier = Math.max(0.70, Math.min(1.20, 0.84 + (qbScore - 80) / 100)) * qbInjuryPenalty;
  mult *= qbMultiplier;

  const yds = Math.round(p.s1 * mult);
  const td = Math.max(0, Math.round(p.s2 * mult));
  const rec = Math.max(10, Math.round(p.s3 * mult));
  return { yds, td, rec, fantasy: yds * 0.1 + td * 6 + rec * 0.5 };
}

/* ============================ SIMULATION ============================ */
function teamPerf(roster, chemistry, form, ptsAcc, playerImpacts = {}) {
  let t = 0;
  roster.forEach((r) => {
    const base = r.player.score;
    const playerChem = chemistry.playerBonuses[r.player.id] || 0;
    const injuryPenalty = playerImpacts[r.player.id]?.injury?.penalty || 1;
    const swing = gauss() * VARIANCE[r.price] * base * 0.4;
    const roll = Math.random();
    const mult = roll < 0.06 ? 0.28 : roll < 0.15 ? 0.7 : roll > 0.92 ? 1.15 : 1.0;
    const ps = (base + swing) * mult * (1 + playerChem) * injuryPenalty;
    t += ps;
    if (ptsAcc) ptsAcc[r.player.id] = (ptsAcc[r.player.id] || 0) + (ps / 100) * 28;
  });
  return (70 + ((t / 5) * (1 + chemistry.totalBonus) - 70) * 0.8) * form;
}

function toScoreline(myPerf, oppPerf, win) {
  let my = Math.max(3, Math.round(myPerf * 0.42 - 8 + Math.random() * 5));
  let opp = Math.max(0, Math.round(oppPerf * 0.42 - 8 + Math.random() * 5));
  if (win && my <= opp) my = opp + randInt(1, 7);
  if (!win && opp <= my) opp = my + randInt(1, 7);
  return { my, opp };
}

function simulate(roster, chemistry) {
  const form = 1 + gauss() * 0.08;
  const games = [], injuries = [], playerStats = {}, playerImpacts = {};
  const ptsAcc = {};
  const qbRosterSpot = roster.find((r) => r.player.pos === "QB");
  const qbScore = qbRosterSpot?.player.score || 85;

  roster.forEach((r) => {
    const injury = rollInjury(r.player);
    if (injury) {
      const injuryWithName = { ...injury, playerName: r.player.name };
      injuries.push(injuryWithName);
      playerImpacts[r.player.id] = { injury: injuryWithName };
    }
    const chemBonus = chemistry.playerBonuses[r.player.id] || 0;
    const injuryPenalty = injury ? injury.penalty : 1;
    const qbImpact = qbRosterSpot ? playerImpacts[qbRosterSpot.player.id]?.injury?.penalty || 1 : 1;
    playerStats[r.player.id] = {
      player: r.player,
      price: r.price,
      injury,
      stats: makePlayerSeasonStats(r, { chemistryBonus: chemBonus, injuryPenalty, qbScore, qbInjuryPenalty: qbImpact }),
    };
  });

  const oppPool = [...OPP_NAMES].sort(() => Math.random() - 0.5);
  for (let w = 0; w < 20; w++) {
    const team = teamPerf(roster, chemistry, form, ptsAcc, playerImpacts);
    const opponent = 65 + w * 0.5 + (Math.random() * 34 - 17);
    const win = team > opponent;
    const score = toScoreline(team, opponent, win);
    games.push({ w: win, my: score.my, opp: score.opp, name: oppPool[w % 20] });
  }

  let pts = 0, mvp = null;
  Object.values(playerStats).forEach((entry) => {
    pts += entry.stats.fantasy;
    if (!mvp || entry.stats.fantasy > mvp.pts) mvp = { player: entry.player, pts: entry.stats.fantasy, price: entry.price };
  });

  const formLabel = form > 1.05 ? "🔥 Your squad caught fire this season" : form < 0.95 ? "🥶 Cold season — the locker room flu hit hard" : null;
  return { games, wins: games.filter((g) => g.w).length, pts: Math.round(pts), mvp, formLabel, playerStats, injuries };
}

function playPlayoffGame(roster, chemistry, oppLevel) {
  const form = 1 + gauss() * 0.05;
  const team = teamPerf(roster, chemistry, form, null);
  const opponent = oppLevel + (Math.random() * 20 - 10);
  const win = team > opponent;
  const score = toScoreline(team, opponent, win);
  return { w: win, my: score.my, opp: score.opp, name: OPP_NAMES[randInt(0, 19)] };
}

/* ============================ COMPONENTS ============================ */
function Avatar({ player }) {
  const col = TC[player.team] || "#3A3F4A";
  return (
    <div className="ava legend" style={{ background: `linear-gradient(180deg, ${col} 0%, ${col}CC 55%, ${col}88 100%)` }}>
      <div className="ava-shine" /><span className="ava-num">{player.jersey}</span><span className="ava-team">{player.team}</span>
    </div>
  );
}

function Card({ player, price, state, onPick, chemLinks = [] }) {
  const labels = STAT_LABELS[player.pos];
  const interactive = state === "active";
  const cls = "card" + (state === "frost" ? " frost" : "") + (state === "over" ? " over" : "") + (state === "picked-sel" ? " sel" : "") + (state === "picked-dim" ? " pdim" : "");

  return (
    <button className={cls} onClick={interactive ? onPick : undefined} disabled={!interactive} tabIndex={interactive ? 0 : -1} aria-label={interactive ? `Draft ${player.name}, $${price}` : player.name}>
      {state === "picked-sel" && <span className="check">✓</span>}
      {state === "over" && <span className="over-tag">CAP</span>}
      {player.score >= 97 && state !== "frost" && <span className="goat">👑</span>}
      {chemLinks.length > 0 && state === "active" && <span className="chem-badge">🔗 CHEM</span>}
      <Avatar player={player} />
      <div className="card-body">
        <div className="pname">{shortName(player.name)}</div>
        <div className="meta"><span className="team">{player.bestYear} BEST</span><span className="pill" style={{ background: TIER_COLORS[price] }}>{player.score}</span></div>
        {state === "frost" ? <div className="bars"><i /><i /><i /></div> : (
          <div className="stats">
            <div className="stat-title">BEST SEASON</div>
            <div><b>{labels[0]}</b><span>{fmtNum(player.s1)}</span></div>
            <div><b>{labels[1]}</b><span>{player.s2}</span></div>
            <div><b>{labels[2]}</b><span>{player.s3}</span></div>
          </div>
        )}
      </div>
    </button>
  );
}

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 2.2, dur: 2.6 + Math.random() * 2, color: ["#F59E0B", "#22C55E", "#60A5FA", "#A78BFA", "#EF4444", "#FBBF24"][i % 6], size: 5 + Math.random() * 6, spin: Math.random() > 0.5 ? 1 : -1 })), []);
  return <div className="confetti" aria-hidden="true">{bits.map((b, i) => <span key={i} style={{ left: b.left + "%", animationDelay: b.delay + "s", animationDuration: b.dur + "s", background: b.color, width: b.size, height: b.size * 0.45, "--spin": b.spin }} />)}</div>;
}


/* ============================ CAP BOWL MINI GAME ============================ */
const CW = 440;
const CH = 952;
const CENTER_X = 220;
const SIDE_L = 22;
const SIDE_R = CW - 22;
const LOS_Y = 620;
const PPY = 15;
const P_HALF = 11;

const DEFAULT_CAP_ROSTER = {
  QB: { name: "Patrick Mahomes", rating: 99 },
  RB: { name: "C. McCaffrey", rating: 97 },
  WR1: { name: "Tyreek Hill", rating: 97 },
  WR2: { name: "Ja'Marr Chase", rating: 96 },
  TE: { name: "Travis Kelce", rating: 95 },
};

const GS = {
  INTRO: "INTRO",
  PLAY_CALL: "PLAY_CALL",
  READY: "READY",
  THROWING: "THROWING",
  LIVE: "LIVE",
  BALL_AIR: "BALL_AIR",
  RUNNING: "RUNNING",
  PLAY_RESULT: "PLAY_RESULT",
  TOUCHDOWN: "TOUCHDOWN",
  GAME_OVER: "GAME_OVER",
};

const rf = (r) => Math.max(0, Math.min(1, ((r ?? 75) - 50) / 49));
const yardToScreenY = (fieldYard, ballYard) => LOS_Y - (fieldYard - ballYard) * PPY;

function getFormation() {
  return {
    QB: { x: CENTER_X, y: LOS_Y + 70 },
    RB: { x: CENTER_X - 28, y: LOS_Y + 90 },
    WR1: { x: CENTER_X - 150, y: LOS_Y },
    WR2: { x: CENTER_X + 150, y: LOS_Y },
    TE: { x: CENTER_X + 64, y: LOS_Y },
    OL: [
      { x: CENTER_X - 30, y: LOS_Y },
      { x: CENTER_X - 15, y: LOS_Y },
      { x: CENTER_X, y: LOS_Y },
      { x: CENTER_X + 15, y: LOS_Y },
      { x: CENTER_X + 30, y: LOS_Y },
    ],
    DEF: {
      CB1: { x: CENTER_X - 150, y: LOS_Y - 28, speed: 1.6 },
      CB2: { x: CENTER_X + 150, y: LOS_Y - 28, speed: 1.6 },
      LB1: { x: CENTER_X + 64, y: LOS_Y - 26, speed: 1.5 },
      LB2: { x: CENTER_X - 20, y: LOS_Y - 28, speed: 1.45 },
      S: { x: CENTER_X, y: LOS_Y - 120, speed: 1.4 },
    },
  };
}

const PLAY_DEFS = [
  { id: "slants", name: "Slants", type: "pass", desc: "Both WRs slant · TE go", routes: { WR1: [[1,0],[6,72]], WR2: [[1,0],[6,-72]], TE: [[1,0],[16,0]], RB: [[0,42],[1,92]] } },
  { id: "mesh", name: "Mesh", type: "pass", desc: "Short crossers · TE corner", routes: { WR1: [[2,0],[4,95],[5,205]], WR2: [[2,0],[4,-95],[5,-205]], TE: [[6,0],[11,82]], RB: [[0,42],[1,88]] } },
  { id: "verts", name: "Verts", type: "pass", desc: "Everyone runs a go", routes: { WR1: [[18,0]], WR2: [[18,0]], TE: [[17,-6]], RB: [[0,55],[10,42]] } },
  { id: "pa_smash", name: "PA Smash", type: "pass", desc: "Post · slant · drag", routes: { WR1: [[7,0],[16,92]], WR2: [[1,0],[6,-70]], TE: [[3,0],[4,-185]], RB: [[0,42],[1,88]] } },
  { id: "curls", name: "Curls", type: "pass", desc: "Everyone curls back", routes: { WR1: [[11,0],[9,14]], WR2: [[11,0],[9,-14]], TE: [[9,0],[7,0]], RB: [[3,42],[2,42]] } },
  { id: "hb_smash", name: "HB Smash", type: "run", desc: "Hand off · find the hole", routes: { WR1: [[1,0],[2,-8]], WR2: [[1,0],[2,8]], TE: [[1,0],[2,0]], RB: [[1,16],[3,-12],[10,6]] } },
];

function drawPlayer(ctx, x, y, isUser, hasBall = false, labelText = "", anim = 0, moving = false) {
  const hw = P_HALF;
  const body = isUser ? "#3776d6" : "#cf3b2c";
  const dark = isUser ? "#1c4a9e" : "#8e2820";
  const lite = isUser ? "#5a92ea" : "#e05a4c";
  const helmC = isUser ? "#15306e" : "#5e0c0c";
  const pants = isUser ? "#dfe6f0" : "#f0e6df";
  const cyc = moving ? Math.sin(anim) : 0;
  const lF = cyc * 3.5;
  const rF = -cyc * 3.5;
  const armS = moving ? Math.sin(anim + Math.PI) * 2.6 : 0;

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath(); ctx.ellipse(x, y + hw + 4, hw * 0.95, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = pants;
  ctx.fillRect(x - hw * 0.46, y + hw * 0.62 + lF, hw * 0.36, hw * 0.6);
  ctx.fillRect(x + hw * 0.10, y + hw * 0.62 + rF, hw * 0.36, hw * 0.6);
  ctx.fillStyle = "#111";
  ctx.fillRect(x - hw * 0.48, y + hw * 1.15 + lF, hw * 0.4, hw * 0.22);
  ctx.fillRect(x + hw * 0.08, y + hw * 1.15 + rF, hw * 0.4, hw * 0.22);

  ctx.fillStyle = dark;
  ctx.fillRect(x - hw * 0.60, y - hw * 0.3, hw * 1.2, hw * 1.04);
  ctx.fillStyle = body;
  ctx.fillRect(x - hw * 0.52, y - hw * 0.3, hw * 1.0, hw * 1.04);
  ctx.fillStyle = lite;
  ctx.fillRect(x - hw * 0.40, y - hw * 0.28, hw * 0.5, hw * 0.5);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(x - hw * 0.22, y - hw * 0.05, hw * 0.44, hw * 0.16);

  ctx.fillStyle = "#e6bd84";
  ctx.fillRect(x - hw * 0.92, y - hw * 0.12 + armS, hw * 0.34, hw * 0.6);
  ctx.fillRect(x + hw * 0.58, y - hw * 0.12 - armS, hw * 0.34, hw * 0.6);

  if (hasBall) {
    ctx.fillStyle = "#7a3b10";
    ctx.beginPath(); ctx.ellipse(x + hw * 0.86, y + hw * 0.2, 5.5, 3.6, -0.35, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x + hw * 0.72, y + hw * 0.2); ctx.lineTo(x + hw * 1.0, y + hw * 0.2); ctx.stroke();
  }

  ctx.fillStyle = "#e6bd84";
  ctx.beginPath(); ctx.arc(x, y - hw * 0.6, hw * 0.46, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = helmC;
  ctx.beginPath(); ctx.arc(x, y - hw * 0.66, hw * 0.45, Math.PI, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - hw * 0.45, y - hw * 0.66, hw * 0.9, hw * 0.18);
  ctx.fillStyle = lite;
  ctx.fillRect(x - hw * 0.06, y - hw * 1.05, hw * 0.12, hw * 0.4);
  ctx.strokeStyle = "#cfcfcf";
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x - hw * 0.3, y - hw * 0.34); ctx.lineTo(x + hw * 0.3, y - hw * 0.34); ctx.stroke();

  if (labelText) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x - 15, y - P_HALF - 17, 30, 12);
    ctx.fillStyle = "#f0c040";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(labelText, x, y - P_HALF - 7);
  }
}

function drawBall(ctx, x, y, angle) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.fillStyle = "#7a3b10";
  ctx.beginPath(); ctx.ellipse(0, 0, 5, 7.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 6); ctx.moveTo(-3.5, 0); ctx.lineTo(3.5, 0); ctx.stroke();
  ctx.restore();
}

function drawField(ctx, ballYard, camY = 0) {
  ctx.fillStyle = "#236f23";
  ctx.fillRect(0, 0, CW, CH);
  ctx.save(); ctx.translate(0, camY);
  const margin = Math.abs(camY) / PPY + 6;
  const topYard = Math.ceil(ballYard + LOS_Y / PPY) + 5 + margin;
  const botYard = Math.floor(ballYard + (LOS_Y - CH) / PPY) - 5 - margin;

  for (let fy = botYard; fy <= topYard; fy++) {
    if (fy % 10 !== 0) continue;
    const y0 = yardToScreenY(fy, ballYard);
    const y1 = yardToScreenY(fy + 10, ballYard);
    if ((Math.floor(fy / 10)) % 2 === 0) {
      ctx.fillStyle = "#277a27";
      ctx.fillRect(SIDE_L, y1, SIDE_R - SIDE_L, y0 - y1);
    }
  }

  const ez0 = yardToScreenY(100, ballYard);
  ctx.fillStyle = "#1a4d8f";
  ctx.fillRect(SIDE_L, ez0 - PPY * 10, SIDE_R - SIDE_L, PPY * 10);
  const ezOwn = yardToScreenY(0, ballYard);
  ctx.fillStyle = "#8f1a1a";
  ctx.fillRect(SIDE_L, ezOwn, SIDE_R - SIDE_L, PPY * 10);

  ctx.textAlign = "center";
  for (let fy = Math.max(0, botYard); fy <= Math.min(100, topYard); fy++) {
    if (fy % 5 !== 0) continue;
    const y = yardToScreenY(fy, ballYard);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = fy % 10 === 0 ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(SIDE_L, y); ctx.lineTo(SIDE_R, y); ctx.stroke();
    if (fy % 10 === 0 && fy > 0 && fy < 100) {
      const label = fy <= 50 ? fy : 100 - fy;
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "bold 20px monospace";
      ctx.fillText(String(label), SIDE_L + 26, y + 7);
      ctx.fillText(String(label), SIDE_R - 26, y + 7);
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.font = "bold 26px monospace";
  ctx.fillText("END ZONE", CENTER_X, ez0 - PPY * 4);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1;
  for (let fy = Math.max(0, botYard); fy <= Math.min(100, topYard); fy++) {
    const y = yardToScreenY(fy, ballYard);
    ctx.beginPath(); ctx.moveTo(CENTER_X - 30, y); ctx.lineTo(CENTER_X - 22, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CENTER_X + 22, y); ctx.lineTo(CENTER_X + 30, y); ctx.stroke();
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(SIDE_L, -300); ctx.lineTo(SIDE_L, CH + 300); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SIDE_R, -300); ctx.lineTo(SIDE_R, CH + 300); ctx.stroke();
  ctx.restore();

  const cp = ["#e74c3c", "#3498db", "#f1c40f", "#ecf0f1", "#e67e22", "#9b59b6"];
  for (let i = 0; i < 70; i++) {
    const cy = (i * 15 + 8) % CH;
    ctx.fillStyle = cp[i % cp.length];
    ctx.fillRect(2, cy, SIDE_L - 4, 11);
    ctx.fillRect(SIDE_R + 2, cy, CW - SIDE_R - 4, 11);
  }
}

const DGW = 150;
const DGH = 168;
function PlayDiagram({ play, onClick }) {
  const cRef = useRef(null);
  useEffect(() => {
    const c = cRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, DGW, DGH);
    ctx.fillStyle = "rgba(40,120,40,0.10)";
    ctx.fillRect(0, 0, DGW, DGH * 0.55);
    const losY = DGH * 0.66;
    const cx = DGW / 2;
    const SDF = 2.6;
    const SLAT = 0.34;
    ctx.strokeStyle = "rgba(110,170,255,0.55)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(8, losY); ctx.lineTo(DGW - 8, losY); ctx.stroke(); ctx.setLineDash([]);
    const start = { WR1: { x: cx - 150 * SLAT, y: losY }, WR2: { x: cx + 150 * SLAT, y: losY }, TE: { x: cx + 64 * SLAT, y: losY }, QB: { x: cx, y: losY + 14 }, RB: { x: cx - 28 * SLAT, y: losY + 18 } };
    for (let i = -2; i <= 2; i++) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + i * 7, losY, 3, 0, Math.PI * 2); ctx.fill(); }
    function route(s, offs, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      const pts = [[s.x, s.y]];
      offs.forEach(([df, lat]) => pts.push([s.x + lat * SLAT, s.y - df * SDF]));
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      const p2 = pts[pts.length - 1], p1 = pts[pts.length - 2] || pts[0];
      const a = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(p2[0], p2[1]);
      ctx.lineTo(p2[0] - 8 * Math.cos(a - 0.45), p2[1] - 8 * Math.sin(a - 0.45));
      ctx.lineTo(p2[0] - 8 * Math.cos(a + 0.45), p2[1] - 8 * Math.sin(a + 0.45));
      ctx.closePath(); ctx.fill();
    }
    route(start.WR1, play.routes.WR1, "#f0c040");
    route(start.WR2, play.routes.WR2, "#f0c040");
    route(start.TE, play.routes.TE, "#e0902a");
    route(start.RB, play.routes.RB, "#ffffff");
    ctx.fillStyle = "#f0c040";
    [start.WR1, start.WR2].forEach((s) => { ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#e0902a"; ctx.beginPath(); ctx.arc(start.TE.x, start.TE.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.arc(start.QB.x, start.QB.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(start.RB.x, start.RB.y, 3.4, 0, Math.PI * 2); ctx.fill();
  }, [play]);

  return (
    <div onClick={onClick} className="cap-diagram">
      <canvas ref={cRef} width={DGW} height={DGH} style={{ display: "block", width: "100%", imageRendering: "pixelated" }} />
      <div style={{ padding: "5px 8px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ color: "#fff", fontSize: 12, fontWeight: "bold", fontFamily: "monospace" }}>{play.name}</div>
        <div style={{ color: "#666", fontSize: 9, fontFamily: "monospace", marginTop: 1 }}>{play.desc}</div>
      </div>
    </div>
  );
}

function CelebrationCanvas() {
  const cRef = useRef(null);
  useEffect(() => {
    const c = cRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    const colors = ["#f0c040", "#e74c3c", "#3498db", "#2ecc71", "#ecf0f1", "#e67e22", "#9b59b6"];
    const confetti = Array.from({ length: 140 }, () => ({ x: Math.random() * W, y: Math.random() * -H, w: 4 + Math.random() * 5, h: 7 + Math.random() * 8, vy: 1.5 + Math.random() * 3, vx: (Math.random() - 0.5) * 1.2, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, color: colors[(Math.random() * colors.length) | 0] }));
    let t = 0, raf;
    function dancer(px, py, phase) {
      const hw = 16, bop = Math.sin(phase) * 5, arm = Math.sin(phase) * 0.9;
      const y = py + bop;
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(px, py + hw + 8, hw * 0.9, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ddd8b0"; ctx.fillRect(px - hw * 0.4, y + hw * 0.6, hw * 0.34, hw * 0.6); ctx.fillRect(px + hw * 0.06, y + hw * 0.6, hw * 0.34, hw * 0.6);
      ctx.fillStyle = "#3a7bd5"; ctx.fillRect(px - hw * 0.55, y - hw * 0.3, hw * 1.1, hw * 1.0);
      ctx.fillStyle = "#1a4fa0"; ctx.fillRect(px - hw * 0.5, y + hw * 0.3, hw, hw * 0.4);
      ctx.strokeStyle = "#e0b87a"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(px - hw * 0.5, y); ctx.lineTo(px - hw * 0.9, y - hw * 0.7 - arm * 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + hw * 0.5, y); ctx.lineTo(px + hw * 0.9, y - hw * 0.7 + arm * 8); ctx.stroke();
      ctx.fillStyle = "#e0b87a"; ctx.beginPath(); ctx.arc(px, y - hw * 0.62, hw * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1a3a8f"; ctx.beginPath(); ctx.arc(px, y - hw * 0.66, hw * 0.43, Math.PI, 0); ctx.fill();
    }
    function frame() {
      t += 0.12;
      ctx.clearRect(0, 0, W, H);
      confetti.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      for (let i = 0; i < 5; i++) dancer(W * (0.16 + i * 0.17), H - 70, t + i * 0.9);
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={cRef} width={CW} height={CH} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated", pointerEvents: "none" }} />;
}

function makeReceiver(sx, sy, waypoints) {
  return { x: sx, y: sy, wpIdx: 0, waypoints, mode: "ROUTE", openAngle: 0, openTimer: 0, anim: 0, moving: false, facing: 0 };
}

function stepReceiver(rec, speed) {
  const ox = rec.x, oy = rec.y;
  if (rec.mode === "ROUTE") {
    if (rec.wpIdx >= rec.waypoints.length) {
      rec.mode = "OPEN";
      rec.openAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      rec.openTimer = 0;
    } else {
      const wp = rec.waypoints[rec.wpIdx], dx = wp.x - rec.x, dy = wp.y - rec.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < speed + 0.5) { rec.x = wp.x; rec.y = wp.y; rec.wpIdx++; }
      else { rec.x += dx / d * speed; rec.y += dy / d * speed; }
    }
  } else {
    rec.openTimer++;
    if (rec.openTimer > 45 + Math.random() * 35) { rec.openTimer = 0; rec.openAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; }
    rec.x += Math.cos(rec.openAngle) * speed * 0.6;
    rec.y += Math.sin(rec.openAngle) * speed * 0.6 - 0.3;
  }
  rec.x = Math.max(SIDE_L + 8, Math.min(SIDE_R - 8, rec.x));
  rec.y = Math.max(20, rec.y);
  const mv = Math.abs(rec.x - ox) + Math.abs(rec.y - oy);
  rec.moving = mv > 0.3;
  if (rec.moving) { rec.anim = (rec.anim || 0) + 0.4; rec.facing = rec.x - ox; }
}

function stepCarrier(g, roster) {
  const ckey = g.carrier;
  const p = ckey === "qb" ? g.qb : g.receivers[ckey];
  if (!p) return "tackled";
  const carR = ckey === "RB" ? rf(roster.RB?.rating) : ckey === "qb" ? rf(roster.QB?.rating) : ckey === "TE" ? rf(roster.TE?.rating) : ckey === "WR1" ? rf(roster.WR1?.rating) : rf(roster.WR2?.rating);
  const speed = 1.5 + carR * 1.3;
  let steerX = 0, nearest = null, nd = Infinity;
  Object.values(g.defenders).forEach((d) => {
    const dx = d.x - p.x, dy = d.y - p.y, dd = Math.sqrt(dx * dx + dy * dy);
    if (dd < nd) { nd = dd; nearest = d; }
    if (dd < 90 && d.y < p.y + 18) steerX += -(dx / (Math.abs(dx) || 1)) * (90 - dd) / 90;
  });
  if (nearest && nd < 16) {
    if (Math.random() < carR * 0.18) { nearest.y += 20; nearest.x += Math.random() * 14 - 7; }
    else return "tackled";
  }
  const vx = Math.max(-speed * 0.75, Math.min(speed * 0.75, steerX * speed * 0.6));
  const vy = Math.sqrt(Math.max(0.16, speed * speed - vx * vx));
  p.x += vx; p.y -= vy;
  p.x = Math.max(SIDE_L + 6, Math.min(SIDE_R - 6, p.x));
  p.anim = (p.anim || 0) + 0.45; p.moving = true; p.facing = vx;
  g.ball.x = p.x; g.ball.y = p.y;
  g.camTargetY = (CH * 0.58) - p.y;
  if (p.y <= yardToScreenY(100, g.ballYard)) return "touchdown";
  Object.values(g.defenders).forEach((d) => {
    const dx = p.x - d.x, dy = p.y - 10 - d.y, dd = Math.sqrt(dx * dx + dy * dy);
    const dsp = d.pursuit || 2.6;
    if (dd > 1) { const ox = d.x; d.x += dx / dd * dsp; d.y += dy / dd * dsp; d.anim = (d.anim || 0) + 0.45; d.moving = true; d.facing = d.x - ox; }
  });
  return null;
}

function CapBowlGame({ roster: rosterInput, chemistry, onWin, onLose }) {
  const roster = useMemo(() => {
    if (!Array.isArray(rosterInput)) return rosterInput || DEFAULT_CAP_ROSTER;
    const byPos = { WR: [] };
    rosterInput.forEach((r) => {
      if (!r?.player) return;
      if (r.player.pos === "WR") byPos.WR.push(r.player);
      else byPos[r.player.pos] = r.player;
    });
    return {
      QB: { name: byPos.QB?.name || "Quarterback", rating: byPos.QB?.score || 75 },
      RB: { name: byPos.RB?.name || "Running Back", rating: byPos.RB?.score || 75 },
      WR1: { name: byPos.WR?.[0]?.name || "Wide Receiver", rating: byPos.WR?.[0]?.score || 75 },
      WR2: { name: byPos.WR?.[1]?.name || "Wide Receiver", rating: byPos.WR?.[1]?.score || 75 },
      TE: { name: byPos.TE?.name || "Tight End", rating: byPos.TE?.score || 75 },
    };
  }, [rosterInput]);

  const canvasRef = useRef(null), rafRef = useRef(null), G = useRef(null);
  const phaseRef = useRef(GS.INTRO), uiRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });
  const [phase, setPhase] = useState(GS.INTRO);
  const [uiData, setUiData] = useState({ score: { user: 14, cpu: 17 }, down: 1, toGo: 10, ballYard: 25, message: "", subMessage: "" });
  uiRef.current = uiData;

  function buildWorld(play, ballYard) {
    const form = getFormation();
    function absWp(role) {
      const offs = play.routes[role] || [], s = form[role] || form.QB;
      return offs.map(([df, lat]) => ({ x: Math.max(SIDE_L + 8, Math.min(SIDE_R - 8, s.x + lat)), y: s.y - df * PPY }));
    }
    G.current = {
      tick: 0, ballYard, play, qb: { x: form.QB.x, y: form.QB.y }, OL: form.OL,
      receivers: { WR1: makeReceiver(form.WR1.x, form.WR1.y, absWp("WR1")), WR2: makeReceiver(form.WR2.x, form.WR2.y, absWp("WR2")), TE: makeReceiver(form.TE.x, form.TE.y, absWp("TE")), RB: makeReceiver(form.RB.x, form.RB.y, absWp("RB")) },
      defenders: { CB1: { ...form.DEF.CB1, cover: "WR1", pursuit: 2.7, anim: 0, moving: false }, CB2: { ...form.DEF.CB2, cover: "WR2", pursuit: 2.7, anim: 0, moving: false }, LB1: { ...form.DEF.LB1, cover: "TE", pursuit: 2.5, anim: 0, moving: false }, LB2: { ...form.DEF.LB2, cover: "RB", pursuit: 2.5, anim: 0, moving: false }, S: { ...form.DEF.S, cover: "S", pursuit: 2.8, anim: 0, moving: false } },
      ball: { x: form.QB.x, y: form.QB.y, vx: 0, vy: 0, angle: 0, inAir: false },
      carrier: "qb", thrownTo: null, camY: 0, camTargetY: 0,
    };
  }

  const recRating = useCallback((role) => role === "RB" ? rf(roster.RB?.rating) : role === "TE" ? rf(roster.TE?.rating) : role === "WR1" ? rf(roster.WR1?.rating) : rf(roster.WR2?.rating), [roster]);
  const recSpeed = useCallback((role) => 1.1 + recRating(role) * 1.1, [recRating]);

  function resolveIncomplete(g) {
    const ui = uiRef.current, nd = ui.down + 1, to = nd > 4;
    phaseRef.current = GS.PLAY_RESULT; setPhase(GS.PLAY_RESULT);
    setUiData((u) => ({ ...u, down: to ? 1 : nd, toGo: to ? 10 : u.toGo, message: to ? "Turnover on Downs" : "Incomplete Pass", subMessage: to ? "Drive ends" : `${nd === 2 ? "2nd" : nd === 3 ? "3rd" : "4th"} & ${u.toGo}` }));
  }
  function resolveRun(g, finalScreenY) {
    const ui = uiRef.current;
    const yg = Math.max(-3, Math.round((yardToScreenY(g.ballYard, g.ballYard) - finalScreenY) / PPY));
    const ny = Math.min(100, g.ballYard + yg);
    if (ny >= 100) { touchdown(g); return; }
    const ntg = Math.max(0, ui.toGo - yg), fd = ntg <= 0, nd = fd ? 1 : ui.down + 1, to = nd > 4 && !fd;
    g.ballYard = ny;
    phaseRef.current = GS.PLAY_RESULT; setPhase(GS.PLAY_RESULT);
    setUiData((u) => ({ ...u, ballYard: ny, down: to ? 1 : nd, toGo: fd ? 10 : to ? 10 : ntg, message: to ? "Turnover on Downs" : fd ? "First Down! 🙌" : yg >= 0 ? `Gain of ${yg}` : `Loss of ${Math.abs(yg)}`, subMessage: to ? "Drive ends" : fd ? `Ball at the ${Math.round(100 - ny)} yd line` : `${yg >= 0 ? "+" : ""}${yg} yds` }));
  }
  function touchdown(g) {
    phaseRef.current = GS.TOUCHDOWN;
    setPhase(GS.TOUCHDOWN);
    setUiData((u) => ({ ...u, score: { ...u.score, user: u.score.user + 7 }, ballYard: Math.min(100, g.ballYard), message: "TOUCHDOWN! 🏈", subMessage: "" }));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function loop() {
      const g = G.current, ph = phaseRef.current;
      ctx.clearRect(0, 0, CW, CH);
      if (!g) { drawField(ctx, 25, 0); rafRef.current = requestAnimationFrame(loop); return; }
      g.tick++;
      const isLive = ph === GS.LIVE || ph === GS.THROWING;
      if (isLive) {
        Object.entries(g.receivers).forEach(([role, rec]) => stepReceiver(rec, recSpeed(role)));
        Object.values(g.defenders).forEach((def) => {
          const cover = def.cover === "S" ? (() => { let dY = Infinity, key = "WR1"; Object.entries(g.receivers).forEach(([k, r]) => { if (r.y < dY) { dY = r.y; key = k; } }); return key; })() : def.cover;
          const target = g.receivers[cover] || g.receivers.WR1;
          const rr = recRating(cover);
          const dSpeed = recSpeed(cover) * (0.80 + (1 - rr) * 0.16);
          const dx = target.x - def.x, dy = target.y - def.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 3) { const ox = def.x; def.x += dx / d * dSpeed; def.y += dy / d * dSpeed; def.anim = (def.anim || 0) + 0.4; def.moving = true; def.facing = def.x - ox; } else def.moving = false;
        });
      }
      if (ph === GS.BALL_AIR) {
        g.ball.x += g.ball.vx; g.ball.y += g.ball.vy; g.ball.flown += 1;
        g.ball.angle = Math.atan2(g.ball.vy, g.ball.vx) + Math.PI / 2;
        const prog = Math.min(1, g.ball.flown / g.ball.flightFrames);
        g.ball.lift = Math.sin(prog * Math.PI) * g.ball.maxLift;
        Object.entries(g.receivers).forEach(([role, rec]) => stepReceiver(rec, recSpeed(role) * 0.92));
        Object.values(g.defenders).forEach((def) => { const dx = g.ball.lx - def.x, dy = g.ball.ly - def.y, d = Math.sqrt(dx * dx + dy * dy); if (d > 3) { const ox = def.x; def.x += dx / d * def.speed * 1.05; def.y += dy / d * def.speed * 1.05; def.anim = (def.anim || 0) + 0.4; def.moving = true; def.facing = def.x - ox; } });
        if (prog >= 1) {
          const lx = g.ball.lx, ly = g.ball.ly;
          let bestRole = null, bestDist = Infinity;
          Object.entries(g.receivers).forEach(([role, rec]) => { const dx = rec.x - lx, dy = rec.y - ly, d = Math.sqrt(dx * dx + dy * dy); if (d < bestDist) { bestDist = d; bestRole = role; } });
          const rr = bestRole ? recRating(bestRole) : 0;
          const reach = 20 + rr * 28 + (chemistry?.totalBonus || 0) * 12;
          if (bestRole && bestDist < reach) {
            let nearDef = Infinity;
            Object.values(g.defenders).forEach((d) => { const x = d.x - lx, y = d.y - ly; nearDef = Math.min(nearDef, Math.sqrt(x * x + y * y)); });
            const qbR = rf(roster.QB?.rating);
            const onTarget = 1 - Math.min(1, bestDist / reach);
            const cov = nearDef < 26 ? 0.55 : nearDef < 48 ? 0.22 : 0;
            const catchP = Math.max(0.05, Math.min(0.97, 0.30 + rr * 0.40 + qbR * 0.10 + onTarget * 0.20 - cov + (chemistry?.totalBonus || 0) * 0.4));
            if (Math.random() < catchP) {
              const rec = g.receivers[bestRole];
              g.carrier = bestRole; g.ball.inAir = false; g.ball.x = rec.x; g.ball.y = rec.y;
              phaseRef.current = GS.RUNNING; setPhase(GS.RUNNING);
            } else { g.ball.inAir = false; resolveIncomplete(g); }
          } else { g.ball.inAir = false; resolveIncomplete(g); }
        }
      }
      if (ph === GS.RUNNING) {
        const p = g.carrier === "qb" ? g.qb : g.receivers[g.carrier];
        if (p) { const res = stepCarrier(g, roster); if (res === "touchdown") touchdown(g); else if (res === "tackled") resolveRun(g, p.y); }
      } else g.camTargetY = 0;
      g.camY += (g.camTargetY - g.camY) * 0.12;
      g.camY = Math.max(-260, Math.min(260, g.camY));
      drawField(ctx, g.ballYard, g.camY);
      ctx.save(); ctx.translate(0, g.camY);
      const ui = uiRef.current;
      const fdY = yardToScreenY(Math.min(100, ui.ballYard + ui.toGo), g.ballYard);
      ctx.strokeStyle = "#f0c040"; ctx.lineWidth = 2.5; ctx.setLineDash([8, 5]); ctx.beginPath(); ctx.moveTo(SIDE_L, fdY); ctx.lineTo(SIDE_R, fdY); ctx.stroke(); ctx.setLineDash([]);
      const losY = yardToScreenY(g.ballYard, g.ballYard);
      ctx.strokeStyle = "rgba(100,180,255,0.5)"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(SIDE_L, losY); ctx.lineTo(SIDE_R, losY); ctx.stroke(); ctx.setLineDash([]);
      g.OL.forEach((ol) => { ctx.fillStyle = "#3776d6"; ctx.fillRect(ol.x - 8, ol.y - 9, 16, 18); ctx.fillStyle = "#1c4a9e"; ctx.fillRect(ol.x - 7, ol.y - 11, 14, 9); });
      g.OL.forEach((ol) => { const dy = losY - 13; ctx.fillStyle = "#cf3b2c"; ctx.fillRect(ol.x - 8, dy - 9, 16, 18); ctx.fillStyle = "#8e2820"; ctx.fillRect(ol.x - 7, dy - 11, 14, 9); });
      Object.values(g.defenders).forEach((d) => drawPlayer(ctx, d.x, d.y, false, false, "", d.anim || 0, d.moving));
      const showL = isLive || ph === GS.BALL_AIR || ph === GS.RUNNING;
      Object.entries(g.receivers).forEach(([role, rec]) => drawPlayer(ctx, rec.x, rec.y, true, g.carrier === role && !g.ball.inAir, showL ? role.replace(/\d/, "") : "", rec.anim || 0, rec.moving));
      drawPlayer(ctx, g.qb.x, g.qb.y, true, g.carrier === "qb" && !g.ball.inAir, showL ? "QB" : "", g.qb.anim || 0, g.qb.moving);
      if (g.ball.inAir) {
        ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.beginPath(); ctx.ellipse(g.ball.x, g.ball.y + 4, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(g.ball.lx, g.ball.ly, 9, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        drawBall(ctx, g.ball.x, g.ball.y - (g.ball.lift || 0), g.ball.angle);
      }
      if (ph === GS.THROWING && dragRef.current.active) {
        const d = dragRef.current, dx = d.curX - d.startX, dy = d.curY - d.startY, mag = Math.sqrt(dx * dx + dy * dy);
        const qbR = rf(roster.QB?.rating), aimDX = mag > 0 ? -dx / mag : 0, aimDY = mag > 0 ? -dy / mag : -1;
        const power = Math.min(1, mag / 200), dist = 70 + power * (130 + qbR * 470);
        const projX = Math.max(SIDE_L + 6, Math.min(SIDE_R - 6, g.qb.x + aimDX * dist));
        const projY = g.qb.y + aimDY * dist;
        const fingerX = d.curX, fingerY = d.curY - g.camY;
        ctx.strokeStyle = `rgba(255,200,50,${0.45 + power * 0.5})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(g.qb.x, g.qb.y); ctx.lineTo(fingerX, fingerY); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,120,0.28)"; ctx.lineWidth = 1.5; ctx.setLineDash([7, 7]); ctx.beginPath(); ctx.moveTo(g.qb.x, g.qb.y); ctx.lineTo(projX, projY); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(projX, projY, 16, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [roster, chemistry, recRating, recSpeed]);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = CW / rect.width, sy = CH / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  }
  function onDown(e) {
    const ph = phaseRef.current, g = G.current;
    if (!g) return;
    if (ph === GS.READY) {
      if (g.play.type === "run") { g.carrier = "RB"; phaseRef.current = GS.RUNNING; setPhase(GS.RUNNING); }
      else { const pos = getPos(e); dragRef.current = { active: true, startX: pos.x, startY: pos.y, curX: pos.x, curY: pos.y }; phaseRef.current = GS.THROWING; setPhase(GS.THROWING); }
      return;
    }
    if (ph === GS.LIVE) { const pos = getPos(e); dragRef.current = { active: true, startX: pos.x, startY: pos.y, curX: pos.x, curY: pos.y }; phaseRef.current = GS.THROWING; setPhase(GS.THROWING); }
  }
  function onMove(e) { if (phaseRef.current !== GS.THROWING || !dragRef.current.active) return; e.preventDefault(); const pos = getPos(e); dragRef.current.curX = pos.x; dragRef.current.curY = pos.y; }
  function onUp() {
    if (phaseRef.current !== GS.THROWING || !dragRef.current.active) return;
    const g = G.current; if (!g) return;
    const d = dragRef.current; dragRef.current.active = false;
    const dx = d.curX - d.startX, dy = d.curY - d.startY, mag = Math.sqrt(dx * dx + dy * dy);
    if (mag < 10) { phaseRef.current = GS.LIVE; setPhase(GS.LIVE); return; }
    const qbR = rf(roster.QB?.rating), aimDX = -dx / mag, aimDY = -dy / mag, power = Math.min(1, mag / 200);
    const maxReach = 130 + qbR * 470;
    const dist = 70 + power * maxReach;
    let lx = g.qb.x + aimDX * dist;
    let ly = g.qb.y + aimDY * dist;
    lx = Math.max(SIDE_L + 6, Math.min(SIDE_R - 6, lx));
    const airSpeed = 5.5;
    const flightFrames = Math.max(8, Math.round(dist / airSpeed));
    g.ball.x = g.qb.x; g.ball.y = g.qb.y;
    g.ball.vx = (lx - g.qb.x) / flightFrames;
    g.ball.vy = (ly - g.qb.y) / flightFrames;
    g.ball.lx = lx; g.ball.ly = ly; g.ball.flown = 0; g.ball.flightFrames = flightFrames; g.ball.maxLift = 6 + dist * 0.04; g.ball.lift = 0; g.ball.inAir = true; g.carrier = null;
    phaseRef.current = GS.BALL_AIR; setPhase(GS.BALL_AIR);
  }

  function handlePlayCall(play) { buildWorld(play, uiRef.current.ballYard); phaseRef.current = GS.READY; setPhase(GS.READY); setUiData((u) => ({ ...u, message: "", subMessage: "" })); }
  function handleNextPlay() { if (uiData.message === "Turnover on Downs") { phaseRef.current = GS.GAME_OVER; setPhase(GS.GAME_OVER); } else { phaseRef.current = GS.PLAY_CALL; setPhase(GS.PLAY_CALL); } }
  function resetGame() { const f = { score: { user: 14, cpu: 17 }, down: 1, toGo: 10, ballYard: 25, message: "", subMessage: "" }; setUiData(f); uiRef.current = f; phaseRef.current = GS.INTRO; setPhase(GS.INTRO); G.current = null; }

  const userWon = uiData.score.user > uiData.score.cpu;
  const hint = phase === GS.READY ? (G.current?.play?.type === "run" ? "Tap to hand off" : "Hold & drag back to snap and throw") : phase === GS.THROWING ? "Pull back for power · aim the throw · release" : phase === GS.BALL_AIR ? "Ball in the air…" : phase === GS.RUNNING ? "Hit the hole!" : phase === GS.LIVE ? "Drag from QB to throw" : "";

  return (
    <div className="capbowl-fullscreen">
      <div className="capbowl-phone">
        <canvas ref={canvasRef} width={CW} height={CH} className="capbowl-canvas" onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={(e) => { e.preventDefault(); onDown(e); }} onTouchMove={(e) => { e.preventDefault(); onMove(e); }} onTouchEnd={(e) => { e.preventDefault(); onUp(e); }} />
        <div className="cap-scoreboard">
          <div><span>YOU</span><b>{uiData.score.user}</b></div>
          <div className="cap-mid"><strong>Q4 · 1:47</strong><em>{["1ST", "2ND", "3RD", "4TH"][uiData.down - 1]} & {uiData.toGo} · OPP {Math.round(100 - uiData.ballYard)}</em></div>
          <div><b>{uiData.score.cpu}</b><span>CPU</span></div>
        </div>
        {[GS.READY, GS.THROWING, GS.LIVE, GS.BALL_AIR, GS.RUNNING].includes(phase) && hint && <div className="cap-hint">{hint}</div>}
        {phase === GS.INTRO && <div className="cap-overlay"><div className="cap-center"><div className="cap-kicker">CAP BOWL</div><h1>ONE DRIVE.<br />WIN IT ALL.</h1><p>Down {uiData.score.cpu - uiData.score.user} · 1:47 left · Own 25</p><small>QB {roster.QB?.name} ({roster.QB?.rating} OVR)</small><button onClick={() => { phaseRef.current = GS.PLAY_CALL; setPhase(GS.PLAY_CALL); }}>🏈 TAKE THE FIELD</button></div></div>}
        {phase === GS.PLAY_CALL && <div className="cap-overlay cap-call"><div className="cap-kicker">CALL YOUR PLAY</div><div className="cap-playgrid">{PLAY_DEFS.map((p) => <PlayDiagram key={p.id} play={p} onClick={() => handlePlayCall(p)} />)}</div></div>}
        {phase === GS.PLAY_RESULT && <div className="cap-overlay"><div className="cap-center"><h2 className={uiData.message.includes("Turnover") ? "bad" : uiData.message.includes("First") ? "good" : ""}>{uiData.message}</h2>{uiData.subMessage && <p>{uiData.subMessage}</p>}<button onClick={handleNextPlay}>{uiData.message === "Turnover on Downs" ? "See Result →" : "Next Play →"}</button></div></div>}
        {phase === GS.TOUCHDOWN && <div className="cap-overlay win"><CelebrationCanvas /><div className="cap-center on-top"><div className="cap-kicker">🏆 CHAMPIONS 🏆</div><div className="big-emoji">🎉</div><h2>Congratulations!</h2><h3>You won the Cap Bowl!</h3><p>{uiData.score.user} – {uiData.score.cpu}</p><button onClick={() => { phaseRef.current = GS.GAME_OVER; setPhase(GS.GAME_OVER); }}>See Final Result →</button></div></div>}
        {phase === GS.GAME_OVER && <div className="cap-overlay"><div className="cap-center"><div className="cap-kicker">CAP BOWL — FINAL</div><div className="big-emoji">{userWon ? "🏆" : "💔"}</div><h2 className={userWon ? "good" : "bad"}>{userWon ? "YOU WIN!" : "GAME OVER"}</h2><p>{uiData.score.user} – {uiData.score.cpu}</p><small>{userWon ? "Drive complete. The cap pick paid off." : "Couldn't find the end zone. Season record stands."}</small><div className="cap-actions"><button className="secondary" onClick={resetGame}>↩ Again</button><button onClick={() => { if (userWon) onWin?.(); else onLose?.(); }}>Back →</button></div></div></div>}
      </div>
    </div>
  );
}


/* ============================ APP ============================ */
export default function CapKings() {
  const [picks, setPicks] = useState({});
  const [activeCol, setActiveCol] = useState(null);
  const [rowPrices, setRowPrices] = useState([5, 4, 3, 2, 1]);
  const [dispPrices, setDispPrices] = useState([5, 4, 3, 2, 1]);
  const [spinRows, setSpinRows] = useState([false, false, false, false, false]);
  const [board, setBoard] = useState(() => buildBoard([5, 4, 3, 2, 1], new Set()));
  const [phase, setPhase] = useState("draft");
  const [result, setResult] = useState(null);
  const [reveal, setReveal] = useState(0);
  const [muted, setMuted] = useState(false);
  const [career, setCareer] = useState(() => {
    try { const saved = localStorage.getItem("capKingsCareer"); return saved ? JSON.parse(saved) : { seasons: 0, best: null, titles: 0, perfects: 0 }; }
    catch { return { seasons: 0, best: null, titles: 0, perfects: 0 }; }
  });
  const [playoff, setPlayoff] = useState({ stage: 0, games: [], pending: false, eliminated: false, champion: false });
  const [copied, setCopied] = useState(false);
  const [capBowl, setCapBowl] = useState(false);

  const spinFlags = useRef([false, false, false, false, false]);
  const tickRef = useRef(null);
  const timeoutsRef = useRef([]);
  const actxRef = useRef(null);
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  useEffect(() => { try { localStorage.setItem("capKingsCareer", JSON.stringify(career)); } catch {} }, [career]);

  const tone = useCallback((f, t = 0.08, type = "square", g = 0.05, delay = 0) => {
    if (mutedRef.current) return;
    try {
      if (!actxRef.current) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return; actxRef.current = new A(); }
      const c = actxRef.current; if (c.state === "suspended") c.resume();
      const o = c.createOscillator(), gn = c.createGain();
      o.type = type; o.frequency.value = f;
      gn.gain.setValueAtTime(g, c.currentTime + delay);
      gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + t);
      o.connect(gn); gn.connect(c.destination); o.start(c.currentTime + delay); o.stop(c.currentTime + delay + t + 0.02);
    } catch {}
  }, []);

  const sPick = () => { tone(523, 0.06, "square", 0.04); tone(784, 0.08, "square", 0.04, 0.06); };
  const sLock = (i) => tone(700 + i * 90, 0.05, "square", 0.025);
  const sW = () => tone(987, 0.04, "triangle", 0.018);
  const sL = () => tone(196, 0.06, "sawtooth", 0.015);
  const sFanfare = (good) => good ? [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "square", 0.05, i * 0.11)) : [330, 262, 196].forEach((f, i) => tone(f, 0.2, "sawtooth", 0.04, i * 0.14));
  const sChamp = () => [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, "square", 0.05, i * 0.13));

  const clearTimers = useCallback(() => {
    clearInterval(tickRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const spent = useMemo(() => Object.values(picks).reduce((a, p) => a + p.price, 0), [picks]);
  const remaining = CAP - spent;
  const pickCount = Object.keys(picks).length;
  const picksLeft = 5 - pickCount;
  const maxAffordable = remaining - Math.max(0, picksLeft - 1);
  const busy = spinRows.some(Boolean);
  const chemistry = useMemo(() => getChemistry(picks), [picks]);
  const roster = useMemo(() => (pickCount === 5 ? [0, 1, 2, 3, 4].map((c) => picks[c]) : null), [picks, pickCount]);
  const finalChemistry = useMemo(() => (roster ? getChemistry(roster) : chemistry), [roster, chemistry]);
  const projLine = roster ? projectedWins(roster, finalChemistry) : null;
  const teamPower = roster ? Math.round(roster.reduce((a, r) => a + r.player.score, 0) / 5) : null;
  const teamReport = useMemo(() => (roster ? getTeamReport(roster, finalChemistry) : null), [roster, finalChemistry]);

  const scramble = useCallback((picksState) => {
    const count = Object.keys(picksState).length;
    if (count >= 5) return;
    const spentNow = Object.values(picksState).reduce((a, p) => a + p.price, 0);
    const left = 5 - count;
    const maxAff = CAP - spentNow - (left - 1);
    const target = genPrices(maxAff);
    const pickedIds = new Set(Object.values(picksState).map((p) => p.player.id));
    const newBoard = buildBoard(target, pickedIds);
    clearTimers();
    spinFlags.current = [true, true, true, true, true];
    setSpinRows([true, true, true, true, true]);
    tickRef.current = setInterval(() => setDispPrices((d) => d.map((v, i) => (spinFlags.current[i] ? (v % 5) + 1 : v))), 55);
    target.forEach((price, rowIndex) => {
      const t = setTimeout(() => {
        spinFlags.current[rowIndex] = false;
        sLock(rowIndex);
        setDispPrices((d) => { const n = [...d]; n[rowIndex] = price; return n; });
        setSpinRows((s) => { const n = [...s]; n[rowIndex] = false; return n; });
        setBoard((b) => { const n = b.map((row) => [...row]); n[rowIndex] = newBoard[rowIndex]; return n; });
        if (rowIndex === 4) { clearInterval(tickRef.current); setRowPrices(target); }
      }, 360 + rowIndex * 60);
      timeoutsRef.current.push(t);
    });
  }, [clearTimers]);

  const nextUnpicked = (from, picksState) => {
    for (let step = 1; step <= 5; step++) { const c = (from + step) % 5; if (!(c in picksState)) return c; }
    return null;
  };

  const handlePick = (row, col) => {
    if (busy || phase !== "draft") return;
    if (activeCol !== col || col in picks) return;
    const price = rowPrices[row];
    if (price > maxAffordable) return;
    const player = board[row][col];
    const newPicks = { ...picks, [col]: { player, price } };
    sPick(); buzz(12);
    setPicks(newPicks);
    setActiveCol(nextUnpicked(col, newPicks));
    if (Object.keys(newPicks).length < 5) scramble(newPicks);
  };

  const handleTab = (col) => { if (phase !== "draft" || col in picks) return; setActiveCol(col); };

  const startSim = () => {
    if (pickCount < 5) return;
    fanfared.current = false;
    const res = simulate(roster, finalChemistry);
    setResult(res); setReveal(0); setPlayoff({ stage: 0, games: [], pending: false, eliminated: false, champion: false }); setCopied(false); setPhase("results");
  };

  useEffect(() => {
    if (phase !== "results" || !result || reveal >= 20) return;
    const t = setTimeout(() => { const g = result.games[reveal]; g.w ? sW() : sL(); setReveal((r) => r + 1); }, 105);
    return () => clearTimeout(t);
  }, [phase, result, reveal]);

  const revealDone = phase === "results" && reveal >= 20;
  const fanfared = useRef(false);
  useEffect(() => {
    if (revealDone && result && !fanfared.current) {
      fanfared.current = true;
      sFanfare(result.wins >= 12);
      buzz(result.wins >= 15 ? [40, 60, 40] : 20);
      setCareer((c) => ({ ...c, seasons: c.seasons + 1, best: c.best === null || result.wins > c.best ? result.wins : c.best, perfects: c.perfects + (result.wins === 20 ? 1 : 0) }));
    }
  }, [revealDone, result]);

  const madePlayoffs = result && result.wins >= 11;
  const playRound = () => {
    if (playoff.pending || playoff.eliminated || playoff.champion) return;
    const round = PLAYOFF_ROUNDS[playoff.stage];

    // Final round launches the playable Cap Bowl instead of auto-simming it.
    if (playoff.stage === 2) {
      tone(440, 0.3, "triangle", 0.03);
      setCapBowl(true);
      return;
    }

    setPlayoff((p) => ({ ...p, pending: true }));
    tone(440, 0.3, "triangle", 0.03);
    setTimeout(() => {
      const g = playPlayoffGame(roster, finalChemistry, round.opp);
      setPlayoff((p) => {
        const games = [...p.games, g];
        if (!g.w) { sFanfare(false); buzz([60, 40, 60]); return { ...p, games, pending: false, eliminated: true }; }
        sFanfare(true); buzz(30); return { ...p, games, stage: p.stage + 1, pending: false };
      });
    }, 1000);
  };

  const onCapBowlWin = () => {
    setCapBowl(false);
    sChamp(); buzz([50, 50, 50, 50, 120]);
    setCareer((c) => ({ ...c, titles: c.titles + 1 }));
    setPlayoff((p) => ({
      ...p,
      games: [...p.games, { w: true, my: 7, opp: 4, name: "Renegades" }],
      pending: false, eliminated: false, champion: true,
    }));
  };

  const onCapBowlLose = () => {
    setCapBowl(false);
    sFanfare(false); buzz([60, 40, 60]);
    setPlayoff((p) => ({
      ...p,
      games: [...p.games, { w: false, my: 0, opp: 4, name: "Renegades" }],
      pending: false, eliminated: true, champion: false,
    }));
  };

  const shareResult = async () => {
    if (!result) return;
    const grade = gradeFor(result.wins);
    const grid = [0, 1].map((row) => result.games.slice(row * 10, row * 10 + 10).map((g) => (g.w ? "🟩" : "🟥")).join("")).join("\n");
    const lines = ["💰 CAP KINGS", `${result.wins}-${20 - result.wins} · ${grade.label}`, grid, `PWR ${teamPower} · O/U ${projLine} ${result.wins > projLine ? "✅ covered" : "❌ missed"}`];
    if (playoff.champion) lines.push("🏆 CAP BOWL CHAMPION 🏆");
    if (finalChemistry.links.length) lines.push("🔗 Chemistry boost active");
    const text = lines.join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  const newBoardReset = () => {
    clearTimers(); fanfared.current = false; setPicks({}); setActiveCol(null); setPhase("draft"); setResult(null); setReveal(0); setCopied(false); setCapBowl(false);
    setPlayoff({ stage: 0, games: [], pending: false, eliminated: false, champion: false });
    setRowPrices([5, 4, 3, 2, 1]); setDispPrices([5, 4, 3, 2, 1]); setSpinRows([false, false, false, false, false]); setBoard(buildBoard([5, 4, 3, 2, 1], new Set()));
  };

  const capPct = Math.min(100, (spent / CAP) * 100);
  const grade = result ? gradeFor(result.wins) : null;
  const shownGames = result ? result.games.slice(0, reveal) : [];
  const winsSoFar = shownGames.filter((g) => g.w).length;
  const lossSoFar = reveal - winsSoFar;
  const lastGame = reveal > 0 ? result.games[reveal - 1] : null;
  const celebrate = (revealDone && result.wins === 20) || playoff.champion;

  return (
    <div className="wrap">
      <style>{CSS}</style>
      {celebrate && <Confetti />}

      {capBowl && roster && (
        <div className="capbowl-overlay">
          <CapBowlGame
            roster={roster}
            chemistry={finalChemistry}
            onWin={onCapBowlWin}
            onLose={onCapBowlLose}
            onExit={() => setCapBowl(false)}
          />
        </div>
      )}

      <header className="hdr">
        <div className="hdr-top">
          <div className="logo">CAP<span>KINGS</span></div>
          <div className="hdr-right">
            {career.titles > 0 && <div className="rings">🏆×{career.titles}</div>}
            {career.best !== null && <div className="best">BEST {career.best}-{20 - career.best}</div>}
            <div className="budget"><span className="bud-num" style={{ color: remaining <= 2 ? "#EF4444" : "#fff" }}>${remaining}</span><span className="bud-lbl">left</span></div>
            <button className="iconbtn" onClick={() => setMuted((m) => !m)} aria-label="Toggle sound">{muted ? "🔇" : "🔊"}</button>
            <button className="iconbtn" onClick={newBoardReset} aria-label="New board">↻</button>
          </div>
        </div>
        <div className="capbar"><div className="capfill" style={{ width: capPct + "%" }} /></div>
        <div className="tabs">
          {POSITIONS.map((pos, c) => {
            const picked = picks[c];
            const isActive = activeCol === c && !picked && phase === "draft";
            return (
              <button key={c} className={"tab" + (isActive ? " on" : "") + (picked ? " done" : "")} style={{ "--pc": POS_COLORS[pos] }} onClick={() => handleTab(c)} disabled={!!picked || phase !== "draft"}>
                <span className="tab-pos">{pos}</span>
                {picked ? <span className="tab-sub done-sub">✓ {shortName(picked.player.name)}</span> : <span className="tab-sub">{isActive ? "picking" : "tap"}</span>}
              </button>
            );
          })}
        </div>
        {chemistry.links.length > 0 && phase === "draft" && (
          <div className="stackbar">
            {chemistry.links.map((l) => <span key={l.key} className={"stack-chip " + l.type}>{l.type === "legendary" ? "⚡ LEGENDARY" : l.type === "stack" ? "🔗 STACK" : l.type === "team" ? "🏟️ TEAM" : l.type === "identity" ? "✨ IDENTITY" : "🧠 CHEM"}: {l.label}</span>)}
          </div>
        )}
      </header>

      {phase === "draft" && (
        <main className="grid-area">
          {activeCol === null && pickCount === 0 && <div className="hint"><b>Build a $15 squad.</b> Tap a position, draft one card, then prices re-spin. Chemistry cards show <b>CHEM</b>.</div>}
          <div className="board">
            {board.map((row, r) => (
              <div className="row" key={r}>
                <div className={"price t" + dispPrices[r] + (spinRows[r] ? " spin" : "") + (dispPrices[r] === 5 && !spinRows[r] ? " gold" : "")} style={{ color: TIER_COLORS[dispPrices[r]] }}>${dispPrices[r]}</div>
                {row.map((player, c) => {
                  const picked = picks[c];
                  let state;
                  if (picked) state = picked.player.id === player.id ? "picked-sel" : "picked-dim";
                  else if (spinRows[r]) state = "frost";
                  else if (activeCol !== c) state = "frost";
                  else if (rowPrices[r] > maxAffordable) state = "over";
                  else state = "active";
                  return <Card key={c + "-" + player.id} player={player} price={dispPrices[r]} state={state} onPick={() => handlePick(r, c)} chemLinks={state === "active" ? getPotentialChemistry(player, picks) : []} />;
                })}
              </div>
            ))}
          </div>

          {pickCount === 5 && teamReport && (
            <div className="team-report">
              <div className="report-title">TEAM REPORT</div>
              <h3>{teamReport.title}</h3>
              {finalChemistry.links.length > 0 && <div className="chem-report"><b>Chemistry Boosts</b>{finalChemistry.links.map((l) => <p key={l.key}>🔗 {l.label}</p>)}</div>}
              <div className="report-cols">
                <div><b>Strengths</b>{teamReport.strengths.map((s, i) => <p key={i}>✅ {s}</p>)}</div>
                <div><b>Weaknesses</b>{teamReport.weaknesses.map((w, i) => <p key={i}>⚠️ {w}</p>)}</div>
              </div>
            </div>
          )}
          <div className="grid-pad" />
        </main>
      )}

      {phase === "results" && result && (
        <main className="results">
          <div className="rec-wrap"><div className="record" style={{ color: revealDone ? grade.color : "#fff" }}>{winsSoFar}-{lossSoFar}</div><div className={"grade" + (revealDone ? " show" : "")} style={{ color: grade.color }}>{grade.label}</div></div>
          {!revealDone && lastGame && <div className="ticker">WK {reveal} · <b className={lastGame.w ? "tw" : "tl"}>{lastGame.w ? "W" : "L"} {lastGame.my}-{lastGame.opp}</b> vs {lastGame.name}</div>}
          <div className="games">{result.games.map((g, i) => <div key={i} className={"g " + (i < reveal ? (g.w ? "w" : "l") : "hide")}>{i < reveal ? (g.w ? "W" : "L") : ""}</div>)}</div>
          <div className={"sub-stats" + (revealDone ? " show" : "")}><div className="ss"><b>{result.pts.toLocaleString()}</b><span>fantasy pts</span></div><div className="ss"><b style={{ color: result.wins > projLine ? "#22C55E" : "#EF4444" }}>{result.wins > projLine ? "✓" : "✗"} {projLine}</b><span>vegas o/u</span></div><div className="ss"><b>{teamPower}</b><span>team power</span></div><div className="ss"><b>${spent}</b><span>cap spent</span></div></div>
          {revealDone && result.formLabel && <div className="form-note">{result.formLabel}</div>}
          {revealDone && result.injuries?.length > 0 && <div className="injury-card"><div className="report-title">SEASON NEWS</div>{result.injuries.map((inj, i) => <p key={i}>🚑 {inj.playerName}: {inj.label}</p>)}</div>}
          {revealDone && result.injuries?.length === 0 && <div className="clean-health">✅ Clean bill of health — no major injuries.</div>}

          {revealDone && madePlayoffs && !playoff.champion && !playoff.eliminated && <div className="po"><div className="po-title">🎟️ PLAYOFF BERTH CLINCHED</div>{playoff.games.map((g, i) => <div key={i} className={"po-game " + (g.w ? "pw" : "pl")}>{PLAYOFF_ROUNDS[i].name}: <b>{g.w ? "W" : "L"} {g.my}-{g.opp}</b> vs {g.name}</div>)}<button className="po-btn" onClick={playRound} disabled={playoff.pending}>{playoff.pending ? "..." : playoff.stage === 2 ? "🏈 Play the Cap Bowl!" : `Play ${PLAYOFF_ROUNDS[playoff.stage].name} ▶`}</button></div>}
          {revealDone && playoff.eliminated && <div className="po">{playoff.games.map((g, i) => <div key={i} className={"po-game " + (g.w ? "pw" : "pl")}>{PLAYOFF_ROUNDS[i].name}: <b>{g.w ? "W" : "L"} {g.my}-{g.opp}</b> vs {g.name}</div>)}<div className="po-out">💔 Eliminated in the {PLAYOFF_ROUNDS[playoff.games.length - 1].name}</div></div>}
          {playoff.champion && <div className="po champ">{playoff.games.map((g, i) => <div key={i} className="po-game pw">{PLAYOFF_ROUNDS[i].name}: <b>W {g.my}-{g.opp}</b> vs {g.name}</div>)}<div className="champ-banner">🏆 CAP BOWL CHAMPION 🏆</div></div>}
          {revealDone && !madePlayoffs && <div className="po-miss">Missed the playoffs — 11 wins gets you in.</div>}

          {revealDone && result.mvp && <div className="mvp"><div className="mvp-ava"><Avatar player={result.mvp.player} /></div><div className="mvp-info"><span className="mvp-tag">SEASON MVP</span><b>{result.mvp.player.name}</b><span className="mvp-pts">{result.mvp.pts.toFixed(1)} fantasy pts · ${result.mvp.price}</span></div><span className="mvp-trophy">🏅</span></div>}
          {revealDone && result.playerStats && <div className="stat-card"><div className="report-title">PLAYER STATS</div><div className="stat-note">WR and TE production is tied to quarterback play.</div>{Object.values(result.playerStats).map(({ player, stats, injury }) => <div className="stat-row" key={player.id}><div><b>{player.name}</b><span>{player.pos === "QB" ? `${stats.yds.toLocaleString()} YDS · ${stats.td} TD · ${stats.ints} INT` : `${stats.yds.toLocaleString()} YDS · ${stats.td} TD · ${stats.rec} REC`}</span>{injury && <em>{injury.label}</em>}</div><strong>{stats.fantasy.toFixed(1)}</strong></div>)}</div>}

          <div className={"recap" + (revealDone ? " show" : "")}>{[0, 1, 2, 3, 4].map((c) => { const p = picks[c]; if (!p) return null; return <div className="recap-row" key={c}><span className="chip" style={{ background: POS_COLORS[POSITIONS[c]] }}>{POSITIONS[c]}</span><div className="recap-ava"><Avatar player={p.player} /></div><div className="recap-name"><b>{p.player.name}</b><span>{p.player.era || p.player.team}</span></div><span className="pill big" style={{ background: TIER_COLORS[p.price] }}>{p.player.score}</span><span className="paid">${p.price}</span></div>; })}</div>
          {revealDone && <div className="career">{career.seasons} season{career.seasons !== 1 ? "s" : ""} · best {career.best}-{20 - career.best}{career.titles > 0 && ` · ${career.titles} title${career.titles > 1 ? "s" : ""}`}{career.perfects > 0 && ` · ${career.perfects} perfect`}</div>}
          <div className={"end-btns" + (revealDone ? " show" : "")}><button className="share" onClick={shareResult}>{copied ? "Copied ✓" : "Share 📋"}</button><button className="again" onClick={newBoardReset}>Run It Back ↻</button></div>
          <div className="grid-pad" />
        </main>
      )}

      {phase === "draft" && <footer className="bottom">{pickCount === 5 ? <div className="line"><b>PWR {teamPower}</b><span>O/U {projLine} wins</span></div> : <div className="prog">{[0, 1, 2, 3, 4].map((c) => <i key={c} className={c in picks ? "fill" : ""} />)}<span>{pickCount}/5</span></div>}<button className={"sim" + (pickCount === 5 ? " ready" : "")} disabled={pickCount < 5} onClick={startSim}>{pickCount === 5 ? "Simulate Season ▶" : `Pick ${5 - pickCount} more`}</button></footer>}
    </div>
  );
}

/* ============================ STYLES ============================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html,body{background:#111318}.wrap{font-family:'Inter',system-ui,sans-serif;background:#111318;color:#fff;max-width:520px;margin:0 auto;min-height:100svh;display:flex;flex-direction:column;position:relative;overflow-x:hidden}.confetti{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}.confetti span{position:absolute;top:-12px;border-radius:2px;animation:fall linear infinite}@keyframes fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(calc(720deg * var(--spin)));opacity:.7}}
.hdr{position:sticky;top:0;z-index:50;background:rgba(17,19,24,.94);backdrop-filter:blur(10px);border-bottom:1px solid #2A3040;padding:7px 8px 6px}.hdr-top{display:flex;align-items:center;justify-content:space-between}.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;color:#F59E0B;line-height:1}.logo span{color:#fff;margin-left:4px}.hdr-right{display:flex;align-items:center;gap:6px}.rings{font-size:10px;font-weight:900;color:#F59E0B}.best{font-size:9px;font-weight:900;color:#F59E0B;background:#F59E0B1A;border:1px solid #F59E0B44;padding:3px 6px;border-radius:999px}.budget{text-align:right;line-height:1}.bud-num{font-family:'Bebas Neue',sans-serif;font-size:24px}.bud-lbl{display:block;font-size:8px;color:#6B7280;font-weight:800;letter-spacing:.4px;text-transform:uppercase}.iconbtn{background:#1C2028;border:1px solid #2A3040;color:#9CA3AF;width:28px;height:28px;border-radius:8px;font-size:12px;cursor:pointer}.capbar{height:5px;background:#2A3040;border-radius:99px;margin-top:6px;overflow:hidden}.capfill{height:100%;border-radius:99px;background:linear-gradient(90deg,#F59E0B,#22C55E,#F97316,#EF4444);transition:width .35s ease}.tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:6px}.tab{background:#1C2028;border:1px solid #2A3040;border-top:2px solid var(--pc);border-radius:8px;padding:4px 2px 3px;cursor:pointer;color:#fff;display:flex;flex-direction:column;align-items:center;gap:1px;min-width:0}.tab.on{background:#232936;border-color:var(--pc);box-shadow:0 0 0 1px var(--pc) inset,0 4px 14px -6px var(--pc)}.tab.done{opacity:.8;cursor:default}.tab-pos{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;color:var(--pc);line-height:1}.tab-sub{font-size:7.5px;color:#6B7280;font-weight:800;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tab-sub.done-sub{color:#22C55E}.stackbar{display:flex;gap:4px;margin-top:6px;overflow-x:auto;padding-bottom:1px}.stackbar::-webkit-scrollbar{display:none}.stack-chip{font-size:8px;font-weight:900;white-space:nowrap;padding:3px 7px;border-radius:999px;border:1px solid #60A5FA44;color:#93C5FD;background:#60A5FA14}.stack-chip.legendary{color:#FCD34D;background:#F59E0B14;border-color:#F59E0B55}.stack-chip.team{color:#86EFAC;background:#22C55E14;border-color:#22C55E44}.stack-chip.identity{color:#C4B5FD;background:#A78BFA14;border-color:#A78BFA44}
.grid-area{padding:6px 6px 0;flex:1}.hint{font-size:10.5px;color:#9CA3AF;background:#1C2028;border:1px dashed #2A3040;border-radius:9px;padding:7px 9px;margin-bottom:6px;text-align:center;line-height:1.3}.hint b{color:#E5E7EB}.board{height:calc(100svh - 177px);min-height:470px;max-height:590px;display:grid;grid-template-rows:repeat(5,1fr);gap:4px}.row{display:grid;grid-template-columns:24px repeat(5,minmax(0,1fr));gap:4px;min-height:0}.price{font-family:'Bebas Neue',sans-serif;font-size:17px;display:flex;align-items:center;justify-content:center;background:#1C2028;border:1px solid #2A3040;border-radius:7px}.price.spin{animation:reel .12s linear infinite;filter:blur(.5px)}.price.gold{border-color:#F59E0B66;box-shadow:0 0 10px -5px #F59E0B}@keyframes reel{0%{transform:translateY(-2px)}50%{transform:translateY(2px)}100%{transform:translateY(-2px)}}
.card{position:relative;background:#1C2028;border:1px solid #2A3040;border-radius:8px;overflow:hidden;padding:0;cursor:pointer;text-align:left;color:#fff;display:flex;flex-direction:column;font-family:inherit;min-width:0;min-height:0}.card:active{transform:scale(.96)}.card.frost{filter:blur(1.7px);opacity:.34;background:#14171E;pointer-events:none}.card.over{opacity:.35;filter:grayscale(1);cursor:not-allowed}.card.pdim{opacity:.22;filter:grayscale(.6)}.card.sel{background:#0D2010;border-color:#22C55E;box-shadow:0 0 12px -4px #22C55E}.check{position:absolute;top:3px;right:3px;z-index:5;background:#22C55E;color:#06270f;width:15px;height:15px;border-radius:50%;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center}.over-tag{position:absolute;top:3px;right:3px;z-index:5;background:#EF4444;color:#fff;font-size:7px;font-weight:900;letter-spacing:.4px;padding:2px 4px;border-radius:4px}.goat{position:absolute;top:2px;left:3px;z-index:5;font-size:10px}.chem-badge{position:absolute;left:3px;bottom:3px;z-index:6;background:#0EA5E9;color:#03131f;font-size:7px;font-weight:900;padding:2px 4px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.35)}.ava{width:100%;height:43%;min-height:32px;background:#232936;position:relative;overflow:hidden;flex-shrink:0}.ava.legend{display:flex;flex-direction:column;align-items:center;justify-content:center}.ava-shine{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(255,255,255,.07))}.ava-num{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;line-height:1;position:relative;text-shadow:0 2px 6px rgba(0,0,0,.5)}.ava-team{font-size:7px;font-weight:800;color:rgba(255,255,255,.75);letter-spacing:1px;position:relative}.card-body{padding:3px 4px 4px;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0}.pname{font-size:8.4px;font-weight:900;line-height:1.08;min-height:18px;overflow:hidden}.meta{display:flex;align-items:center;justify-content:space-between;gap:2px}.team{font-size:6.4px;color:#6B7280;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pill{font-size:8px;font-weight:900;color:#111318;padding:1px 4px;border-radius:999px;flex-shrink:0}.pill.big{font-size:11px;padding:2px 7px}.stats{display:flex;flex-direction:column;gap:0;margin-top:0}.stat-title{font-size:6px;color:#F59E0B;font-weight:900;letter-spacing:.5px;margin-bottom:1px;justify-content:flex-start!important}.stat-note{font-size:9px;color:#6B7280;font-weight:800;margin:2px 0 6px}.stats div{display:flex;justify-content:space-between;font-size:7px;line-height:1.18}.stats b{color:#6B7280;font-weight:800}.stats span{color:#D1D5DB;font-weight:800}.bars{display:flex;flex-direction:column;gap:3px;margin-top:2px}.bars i{height:4px;background:#2A3040;border-radius:3px;display:block}.grid-pad{height:76px}
.bottom{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;z-index:60;background:rgba(17,19,24,.96);backdrop-filter:blur(10px);border-top:1px solid #2A3040;padding:8px 10px calc(8px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:10px}.prog{display:flex;align-items:center;gap:4px}.prog i{width:13px;height:6px;border-radius:3px;background:#2A3040}.prog i.fill{background:#22C55E}.prog span{font-size:10px;color:#6B7280;font-weight:900;margin-left:3px}.line{display:flex;flex-direction:column;line-height:1.1}.line b{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#F59E0B;letter-spacing:.5px}.line span{font-size:8px;color:#6B7280;font-weight:900;text-transform:uppercase}.sim{flex:1;font-weight:900;font-size:13px;padding:11px;border-radius:11px;cursor:pointer;background:#1C2028;color:#4b5563;border:1px solid #2A3040}.sim.ready{background:linear-gradient(135deg,#16A34A,#22C55E);color:#04150a;border-color:transparent;box-shadow:0 6px 20px -6px #22C55E99}
.team-report{background:#1C2028;border:1px solid #2A3040;border-radius:12px;padding:10px;margin:8px 0 0}.report-title{font-size:8px;font-weight:900;letter-spacing:1.4px;color:#F59E0B}.team-report h3{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;margin:2px 0 7px}.chem-report{background:#111827;border:1px solid #2A3040;border-radius:10px;padding:8px;margin-bottom:8px}.chem-report b,.report-cols b{font-size:10px;color:#E5E7EB}.chem-report p{font-size:10px;color:#93C5FD;margin-top:4px;font-weight:800}.report-cols{display:grid;grid-template-columns:1fr 1fr;gap:9px}.report-cols p{font-size:10px;color:#9CA3AF;line-height:1.28;margin-top:4px}
.results{padding:14px 12px 0;flex:1;display:flex;flex-direction:column;align-items:center}.rec-wrap{text-align:center}.record{font-family:'Bebas Neue',sans-serif;font-size:76px;line-height:.9;letter-spacing:2px;transition:color .4s}.grade{font-size:15px;font-weight:900;opacity:0;transform:translateY(6px);transition:all .4s .15s;margin-top:2px}.grade.show{opacity:1;transform:none}.ticker{font-size:11px;color:#9CA3AF;margin-top:8px;font-weight:800;min-height:16px}.ticker .tw{color:#22C55E}.ticker .tl{color:#EF4444}.games{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin:12px 0 6px;width:100%;max-width:380px}.g{aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:1px solid #2A3040;background:#1C2028;color:transparent}.g.w{background:#0D2010;border-color:#22C55E66;color:#22C55E}.g.l{background:#200d0d;border-color:#EF444466;color:#EF4444}.sub-stats{display:flex;gap:14px;margin:10px 0 2px;opacity:0;transition:opacity .4s .25s}.sub-stats.show{opacity:1}.ss{text-align:center}.ss b{font-family:'Bebas Neue',sans-serif;font-size:20px;display:block}.ss span{font-size:8px;color:#6B7280;font-weight:900;text-transform:uppercase;letter-spacing:.4px}.form-note{font-size:10px;color:#9CA3AF;margin-top:8px;font-weight:800}.injury-card,.stat-card,.po,.mvp,.recap{width:100%;max-width:400px}.injury-card{margin-top:10px;background:#241313;border:1px solid #EF444455;border-radius:12px;padding:10px}.injury-card p{font-size:10.5px;color:#FCA5A5;margin-top:5px;font-weight:800}.clean-health{width:100%;max-width:400px;margin-top:10px;background:#0D2010;border:1px solid #22C55E55;color:#86EFAC;border-radius:12px;padding:9px 10px;font-size:10.5px;font-weight:900;text-align:center}.po{margin-top:12px;background:#1C2028;border:1px solid #2A3040;border-radius:12px;padding:10px;text-align:center}.po.champ{border-color:#F59E0B;box-shadow:0 0 24px -8px #F59E0B}.po-title{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1.5px;color:#2DD4BF;margin-bottom:6px}.po-game{font-size:11px;color:#D1D5DB;padding:5px 0;border-bottom:1px solid #2A3040}.po-game.pw b{color:#22C55E}.po-game.pl b{color:#EF4444}.po-btn{margin-top:9px;width:100%;padding:10px;border-radius:10px;border:none;cursor:pointer;font-weight:900;font-size:12px;background:linear-gradient(135deg,#0D9488,#2DD4BF);color:#022c26}.po-out{margin-top:9px;font-size:12px;font-weight:900;color:#EF4444}.po-miss{margin-top:11px;font-size:10px;color:#6B7280;font-weight:800}.champ-banner{margin-top:9px;font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:2px;color:#F59E0B;text-shadow:0 0 18px #F59E0B66}.mvp{margin-top:10px;display:flex;align-items:center;gap:9px;background:linear-gradient(135deg,#1C2028,#232014);border:1px solid #F59E0B55;border-radius:12px;padding:8px 10px}.mvp-ava{width:42px;height:42px;border-radius:9px;overflow:hidden;flex-shrink:0}.mvp-ava .ava{height:100%}.mvp-ava .ava-num{font-size:18px}.mvp-ava .ava-team{display:none}.mvp-info{flex:1;min-width:0;line-height:1.25}.mvp-tag{font-size:7px;font-weight:900;letter-spacing:1.4px;color:#F59E0B;display:block}.mvp-info b{font-size:12px;display:block}.mvp-pts{font-size:9.5px;color:#9CA3AF;font-weight:800}.mvp-trophy{font-size:21px}.stat-card{margin-top:10px;background:#1C2028;border:1px solid #2A3040;border-radius:12px;padding:10px}.stat-row{display:flex;justify-content:space-between;gap:10px;border-top:1px solid #2A3040;padding:7px 0}.stat-row:first-of-type{border-top:none}.stat-row b{display:block;font-size:11.5px}.stat-row span{display:block;font-size:9.5px;color:#9CA3AF;margin-top:2px}.stat-row em{display:block;font-size:8.5px;color:#EF4444;font-style:normal;margin-top:2px}.stat-row strong{font-family:'Bebas Neue',sans-serif;font-size:19px;color:#F59E0B}.recap{margin-top:10px;opacity:0;transform:translateY(8px);transition:all .4s .35s}.recap.show{opacity:1;transform:none}.recap-row{display:flex;align-items:center;gap:8px;background:#1C2028;border:1px solid #2A3040;border-radius:11px;padding:6px 9px;margin-bottom:5px}.chip{font-size:8px;font-weight:900;color:#111318;padding:2px 5px;border-radius:5px;width:26px;text-align:center;flex-shrink:0}.recap-ava{width:34px;height:34px;border-radius:8px;overflow:hidden;flex-shrink:0}.recap-ava .ava{height:100%}.recap-ava .ava-num{font-size:16px}.recap-ava .ava-team{display:none}.recap-name{flex:1;min-width:0;line-height:1.15}.recap-name b{font-size:11.5px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.recap-name span{font-size:8.5px;color:#6B7280;font-weight:800}.paid{font-family:'Bebas Neue',sans-serif;font-size:17px;color:#F59E0B;width:26px;text-align:right}.career{margin-top:10px;font-size:9.5px;color:#6B7280;font-weight:900;text-transform:uppercase;letter-spacing:.4px}.end-btns{display:flex;gap:8px;width:100%;max-width:400px;margin-top:10px;opacity:0;transition:opacity .4s .45s}.end-btns.show{opacity:1}.share,.again{padding:13px;border-radius:12px;cursor:pointer;font-weight:900;font-size:13px;font-family:'Inter',sans-serif}.share{flex:1;background:#1C2028;color:#E5E7EB;border:1px solid #2A3040}.again{flex:1.4;border:none;background:linear-gradient(135deg,#F59E0B,#FBBF24);color:#2a1a00;box-shadow:0 6px 20px -6px #F59E0B88}
@media(max-height:740px){.hdr{padding-top:5px}.logo{font-size:22px}.tabs{margin-top:5px}.board{height:calc(100svh - 164px);min-height:435px;gap:3px}.row{gap:3px;grid-template-columns:22px repeat(5,minmax(0,1fr))}.ava{height:39%;min-height:26px}.pname{font-size:7.7px;min-height:16px}.team{font-size:5.8px}.stats div{font-size:6.4px}.card-body{padding:2px 3px 3px}.price{font-size:15px}.bottom{padding-top:7px}.hint{display:none}.record{font-size:68px}}
@media(max-width:380px){.row{grid-template-columns:22px repeat(5,minmax(0,1fr));gap:3px}.board{gap:3px}.pname{font-size:7.5px}.stats div{font-size:6.2px}.team{font-size:5.7px}.pill{font-size:7px;padding:1px 3px}.chem-badge{font-size:6px;padding:2px 3px}.ava-num{font-size:18px}.price{font-size:15px}.record{font-size:68px}.sub-stats{gap:10px}}
@media(prefers-reduced-motion:reduce){.price.spin,.confetti span{animation:none}*{transition-duration:.01ms!important}}

/* ---- Cap Bowl playable overlay ---- */
.capbowl-overlay{position:fixed;inset:0;z-index:300;background:#0D0F14;overflow:auto}.capbowl-screen{min-height:100svh;background:#0D0F14;color:#fff;font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;padding-bottom:24px}.capbowl-scorebug{width:100%;max-width:430px;background:#1C2028;border-bottom:2px solid #2A3040;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;text-align:center;padding:10px 12px}.capbowl-scorebug b{display:block;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px}.capbowl-scorebug span{display:block;color:#6B7280;font-size:9px;font-weight:900;text-transform:uppercase}.capbowl-clock{font-family:'Bebas Neue',sans-serif;font-size:34px;color:#F59E0B;line-height:1}.capbowl-field{position:relative;width:min(92vw,360px);height:420px;margin:12px auto;background:repeating-linear-gradient(0deg,#286028 0 28px,#2d6a2d 28px 56px);border:3px solid rgba(255,255,255,.25);border-radius:12px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.45)}.capbowl-field:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 41px,rgba(255,255,255,.20) 42px,transparent 43px)}.capbowl-endzone{position:absolute;top:0;left:0;right:0;height:58px;background:#173580;color:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px}.capbowl-yardline{position:absolute;left:0;right:0;height:3px;background:#fff;transform:translateY(50%);box-shadow:0 0 10px rgba(255,255,255,.45)}.capbowl-yardline span{position:absolute;right:8px;bottom:7px;background:#111318;color:#fff;border:1px solid #2A3040;border-radius:999px;padding:3px 8px;font-size:10px;font-weight:900}.capbowl-first{position:absolute;left:0;right:0;height:3px;background:#FBBF24;transform:translateY(50%);box-shadow:0 0 12px #F59E0B}.capbowl-ball{position:absolute;left:50%;transform:translate(-50%,50%);font-size:26px;transition:bottom .45s ease}.capbowl-panel{width:100%;max-width:430px;padding:0 12px}.capbowl-situation{display:flex;align-items:center;justify-content:space-between;background:#1C2028;border:1px solid #2A3040;border-radius:12px;padding:10px 12px;margin-bottom:10px}.capbowl-situation b{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#F59E0B}.capbowl-situation span{font-size:10px;color:#9CA3AF;font-weight:900;text-transform:uppercase}.capbowl-run,.capbowl-targets button,.capbowl-exit{width:100%;border:none;border-radius:12px;padding:13px 12px;font-weight:900;font-size:13px;font-family:'Inter',sans-serif;cursor:pointer}.capbowl-run{background:linear-gradient(135deg,#F97316,#FB923C);color:#1a0e00;margin-bottom:8px}.capbowl-targets{display:grid;grid-template-columns:1fr 1fr;gap:8px}.capbowl-targets button{background:#1C2028;color:#fff;border:1px solid #2A3040}.capbowl-targets button.chem-target{border-color:#F59E0B;background:#221b0b;color:#FCD34D}.capbowl-run:disabled,.capbowl-targets button:disabled{opacity:.6;cursor:wait}.capbowl-exit{background:linear-gradient(135deg,#F59E0B,#FBBF24);color:#211300}.capbowl-log{margin-top:12px;background:#111318;border:1px solid #2A3040;border-radius:12px;overflow:hidden}.capbowl-log p{font-size:11px;color:#D1D5DB;padding:8px 10px;border-bottom:1px solid #1f2430;line-height:1.35}.capbowl-log p:first-child{color:#fff;font-weight:800}.capbowl-log p:last-child{border-bottom:none}


/* ---- full-screen vertical Cap Bowl ---- */
.capbowl-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  user-select: none;
  overflow: hidden;
}
.capbowl-phone {
  position: relative;
  height: 100%;
  aspect-ratio: 440 / 952;
  max-width: 100%;
  background: #236f23;
  overflow: hidden;
}
.capbowl-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  touch-action: none;
  cursor: crosshair;
}
.cap-scoreboard {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(6,6,15,.96), rgba(15,15,34,.82));
  border-bottom: 2px solid #f0c040;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}
.cap-scoreboard div { display: flex; gap: 6px; align-items: center; }
.cap-scoreboard span { color: #4a90e2; font-weight: 800; font-size: 12px; }
.cap-scoreboard div:last-child span { color: #c0392b; }
.cap-scoreboard b { background: #4a90e2; color: #fff; font-weight: 900; font-size: 22px; padding: 1px 11px; border-radius: 4px; }
.cap-scoreboard div:last-child b { background: #c0392b; }
.cap-scoreboard .cap-mid { display: block; text-align: center; }
.cap-scoreboard .cap-mid strong { display: block; color: #f0c040; font-size: 10px; letter-spacing: 2px; }
.cap-scoreboard .cap-mid em { display: block; color: #bbb; font-size: 10px; margin-top: 1px; font-style: normal; }
.cap-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,.72);
  border: 1px solid rgba(240,192,64,.35);
  border-radius: 6px;
  padding: 7px 18px;
  color: #f0c040;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}
.cap-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.86);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 16px;
}
.cap-overlay.cap-call {
  background: rgba(0,0,0,.95);
  flex-direction: column;
}
.cap-overlay.win { background: rgba(0,0,0,.82); }
.cap-center {
  text-align: center;
  padding: 24px;
  max-width: 340px;
  position: relative;
  z-index: 2;
}
.cap-kicker {
  color: #f0c040;
  font-size: 11px;
  letter-spacing: 5px;
  margin-bottom: 14px;
  font-weight: 900;
}
.cap-center h1 {
  color: #fff;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 10px;
}
.cap-center h2 {
  font-size: 34px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
}
.cap-center h2.good { color: #2ecc71; }
.cap-center h2.bad { color: #e74c3c; }
.cap-center h3 {
  font-size: 22px;
  color: #f0c040;
  margin-bottom: 12px;
  text-shadow: 0 0 14px rgba(240,192,64,.6);
}
.cap-center p { color: #aaa; font-size: 14px; margin-bottom: 10px; }
.cap-center small { display: block; color: #777; font-size: 12px; margin-bottom: 28px; line-height: 1.6; }
.cap-center button, .cap-actions button {
  background: #f0c040;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-family: 'Courier New', monospace;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 1px;
}
.cap-actions { display: flex; gap: 10px; justify-content: center; }
.cap-actions .secondary { background: rgba(255,255,255,.08); color: #fff; }
.cap-playgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 340px;
}
.cap-diagram {
  cursor: pointer;
  border: 2px solid rgba(255,255,255,.1);
  border-radius: 8px;
  overflow: hidden;
  background: #0a0a14;
}
.cap-diagram:hover {
  border-color: #f0c040;
  box-shadow: 0 0 12px rgba(240,192,64,.4);
}
.big-emoji { font-size: 56px; margin-bottom: 10px; }
.on-top { position: relative; z-index: 2; }

`;

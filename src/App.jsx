import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

/* NFL divisions for division chemistry */
const DIVISIONS = {
  "AFC East":  ["BUF","MIA","NE","NYJ"],
  "AFC North": ["BAL","CIN","CLE","PIT"],
  "AFC South": ["HOU","IND","JAX","TEN"],
  "AFC West":  ["DEN","KC","LV","LAC"],
  "NFC East":  ["DAL","NYG","PHI","WAS"],
  "NFC North": ["CHI","DET","GB","MIN"],
  "NFC South": ["ATL","CAR","NO","TB"],
  "NFC West":  ["ARI","LAR","SF","SEA"],
};
function sameDivision(teamA, teamB) {
  if (teamA === "FA" || teamB === "FA") return false;
  return Object.values(DIVISIONS).some((d) => d.includes(teamA) && d.includes(teamB));
}

/* ============================ PLAYER POOLS ============================ */
const QB = {
5:[
["Tom Brady","NE",99,null,12,5235,43,102.2,"NE/TB · 2000-22"],
["Joe Montana","SF",98,null,16,3944,31,107.2,"SF · 1979-94"],
["Patrick Mahomes","KC",97,3139477,15,5250,41,105.3,null],
["Josh Allen","BUF",97,3918298,17,4544,40,101.4,null],
["Peyton Manning","IND",96,null,18,5477,55,115.1,"IND/DEN · 1998-15"],
["Lamar Jackson","BAL",95,3916387,8,3678,24,102.0,null],
["Drew Brees","NO",95,null,9,5476,46,110.6,"NO · 2001-20"],
["Joe Burrow","CIN",94,4361978,9,4918,43,108.2,null],
["Johnny Unitas","BAL",93,null,19,3481,32,89.1,"BAL · 1956-73"],
],
4:[
["Aaron Rodgers","PIT",92,8439,8,4299,37,111.9,null],
["Steve Young","SF",91,null,8,3969,35,104.9,"SF · 1985-99"],
["Dan Marino","MIA",91,null,13,5084,48,99.4,"MIA · 1983-99"],
["Matthew Stafford","LAR",90,13197,9,4243,24,98.1,null],
["Jalen Hurts","PHI",90,4241479,1,3858,23,94.2,null],
["Brock Purdy","SF",89,4432577,13,4280,31,113.0,null],
["Justin Herbert","LAC",89,4038941,10,4739,25,94.1,null],
["Drake Maye","NE",88,4432772,10,3258,22,93.5,null],
["Baker Mayfield","TB",88,3054978,6,4500,41,106.8,null],
["Jordan Love","GB",88,4241985,10,4159,32,96.1,null],
["CJ Stroud","HOU",87,4431611,7,4108,23,98.3,null],
["Warren Moon","HOU",87,null,1,4690,33,96.8,"HOU/MIN · 1984-00"],
["John Elway","DEN",87,null,7,3891,27,93.0,"DEN · 1983-98"],
["Kurt Warner","ARI",87,null,13,4830,41,109.2,"STL/ARI · 1998-09"],
["Troy Aikman","DAL",86,null,8,3445,23,99.0,"DAL · 1989-00"],
["Jayden Daniels","WAS",85,4429084,5,3568,25,99.3,null],
["Kyler Murray","ARI",85,3917315,1,3787,26,100.6,null],
["Chad Pennington","NYJ",86,null,10,3799,23,104.2,"NYJ · 2000-10"],
["Donovan McNabb","PHI",86,null,5,3916,31,92.0,"PHI · 1999-10"],
["Matt Hasselbeck","SEA",85,null,8,3966,28,90.8,"SEA · 2001-10"],
["Carson Palmer","CIN",86,null,9,4296,32,98.5,"CIN/ARI · 2003-17"],
["Mark Brunell","JAX",85,null,8,3931,20,92.7,"JAX · 1994-06"],
["Dak Prescott","DAL",86,null,4,4516,36,105.0,null],
["Sam Bradford","MIN",85,null,14,3877,20,99.4,"STL/MIN · 2010-18"],
["Alex Smith","WAS",85,null,11,3725,26,102.4,"SF/KC · 2005-20"],
["Matt Schaub","HOU",85,null,8,4770,29,98.6,"HOU · 2007-13"],
["Andy Dalton","CIN",85,null,14,3250,25,96.5,"CIN · 2011-21"],
["Case Keenum","DEN",84,null,17,3547,22,98.3,"MIN/DEN · 2012-20"],
["Nick Foles","PHI",84,null,9,2271,27,119.2,"PHI · 2012-19"],
["Jimmy Garoppolo","SF",84,null,10,3810,27,102.0,"SF · 2016-22"],
["Teddy Bridgewater","MIN",84,null,5,3023,18,99.5,"MIN/NO · 2014-21"],
["Ryan Fitzpatrick","MIA",84,null,14,3529,31,95.3,"BUF/MIA · 2005-21"],
["Chad Henne","JAX",83,null,4,2264,14,87.5,"MIA/JAX · 2008-21"],
["Tyrod Taylor","BUF",83,null,5,3023,20,101.0,"BUF/CLE · 2015-21"],
["Josh McCown","PHI",83,null,15,1678,11,93.1,"FA · 2002-18"],
["Joe Flacco","NYJ",83,null,5,3817,22,84.5,"BAL/DEN · 2008-22"],
],
3:[
["Brett Favre","GB",84,null,4,4413,38,95.4,"GB · 1991-10"],
["Dak Prescott","DAL",84,2577417,4,4516,36,105.0,null],
["Cam Newton","CAR",83,null,1,3837,35,99.4,"CAR · 2011-21"],
["Jared Goff","DET",83,null,16,4575,30,97.9,null],
["Bo Nix","DEN",83,null,10,3775,29,93.3,null],
["Tua Tagovailoa","MIA",83,4241457,1,4624,29,106.1,null],
["Matt Ryan","ATL",82,null,2,4944,38,117.1,"ATL · 2008-21"],
["Caleb Williams","CHI",82,null,18,3541,20,88.7,null],
["Trevor Lawrence","JAX",81,null,16,4016,21,87.3,null],
["Russell Wilson","NYG",80,16757,3,3524,29,100.3,null],
["Philip Rivers","LAC",79,null,17,4515,32,99.0,"SD/LAC · 2004-20"],
["Eli Manning","NYG",79,null,10,4933,35,92.9,"NYG · 2004-19"],
["Tony Romo","DAL",78,null,9,4903,34,97.6,"DAL · 2003-16"],
["Ben Roethlisberger","PIT",77,null,7,4952,34,97.0,"PIT · 2004-21"],
["Sam Darnold","SEA",76,3886820,14,4319,35,101.7,null],
["Trey Lance","DAL",79,null,5,603,5,87.2,null],
["Hendon Hooker","DET",79,null,2,856,4,80.2,null],
["Anthony Richardson","IND",79,null,8,1814,18,89.6,null],
["Easton Stick","LAC",78,null,12,1395,8,88.1,null],
["Michael Penix Jr.","ATL",79,null,9,2012,13,88.3,null],
["Will Levis","TEN",78,null,8,1924,12,85.4,null],
["Tommy DeVito","NYG",77,null,15,1532,9,88.3,null],
["Jacoby Brissett","WAS",77,null,12,2849,18,93.1,null],
["Colt McCoy","ARI",77,null,12,2547,17,95.3,"ARI/NYG · 2010-22"],
["Chad Pennington","MIA",78,null,10,3799,23,104.2,"MIA · 2008-10"],
["Chris Simms","TB",77,null,14,1304,7,82.3,"TB · 2003-07"],
["A.J. McCarron","CIN",77,null,5,854,6,97.4,"CIN · 2014-17"],
["Shaun Hill","DET",77,null,13,1765,11,91.4,"DET · 2008-09"],
["Rex Grossman","CHI",76,null,8,3193,23,73.9,"CHI · 2003-08"],
["Sage Rosenfels","HOU",76,null,18,1507,11,99.1,"HOU · 2002-09"],
["Blaine Gabbert","TB",76,null,7,1698,9,85.2,"JAX/SF · 2011-18"],
["Chase Daniel","NO",75,null,10,618,5,97.7,"NO/CHI · 2009-20"],
],
2:[
["Geno Smith","LV",74,15813,7,4320,20,91.1,null],
["Kirk Cousins","ATL",73,15825,18,4170,29,103.1,null],
["Derek Carr","NO",72,16760,4,3522,24,93.9,"LV/NO · 2014-24"],
["Jameis Winston","NYG",71,null,5,5109,33,84.3,null],
["Andy Dalton","CIN",71,14163,14,3250,25,96.5,null],
["Gardner Minshew","LV",70,null,15,3514,21,93.1,null],
["Ryan Fitzpatrick","MIA",69,null,14,3529,31,95.3,"BUF/MIA · 2005-21"],
["Justin Fields","NYJ",69,4241372,7,2562,16,84.1,null],
["Mac Jones","SF",68,4361741,10,2055,12,85.0,null],
["Jacoby Brissett","ARI",66,2979843,7,1197,7,83.3,null],
["Nathan Peterman","BUF",68,null,2,308,3,51.7,"BUF · 2017-18"],
["Davis Mills","HOU",68,null,15,2664,16,88.8,"HOU · 2021-22"],
["Sam Howell","WAS",69,null,14,4044,21,89.3,"WAS · 2023"],
["Skylar Thompson","MIA",68,null,19,1163,5,80.2,"MIA · 2022-24"],
["Taylor Heinicke","ATL",69,null,4,2969,20,95.5,"WAS/ATL · 2020-23"],
["Brett Hundley","GB",68,null,7,1836,9,86.4,"GB · 2015-17"],
["Deshone Kizer","CLE",67,null,14,2894,11,60.5,"CLE · 2017-18"],
["Trace McSorley","ARI",66,null,3,183,2,84.0,"BAL/ARI · 2019-22"],
["PJ Walker","CAR",67,null,6,1196,7,81.3,"CAR · 2021-22"],
["Matt Cassel","TEN",68,null,16,3693,27,92.5,"NE/KC · 2001-16"],
["Christian Hackenberg","NYJ",65,null,5,0,0,0.0,"NYJ · 2016-17"],
["Sean Mannion","MIN",65,null,14,411,1,75.6,"LAR/MIN · 2015-21"],
],
1:[
["Bryce Young","CAR",64,4432051,9,2877,11,71.3,null],
["Mitch Trubisky","PIT",62,null,10,3138,24,95.4,null],
["Aidan O'Connell","LV",62,4360777,4,1618,8,82.4,null],
["Ryan Tannehill","FA",61,15967,17,1614,9,86.2,null],
["Kenny Pickett","PHI",61,null,7,2070,7,81.4,null],
["Zach Wilson","MIA",60,null,2,1289,6,72.1,null],
["Malik Willis","GB",60,4430178,2,923,5,79.3,null],
["Marcus Mariota","WAS",59,2576336,8,1334,7,84.1,null],
["Deshaun Watson","CLE",58,null,4,1156,5,77.3,null],
["Tim Tebow","DEN",57,null,15,1729,12,72.9,"DEN/NYJ · 2010-12"],
["Bailey Zappe","NE",57,4430181,4,498,3,80.2,null],
["Joe Flacco","CLE",63,null,19,3273,21,82.6,"CLE · 2023"],
["Jarrett Stidham","LV",62,null,15,1105,7,84.0,"NE/LV · 2019-23"],
["Colt Anderson","IND",61,null,16,234,1,80.1,"IND · 2009-12"],
["Kellen Moore","DAL",60,null,17,0,0,0.0,"DAL · 2012-15"],
["Tanner Mordecai","MIA",60,null,10,0,0,0.0,"MIA · 2024"],
["Dorian Thompson-Robinson","CLE",59,null,17,1215,5,68.3,"CLE · 2023-24"],
["Dustin Batiste","FA",58,null,9,0,0,0.0,"FA"],
["Jake Browning","CIN",60,null,10,1566,13,94.7,"CIN · 2023"],
["Joe Milton","NE",59,null,15,0,0,0.0,"NE · 2024"],
["Jaren Hall","MIN",58,null,16,194,2,72.4,"MIN · 2023"],
],
};

const RB = {
5:[
["Barry Sanders","DET",99,null,20,2358,11,6.1,"DET · 1989-98"],
["Jim Brown","CLE",98,null,32,1863,17,5.2,"CLE · 1957-65"],
["Walter Payton","CHI",97,null,34,1852,14,5.0,"CHI · 1975-87"],
["Saquon Barkley","PHI",97,3929630,26,2005,13,5.8,null],
["Jonathan Taylor","IND",96,4035538,28,1811,18,5.5,null],
["LaDainian Tomlinson","SD",96,null,21,1815,28,5.2,"SD · 2001-11"],
["Emmitt Smith","DAL",96,null,22,1773,25,4.7,"DAL · 1990-04"],
["Gale Sayers","CHI",95,null,40,1231,8,5.0,"CHI · 1965-71"],
["Derrick Henry","BAL",95,3054220,22,1921,16,5.1,null],
["Bijan Robinson","ATL",95,null,7,1456,9,5.2,null],
["Bo Jackson","LV",94,null,34,950,4,5.5,"LA Raiders · 1987-90"],
["Christian McCaffrey","SF",94,3054211,23,1459,14,5.4,null],
],
4:[
["Eric Dickerson","LAR",93,null,29,2105,14,5.6,"LAR · 1983-93"],
["Marshall Faulk","STL",92,null,28,1381,18,5.4,"IND/STL · 1994-06"],
["De'Von Achane","MIA",92,4430030,28,1383,13,6.0,null],
["Jahmyr Gibbs","DET",92,4430715,26,1412,16,5.6,null],
["Adrian Peterson","MIN",91,null,28,2097,13,6.0,"MIN · 2007-19"],
["Shaun Alexander","SEA",90,null,37,1880,27,5.1,"SEA · 2000-08"],
["Nick Chubb","HOU",90,3054085,21,1525,12,5.3,null],
["James Cook","BUF",89,4430022,4,1267,9,5.0,null],
["Alvin Kamara","NO",89,3054210,41,1330,16,4.9,null],
["Breece Hall","NYJ",89,null,20,994,9,4.4,null],
["Ashton Jeanty","LV",88,null,2,1130,8,4.6,null],
["Marshawn Lynch","SEA",88,null,24,1306,12,4.9,"SEA · 2007-19"],
["Frank Gore","SF",88,null,21,1695,8,4.9,"SF · 2005-20"],
["Josh Jacobs","GB",88,4054978,8,1329,7,4.7,null],
["Curtis Martin","NYJ",89,null,28,1697,12,4.0,"NYJ · 1995-05"],
["Corey Dillon","CIN",89,null,28,1635,13,4.5,"CIN · 1997-06"],
["Clinton Portis","WAS",89,null,26,1516,14,5.1,"DEN/WAS · 2002-10"],
["Ricky Williams","MIA",88,null,34,1372,16,5.0,"NO/MIA · 1999-11"],
["Tiki Barber","NYG",88,null,21,1860,9,5.2,"NYG · 1997-06"],
["Steven Jackson","STL",88,null,39,1528,13,4.5,"STL · 2004-15"],
["Edgerrin James","IND",88,null,32,1709,13,4.7,"IND · 1999-09"],
["Thomas Jones","NYJ",87,null,20,1402,14,4.4,"CHI/NYJ · 2000-11"],
["Priest Holmes","KC",88,null,31,1615,27,5.1,"KC · 2001-07"],
["Warrick Dunn","ATL",87,null,28,1106,8,4.5,"ATL · 1997-08"],
["Fred Taylor","JAX",87,null,28,1572,14,4.7,"JAX · 1998-08"],
["Jamal Lewis","BAL",89,null,31,2066,14,5.3,"BAL · 2000-09"],
["Kevin Jones","DET",85,null,31,1133,5,3.9,"DET · 2004-07"],
["Willie Parker","PIT",85,null,39,1494,4,4.4,"PIT · 2004-09"],
["Cadillac Williams","TB",85,null,24,1178,6,4.7,"TB · 2005-10"],
["Ronnie Brown","MIA",85,null,23,1008,9,4.2,"MIA · 2005-11"],
["Ryan Grant","GB",84,null,25,956,4,4.3,"GB · 2007-12"],
],
3:[
["Earl Campbell","HOU",87,null,34,1934,19,4.7,"HOU · 1978-85"],
["DeMarco Murray","DAL",85,null,29,1845,13,4.7,"DAL/TEN · 2011-17"],
["Tony Dorsett","DAL",85,null,33,1646,14,5.1,"DAL · 1977-88"],
["Bucky Irving","TB",85,null,7,1122,8,5.4,null],
["Joe Mixon","HOU",84,null,28,1034,11,4.8,null],
["Jerome Bettis","PIT",84,null,36,1665,7,4.4,"PIT · 1993-05"],
["Kyren Williams","LAR",84,null,23,1144,12,4.9,null],
["JK Dobbins","DEN",84,null,27,1058,9,5.2,null],
["Quinshon Judkins","CLE",84,null,10,1051,10,4.6,null],
["Kenneth Walker","SEA",84,null,9,1050,9,4.6,null],
["Travis Etienne","JAX",84,null,1,1033,11,5.1,null],
["Tony Pollard","TEN",83,null,20,1005,6,4.3,null],
["Aaron Jones","MIN",83,null,33,1040,7,4.7,null],
["David Montgomery","DET",83,null,5,775,13,4.1,null],
["Isiah Pacheco","KC",81,null,10,935,7,4.7,null],
["Rhamondre Stevenson","NE",81,null,38,1040,5,4.3,null],
["Jamaal Charles","KC",80,null,25,1509,12,6.4,"KC · 2008-16"],
["Miles Sanders","CAR",82,null,26,1269,11,4.5,"PHI/CAR · 2019-23"],
["D'Andre Swift","CHI",82,null,29,1049,5,4.6,"DET/PHI · 2020-24"],
["Raheem Mostert","MIA",82,null,31,1012,8,5.0,"SF/MIA · 2015-24"],
["Zeke Elliott","DAL",82,null,21,1357,12,4.1,"DAL · 2016-23"],
["Leonard Fournette","TB",82,null,27,990,8,4.3,"JAX/TB · 2017-22"],
["Rex Burkhead","HOU",80,null,33,421,8,4.3,"NE/HOU · 2013-21"],
["Sony Michel","LAR",80,null,4,912,7,4.4,"NE/LAR · 2018-21"],
["Giovani Bernard","TB",80,null,25,644,4,4.2,"CIN/TB · 2013-21"],
["Chase Edmonds","TB",79,null,2,311,2,4.4,"ARI/MIA · 2018-22"],
["Marlon Mack","IND",79,null,25,908,9,4.2,"IND · 2017-20"],
["Mark Ingram","BAL",82,null,22,1124,15,4.4,"NO/BAL · 2011-22"],
["Lamar Miller","HOU",81,null,26,1144,5,4.5,"MIA/HOU · 2012-19"],
["CJ Spiller","BUF",81,null,28,1211,6,5.2,"BUF · 2010-15"],
["Isaiah Crowell","NYJ",80,null,34,1037,8,4.4,"CLE/NYJ · 2014-18"],
["Darius Guice","WAS",79,null,25,245,2,4.5,"WAS · 2018-20"],
["Stevan Ridley","NE",79,null,22,1263,12,4.4,"NE · 2011-14"],
["Frank Pollard","PIT",79,null,21,608,4,4.1,"PIT · 1980-88"],
["Larry Johnson","KC",82,null,27,1789,20,5.0,"KC · 2003-09"],
["Willis McGahee","BAL",81,null,23,1207,7,3.9,"BUF/BAL · 2003-13"],
["Ahmad Bradshaw","NYG",80,null,44,1235,9,4.5,"NYG · 2007-13"],
],
2:[
["Kareem Hunt","KC",74,null,29,534,5,4.1,null],
["Gus Edwards","FA",74,null,35,615,4,4.3,null],
["Najee Harris","LAC",73,null,22,1035,6,4.0,null],
["Jaylen Warren","PIT",73,null,30,564,2,5.0,null],
["Devin Singletary","NYG",72,null,26,744,4,4.0,null],
["Rachaad White","TB",72,null,1,990,5,4.3,null],
["Ezekiel Elliott","DAL",71,null,21,642,3,3.8,null],
["Zack Moss","CIN",71,null,31,794,5,4.3,null],
["Latavius Murray","FA",70,null,28,1066,6,4.4,null],
["Dameon Pierce","HOU",70,null,31,561,4,3.9,null],
["AJ Dillon","PHI",69,null,28,417,3,3.9,null],
["JaMycal Hasty","JAX",73,null,22,289,2,4.1,"SF/JAX · 2020-22"],
["Tony Jones Jr.","NO",72,null,39,348,2,4.0,"NO · 2020-22"],
["Ty Montgomery","NYJ",72,null,88,322,2,4.2,"GB/NYJ · 2015-19"],
["Patrick Laird","MIA",71,null,42,158,1,3.7,"MIA · 2019-22"],
["Justice Hill","BAL",72,null,32,280,3,4.1,"BAL · 2019-23"],
["Salvon Ahmed","MIA",71,null,26,390,2,4.3,"MIA · 2020-22"],
["Jaret Patterson","WAS",70,null,32,232,2,3.8,"WAS · 2021-22"],
["Dontrell Hilliard","TEN",71,null,41,350,2,4.8,"CLE/TEN · 2018-22"],
["James Robinson","JAX",73,null,23,1070,10,4.5,"JAX · 2020-22"],
["Tevin Coleman","SF",73,null,26,876,8,4.6,"ATL/SF · 2015-21"],
["Peyton Barber","WAS",72,null,25,546,6,3.8,"TB/WAS · 2016-21"],
["Duke Johnson","HOU",72,null,29,410,1,4.0,"CLE/HOU · 2015-21"],
["Matt Breida","BUF",73,null,22,814,3,5.3,"SF/BUF · 2017-21"],
["Javonte Williams","DEN",74,null,33,903,7,4.1,"DEN · 2021-24"],
["Khalil Herbert","CHI",74,null,24,739,5,4.5,"CHI · 2021-23"],
["Kene Nwangwu","MIN",70,null,28,274,2,5.1,"MIN · 2021-23"],
["Tyler Allgeier","ATL",73,null,25,1035,7,4.3,"ATL · 2022-24"],
["Chuba Hubbard","CAR",74,null,30,938,8,4.4,"CAR · 2021-24"],
],
1:[
["Cam Akers","MIN",64,null,3,293,2,3.4,null],
["Clyde Edwards-Helaire","KC",63,null,25,803,4,4.4,null],
["Samaje Perine","CIN",63,null,25,391,2,3.8,null],
["Hassan Haskins","LAC",62,null,27,348,2,3.6,null],
["D'Onta Foreman","FA",62,null,21,914,5,4.5,null],
["Roschon Johnson","CHI",61,null,30,444,3,3.8,null],
["Craig Reynolds","DET",60,null,46,176,1,3.3,null],
["Boston Scott","FA",59,null,35,754,7,4.6,null],
["Malcolm Brown","FA",58,null,34,198,1,3.4,null],
["Mike Boone","FA",57,null,26,186,1,3.2,null],
["Jaquizz Rodgers","ATL",63,null,32,590,2,3.8,"ATL · 2011-15"],
["Damaris Johnson","PHI",62,null,18,0,0,0.0,"PHI · 2012-13"],
["Adam Hayward","TB",61,null,45,0,0,0.0,"TB · 2007-12"],
["Eric Tomlinson","NYJ",61,null,85,0,0,0.0,"NYJ · 2015-19"],
["Patrick DiMarco","BUF",61,null,42,97,1,3.5,"ATL/BUF · 2012-18"],
["Spencer Ware","KC",62,null,32,921,3,4.0,"KC · 2015-19"],
["Stevan Ridley","DET",62,null,22,327,3,3.9,"DET · 2015"],
["Tauren Gipson","CLE",60,null,30,0,0,0.0,"CLE · 2018-19"],
["Lorenzo Taliaferro","BAL",60,null,42,226,4,3.6,"BAL · 2014-16"],
["George Atkinson III","PIT",59,null,23,176,1,3.3,"OAK/PIT · 2014-16"],
["Wendell Smallwood","PHI",60,null,28,381,2,3.8,"PHI · 2016-19"],
["Benny Cunningham","CHI",60,null,33,203,1,3.6,"STL/CHI · 2013-17"],
["Juwan Thompson","DEN",59,null,36,130,0,3.5,"DEN · 2014-15"],
["De'Angelo Henderson","DEN",59,null,33,207,1,4.2,"DEN · 2017-18"],
["Jonathan Williams","IND",59,null,31,336,4,4.2,"BUF/IND · 2016-19"],
],
};

const WR = {
5:[
["Jerry Rice","SF",99,null,80,1848,17,89,"SF · 1985-04"],
["Randy Moss","MIN",98,null,84,1632,23,96,"MIN/NE · 1998-12"],
["Calvin Johnson","DET",97,null,81,1964,5,84,"DET · 2007-15"],
["Justin Jefferson","MIN",97,4241389,18,1533,10,103,null],
["Ja'Marr Chase","CIN",97,4361579,1,1708,17,100,null],
["Jaxon Smith-Njigba","SEA",97,null,11,1793,10,119,null],
["Tyreek Hill","MIA",96,null,10,1799,13,119,null],
["CeeDee Lamb","DAL",96,null,88,1749,12,135,null],
["Puka Nacua","LAR",95,null,17,1486,6,105,null],
["Julio Jones","ATL",95,null,11,1871,8,136,"ATL · 2011-22"],
["Terrell Owens","SF",95,null,81,1451,16,95,"SF/DAL · 1996-10"],
],
4:[
["Amon-Ra St. Brown","DET",93,null,14,1515,10,119,null],
["Larry Fitzgerald","ARI",93,null,11,1431,12,107,"ARI · 2004-20"],
["AJ Brown","PHI",93,null,11,1457,11,106,null],
["Cris Carter","MIN",92,null,80,1371,17,122,"MIN · 1987-02"],
["Davante Adams","LAR",92,null,17,1553,14,123,null],
["Michael Irvin","DAL",91,null,88,1603,10,111,"DAL · 1988-99"],
["Andre Johnson","HOU",91,null,80,1598,9,115,"HOU · 2003-14"],
["Nico Collins","HOU",91,null,12,1297,8,80,null],
["Stefon Diggs","NE",91,null,8,1429,11,108,null],
["Brian Thomas Jr.","JAX",90,null,7,1282,10,87,null],
["Tee Higgins","CIN",90,null,5,1024,5,73,null],
["DK Metcalf","PIT",90,null,4,1114,10,66,null],
["Malik Nabers","NYG",90,null,1,1204,7,109,null],
["Mike Evans","TB",90,null,13,1255,13,79,null],
["Brandon Aiyuk","SF",89,null,11,1342,7,75,null],
["George Pickens","DAL",89,null,3,1198,9,74,null],
["Reggie Wayne","IND",89,null,87,1510,10,111,"IND · 2001-14"],
["Chad Johnson","CIN",89,null,85,1440,9,97,"CIN · 2001-10"],
["Marvin Harrison","IND",89,null,88,1722,15,143,"IND · 1996-08"],
["Torry Holt","STL",91,null,88,1696,12,88,"STL · 1999-08"],
["Isaac Bruce","STL",90,null,80,1781,13,84,"STL · 1994-07"],
["Tim Brown","LV",90,null,81,1408,9,89,"LV · 1988-04"],
["Herman Moore","DET",89,null,84,1686,14,123,"DET · 1991-01"],
["Rod Smith","DEN",89,null,80,1602,12,113,"DEN · 1994-06"],
["Keyshawn Johnson","TB",89,null,19,1422,8,106,"TB · 1996-06"],
["Eric Moulds","BUF",89,null,80,1326,10,100,"BUF · 1996-05"],
["Laveranues Coles","WAS",88,null,87,1204,9,90,"WAS/NYJ · 2000-08"],
["Plaxico Burress","NYG",88,null,17,1422,12,70,"PIT/NYG · 2000-08"],
["Donald Driver","GB",88,null,80,1295,9,86,"GB · 1999-12"],
["Wes Welker","NE",88,null,83,1569,11,112,"NE · 2007-12"],
["Wayne Chrebet","NYJ",88,null,80,1083,7,75,"NYJ · 1995-05"],
["Chris Chambers","MIA",87,null,84,1118,11,73,"MIA · 2001-07"],
["Ashley Lelie","DEN",86,null,80,1084,7,47,"DEN · 2002-07"],
["Drew Bennett","TEN",86,null,80,1247,11,80,"TEN · 2001-06"],
["Santana Moss","WAS",86,null,16,1483,9,84,"WAS · 2005-14"],
["Patrick Crayton","DAL",86,null,14,1110,8,64,"DAL · 2004-10"],
["Deion Branch","NE",86,null,83,998,6,78,"NE · 2002-10"],
["Marcus Colston","NO",87,null,12,1177,11,93,"NO · 2006-15"],
["Vincent Jackson","TB",87,null,83,1384,9,72,"SD/TB · 2005-14"],
["Sidney Rice","SEA",86,null,18,1312,8,83,"MIN/SEA · 2007-13"],
["Anquan Boldin","SF",88,null,81,1402,11,102,"ARI/BAL · 2003-16"],
["Lee Evans","BUF",86,null,83,1292,8,58,"BUF · 2004-11"],
["Hank Baskett","PHI",85,null,84,440,4,35,"PHI · 2006-10"],
],
3:[
["Deebo Samuel","WAS",87,null,1,1127,9,73,null],
["Garrett Wilson","NYJ",87,null,17,1042,4,95,null],
["Drake London","ATL",87,null,5,1271,10,92,null],
["Ladd McConkey","LAC",86,null,15,1149,7,82,null],
["DeVonta Smith","PHI",85,null,6,1066,7,81,null],
["Jaylen Waddle","MIA",85,null,17,1014,4,72,null],
["Chris Olave","NO",85,null,12,1353,8,87,null],
["Cooper Kupp","SEA",84,null,10,1947,16,145,null],
["Zay Flowers","BAL",84,null,4,1059,4,74,null],
["DeAndre Hopkins","BAL",83,15818,10,1572,11,115,null],
["Steve Smith Sr.","CAR",82,null,89,1563,7,103,"CAR · 2001-16"],
["Antonio Brown","PIT",82,null,84,1834,15,136,"PIT · 2010-21"],
["Hines Ward","PIT",81,null,86,1329,12,112,"PIT · 1998-11"],
["Julian Edelman","NE",80,null,11,1117,6,100,"NE · 2009-20"],
["TY Hilton","IND",80,null,13,1448,6,91,"IND · 2012-21"],
["Alshon Jeffery","PHI",84,null,17,1421,10,80,"CHI/PHI · 2012-20"],
["Golden Tate","NYG",84,null,15,1331,5,99,"DET/NYG · 2010-19"],
["Danny Amendola","NE",83,null,80,786,6,60,"NE · 2013-17"],
["Randall Cobb","GB",83,null,18,1287,12,91,"GB · 2011-22"],
["Hakeem Nicks","NYG",83,null,88,1052,11,79,"NYG · 2009-14"],
["Victor Cruz","NYG",83,null,80,1536,9,86,"NYG · 2010-16"],
["Jermaine Kearse","NYJ",82,null,15,810,5,64,"SEA/NYJ · 2012-18"],
["Kendall Wright","TEN",82,null,13,1079,4,94,"TEN · 2012-17"],
["Michael Floyd","ARI",82,null,15,1041,9,65,"ARI · 2012-17"],
["Dez Bryant","DAL",84,null,88,1320,16,88,"DAL · 2010-17"],
["Pierre Garcon","WAS",83,null,88,1346,5,113,"IND/WAS · 2008-17"],
["Mohamed Sanu","ATL",82,null,12,838,5,67,"CIN/ATL · 2012-21"],
["Kendall Wright","TEN",81,null,13,1079,4,94,"TEN · 2012-17"],
["Robbie Anderson","CAR",81,null,11,1005,5,95,"NYJ/CAR · 2016-21"],
["Josh Gordon","CLE",82,null,12,1646,9,87,"CLE · 2012-19"],
["Mose Frazier","GB",80,null,11,0,0,0,"GB · 2016"],
["John Brown","BUF",81,null,15,1060,7,72,"ARI/BUF · 2014-21"],
["Donte Moncrief","PIT",80,null,12,728,6,59,"IND/PIT · 2014-19"],
["Phillip Dorsett","NE",80,null,14,492,5,43,"IND/NE · 2015-20"],
["Allen Hurns","DAL",80,null,17,1031,10,64,"JAX/DAL · 2014-19"],
["Corey Coleman","CLE",80,null,19,718,5,33,"CLE · 2016-18"],
["David Gettis","CAR",80,null,17,508,3,25,"CAR · 2010-11"],
["Andre Roberts","BUF",80,null,19,606,3,41,"ARI/BUF · 2010-19"],
],
2:[
["Rashee Rice","KC",78,null,4,938,7,79,null],
["Terry McLaurin","WAS",78,null,17,1023,6,76,null],
["Keenan Allen","LAC",78,null,13,1393,8,108,null],
["Amari Cooper","FA",77,null,18,1250,5,72,null],
["Jakobi Meyers","LV",77,null,16,807,8,71,null],
["Jerry Jeudy","CLE",77,null,3,1229,4,90,null],
["Calvin Ridley","TEN",76,null,0,1016,6,76,null],
["Tyler Lockett","FA",76,null,16,894,6,79,null],
["Brandin Cooks","NO",76,null,3,1173,8,81,null],
["Michael Pittman","IND",76,null,11,1152,4,109,null],
["Diontae Johnson","FA",75,null,18,1022,3,84,null],
["Tavon Austin","LAR",78,null,11,509,4,54,"LAR · 2013-18"],
["Paul Richardson","WAS",77,null,10,703,7,44,"SEA/WAS · 2014-20"],
["Quincy Enunwa","NYJ",77,null,81,857,4,58,"NYJ · 2014-19"],
["Marquise Goodwin","SF",77,null,11,965,6,28,"SF · 2017-20"],
["Cody Latimer","NYG",76,null,13,413,4,26,"DEN/NYG · 2014-19"],
["J.J. Nelson","ARI",76,null,13,568,5,30,"ARI · 2015-18"],
["Chad Williams","ARI",76,null,17,213,2,16,"ARI · 2017-19"],
["Jaydon Mickens","JAX",75,null,14,202,1,19,"JAX · 2016-19"],
["Dede Westbrook","JAX",77,null,12,717,5,66,"JAX · 2017-20"],
["Parris Campbell","IND",77,null,15,727,4,62,"IND · 2019-23"],
["Josh Doctson","WAS",77,null,18,502,5,37,"WAS · 2016-19"],
["Corey Davis","NYJ",77,null,84,984,8,65,"TEN/NYJ · 2017-21"],
["Albert Wilson","MIA",76,null,15,607,5,40,"KC/MIA · 2014-19"],
["Chris Moore","HOU",75,null,10,401,3,28,"BAL/HOU · 2016-21"],
["Equanimeous St. Brown","CHI",76,null,19,289,1,25,"GB/CHI · 2018-22"],
["Jalen Reagor","MIN",75,null,18,299,1,23,"PHI/MIN · 2020-22"],
["Nelson Agholor","NE",76,null,15,896,8,57,"PHI/LV · 2015-21"],
["Kendrick Bourne","NE",76,null,84,800,5,55,"SF/NE · 2017-22"],
["Marquez Callaway","NO",75,null,12,698,6,46,"NO · 2020-22"],
["Amon-Ra St. Brown","DET",75,null,14,912,5,90,"DET · 2021 rookie"],
["N'Keal Harry","CHI",74,null,15,598,6,39,"NE/CHI · 2019-22"],
["Denzel Mims","NYJ",74,null,11,490,3,38,"NYJ · 2020-22"],
],
1:[
["Romeo Doubs","GB",70,null,87,607,4,53,null],
["Chris Godwin","TB",69,null,14,1023,2,86,null],
["Curtis Samuel","BUF",68,null,1,851,6,77,null],
["Darnell Mooney","ATL",68,null,1,524,4,49,null],
["KJ Osborn","FA",68,null,17,431,2,42,null],
["Mecole Hardman","FA",67,null,12,303,5,27,null],
["Kalif Raymond","DET",67,null,11,405,2,38,null],
["Demarcus Robinson","SF",67,null,15,412,2,37,null],
["Marquez Valdes-Scantling","FA",66,null,11,360,4,32,null],
["Josh Reynolds","FA",66,null,8,418,2,39,null],
["Tutu Atwell","LAR",65,null,5,483,3,42,null],
["David Moore","CAR",69,null,13,570,6,27,"SEA/CAR · 2017-21"],
["Keelan Cole","NYJ",69,null,84,748,4,64,"JAX/NYJ · 2017-21"],
["DeAndrew White","HOU",68,null,14,120,0,13,"HOU · 2014-15"],
["Cody Core","CIN",68,null,16,232,1,18,"CIN · 2016-18"],
["Reggie Davis","GB",67,null,11,92,1,10,"GB · 2017-18"],
["Tanner McEvoy","SEA",67,null,18,100,1,9,"SEA · 2015-17"],
["River Cracraft","MIA",66,null,10,200,2,19,"MIA · 2016-20"],
["De'Anthony Thomas","KC",67,null,13,233,1,22,"KC · 2014-19"],
["Krishawn Hogan","IND",66,null,17,150,1,14,"IND · 2017-18"],
["Damion Ratley","CLE",66,null,13,318,1,22,"CLE · 2018-20"],
["Reggie Begelton","GB",65,null,11,0,0,0,"GB · 2019"],
["Rashard Higgins","CLE",67,null,81,572,4,38,"CLE · 2016-21"],
["Travis Rudolph","NYG",66,null,15,211,1,18,"NYG · 2017-19"],
["Krishawn Hogan","IND",65,null,17,150,1,14,"IND · 2017-18"],
["Gehrig Dieter","KC",65,null,10,0,0,0,"KC · 2017-19"],
["Marcus Leak","PHI",64,null,81,0,0,0,"PHI · 2007"],
["C.J. Board","NYG",65,null,18,238,1,20,"JAX/NYG · 2019-21"],
["Alex Erickson","CIN",65,null,12,462,2,40,"CIN · 2016-21"],
],
};

const TE = {
5:[
["Rob Gronkowski","NE",99,null,87,1327,17,90,"NE/TB · 2010-21"],
["Travis Kelce","KC",97,15847,87,984,5,93,null],
["Tony Gonzalez","KC",97,null,88,1325,10,102,"KC/ATL · 1997-13"],
["George Kittle","SF",96,null,85,1020,6,65,null],
["Shannon Sharpe","DEN",94,null,84,1107,10,72,"DEN · 1990-03"],
["Brock Bowers","LV",93,null,89,1194,5,112,null],
["Mark Andrews","BAL",93,null,89,1361,11,107,null],
["Trey McBride","ARI",93,null,85,1146,8,111,null],
],
4:[
["Kellen Winslow Sr.","SD",92,null,80,1290,10,89,"SD · 1979-87"],
["Dallas Goedert","PHI",90,null,88,808,4,59,null],
["Antonio Gates","SD",89,null,85,1101,13,81,"SD · 2003-18"],
["Sam LaPorta","DET",88,null,87,889,10,86,null],
["Kyle Pitts","ATL",87,null,8,1026,1,68,null],
["Tucker Kraft","GB",87,null,85,675,7,55,null],
["Ozzie Newsome","CLE",86,null,82,1001,5,89,"CLE · 1978-90"],
["TJ Hockenson","MIN",86,null,87,914,6,95,null],
["David Njoku","CLE",86,null,85,882,6,81,null],
["Evan Engram","DEN",85,null,1,963,4,114,null],
["Zach Ertz","WAS",85,null,86,1163,8,116,null],
["Mike Ditka","CHI",85,null,89,1076,12,75,"CHI · 1961-72"],
["Jeremy Shockey","NYG",89,null,80,1062,10,74,"NYG · 2002-08"],
["Chris Cooley","WAS",88,null,47,1084,8,83,"WAS · 2004-12"],
["Ben Coates","NE",88,null,87,1174,10,84,"NE · 1991-99"],
["Jermaine Wiggins","NE",87,null,84,466,4,41,"NE · 2000-04"],
["Heath Miller","PIT",87,null,83,816,6,66,"PIT · 2005-15"],
["Todd Heap","BAL",87,null,86,855,6,73,"BAL · 2001-11"],
["Marcus Pollard","IND",86,null,87,510,6,44,"IND · 1995-06"],
["Bubba Franks","GB",86,null,88,672,7,49,"GB · 2000-06"],
["Daniel Graham","NE",86,null,82,730,9,51,"NE · 2002-06"],
["Visanthe Shiancoe","MIN",85,null,81,596,8,52,"MIN · 2006-11"],
["Bo Scaife","TEN",85,null,84,548,4,55,"TEN · 2005-10"],
["Ben Watson","NE",85,null,84,910,7,68,"NE/NO · 2004-18"],
["Jace Amaro","NYJ",84,null,81,345,2,38,"NYJ · 2014-18"],
["Virgil Green","DEN",84,null,85,285,3,27,"DEN · 2011-18"],
["Coby Fleener","NO",84,null,82,774,8,54,"IND/NO · 2012-17"],
["Brandon Myers","NYG",84,null,88,806,4,79,"LV/NYG · 2008-13"],
["Julius Thomas","JAX",85,null,89,984,12,65,"DEN/JAX · 2011-17"],
["Dwayne Allen","NE",84,null,83,437,4,33,"IND/NE · 2012-18"],
],
3:[
["Jake Ferguson","DAL",84,null,87,761,5,71,null],
["Isaiah Likely","BAL",83,null,80,530,7,50,null],
["Hunter Henry","NE",83,null,85,524,4,49,null],
["Cole Kmet","CHI",82,null,85,719,5,71,null],
["Darren Waller","MIA",82,null,83,1196,9,107,null],
["Jason Witten","DAL",82,null,82,1215,9,111,"DAL · 2003-20"],
["Vernon Davis","SF",81,null,85,965,13,78,"SF · 2006-19"],
["Tyler Higbee","LAR",80,null,89,617,3,56,null],
["Chig Okonkwo","TEN",80,null,85,578,4,55,null],
["Jimmy Graham","NO",80,null,80,1215,16,86,null],
["Dallas Clark","IND",80,null,44,1106,10,100,"IND · 2003-13"],
["Greg Olsen","CAR",79,null,88,1104,8,77,"CAR · 2007-20"],
["Dalton Kincaid","BUF",79,null,86,673,2,73,null],
["Jordan Reed","WAS",78,null,86,952,11,87,"WAS · 2013-20"],
["Juwan Johnson","NO",77,null,83,439,4,45,null],
["Charles Clay","BUF",82,null,42,762,6,57,"MIA/BUF · 2011-19"],
["Scott Chandler","NE",81,null,84,454,6,38,"DAL/NE · 2009-15"],
["Tyler Eifert","JAX",82,null,85,615,9,52,"CIN/JAX · 2013-19"],
["Luke Willson","SEA",80,null,82,330,4,28,"SEA · 2013-18"],
["Clive Walford","LV",79,null,88,376,4,32,"LV · 2015-18"],
["Jeff Cumberland","NYJ",79,null,85,530,5,37,"NYJ · 2010-15"],
["Lance Kendricks","GB",79,null,84,397,4,35,"STL/GB · 2011-18"],
["Richard Rodgers","GB",79,null,82,510,8,45,"GB · 2014-20"],
["Michael Hoomanawanui","NE",78,null,47,289,4,23,"STL/NE · 2010-15"],
["Rhett Ellison","NYG",78,null,85,240,2,24,"MIN/NYG · 2012-19"],
["Lee Smith","BUF",78,null,85,197,3,18,"BUF/LV · 2011-21"],
["Jacob Tamme","ATL",78,null,84,404,4,40,"IND/ATL · 2008-16"],
["Niles Paul","WAS",77,null,84,341,3,31,"WAS · 2011-17"],
["Weslye Saunders","PIT",77,null,86,183,2,16,"PIT · 2011-14"],
["Jim Dray","SF",77,null,80,141,1,14,"SF · 2010-14"],
["Ladarius Green","PIT",80,null,88,429,4,42,"SD/PIT · 2012-16"],
["Vance McDonald","PIT",80,null,89,452,4,39,"PIT · 2013-19"],
["Eric Ebron","PIT",81,null,85,615,13,56,"DET/IND · 2014-21"],
["Mycah Pittman","WAS",79,null,80,0,0,0,"WAS · 2023"],
["Geoff Swaim","TEN",78,null,87,341,3,34,"DAL/TEN · 2015-21"],
],
2:[
["Noah Gray","KC",75,null,83,407,4,41,null],
["Mike Gesicki","CIN",74,null,88,375,2,43,null],
["Will Dissly","LAC",74,null,89,367,3,39,null],
["Cade Otton","TB",74,null,88,600,4,59,null],
["Hayden Hurst","FA",73,null,81,278,2,31,null],
["Tyler Conklin","LAC",73,null,83,552,3,58,null],
["Durham Smythe","CHI",73,null,81,278,1,31,null],
["Jordan Akins","FA",72,null,88,291,2,33,null],
["Brevin Jordan","HOU",72,null,9,311,2,36,null],
["Adam Trautman","DEN",72,null,87,244,1,28,null],
["Kevin Brock","IND",74,null,87,0,0,0,"IND · 2020"],
["Nick Boyle","BAL",74,null,86,223,1,22,"BAL · 2015-21"],
["Luke Farrell","JAX",73,null,89,198,2,19,"JAX · 2021-23"],
["Harry Douglas","TEN",73,null,83,160,1,16,"TEN · 2015-16"],
["Anthony Firkser","TEN",73,null,86,360,3,35,"TEN · 2018-21"],
["Matt Lengel","CIN",72,null,47,183,2,17,"CIN · 2016-19"],
["Marcel Jensen","BUF",72,null,83,0,0,0,"BUF · 2016-17"],
["David Morgan","MIN",72,null,88,165,2,17,"MIN · 2016-18"],
["Marcus Baugh","CLE",71,null,84,231,2,24,"CLE · 2018-19"],
["Kevin Rader","PIT",71,null,88,89,1,9,"PIT · 2018-19"],
["Troy Niklas","ARI",71,null,87,159,1,14,"ARI · 2014-17"],
["Ryan Hewitt","CIN",71,null,45,115,1,12,"CIN · 2014-17"],
["Blake Jarwin","DAL",73,null,89,381,3,35,"DAL · 2017-21"],
["Kahale Warring","HOU",72,null,85,0,0,0,"HOU · 2019-21"],
["Josiah Deguara","GB",73,null,86,214,2,21,"GB · 2020-22"],
["Jeremy Sprinkle","DAL",72,null,87,228,2,23,"WAS/DAL · 2017-21"],
["Eric Saubert","DEN",71,null,88,156,2,16,"ATL/DEN · 2017-21"],
["Ross Dwelley","SF",71,null,82,198,3,21,"SF · 2018-21"],
["Daniel Brown","CHI",70,null,84,185,1,20,"CHI · 2012-17"],
],
1:[
["Josh Oliver","BAL",69,null,84,167,1,18,null],
["Donald Parham","FA",68,null,89,178,1,19,null],
["Jody Fortson","FA",67,null,88,189,2,19,null],
["Ryan Griffin","FA",67,null,84,142,1,16,null],
["Foster Moreau","NO",67,null,87,312,2,32,null],
["Pharaoh Brown","FA",67,null,86,134,0,14,null],
["MyCole Pruitt","FA",66,null,85,123,0,13,null],
["Nick Vannett","FA",66,null,81,156,1,17,null],
["Tanner Hudson","FA",66,null,88,147,0,16,null],
["Johnny Mundt","FA",65,null,86,178,1,19,null],
["Matt Lengel","FA",68,null,47,183,2,17,"FA"],
["Jake McGee","DEN",68,null,85,0,0,0,"DEN · 2015-17"],
["Ryan O'Malley","NYG",67,null,86,0,0,0,"NYG · 2015-16"],
["Brian Leonhardt","GB",67,null,83,0,0,0,"GB · 2015-16"],
["David Paulson","PIT",66,null,84,170,1,18,"PIT · 2012-14"],
["Evan Rodriguez","CHI",66,null,81,0,0,0,"CHI · 2013-15"],
["Michael Egnew","MIA",65,null,88,27,0,3,"MIA · 2012-14"],
["Tommy Streeter","CLE",65,null,86,0,0,0,"CLE · 2012-14"],
["Dion Sims","CHI",66,null,85,198,2,20,"MIA/CHI · 2013-17"],
["Derek Carrier","LV",65,null,86,234,3,22,"LV · 2016-20"],
["Sal Cannella","ARI",65,null,87,0,0,0,"ARI · 2019-20"],
["James O'Shaughnessy","JAX",66,null,80,290,3,30,"JAX · 2017-21"],
["Eric Tomlinson","NYJ",65,null,85,89,1,9,"NYJ · 2015-19"],
["Antony Auclair","TB",65,null,86,134,1,14,"TB · 2017-20"],
["Cole Wick","TB",64,null,85,0,0,0,"TB · 2017"],
],
};

/* ============================ CONSTANTS ============================ */
const POSITIONS = ["QB","RB","WR","WR","TE"];
const POOLS = { QB, RB, WR, TE };
const STAT_LABELS = { QB:["YDS","TD","RTG"], RB:["YDS","TD","YPC"], WR:["YDS","TD","REC"], TE:["YDS","TD","REC"] };
const POS_COLORS = { QB:"#F87171", RB:"#FB923C", WR:"#FBBF24", TE:"#4ADE80" };
const TIER_COLORS = { 5:"#F59E0B", 4:"#A78BFA", 3:"#60A5FA", 2:"#34D399", 1:"#9CA3AF" };
const VARIANCE = { 5:0.10, 4:0.13, 3:0.17, 2:0.22, 1:0.35 };
const CAP = 15;
const OPP_NAMES = ["Ironhawks","Marauders","Night Wolves","Sentinels","Vipers","Outlaws","Monarchs","Rhinos","Blizzard","Scorpions","Gladiators","Renegades","Mustangs","Krakens","Comets","Jackals","Juggernauts","Phantoms","Stallions","Cyclones"];
const PLAYOFF_ROUNDS = [
  { name:"Divisional Round", opp:74 },
  { name:"Conference Championship", opp:79 },
  { name:"Cap Bowl", opp:84 },
];

/* ============================ CHEMISTRY ============================ */

/* Legendary duos — the crown jewels. These fire for ANY pair regardless of team. */
const LEGENDARY_DUOS = {
  "Joe Montana|Jerry Rice":          { label:"Montana to Rice",     type:"legendary", bonus:0.09 },
  "Tom Brady|Rob Gronkowski":        { label:"Brady to Gronk",      type:"legendary", bonus:0.09 },
  "Peyton Manning|Marvin Harrison":  { label:"Manning to Harrison", type:"legendary", bonus:0.08 },
  "Peyton Manning|Reggie Wayne":     { label:"Manning to Wayne",    type:"legendary", bonus:0.07 },
  "Troy Aikman|Michael Irvin":       { label:"Aikman to Irvin",     type:"legendary", bonus:0.07 },
  "Patrick Mahomes|Travis Kelce":    { label:"Mahomes to Kelce",    type:"legendary", bonus:0.08 },
  "Joe Burrow|Ja'Marr Chase":        { label:"Burrow to Chase",     type:"legendary", bonus:0.07 },
  "Jalen Hurts|AJ Brown":            { label:"Hurts to AJ Brown",   type:"legendary", bonus:0.06 },
  "Jalen Hurts|DeVonta Smith":       { label:"Hurts to DeVonta",    type:"legendary", bonus:0.06 },
  "Dak Prescott|CeeDee Lamb":        { label:"Dak to CeeDee",       type:"legendary", bonus:0.06 },
  "Drew Brees|Jimmy Graham":         { label:"Brees to Graham",     type:"legendary", bonus:0.06 },
  "Aaron Rodgers|Davante Adams":     { label:"Rodgers to Adams",    type:"legendary", bonus:0.07 },
  "Steve Young|Jerry Rice":          { label:"Young to Rice",       type:"legendary", bonus:0.08 },
  "Dan Marino|Mark Clayton":         { label:"Marino Era",          type:"legendary", bonus:0.05 },
  "Lamar Jackson|Mark Andrews":      { label:"Lamar to Andrews",    type:"legendary", bonus:0.07 },
  "CJ Stroud|Nico Collins":          { label:"Stroud to Collins",   type:"legendary", bonus:0.05 },
};

function lookupDuo(a, b) {
  return LEGENDARY_DUOS[`${a.name}|${b.name}`] || LEGENDARY_DUOS[`${b.name}|${a.name}`] || null;
}

/* Tags for identity chemistry */
const PLAYER_TAGS = {
  "Lamar Jackson":["speed","rushing_qb"], "Jayden Daniels":["speed","rushing_qb"],
  "Josh Allen":["power","rushing_qb"], "Patrick Mahomes":["creator"],
  "Joe Burrow":["precision"], "Tom Brady":["precision","legend"],
  "Peyton Manning":["precision","legend"], "Joe Montana":["precision","legend"],
  "Drew Brees":["precision","legend"],
  "Derrick Henry":["power"], "Bijan Robinson":["speed"],
  "Jahmyr Gibbs":["speed"], "De'Von Achane":["speed"],
  "Christian McCaffrey":["versatile"], "Jerome Bettis":["power","legend"],
  "Bo Jackson":["power","speed","legend"], "Barry Sanders":["speed","legend"],
  "Walter Payton":["versatile","legend"], "LaDainian Tomlinson":["versatile","legend"],
  "Tyreek Hill":["speed"], "Justin Jefferson":["precision"],
  "Ja'Marr Chase":["speed"], "Amon-Ra St. Brown":["precision"],
  "CeeDee Lamb":["precision"], "AJ Brown":["power"],
  "DK Metcalf":["power"], "Cooper Kupp":["precision"],
  "Jerry Rice":["precision","legend"], "Randy Moss":["speed","legend"],
  "Marvin Harrison":["precision","legend"], "Reggie Wayne":["precision","legend"],
  "Michael Irvin":["power","legend"], "Julio Jones":["power","speed","legend"],
  "Rob Gronkowski":["power","legend"], "George Kittle":["power"],
  "Travis Kelce":["precision"], "Brock Bowers":["speed"],
  "Tony Gonzalez":["precision","legend"], "Shannon Sharpe":["speed","legend"],
};

function tagsFor(player) {
  const tags = new Set(PLAYER_TAGS[player.name] || []);
  if (player.era) tags.add("legend");
  if (player.score >= 95) tags.add("elite");
  return tags;
}

function getChemistry(picksOrRoster) {
  const roster = Array.isArray(picksOrRoster)
    ? picksOrRoster
    : Object.values(picksOrRoster || {});
  if (!roster.length) return { links:[], playerBonuses:{}, totalBonus:0 };

  const links = [];
  const playerBonuses = {};
  const seen = new Set();

  function addLink(a, b, label, bonus, type) {
    const key = b ? [a?.id, b?.id, label].sort().join("|") : label;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ key, a, b, label, bonus, type });
    const share = b ? bonus / 2 : bonus / roster.length;
    if (a) playerBonuses[a.id] = (playerBonuses[a.id] || 0) + share;
    if (b) playerBonuses[b.id] = (playerBonuses[b.id] || 0) + share;
  }

  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      const a = roster[i].player;
      const b = roster[j].player;
      if (!a || !b) continue;

      /* 1. Legendary duos — highest priority */
      const duo = lookupDuo(a, b);
      if (duo) { addLink(a, b, duo.label, duo.bonus, "legendary"); continue; }

      /* 2. Same-team passing stack (QB + pass-catcher) */
      const posA = a.pos, posB = b.pos;
      const isQB = posA === "QB" || posB === "QB";
      const isCatcher = ["WR","TE"].includes(posA) || ["WR","TE"].includes(posB);
      if (isQB && isCatcher && a.team === b.team && a.team !== "FA") {
        addLink(a, b, `${a.team} Passing Stack`, 0.06, "stack");
        continue;
      }

      /* 3. Same team (any two, non-QB-catcher) */
      if (a.team === b.team && a.team !== "FA") {
        addLink(a, b, `${a.team} Team Chemistry`, 0.025, "team");
        continue; // don't double-count with division
      }

      /* 4. Same division */
      if (sameDivision(a.team, b.team)) {
        addLink(a, b, "Division Rivals", 0.015, "division");
        // don't skip — can still trigger identity below via separate pairs
      }
    }
  }

  /* 5. Identity chemistry — scan all unique pairs once more for tags */
  const identityPairs = new Set();
  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      const a = roster[i].player, b = roster[j].player;
      if (!a || !b) continue;
      const key = [a.id, b.id].sort().join("|");
      if (identityPairs.has(key)) continue;
      identityPairs.add(key);
      const at = tagsFor(a), bt = tagsFor(b);
      if (at.has("speed") && bt.has("speed"))       addLink(a, b, "Speed Identity",    0.02, "identity");
      if (at.has("power") && bt.has("power"))       addLink(a, b, "Bully-Ball Identity", 0.02, "identity");
      if (at.has("precision") && bt.has("precision")) addLink(a, b, "Timing Offense",  0.025, "identity");
      if (at.has("legend") && bt.has("legend"))     addLink(a, b, "Legend Locker Room", 0.015, "era");
    }
  }

  /* 6. Balanced offense — needs quality at every spot */
  const qb  = roster.find((r) => r.player.pos === "QB");
  const rb  = roster.find((r) => r.player.pos === "RB");
  const wrs = roster.filter((r) => r.player.pos === "WR");
  const te  = roster.find((r) => r.player.pos === "TE");
  if (qb?.player.score >= 83 && rb?.player.score >= 83
      && wrs.some((r) => r.player.score >= 85) && te?.player.score >= 82) {
    addLink(null, null, "Balanced Offense", 0.03, "roster");
    roster.forEach((r) => { playerBonuses[r.player.id] = (playerBonuses[r.player.id]||0) + 0.006; });
  }

  return { links, playerBonuses, totalBonus: Math.min(0.22, links.reduce((a,l) => a + l.bonus, 0)) };
}

function getPotentialChemistry(player, picks) {
  const picked = Object.values(picks || {});
  if (!picked.length) return [];
  const fakeRoster = [...picked, { player, price:1 }];
  return getChemistry(fakeRoster).links.filter(
    (l) => l.a?.id === player.id || l.b?.id === player.id
  );
}

/* Chemistry chip display label */
function chemLabel(link) {
  if (link.type === "legendary") return { icon:"⚡", text:"LEGENDARY" };
  if (link.type === "stack")     return { icon:"🔗", text:"STACK BOOST" };
  if (link.type === "team")      return { icon:"🏟", text:"TEAM CHEM" };
  if (link.type === "division")  return { icon:"🗺", text:"DIVISION" };
  if (link.type === "identity")  return { icon:"✨", text:"IDENTITY" };
  if (link.type === "era")       return { icon:"🏛", text:"LEGENDS" };
  if (link.type === "roster")    return { icon:"⚖️", text:"BALANCED" };
  return { icon:"🔗", text:"CHEM" };
}

/* ============================ HELPERS ============================ */
const toPlayer = (arr, pos) => ({
  name:arr[0], team:arr[1], score:arr[2], espnId:arr[3], jersey:arr[4],
  s1:arr[5], s2:arr[6], s3:arr[7], era:arr[8], pos, id:pos+"·"+arr[0],
});
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const fmtNum  = (n) => (typeof n === "number" && n >= 1000 ? n.toLocaleString() : String(n));
const buzz    = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch {} };
const shortName = (name) => {
  if (name.length <= 12) return name;
  const p = name.split(" ");
  return p.length < 2 ? name : `${p[0][0]}. ${p.slice(1).join(" ")}`;
};

function gauss() {
  let u=0, v=0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

function buildBoard(prices, pickedIds) {
  const board = Array.from({length:5}, () => Array(5).fill(null));
  for (let c=0; c<5; c++) {
    const pos = POSITIONS[c];
    const usedInCol = new Set();
    for (let r=0; r<5; r++) {
      const tier = prices[r];
      let pool = POOLS[pos][tier].filter((p) => !usedInCol.has(p[0]) && !pickedIds.has(pos+"·"+p[0]));
      if (!pool.length) pool = POOLS[pos][tier].filter((p) => !usedInCol.has(p[0]));
      if (!pool.length) pool = POOLS[pos][tier];
      const pick = pool[Math.floor(Math.random()*pool.length)];
      usedInCol.add(pick[0]);
      board[r][c] = toPlayer(pick, pos);
    }
  }
  return board;
}

function genPrices(maxAffordable) {
  const target = Array.from({length:5}, () => randInt(1,5));
  const cap = Math.max(1, Math.min(5, maxAffordable));
  if (!target.some((p) => p <= cap)) target[randInt(0,4)] = randInt(1, cap);
  return target;
}

function projectedWins(roster, chemistry) {
  const avg = roster.reduce((a,r) => a + r.player.score, 0) / 5;
  const raw = 0.403*avg - 19.9 + chemistry.totalBonus*9;
  return Math.max(1, Math.min(18.5, Math.round(raw*2)/2));
}

function gradeFor(wins) {
  if (wins===20) return { label:"Perfect Season 🏆", color:"#F59E0B" };
  if (wins>=18)  return { label:"Dynasty Material 🔥", color:"#A78BFA" };
  if (wins>=15)  return { label:"Dominant Squad 💪",   color:"#60A5FA" };
  if (wins>=12)  return { label:"Playoff Bound",        color:"#2DD4BF" };
  if (wins>=10)  return { label:"Winning Record",       color:"#9CA3AF" };
  if (wins>=7)   return { label:"Below .500",           color:"#F97316" };
  if (wins>=4)   return { label:"Dumpster Fire 💀",     color:"#EF4444" };
  return { label:"Historically Bad 😂", color:"#EF4444" };
}

/* ============================ TEAM REPORT ============================ */
function getTeamReport(roster, chemistry) {
  if (!roster) return null;
  const byPos = roster.reduce((acc,r) => { (acc[r.player.pos]||=[]).push(r); return acc; }, {});
  const avg = roster.reduce((a,r) => a + r.player.score, 0) / roster.length;
  const qb  = byPos.QB?.[0], rb = byPos.RB?.[0];
  const wrs = byPos.WR || [], te = byPos.TE?.[0];
  const strengths=[], weaknesses=[];

  if (qb?.player.score >= 92)        strengths.push("Elite quarterback play");
  else if (qb?.player.score < 80)    weaknesses.push("QB is a question mark");
  if (rb?.player.score >= 90)        strengths.push("Feature-back rushing attack");
  else if (rb?.player.score < 78)    weaknesses.push("Thin run game");
  const wrAvg = wrs.reduce((a,r) => a+r.player.score,0)/Math.max(1,wrs.length);
  if (wrAvg >= 90)                   strengths.push("Dangerous receiver room");
  else if (wrAvg < 80)               weaknesses.push("Receivers may struggle");
  if (te?.player.score >= 90)        strengths.push("Mismatch TE weapon");
  else if (te?.player.score < 78)    weaknesses.push("Limited TE impact");
  if (chemistry.links.length >= 3)   strengths.push("Strong roster chemistry");
  else if (chemistry.links.length)   strengths.push("Chemistry boost active");
  else                               weaknesses.push("No chemistry active");
  if (avg >= 91)                     strengths.push("Top-end roster talent");
  if (avg < 83)                      weaknesses.push("Overall talent thin");
  const legends = roster.filter((r) => r.player.era).length;
  if (legends >= 3) { strengths.push("Legend upside"); weaknesses.push("Durability risk"); }
  if (roster.filter((r) => r.price<=2).length >= 3) weaknesses.push("Too many budget starters");

  let title = "Risky Wild Card";
  if (avg>=91 && chemistry.links.length>=2)      title = "Loaded Contender";
  else if (chemistry.links.some((l) => l.type==="legendary")) title = "Legacy Build";
  else if (chemistry.links.length>=3)            title = "Chemistry Build";
  else if (avg>=88)                              title = "Balanced Playoff Team";
  else if (roster.filter((r)=>r.price<=2).length>=3) title = "Stars & Scrubs";

  return { title, strengths:strengths.slice(0,4), weaknesses:weaknesses.slice(0,4) };
}

/* ============================ INJURIES & STATS ============================ */
function rollInjury(player) {
  let chance = 0.07;
  if (player.era)      chance += 0.04;
  if (player.pos==="RB") chance += 0.03;
  if (player.score>=95) chance -= 0.01;
  if (Math.random() > chance) return null;
  const roll = Math.random();
  if (roll < 0.55) return { type:"minor",    label:"Minor injury — missed 1 game",    penalty:0.93, gamesMissed:1 };
  if (roll < 0.88) return { type:"moderate", label:"Setback — missed 3 games",         penalty:0.79, gamesMissed:3 };
  return             { type:"major",    label:"Major injury — missed 6 games",   penalty:0.60, gamesMissed:6 };
}

function makePlayerSeasonStats(r, chemBonus=0, injuryPenalty=1) {
  const p = r.player;
  const talent = p.score / 90;
  const priceBoost = 1+(r.price-3)*0.04;
  const chemMult   = 1+chemBonus;
  const luck       = 1+gauss()*VARIANCE[r.price]*0.55;
  const mult       = Math.max(0.45, talent*priceBoost*chemMult*luck*injuryPenalty);
  if (p.pos==="QB") {
    const yds = Math.round(p.s1*mult);
    const td  = Math.max(1, Math.round(p.s2*mult));
    const ints = Math.max(3, Math.round((22-p.score/6)*(1/Math.max(0.75,mult))));
    return { yds, td, ints, fantasy: yds*0.04 + td*4 - ints*2 };
  }
  if (p.pos==="RB") {
    const yds = Math.round(p.s1*mult);
    const td  = Math.max(0, Math.round(p.s2*mult));
    const rec = Math.max(8, Math.round(28*mult + Math.random()*20));
    return { yds, td, rec, fantasy: yds*0.1 + td*6 + rec*0.5 };
  }
  const yds = Math.round(p.s1*mult);
  const td  = Math.max(0, Math.round(p.s2*mult));
  const rec = Math.max(10, Math.round(p.s3*mult));
  return { yds, td, rec, fantasy: yds*0.1 + td*6 + rec*0.5 };
}

/* ============================ SIMULATION ============================ */
function teamPerf(roster, chemistry, form, ptsAcc, playerImpacts={}) {
  let t=0;
  roster.forEach((r) => {
    const base  = r.player.score;
    const pChem = chemistry.playerBonuses[r.player.id] || 0;
    const inj   = playerImpacts[r.player.id]?.injury?.penalty || 1;
    const swing = gauss()*VARIANCE[r.price]*base*0.4;
    const roll  = Math.random();
    const mult  = roll<0.06?0.28 : roll<0.15?0.7 : roll>0.92?1.15 : 1.0;
    const ps    = (base+swing)*mult*(1+pChem)*inj;
    t += ps;
    if (ptsAcc) ptsAcc[r.player.id] = (ptsAcc[r.player.id]||0) + (ps/100)*28;
  });
  return (70 + ((t/5)*(1+chemistry.totalBonus)-70)*0.8)*form;
}

function toScoreline(myPerf, oppPerf, win) {
  let my  = Math.max(3,  Math.round(myPerf*0.42  - 8 + Math.random()*5));
  let opp = Math.max(0,  Math.round(oppPerf*0.42 - 8 + Math.random()*5));
  if (win  && my<=opp)  my  = opp + randInt(1,7);
  if (!win && opp<=my)  opp = my  + randInt(1,7);
  return { my, opp };
}

function simulate(roster, chemistry) {
  const form = 1+gauss()*0.08;
  const games=[], injuries=[], playerStats={}, playerImpacts={}, ptsAcc={};

  roster.forEach((r) => {
    const injury = rollInjury(r.player);
    if (injury) { injuries.push({...injury, playerName:r.player.name}); playerImpacts[r.player.id]={injury}; }
    const chemBonus    = chemistry.playerBonuses[r.player.id] || 0;
    const injuryPenalty = injury ? injury.penalty : 1;
    playerStats[r.player.id] = { player:r.player, price:r.price, injury, stats:makePlayerSeasonStats(r, chemBonus, injuryPenalty) };
  });

  const oppPool = [...OPP_NAMES].sort(() => Math.random()-0.5);
  for (let w=0; w<20; w++) {
    const team     = teamPerf(roster, chemistry, form, ptsAcc, playerImpacts);
    const opponent = 65+w*0.5+(Math.random()*34-17);
    const win      = team > opponent;
    const score    = toScoreline(team, opponent, win);
    games.push({ w:win, my:score.my, opp:score.opp, name:oppPool[w%20] });
  }

  let pts=0, mvp=null;
  Object.values(playerStats).forEach((e) => {
    pts += e.stats.fantasy;
    if (!mvp || e.stats.fantasy > mvp.pts) mvp = { player:e.player, pts:e.stats.fantasy, price:e.price };
  });

  const formLabel = form>1.05 ? "🔥 Your squad caught fire this season" : form<0.95 ? "🥶 Cold season — locker room flu hit hard" : null;
  return { games, wins:games.filter((g) => g.w).length, pts:Math.round(pts), mvp, formLabel, playerStats, injuries };
}

function playPlayoffGame(roster, chemistry, oppLevel) {
  const form = 1+gauss()*0.05;
  const team = teamPerf(roster, chemistry, form, null);
  const opp  = oppLevel+(Math.random()*20-10);
  const win  = team > opp;
  const score = toScoreline(team, opp, win);
  return { w:win, my:score.my, opp:score.opp, name:OPP_NAMES[randInt(0,19)] };
}

/* ============================ CAP BOWL GAME ============================ */
/* ============================================================
   CAP BOWL GAME — self-contained component
   Props:
     roster   — array of 5 {player, price} picks [QB,RB,WR,WR,TE]
     chemistry — finalChem object
     onWin    — called when TD scored
     onLose   — called when drive ends without TD
   ============================================================ */

const FIELD_W = 320;   // logical px, will scale to viewport
const FIELD_H = 520;
const EZ_TOP  = 40;    // end zone top edge (y=0 is top of visible field)
const BALL_Y_START = FIELD_H - 80; // LOS at start (~own 20)
const FIRST_DOWN_DIST = 45; // px per 10 yards

// Colour constants
const C = {
  field:    "#2d6a2d",
  fieldAlt: "#286028",
  ezone:    "#1a3d8f",
  ezoneAlt: "#173580",
  line:     "rgba(255,255,255,0.25)",
  yardNum:  "rgba(255,255,255,0.35)",
  offense:  "#F59E0B",
  defense:  "#EF4444",
  ball:     "#c8722a",
  shadow:   "rgba(0,0,0,0.35)",
};

const POS_LABEL = ["QB","RB","WR","WR","TE"];

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dist(a, b) { return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2); }
function lerp(a, b, t) { return a + (b - a) * t; }

/* Map a player score (57–99) to 0–1 */
function norm(score, lo=60, hi=99) { return clamp((score-lo)/(hi-lo), 0, 1); }

/* Run yards: bell-curve around RB score */
function rollRunYards(rbScore) {
  const base = 1 + norm(rbScore) * 6; // 1–7
  const rand = (Math.random() + Math.random()) / 2; // triangle dist 0-1
  const yards = Math.round(base * rand + Math.random() * 2 - 0.5);
  const bigRun = Math.random() < norm(rbScore) * 0.15;
  return bigRun ? yards + randInt(5, 12) : Math.max(0, yards);
}


/* ======================== COMPONENT ======================== */
export function CapBowlGame({ roster, chemistry, onWin, onLose }) {
  const qb  = roster[0]?.player;
  const rb  = roster[1]?.player;
  const wrs = [roster[2]?.player, roster[3]?.player];
  const te  = roster[4]?.player;

  // Receivers list: WR1 far left, WR2 far right, TE slot, RB flat
  const receivers = [
    { player: wrs[0], label:"WR1", role:"wr1" },
    { player: wrs[1], label:"WR2", role:"wr2" },
    { player: te,     label:"TE",  role:"te"  },
    { player: rb,     label:"RB",  role:"flat"},
  ];

  /* ---- game state ---- */
  const [phase, setPhase]       = useState("intro");   // intro|playcall|pass_aim|run_anim|pass_flight|result|td|loss
  const [gameClock, setGClk]    = useState(120);       // seconds
  const [playClock, setPClk]    = useState(25);
  const [timeouts,  setTOs]     = useState(3);
  const [down,      setDown]    = useState(1);
  const [toGo,      setToGo]    = useState(10);        // yards
  const [yardLine,  setYdLine]  = useState(20);        // own 20 = start
  const [scrollY,   setScrollY] = useState(0);         // field scroll
  const [lastPlay,  setLast]    = useState(null);       // {text, yards, result}
  const [clockRun,  setClkRun]  = useState(false);
  const [passTarget,setPT]      = useState(null);       // receiver index
  const [ballPos,   setBallPos] = useState({x:FIELD_W/2, y:BALL_Y_START});
  const [throwArc,  setArc]     = useState(null);      // {sx,sy,ex,ey,t}
  const [players,   setPlayers] = useState([]);         // animated player positions
  const [defenders, setDefs]    = useState([]);
  const [runAnim,   setRunAnim] = useState(null);
  const [resultMsg, setResultMsg]= useState("");
  const [gain,      setGain]    = useState(null);       // yards gained last play

  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const gcRef     = useRef(gameClock);
  const pcRef     = useRef(playClock);
  const clkRef    = useRef(null);
  const pcClkRef  = useRef(null);
  gcRef.current   = gameClock;
  pcRef.current   = playClock;

  /* Field scroll: keep LOS in lower 60% of visible field */
  const losY = useCallback((yl) => {
    // own 20 = BALL_Y_START, each yard = FIRST_DOWN_DIST/10 px up
    return BALL_Y_START - ((yl - 20) / 10) * FIRST_DOWN_DIST;
  }, []);

  const currentLosY = losY(yardLine);

  /* ---- init player positions for a play ---- */
  const initPositions = useCallback((yl) => {
    const losYPx = losY(yl);
    setPlayers([
      { x: FIELD_W/2,    y: losYPx + 18, label: "QB", role:"qb",  color: C.offense }, // QB
      { x: FIELD_W/2-70, y: losYPx + 2,  label: "WR", role:"wr1", color: C.offense }, // WR1
      { x: FIELD_W/2+70, y: losYPx + 2,  label: "WR", role:"wr2", color: C.offense }, // WR2
      { x: FIELD_W/2+30, y: losYPx + 8,  label: "TE", role:"te",  color: C.offense }, // TE
      { x: FIELD_W/2,    y: losYPx + 32, label: "RB", role:"rb",  color: C.offense }, // RB
    ]);
    setDefs([
      { x: FIELD_W/2-65, y: losYPx - 20, color: C.defense, role:"cb1" },
      { x: FIELD_W/2+65, y: losYPx - 20, color: C.defense, role:"cb2" },
      { x: FIELD_W/2-15, y: losYPx - 12, color: C.defense, role:"lb1" },
      { x: FIELD_W/2+15, y: losYPx - 12, color: C.defense, role:"lb2" },
    ]);
    setBallPos({ x: FIELD_W/2, y: losYPx + 18 });
    setArc(null);
    setRunAnim(null);
    setGain(null);
  }, [losY]);

  /* ---- start game ---- */
  const startGame = () => {
    setPhase("playcall");
    initPositions(20);
    setClockRun(true);
  };

  /* ---- game clock tick ---- */
  useEffect(() => {
    if (!clockRun) return;
    clkRef.current = setInterval(() => {
      setGClk(g => {
        if (g <= 1) {
          clearInterval(clkRef.current);
          setPhase("loss");
          setResultMsg("⏰ Clock expired");
          return 0;
        }
        return g - 1;
      });
    }, 1000);
    return () => clearInterval(clkRef.current);
  }, [clockRun]);

  /* ---- play clock tick ---- */
  useEffect(() => {
    if (phase !== "playcall") { clearInterval(pcClkRef.current); return; }
    setPClk(25);
    pcClkRef.current = setInterval(() => {
      setPClk(p => {
        if (p <= 1) {
          clearInterval(pcClkRef.current);
          // delay of game — 5 yard penalty, re-set
          setResultMsg("⚠️ Delay of game — 5 yards back");
          const newYl = Math.max(1, yardLine - 5);
          setYdLine(newYl);
          setToGo(tg => Math.min(tg + 5, 99));
          initPositions(newYl);
          return 25;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(pcClkRef.current);
  }, [phase]);

  /* ---- timeout ---- */
  const useTimeout = () => {
    if (timeouts <= 0 || phase !== "playcall") return;
    setTOs(t => t - 1);
    setClockRun(false);
    setTimeout(() => setClockRun(true), 500);
  };

  /* ---- select run ---- */
  const selectRun = () => {
    if (phase !== "playcall") return;
    setPhase("run_anim");
    setClockRun(false); // clock runs after
    clearInterval(pcClkRef.current);

    const rbScore  = rb?.score || 75;
    const yards    = rollRunYards(rbScore);
    const losYPx   = losY(yardLine);

    // animate RB moving forward
    const targetY = losYPx - (yards / 10) * FIRST_DOWN_DIST;
    let t = 0;
    const startY = losYPx + 32;
    const tick = () => {
      t += 0.04;
      if (t >= 1) {
        t = 1;
        setPlayers(ps => ps.map(p => p.role === "rb" ? { ...p, y: targetY } : p));
        setBallPos({ x: FIELD_W/2, y: targetY });
        setTimeout(() => resolvePlay(yards, "run"), 400);
        return;
      }
      const cy = lerp(startY, targetY, t < 0.5 ? 2*t*t : -1+(4-2*t)*t);
      setPlayers(ps => ps.map(p => p.role === "rb" ? { ...p, y: cy, x: FIELD_W/2 + Math.sin(t*Math.PI)*12 } : p));
      setBallPos({ x: FIELD_W/2 + Math.sin(t*Math.PI)*12, y: cy });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  /* ---- select pass ---- */
  const selectPass = () => {
    if (phase !== "playcall") return;
    setPhase("pass_aim");
    clearInterval(pcClkRef.current);
    // animate receivers running routes
    const losYPx = losY(yardLine);
    const routes = {
      wr1: { x: FIELD_W/2 - 80, y: losYPx - 70 }, // go route
      wr2: { x: FIELD_W/2 + 55, y: losYPx - 35 }, // curl
      te:  { x: FIELD_W/2 + 20, y: losYPx - 28 }, // checkdown
      flat:{ x: FIELD_W/2 - 35, y: losYPx + 5  }, // RB flat
    };
    let t = 0;
    const startPositions = {};
    setPlayers(ps => { ps.forEach(p => { startPositions[p.role] = { x: p.x, y: p.y }; }); return ps; });
    const roles = ["wr1","wr2","te","flat"];
    const animate = () => {
      t += 0.025;
      if (t >= 1) {
        setPlayers(ps => ps.map(p => {
          const r = routes[p.role]; return r ? { ...p, x: r.x, y: r.y } : p;
        }));
        return;
      }
      setPlayers(ps => ps.map(p => {
        const r = routes[p.role];
        const s = startPositions[p.role];
        if (!r || !s) return p;
        const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        return { ...p, x: lerp(s.x, r.x, ease), y: lerp(s.y, r.y, ease) };
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    setTimeout(() => {
      setPlayers(ps => { ps.forEach(p => { startPositions[p.role] = { x: p.x, y: p.y }; }); return ps; });
      rafRef.current = requestAnimationFrame(animate);
    }, 50);
  };

  /* ---- throw to receiver ---- */
  const throwTo = (recIdx) => {
    if (phase !== "pass_aim") return;
    setPhase("pass_flight");

    const recRoles = ["wr1","wr2","te","flat"];
    const recRole  = recRoles[recIdx];
    const recPlayer = receivers[recIdx]?.player;
    const qbScore  = qb?.score || 80;
    const recScore = recPlayer?.score || 75;

    // Find receiver position
    let recPos = { x: FIELD_W/2, y: losY(yardLine) - 50 };
    setPlayers(ps => { const r = ps.find(p => p.role === recRole); if (r) recPos = { x: r.x, y: r.y }; return ps; });

    // Accuracy offset based on QB score
    const maxErr = clamp(30 - norm(qbScore) * 24, 3, 28);
    const errX   = (Math.random() - 0.5) * maxErr;
    const errY   = (Math.random() - 0.5) * maxErr;
    const landX  = recPos.x + errX;
    const landY  = recPos.y + errY;

    // Catch radius based on receiver score (+ chemistry)
    const hasChem = chemistry?.links?.some(l =>
      (l.a?.name === qb?.name && l.b?.name === recPlayer?.name) ||
      (l.b?.name === qb?.name && l.a?.name === recPlayer?.name)
    );
    const baseRadius = 14 + norm(recScore) * 22; // 14–36
    const catchRadius = hasChem ? baseRadius * 1.35 : baseRadius;

    const startPos = { x: FIELD_W/2, y: losY(yardLine) + 18 };

    // Animate ball along arc
    let t = 0;
    const animBall = () => {
      t += 0.035;
      if (t >= 1) {
        t = 1;
        const caught = dist({ x: landX, y: landY }, recPos) <= catchRadius;
        setBallPos({ x: landX, y: landY });

        setTimeout(() => {
          if (caught) {
            // yards gained = distance from LOS to receiver
            const losYPx = losY(yardLine);
            const yardsGained = Math.max(0, Math.round((losYPx - recPos.y) / FIRST_DOWN_DIST * 10));
            resolvePlay(yardsGained, "complete");
          } else {
            resolvePlay(0, "incomplete");
            setClockRun(false); // clock stops on inc
          }
        }, 350);
        return;
      }
      const ex = lerp(startPos.x, landX, t);
      const arcPeak = -60 * Math.sin(t * Math.PI);
      const ey = lerp(startPos.y, landY, t) + arcPeak;
      setBallPos({ x: ex, y: ey });
      rafRef.current = requestAnimationFrame(animBall);
    };
    setBallPos(startPos);
    rafRef.current = requestAnimationFrame(animBall);
    setPT(recIdx);
  };

  /* ---- resolve play ---- */
  const resolvePlay = useCallback((yards, type) => {
    cancelAnimationFrame(rafRef.current);
    setGain(yards);

    setYdLine(prevYL => {
      const newYL = prevYL + yards;

      // TD?
      if (newYL >= 100) {
        setPhase("td");
        setClockRun(false);
        setTimeout(onWin, 1800);
        return 100;
      }

      const newToGo = Math.max(1, toGo - yards);
      const newDown = yards >= toGo ? 1 : down + 1;
      const newToGoActual = yards >= toGo ? 10 : newToGo;

      setLast({ type, yards });

      if (newDown > 4) {
        setPhase("loss");
        setResultMsg("4th down — turnover on downs");
        setClockRun(false);
        setTimeout(onLose, 2000);
        return newYL;
      }

      setDown(newDown);
      setToGo(newToGoActual);

      // Clock management
      if (type === "run" || type === "complete") {
        setClockRun(true); // runs down
        // Show result briefly then back to playcall
        setTimeout(() => {
          initPositions(newYL);
          setPhase("playcall");
        }, 1200);
      } else {
        // incomplete — clock stopped
        setTimeout(() => {
          initPositions(newYL);
          setPhase("playcall");
        }, 900);
      }
      return newYL;
    });
  }, [down, toGo, onWin, onLose, initPositions]);

  /* ---- canvas draw ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = FIELD_W, H = FIELD_H;

    ctx.clearRect(0, 0, W, H);

    // --- Draw field stripes ---
    for (let y = 0; y < H + 40; y += 20) {
      ctx.fillStyle = (Math.floor(y / 20) % 2 === 0) ? C.field : C.fieldAlt;
      ctx.fillRect(0, y, W, 20);
    }

    // --- End zone ---
    ctx.fillStyle = C.ezone;
    ctx.fillRect(0, 0, W, EZ_TOP);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Bebas Neue', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("END ZONE", W/2, 27);

    // --- Yard lines ---
    const losYPx = losY(yardLine);
    for (let yd = 0; yd <= 100; yd += 5) {
      const lineY = BALL_Y_START - ((yd - 20) / 10) * FIRST_DOWN_DIST;
      if (lineY < -10 || lineY > H + 10) continue;
      ctx.strokeStyle = yd % 10 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)";
      ctx.lineWidth = yd % 10 === 0 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(W, lineY);
      ctx.stroke();
      if (yd % 10 === 0 && yd > 0 && yd < 100) {
        ctx.fillStyle = C.yardNum;
        ctx.font = "10px monospace";
        ctx.fillText(yd <= 50 ? yd : 100 - yd, 18, lineY - 3);
        ctx.fillText(yd <= 50 ? yd : 100 - yd, W - 18, lineY - 3);
      }
    }

    // --- First down line ---
    const fdY = losY(yardLine + Math.min(toGo, 99 - yardLine));
    ctx.strokeStyle = "#FBBF24";
    ctx.lineWidth = 2;
    ctx.setLineDash([6,3]);
    ctx.beginPath(); ctx.moveTo(0, fdY); ctx.lineTo(W, fdY); ctx.stroke();
    ctx.setLineDash([]);

    // --- LOS ---
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, losYPx); ctx.lineTo(W, losYPx); ctx.stroke();

    // --- Hash marks ---
    for (let yd = 0; yd <= 100; yd++) {
      const lineY = BALL_Y_START - ((yd - 20) / 10) * FIRST_DOWN_DIST;
      if (lineY < 0 || lineY > H) continue;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      [W*0.33, W*0.67].forEach(hx => {
        ctx.beginPath(); ctx.moveTo(hx - 5, lineY); ctx.lineTo(hx + 5, lineY); ctx.stroke();
      });
    }

    // --- Throw arc ---
    if (throwArc || (phase === "pass_flight")) {
      const startY = losYPx + 18;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4,4]);
      ctx.beginPath();
      ctx.moveTo(FIELD_W/2, startY);
      ctx.quadraticCurveTo(FIELD_W/2, startY - 50, ballPos.x, ballPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --- Catch radius circles (pass aim) ---
    if (phase === "pass_aim") {
      players.forEach((p, i) => {
        const roles = ["wr1","wr2","te","flat"];
        const ri = roles.indexOf(p.role);
        if (ri === -1) return;
        const recPlayer = receivers[ri]?.player;
        const recScore = recPlayer?.score || 75;
        const hasChem = chemistry?.links?.some(l =>
          (l.a?.name === qb?.name && l.b?.name === recPlayer?.name) ||
          (l.b?.name === qb?.name && l.a?.name === recPlayer?.name)
        );
        const baseR = 14 + norm(recScore) * 22;
        const r = hasChem ? baseR * 1.35 : baseR;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = hasChem ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)";
        ctx.lineWidth = hasChem ? 2.5 : 1.5;
        ctx.stroke();
        if (hasChem) {
          ctx.fillStyle = "rgba(245,158,11,0.12)";
          ctx.fill();
        }
      });
    }

    // --- Defenders ---
    defenders.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = C.defense;
      ctx.fill();
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // --- Players ---
    players.forEach(p => {
      // Shadow
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 11, 8, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = C.shadow;
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Label
      ctx.fillStyle = "#111";
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.label, p.x, p.y + 2.5);
    });

    // --- Ball ---
    if (phase !== "playcall" && phase !== "pass_aim") {
      ctx.beginPath();
      ctx.ellipse(ballPos.x, ballPos.y, 6, 4, Math.PI/4, 0, Math.PI*2);
      ctx.fillStyle = C.ball;
      ctx.fill();
      ctx.strokeStyle = "#7c3605";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- TD Flash ---
    if (phase === "td") {
      ctx.fillStyle = "rgba(245,158,11,0.25)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 44px 'Bebas Neue', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TOUCHDOWN!", W/2, H/2);
      ctx.fillStyle = "#fff";
      ctx.font = "16px Inter, sans-serif";
      ctx.fillText("🏆 CAP BOWL CHAMPION", W/2, H/2 + 34);
    }

    // --- Clock out ---
    if (phase === "loss") {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 32px 'Bebas Neue', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DRIVE OVER", W/2, H/2);
      ctx.fillStyle = "#fff";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(resultMsg, W/2, H/2 + 28);
    }

  }, [phase, players, defenders, ballPos, yardLine, toGo, down, throwArc, losY, receivers, chemistry, qb, resultMsg]);

  /* ---- cleanup ---- */
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(clkRef.current);
    clearInterval(pcClkRef.current);
  }, []);

  /* ---- format clock ---- */
  const fmtClock = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const downStr  = ["1st","2nd","3rd","4th"][down-1] || "4th";

  /* scale factor: fit to screen width */
  const scale = Math.min(1, (typeof window !== "undefined" ? window.innerWidth : 390) / (FIELD_W + 16));

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      background:"#0D0F14", minHeight:"100vh", padding:"0 0 24px",
      fontFamily:"'Inter', system-ui, sans-serif", color:"#fff",
    }}>

      {/* HUD */}
      <div style={{
        width:"100%", maxWidth:400, background:"#1C2028",
        borderBottom:"2px solid #2A3040",
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
        padding:"8px 12px", gap:4,
      }}>
        {/* Left: down/distance */}
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          <div style={{fontSize:18,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:"#F59E0B",lineHeight:1}}>
            {downStr} &amp; {toGo}
          </div>
          <div style={{fontSize:9,color:"#6B7280",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
            {yardLine >= 50 ? `OPP ${100-yardLine}` : `OWN ${yardLine}`}
          </div>
        </div>
        {/* Center: clocks */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif", fontSize:26, lineHeight:1,
            color: gameClock <= 30 ? "#EF4444" : "#fff",
          }}>{fmtClock(gameClock)}</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{fontSize:9,color:"#6B7280",fontWeight:700}}>PLAY {playClock}s</div>
            {phase === "playcall" && (
              <div style={{
                width:8, height:8, borderRadius:"50%",
                background: playClock <= 10 ? "#EF4444" : "#22C55E",
                boxShadow: `0 0 5px ${playClock <= 10 ? "#EF4444" : "#22C55E"}`,
              }}/>
            )}
          </div>
        </div>
        {/* Right: timeouts */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <div style={{display:"flex",gap:4}}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:10, height:10, borderRadius:"50%",
                background: i < timeouts ? "#F59E0B" : "#2A3040",
                border: "1px solid #3A4050",
              }}/>
            ))}
          </div>
          <button onClick={useTimeout} disabled={timeouts===0||phase!=="playcall"} style={{
            background: timeouts>0&&phase==="playcall" ? "#1C2028" : "#111318",
            border:"1px solid #2A3040", color: timeouts>0&&phase==="playcall" ? "#F59E0B" : "#3A4050",
            fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:4,
            cursor: timeouts>0&&phase==="playcall" ? "pointer" : "not-allowed",
            letterSpacing:1,
          }}>TIMEOUT</button>
        </div>
      </div>

      {/* Score bug */}
      <div style={{
        display:"flex", gap:0, margin:"6px 0 4px",
        background:"#1C2028", border:"1px solid #2A3040", borderRadius:8,
        overflow:"hidden", fontSize:12, fontWeight:800,
      }}>
        <div style={{padding:"4px 14px", background:"#F59E0B", color:"#111"}}>YOU 0</div>
        <div style={{padding:"4px 10px", color:"#6B7280", fontSize:10, display:"flex",alignItems:"center"}}>DOWN 4 TO WIN</div>
        <div style={{padding:"4px 14px", background:"#EF4444", color:"#fff"}}>OPP 4</div>
      </div>

      {/* Canvas field */}
      <div style={{
        position:"relative",
        transform:`scale(${scale})`, transformOrigin:"top center",
        width:FIELD_W, height:FIELD_H,
        boxShadow:"0 8px 40px rgba(0,0,0,0.6)",
        borderRadius:4, overflow:"hidden",
        marginBottom: scale < 1 ? -(FIELD_H*(1-scale)) : 0,
      }}>
        <canvas ref={canvasRef} width={FIELD_W} height={FIELD_H} style={{display:"block"}}/>
      </div>

      {/* Play result banner */}
      {gain !== null && phase === "playcall" && (
        <div style={{
          margin:"6px 0 2px",
          fontSize:14, fontWeight:800,
          color: gain >= toGo ? "#22C55E" : gain > 0 ? "#F59E0B" : "#9CA3AF",
        }}>
          {gain === 0 ? "Incomplete pass" : `+${gain} yards${gain >= toGo ? " — FIRST DOWN! 🔥" : ""}`}
        </div>
      )}

      {/* Controls */}
      <div style={{width:"100%", maxWidth:380, padding:"0 12px", marginTop:8}}>
        {phase === "intro" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:"#F59E0B",marginBottom:4}}>
              CAP BOWL 🏆
            </div>
            <div style={{fontSize:13,color:"#9CA3AF",marginBottom:4}}>
              Down 4 · 2:00 left · Need a TD to win
            </div>
            <div style={{
              background:"#1C2028", border:"1px solid #2A3040", borderRadius:10,
              padding:"10px 12px", marginBottom:12, textAlign:"left",
            }}>
              <div style={{fontSize:10,fontWeight:800,color:"#6B7280",letterSpacing:1.5,marginBottom:6}}>YOUR SQUAD</div>
              {roster.map((r,i) => r && (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}>
                  <span style={{
                    fontSize:8,fontWeight:800,color:"#111",
                    background:["#F87171","#FB923C","#FBBF24","#FBBF24","#4ADE80"][i],
                    padding:"1px 5px",borderRadius:3,minWidth:24,textAlign:"center",
                  }}>{POS_LABEL[i]}</span>
                  <span style={{fontSize:12,fontWeight:700}}>{r.player.name}</span>
                  <span style={{fontSize:10,color:"#6B7280",marginLeft:"auto"}}>{r.player.score}</span>
                </div>
              ))}
            </div>
            <button onClick={startGame} style={{
              width:"100%", padding:"14px", borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#F59E0B,#FBBF24)",
              color:"#1a0e00", fontWeight:900, fontSize:16, cursor:"pointer",
              fontFamily:"'Inter',sans-serif", letterSpacing:.3,
            }}>⚡ Take the Field</button>
          </div>
        )}

        {phase === "playcall" && (
          <div>
            <div style={{fontSize:10,fontWeight:800,color:"#6B7280",textAlign:"center",letterSpacing:2,marginBottom:8}}>CALL YOUR PLAY</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={selectRun} style={{
                padding:"14px 8px", borderRadius:11, border:"1px solid #2A3040",
                background:"#1C2028", color:"#fff", cursor:"pointer",
                fontFamily:"'Inter',sans-serif",
              }}>
                <div style={{fontSize:22,marginBottom:3}}>🏃</div>
                <div style={{fontWeight:900,fontSize:14}}>RUN</div>
                <div style={{fontSize:9,color:"#FB923C",fontWeight:700}}>{rb?.name?.split(" ").pop() || "RB"}</div>
              </button>
              <button onClick={selectPass} style={{
                padding:"14px 8px", borderRadius:11, border:"1px solid #2A3040",
                background:"#1C2028", color:"#fff", cursor:"pointer",
                fontFamily:"'Inter',sans-serif",
              }}>
                <div style={{fontSize:22,marginBottom:3}}>🏈</div>
                <div style={{fontWeight:900,fontSize:14}}>PASS</div>
                <div style={{fontSize:9,color:"#60A5FA",fontWeight:700}}>{qb?.name?.split(" ").pop() || "QB"}</div>
              </button>
            </div>
          </div>
        )}

        {phase === "pass_aim" && (
          <div>
            <div style={{fontSize:10,fontWeight:800,color:"#60A5FA",textAlign:"center",letterSpacing:2,marginBottom:8}}>CHOOSE YOUR TARGET</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {receivers.map((rec,i) => {
                const hasChem = chemistry?.links?.some(l =>
                  (l.a?.name === qb?.name && l.b?.name === rec.player?.name) ||
                  (l.b?.name === qb?.name && l.a?.name === rec.player?.name)
                );
                return (
                  <button key={i} onClick={() => throwTo(i)} style={{
                    padding:"10px 8px", borderRadius:10,
                    border: hasChem ? "2px solid #F59E0B" : "1px solid #2A3040",
                    background: hasChem ? "#232014" : "#1C2028",
                    color:"#fff", cursor:"pointer", fontFamily:"'Inter',sans-serif",
                    position:"relative",
                  }}>
                    {hasChem && <span style={{
                      position:"absolute",top:-6,right:6,
                      fontSize:8,fontWeight:800,color:"#F59E0B",
                      background:"#0D0F14",padding:"1px 4px",borderRadius:3,
                    }}>⚡CHEM</span>}
                    <div style={{fontWeight:900,fontSize:13}}>{rec.label}</div>
                    <div style={{fontSize:10,color:"#9CA3AF",marginTop:1}}>{rec.player?.name?.split(" ").pop()}</div>
                    <div style={{
                      marginTop:4, height:3, borderRadius:99,
                      background:`hsl(${(rec.player?.score||65)-60},70%,45%)`,
                      width: `${norm(rec.player?.score||65)*100}%`,
                    }}/>
                  </button>
                );
              })}
            </div>
            <button onClick={() => { setPhase("playcall"); }} style={{
              marginTop:8, width:"100%", padding:"8px", borderRadius:8,
              border:"1px solid #2A3040", background:"transparent",
              color:"#6B7280", fontSize:12, cursor:"pointer",
              fontFamily:"'Inter',sans-serif",
            }}>← Cancel</button>
          </div>
        )}

        {(phase === "run_anim" || phase === "pass_flight") && (
          <div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{fontSize:28}}>{phase === "run_anim" ? "🏃" : "🏈"}</div>
            <div style={{fontSize:12,color:"#9CA3AF",fontWeight:600,marginTop:4}}>
              {phase === "run_anim" ? "Running the ball..." : "Ball in the air..."}
            </div>
          </div>
        )}

        {phase === "td" && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:40}}>🏆</div>
            <div style={{fontSize:26,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:"#F59E0B"}}>TOUCHDOWN!</div>
            <div style={{fontSize:13,color:"#9CA3AF",marginTop:4}}>CAP BOWL CHAMPION</div>
          </div>
        )}

        {phase === "loss" && (
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:34}}>💔</div>
            <div style={{fontSize:18,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:"#EF4444"}}>DRIVE OVER</div>
            <div style={{fontSize:12,color:"#9CA3AF",marginTop:4}}>{resultMsg}</div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================ AVATAR ============================ */
function Avatar({ player }) {
  const col = TC[player.team] || "#3A3F4A";
  return (
    <div className="ava legend" style={{ background:`linear-gradient(160deg,${col} 0%,${col}BB 60%,${col}77 100%)` }}>
      <div className="ava-shine"/>
      <span className="ava-num">{player.jersey}</span>
      <span className="ava-team">{player.team}</span>
    </div>
  );
}

/* ============================ CARD ============================ */
function Card({ player, price, state, onPick, chemLinks=[] }) {
  const labels = STAT_LABELS[player.pos];
  const interactive = state === "active";
  const hasChem = chemLinks.length > 0;
  const topChem = hasChem ? chemLinks[0] : null;
  const cls = "card"
    + (state==="frost"      ? " frost"      : "")
    + (state==="over"       ? " over"       : "")
    + (state==="picked-sel" ? " sel"        : "")
    + (state==="picked-dim" ? " pdim"       : "")
    + (hasChem && interactive ? " has-chem" : "");

  return (
    <button className={cls} onClick={interactive ? onPick : undefined}
      disabled={!interactive} tabIndex={interactive ? 0 : -1}>
      {state==="picked-sel" && <span className="check">✓</span>}
      {state==="over"       && <span className="over-tag">CAP</span>}
      {player.score>=97 && state!=="frost" && <span className="goat">👑</span>}
      {hasChem && interactive && (
        <span className={"chem-badge cbt-"+topChem.type}>
          {chemLabel(topChem).icon}
        </span>
      )}
      <Avatar player={player}/>
      <div className="card-body">
        <div className="pname">{shortName(player.name)}</div>
        <div className="meta">
          <span className="team">{player.era ? player.era : player.team}</span>
          <span className="pill" style={{background:TIER_COLORS[price]}}>{player.score}</span>
        </div>
        {state==="frost" ? (
          <div className="bars"><i/><i/><i/></div>
        ) : (
          <div className="stats">
            <div><b>{labels[0]}</b><span>{fmtNum(player.s1)}</span></div>
            <div><b>{labels[1]}</b><span>{player.s2}</span></div>
            <div><b>{labels[2]}</b><span>{player.s3}</span></div>
          </div>
        )}
      </div>
    </button>
  );
}

/* ============================ CONFETTI ============================ */
function Confetti() {
  const bits = useMemo(() => Array.from({length:60}, (_,i) => ({
    left: Math.random()*100, delay: Math.random()*2.2,
    dur:  2.6+Math.random()*2,
    color:["#F59E0B","#22C55E","#60A5FA","#A78BFA","#EF4444","#FBBF24"][i%6],
    size: 5+Math.random()*5, spin:Math.random()>.5?1:-1,
  })), []);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b,i) => (
        <span key={i} style={{
          left:b.left+"%", animationDelay:b.delay+"s",
          animationDuration:b.dur+"s", background:b.color,
          width:b.size, height:b.size*0.45, "--spin":b.spin,
        }}/>
      ))}
    </div>
  );
}

/* ============================ APP ============================ */
export default function CapKings() {
  const [picks,      setPicks]      = useState({});
  const [activeCol,  setActiveCol]  = useState(null);
  const [rowPrices,  setRowPrices]  = useState([5,4,3,2,1]);
  const [dispPrices, setDispPrices] = useState([5,4,3,2,1]);
  const [spinRows,   setSpinRows]   = useState([false,false,false,false,false]);
  const [board,      setBoard]      = useState(() => buildBoard([5,4,3,2,1], new Set()));
  const [phase,      setPhase]      = useState("draft");
  const [result,     setResult]     = useState(null);
  const [reveal,     setReveal]     = useState(0);
  const [muted,      setMuted]      = useState(false);
  const [career,     setCareer]     = useState(() => {
    try { const s=localStorage.getItem("capKingsCareer"); return s?JSON.parse(s):{seasons:0,best:null,titles:0,perfects:0}; }
    catch { return {seasons:0,best:null,titles:0,perfects:0}; }
  });
  const [playoff,  setPlayoff]  = useState({stage:0,games:[],pending:false,eliminated:false,champion:false});
  const [copied,   setCopied]   = useState(false);
  const [capBowl,  setCapBowl]  = useState(false);  // true = playing the Cap Bowl mini game

  const spinFlags  = useRef([false,false,false,false,false]);
  const tickRef    = useRef(null);
  const timeoutsRef= useRef([]);
  const actxRef    = useRef(null);
  const mutedRef   = useRef(false);
  mutedRef.current = muted;
  const fanfared   = useRef(false);

  useEffect(() => {
    try { localStorage.setItem("capKingsCareer", JSON.stringify(career)); } catch {}
  }, [career]);

  // Kill white gutters on the host page — inject dark bg into real <html>/<body>
  useEffect(() => {
    document.body.style.background = "#111318";
    document.documentElement.style.background = "#111318";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  /* ---- sound ---- */
  const tone = useCallback((f,t=0.08,type="square",g=0.05,delay=0) => {
    if (mutedRef.current) return;
    try {
      if (!actxRef.current) {
        const A = window.AudioContext||window.webkitAudioContext;
        if (!A) return;
        actxRef.current = new A();
      }
      const c=actxRef.current;
      if (c.state==="suspended") c.resume();
      const o=c.createOscillator(), gn=c.createGain();
      o.type=type; o.frequency.value=f;
      gn.gain.setValueAtTime(g, c.currentTime+delay);
      gn.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+delay+t);
      o.connect(gn); gn.connect(c.destination);
      o.start(c.currentTime+delay); o.stop(c.currentTime+delay+t+0.02);
    } catch {}
  }, []);
  const sPick    = () => { tone(523,.06,"square",.04); tone(784,.08,"square",.04,.06); };
  const sLock    = (i) => tone(700+i*90,.05,"square",.025);
  const sW       = () => tone(987,.04,"triangle",.018);
  const sL       = () => tone(196,.06,"sawtooth",.015);
  const sFanfare = (good) => good
    ? [523,659,784,1047].forEach((f,i)  => tone(f,.16,"square",.05,i*.11))
    : [330,262,196].forEach((f,i)        => tone(f,.2,"sawtooth",.04,i*.14));
  const sChamp   = () => [523,659,784,1047,784,1047,1319].forEach((f,i) => tone(f,.18,"square",.05,i*.13));

  const clearTimers = useCallback(() => {
    clearInterval(tickRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current=[];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  /* ---- derived ---- */
  const spent         = useMemo(() => Object.values(picks).reduce((a,p)=>a+p.price,0), [picks]);
  const remaining     = CAP - spent;
  const pickCount     = Object.keys(picks).length;
  const picksLeft     = 5 - pickCount;
  const maxAffordable = remaining - Math.max(0, picksLeft-1);
  const busy          = spinRows.some(Boolean);
  const chemistry     = useMemo(() => getChemistry(picks), [picks]);
  const roster        = useMemo(() => pickCount===5 ? [0,1,2,3,4].map((c)=>picks[c]) : null, [picks, pickCount]);
  const finalChem     = useMemo(() => roster ? getChemistry(roster) : chemistry, [roster, chemistry]);
  const projLine      = roster ? projectedWins(roster, finalChem) : null;
  const teamPower     = roster ? Math.round(roster.reduce((a,r)=>a+r.player.score,0)/5) : null;
  const teamReport    = useMemo(() => roster ? getTeamReport(roster, finalChem) : null, [roster, finalChem]);

  /* ---- scramble ---- */
  const scramble = useCallback((picksState) => {
    const count = Object.keys(picksState).length;
    if (count>=5) return;
    const spentNow = Object.values(picksState).reduce((a,p)=>a+p.price,0);
    const left     = 5-count;
    const maxAff   = CAP-spentNow-(left-1);
    const target   = genPrices(maxAff);
    const pickedIds= new Set(Object.values(picksState).map((p)=>p.player.id));
    const newBoard = buildBoard(target, pickedIds);

    clearTimers();
    spinFlags.current=[true,true,true,true,true];
    setSpinRows([true,true,true,true,true]);
    tickRef.current = setInterval(
      () => setDispPrices((d) => d.map((v,i) => spinFlags.current[i] ? (v%5)+1 : v)), 55
    );
    target.forEach((price, ri) => {
      const t = setTimeout(() => {
        spinFlags.current[ri]=false;
        sLock(ri);
        setDispPrices((d) => { const n=[...d]; n[ri]=price; return n; });
        setSpinRows((s)   => { const n=[...s]; n[ri]=false; return n; });
        setBoard((b)      => { const n=b.map((row)=>[...row]); n[ri]=newBoard[ri]; return n; });
        if (ri===4) { clearInterval(tickRef.current); setRowPrices(target); }
      }, 360+ri*60);
      timeoutsRef.current.push(t);
    });
  }, [clearTimers]);

  const nextUnpicked = (from, picksState) => {
    for (let s=1; s<=5; s++) { const c=(from+s)%5; if (!(c in picksState)) return c; }
    return null;
  };

  const handlePick = (row, col) => {
    if (busy || phase!=="draft") return;
    if (activeCol!==col || col in picks) return;
    const price=rowPrices[row];
    if (price>maxAffordable) return;
    const player=board[row][col];
    const newPicks={...picks,[col]:{player,price}};
    sPick(); buzz(12);
    setPicks(newPicks);
    setActiveCol(nextUnpicked(col, newPicks));
    if (Object.keys(newPicks).length<5) scramble(newPicks);
  };

  const handleTab = (col) => { if (phase!=="draft"||col in picks) return; setActiveCol(col); };

  const startSim = () => {
    if (pickCount<5) return;
    fanfared.current=false;
    const res=simulate(roster, finalChem);
    setResult(res); setReveal(0);
    setPlayoff({stage:0,games:[],pending:false,eliminated:false,champion:false});
    setCopied(false); setPhase("results");
  };

  /* ---- reveal ticker ---- */
  useEffect(() => {
    if (phase!=="results"||!result||reveal>=20) return;
    const t=setTimeout(() => { result.games[reveal].w ? sW() : sL(); setReveal((r)=>r+1); }, 105);
    return () => clearTimeout(t);
  }, [phase,result,reveal]);

  const revealDone = phase==="results" && reveal>=20;

  useEffect(() => {
    if (!revealDone||!result||fanfared.current) return;
    fanfared.current=true;
    sFanfare(result.wins>=12);
    buzz(result.wins>=15?[40,60,40]:20);
    setCareer((c) => ({
      ...c, seasons:c.seasons+1,
      best: c.best===null||result.wins>c.best ? result.wins : c.best,
      perfects: c.perfects+(result.wins===20?1:0),
    }));
  }, [revealDone,result]);

  /* ---- playoffs ---- */
  const madePlayoffs = result && result.wins>=11;
  const playRound = () => {
    if (playoff.pending||playoff.eliminated||playoff.champion) return;
    const round=PLAYOFF_ROUNDS[playoff.stage];
    // Stage 2 = Cap Bowl → launch the mini game instead of auto-sim
    if (playoff.stage===2) {
      tone(440,.3,"triangle",.03);
      setCapBowl(true);
      return;
    }
    setPlayoff((p) => ({...p,pending:true}));
    tone(440,.3,"triangle",.03);
    setTimeout(() => {
      const g=playPlayoffGame(roster, finalChem, round.opp);
      setPlayoff((p) => {
        const games=[...p.games,g];
        if (!g.w) { sFanfare(false); buzz([60,40,60]); return {...p,games,pending:false,eliminated:true}; }
        sFanfare(true); buzz(30);
        return {...p,games,stage:p.stage+1,pending:false};
      });
    },1000);
  };

  /* ---- Cap Bowl game callbacks ---- */
  const onCapBowlWin = () => {
    setCapBowl(false);
    sChamp(); buzz([50,50,50,50,120]);
    setCareer((c)=>({...c,titles:c.titles+1}));
    setPlayoff((p) => ({...p, champion:true, eliminated:false,
      games:[...p.games, {w:true, my:7, opp:4, name:"Renegades"}]
    }));
  };
  const onCapBowlLose = () => {
    setCapBowl(false);
    sFanfare(false); buzz([60,40,60]);
    setPlayoff((p) => ({...p, eliminated:true,
      games:[...p.games, {w:false, my:0, opp:4, name:"Renegades"}]
    }));
  };

  /* ---- share ---- */
  const shareResult = async () => {
    if (!result) return;
    const grade = gradeFor(result.wins);
    const wins20 = result.games.filter((g)=>g.w).length;
    // 5×4 grid = 2 rows of 10 → reuse same 20 squares but display as 4 rows of 5 in text
    const rows = [0,1,2,3].map((row) =>
      result.games.slice(row*5, row*5+5).map((g)=>g.w?"🟩":"🟥").join("")
    );
    let postseasonLine = "";
    if (playoff.champion)           postseasonLine = "🏆 CAP BOWL CHAMPION";
    else if (playoff.eliminated)    postseasonLine = `❌ Out: ${PLAYOFF_ROUNDS[playoff.games.length-1].name}`;
    else if (madePlayoffs)          postseasonLine = "🎟️ Made playoffs";
    else                            postseasonLine = "📺 Missed playoffs";

    const chemLine = finalChem.links.filter((l)=>["legendary","stack"].includes(l.type))
      .map((l)=>`🔗 ${l.label}`).join(" · ");

    const lines = [
      "💰 CAP KINGS",
      `${wins20}-${20-wins20} · ${grade.label}`,
      "",
      ...rows,
      "",
      postseasonLine,
      `PWR ${teamPower} · O/U ${projLine} ${result.wins>projLine?"✅ covered":"❌ missed"}`,
      chemLine ? chemLine : null,
      "",
      "🏈 cap-kings.com",
    ].filter((l)=>l!==null);

    const text = lines.join("\n");
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta=document.createElement("textarea");
      ta.value=text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const newBoardReset = () => {
    clearTimers(); fanfared.current=false;
    setPicks({}); setActiveCol(null); setPhase("draft");
    setResult(null); setReveal(0); setCopied(false); setCapBowl(false);
    setPlayoff({stage:0,games:[],pending:false,eliminated:false,champion:false});
    setRowPrices([5,4,3,2,1]); setDispPrices([5,4,3,2,1]);
    setSpinRows([false,false,false,false,false]);
    setBoard(buildBoard([5,4,3,2,1],new Set()));
  };

  /* ---- UI ---- */
  const capPct      = Math.min(100,(spent/CAP)*100);
  const grade       = result ? gradeFor(result.wins) : null;
  const shownGames  = result ? result.games.slice(0,reveal) : [];
  const winsSoFar   = shownGames.filter((g)=>g.w).length;
  const lossSoFar   = reveal - winsSoFar;
  const lastGame    = reveal>0 ? result.games[reveal-1] : null;
  const celebrate   = (revealDone && result?.wins===20) || playoff.champion;

  return (
    <div className="wrap">
      <style>{CSS}</style>
      {celebrate && <Confetti/>}

      {/* ========== CAP BOWL MINI GAME OVERLAY ========== */}
      {capBowl && roster && (
        <div style={{position:"fixed",inset:0,zIndex:300,overflowY:"auto",background:"#0D0F14"}}>
          <CapBowlGame
            roster={roster}
            chemistry={finalChem}
            onWin={onCapBowlWin}
            onLose={onCapBowlLose}
          />
        </div>
      )}

      {/* ========== HEADER ========== */}
      <header className="hdr">
        <div className="hdr-top">
          <div className="logo">CAP<span> KINGS</span></div>
          <div className="hdr-right">
            {career.titles>0 && <div className="rings">🏆×{career.titles}</div>}
            {career.best!==null && <div className="best">BEST {career.best}-{20-career.best}</div>}
            <div className="budget">
              <span className="bud-num" style={{color:remaining<=2?"#EF4444":"#fff"}}>${remaining}</span>
              <span className="bud-lbl">left</span>
            </div>
            <button className="iconbtn" onClick={()=>setMuted((m)=>!m)}>{muted?"🔇":"🔊"}</button>
            <button className="iconbtn" onClick={newBoardReset}>↻</button>
          </div>
        </div>
        <div className="capbar"><div className="capfill" style={{width:capPct+"%"}}/></div>
        <div className="tabs">
          {POSITIONS.map((pos,c) => {
            const picked   = picks[c];
            const isActive = activeCol===c && !picked && phase==="draft";
            return (
              <button key={c}
                className={"tab"+(isActive?" on":"")+(picked?" done":"")}
                style={{"--pc":POS_COLORS[pos]}}
                onClick={()=>handleTab(c)}
                disabled={!!picked||phase!=="draft"}>
                <span className="tab-pos">{pos}</span>
                {picked
                  ? <span className="tab-sub done-sub">✓ {shortName(picked.player.name)}</span>
                  : <span className="tab-sub">{isActive?"picking":"tap"}</span>}
              </button>
            );
          })}
        </div>

        {/* Chemistry bar — only show notable links */}
        {chemistry.links.filter((l)=>["legendary","stack","team","identity","era","roster"].includes(l.type)).length>0 && phase==="draft" && (
          <div className="stackbar">
            {chemistry.links
              .filter((l)=>["legendary","stack","team","identity","era","roster"].includes(l.type))
              .map((l) => {
                const cl = chemLabel(l);
                return (
                  <span key={l.key} className={"stack-chip cbt-"+l.type}>
                    {cl.icon} <b>{cl.text}</b>: {l.label}
                  </span>
                );
              })}
          </div>
        )}
      </header>

      {/* ========== DRAFT ========== */}
      {phase==="draft" && (
        <main className="grid-area">
          {activeCol===null && pickCount===0 && (
            <div className="hint">
              <b>Build a $15 squad.</b> Tap a position, draft one card, prices re-spin. Same-team stacks &amp; legendary duos unlock <b>CHEM</b> boosts.
            </div>
          )}
          <div className="board">
            {board.map((row,r) => (
              <div className="row" key={r}>
                <div className={"price t"+dispPrices[r]+(spinRows[r]?" spin":"")+(dispPrices[r]===5&&!spinRows[r]?" gold":"")}
                     style={{color:TIER_COLORS[dispPrices[r]]}}>
                  ${dispPrices[r]}
                </div>
                {row.map((player,c) => {
                  const picked=picks[c];
                  let state;
                  if (picked)               state = picked.player.id===player.id ? "picked-sel" : "picked-dim";
                  else if (spinRows[r])     state = "frost";
                  else if (activeCol!==c)   state = "frost";
                  else if (rowPrices[r]>maxAffordable) state = "over";
                  else                      state = "active";
                  return (
                    <Card key={c+"-"+player.id}
                      player={player} price={dispPrices[r]}
                      state={state}
                      onPick={()=>handlePick(r,c)}
                      chemLinks={state==="active" ? getPotentialChemistry(player,picks) : []}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Team Report */}
          {pickCount===5 && teamReport && (
            <div className="team-report">
              <div className="report-label">TEAM REPORT</div>
              <div className="report-title">{teamReport.title}</div>
              {finalChem.links.filter((l)=>["legendary","stack","team","identity","era","roster"].includes(l.type)).length>0 && (
                <div className="chem-report">
                  {finalChem.links
                    .filter((l)=>["legendary","stack","team","identity","era","roster"].includes(l.type))
                    .map((l) => {
                      const cl=chemLabel(l);
                      return <span key={l.key} className={"chem-pill cbt-"+l.type}>{cl.icon} {l.label}</span>;
                    })}
                </div>
              )}
              <div className="report-cols">
                <div>
                  {teamReport.strengths.map((s,i) => <p key={i} className="rp-s">✅ {s}</p>)}
                </div>
                <div>
                  {teamReport.weaknesses.map((w,i) => <p key={i} className="rp-w">⚠️ {w}</p>)}
                </div>
              </div>
            </div>
          )}
          <div className="grid-pad"/>
        </main>
      )}

      {/* ========== RESULTS ========== */}
      {phase==="results" && result && (
        <main className="results">
          <div className="rec-wrap">
            <div className="record" style={{color:revealDone?grade.color:"#fff"}}>
              {winsSoFar}-{lossSoFar}
            </div>
            <div className={"grade"+(revealDone?" show":"")} style={{color:grade.color}}>
              {grade.label}
            </div>
          </div>

          {!revealDone && lastGame && (
            <div className="ticker">
              WK {reveal} · <b className={lastGame.w?"tw":"tl"}>{lastGame.w?"W":"L"} {lastGame.my}-{lastGame.opp}</b> vs {lastGame.name}
            </div>
          )}

          {/* 5×4 W/L grid */}
          <div className="games">
            {result.games.map((g,i) => (
              <div key={i} className={"g "+(i<reveal?(g.w?"w":"l"):"hide")}
                   title={i<reveal?`${g.my}-${g.opp} vs ${g.name}`:""}>
                {i<reveal?(g.w?"W":"L"):""}
              </div>
            ))}
          </div>

          <div className={"sub-stats"+(revealDone?" show":"")}>
            <div className="ss"><b>{result.pts.toLocaleString()}</b><span>fantasy pts</span></div>
            <div className="ss">
              <b style={{color:result.wins>projLine?"#22C55E":"#EF4444"}}>
                {result.wins>projLine?"✓":"✗"} {projLine}
              </b>
              <span>vegas o/u</span>
            </div>
            <div className="ss"><b>{teamPower}</b><span>team power</span></div>
            <div className="ss"><b>${spent}</b><span>cap spent</span></div>
          </div>

          {revealDone && result.formLabel && (
            <div className="form-note">{result.formLabel}</div>
          )}

          {/* Season News */}
          {revealDone && (
            <div className={"injury-card"+(result.injuries?.length?"":"")} >
              <div className="report-label">SEASON NEWS</div>
              {result.injuries?.length>0
                ? result.injuries.map((inj,i)=><p key={i} className={"inj-"+inj.type}>🚑 <b>{inj.playerName}</b>: {inj.label}</p>)
                : <p className="clean-health">✅ Clean bill of health all season.</p>}
            </div>
          )}

          {/* Playoffs */}
          {revealDone && madePlayoffs && !playoff.champion && !playoff.eliminated && (
            <div className="po">
              <div className="po-title">🎟️ PLAYOFF BERTH CLINCHED</div>
              {playoff.games.map((g,i) => (
                <div key={i} className={"po-game "+(g.w?"pw":"pl")}>
                  {PLAYOFF_ROUNDS[i].name}: <b>{g.w?"W":"L"} {g.my}-{g.opp}</b> vs {g.name}
                </div>
              ))}
              <button className="po-btn" onClick={playRound} disabled={playoff.pending}
                style={playoff.stage===2?{background:"linear-gradient(135deg,#F59E0B,#FBBF24)",color:"#1a0e00"}:{}}>
                {playoff.pending?"...":playoff.stage===2?"🏈 Play the Cap Bowl!":"Play "+PLAYOFF_ROUNDS[playoff.stage].name+" ▶"}
              </button>
            </div>
          )}
          {revealDone && playoff.eliminated && (
            <div className="po">
              {playoff.games.map((g,i) => (
                <div key={i} className={"po-game "+(g.w?"pw":"pl")}>
                  {PLAYOFF_ROUNDS[i].name}: <b>{g.w?"W":"L"} {g.my}-{g.opp}</b> vs {g.name}
                </div>
              ))}
              <div className="po-out">💔 Eliminated in the {PLAYOFF_ROUNDS[playoff.games.length-1].name}</div>
            </div>
          )}
          {playoff.champion && (
            <div className="po champ">
              {playoff.games.map((g,i) => (
                <div key={i} className="po-game pw">
                  {PLAYOFF_ROUNDS[i].name}: <b>W {g.my}-{g.opp}</b> vs {g.name}
                </div>
              ))}
              <div className="champ-banner">🏆 CAP BOWL CHAMPION 🏆</div>
            </div>
          )}
          {revealDone && !madePlayoffs && (
            <div className="po-miss">📺 Missed the playoffs — need 11 wins.</div>
          )}

          {/* MVP */}
          {revealDone && result.mvp && (
            <div className="mvp">
              <div className="mvp-ava"><Avatar player={result.mvp.player}/></div>
              <div className="mvp-info">
                <span className="mvp-tag">SEASON MVP</span>
                <b>{result.mvp.player.name}</b>
                <span className="mvp-pts">{result.mvp.pts.toFixed(1)} pts · ${result.mvp.price}</span>
              </div>
              <span className="mvp-trophy">🏅</span>
            </div>
          )}

          {/* Player stats */}
          {revealDone && result.playerStats && (
            <div className="stat-card">
              <div className="report-label">PLAYER STATS</div>
              {Object.values(result.playerStats).map(({player,stats,injury}) => (
                <div className="stat-row" key={player.id}>
                  <span className="stat-pos" style={{background:POS_COLORS[player.pos]}}>{player.pos}</span>
                  <div className="stat-info">
                    <b>{player.name}</b>
                    <span>
                      {player.pos==="QB"
                        ? `${stats.yds.toLocaleString()} YDS · ${stats.td} TD · ${stats.ints} INT`
                        : `${stats.yds.toLocaleString()} YDS · ${stats.td} TD · ${stats.rec} REC`}
                    </span>
                    {injury && <em className={"inj-"+injury.type}>{injury.label}</em>}
                  </div>
                  <strong className="stat-pts">{stats.fantasy.toFixed(1)}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Roster recap */}
          <div className={"recap"+(revealDone?" show":"")}>
            {[0,1,2,3,4].map((c) => {
              const p=picks[c]; if (!p) return null;
              return (
                <div className="recap-row" key={c}>
                  <span className="chip" style={{background:POS_COLORS[POSITIONS[c]]}}>{POSITIONS[c]}</span>
                  <div className="recap-ava"><Avatar player={p.player}/></div>
                  <div className="recap-name">
                    <b>{p.player.name}</b>
                    <span>{p.player.era||p.player.team}</span>
                  </div>
                  <span className="pill big" style={{background:TIER_COLORS[p.price]}}>{p.player.score}</span>
                  <span className="paid">${p.price}</span>
                </div>
              );
            })}
          </div>

          {revealDone && (
            <div className="career">
              {career.seasons} season{career.seasons!==1?"s":""} · best {career.best}-{20-career.best}
              {career.titles>0&&` · ${career.titles} 🏆`}
              {career.perfects>0&&` · ${career.perfects} perfect`}
            </div>
          )}

          <div className={"end-btns"+(revealDone?" show":"")}>
            <button className="share" onClick={shareResult}>{copied?"Copied! ✓":"Share 📋"}</button>
            <button className="again" onClick={newBoardReset}>Run It Back ↻</button>
          </div>
          <div className="grid-pad"/>
        </main>
      )}

      {/* ========== BOTTOM BAR ========== */}
      {phase==="draft" && (
        <footer className="bottom">
          {pickCount===5
            ? <div className="line"><b>PWR {teamPower}</b><span>O/U {projLine} wins</span></div>
            : <div className="prog">
                {[0,1,2,3,4].map((c) => <i key={c} className={c in picks?"fill":""}/>)}
                <span>{pickCount}/5</span>
              </div>}
          <button className={"sim"+(pickCount===5?" ready":"")}
            disabled={pickCount<5} onClick={startSim}>
            {pickCount===5?"Simulate Season ▶":`Pick ${5-pickCount} more`}
          </button>
        </footer>
      )}
    </div>
  );
}

/* ============================ CSS ============================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { background: #111318; height: 100%; margin: 0; padding: 0; }

/* ---- wrap ---- */
.wrap {
  font-family: 'Inter', system-ui, sans-serif;
  background: #111318; color: #fff;
  width: 100%; max-width: 430px; margin: 0 auto; min-height: 100vh;
  display: flex; flex-direction: column; position: relative;
  overflow-x: hidden;
}
/* On true mobile (narrower than 430px) fill edge-to-edge */
@media (max-width: 430px) {
  .wrap { max-width: 100%; }
  .bottom { max-width: 100%; }
}

/* ---- confetti ---- */
.confetti { position: fixed; inset: 0; pointer-events: none; z-index: 200; overflow: hidden; }
.confetti span { position: absolute; top: -12px; border-radius: 2px; animation: fall linear infinite; }
@keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity:1; }
  100% { transform: translateY(110vh) rotate(calc(720deg * var(--spin))); opacity:.7; } }

/* ---- header ---- */
.hdr {
  position: sticky; top: 0; z-index: 50;
  background: rgba(17,19,24,.95); backdrop-filter: blur(10px);
  border-bottom: 1px solid #2A3040;
  padding: 7px 8px 6px;
}
.hdr-top { display:flex; align-items:center; justify-content:space-between; }
.logo {
  font-family: 'Bebas Neue', sans-serif; font-size: 21px;
  letter-spacing: 1.5px; color: #F59E0B; line-height: 1;
}
.logo span { color: #fff; }
.hdr-right { display:flex; align-items:center; gap:6px; }
.rings { font-size:11px; font-weight:800; color:#F59E0B; }
.best {
  font-size:9px; font-weight:800; color:#F59E0B;
  background:#F59E0B18; border:1px solid #F59E0B44;
  padding:2px 6px; border-radius:999px; letter-spacing:.5px;
}
.budget { text-align:right; line-height:1; }
.bud-num { font-family:'Bebas Neue',sans-serif; font-size:22px; }
.bud-lbl { display:block; font-size:8px; color:#6B7280; font-weight:600; letter-spacing:.3px; text-transform:uppercase; }
.iconbtn {
  background:#1C2028; border:1px solid #2A3040; color:#9CA3AF;
  width:28px; height:28px; border-radius:7px; font-size:12px; cursor:pointer;
}
.iconbtn:hover { color:#fff; }

/* cap bar */
.capbar { height:5px; background:#2A3040; border-radius:99px; margin-top:6px; overflow:hidden; }
.capfill { height:100%; border-radius:99px;
  background:linear-gradient(90deg,#F59E0B,#22C55E,#F97316,#EF4444);
  background-size:430px 100%; transition:width .3s ease; }

/* position tabs */
.tabs { display:grid; grid-template-columns:repeat(5,1fr); gap:4px; margin-top:6px; }
.tab {
  background:#1C2028; border:1px solid #2A3040; border-top:2px solid var(--pc);
  border-radius:7px; padding:4px 2px 3px; cursor:pointer; color:#fff;
  display:flex; flex-direction:column; align-items:center; gap:1px; min-width:0;
  transition:background .15s, transform .1s;
}
.tab:active { transform:scale(.95); }
.tab.on { background:#232936; border-color:var(--pc); box-shadow:0 0 0 1px var(--pc) inset, 0 3px 10px -5px var(--pc); }
.tab.done { opacity:.8; cursor:default; }
.tab-pos { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:1px; color:var(--pc); line-height:1; }
.tab-sub { font-size:7px; color:#6B7280; font-weight:600; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tab-sub.done-sub { color:#22C55E; }

/* chemistry bar */
.stackbar { display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
.stack-chip {
  font-size:8px; font-weight:700; padding:2px 7px; border-radius:999px;
  border:1px solid; display:inline-flex; align-items:center; gap:3px;
}
.stack-chip b { font-weight:800; }

/* ---- grid area ---- */
.grid-area { padding: 6px 6px 0; flex:1; }
.hint {
  font-size:11px; color:#9CA3AF; background:#1C2028;
  border:1px dashed #2A3040; border-radius:9px;
  padding:8px 10px; margin-bottom:7px; text-align:center; line-height:1.4;
}
.hint b { color:#E5E7EB; }

.board { display:flex; flex-direction:column; gap:5px; }
.row { display:grid; grid-template-columns:26px repeat(5,1fr); gap:4px; align-items:stretch; }

/* price label */
.price {
  font-family:'Bebas Neue',sans-serif; font-size:18px;
  display:flex; align-items:center; justify-content:center;
  background:#1C2028; border:1px solid #2A3040; border-radius:7px;
}
.price.spin { animation:reel .12s linear infinite; filter:blur(.5px); }
.price.gold { border-color:#F59E0B66; animation:glow 2.2s ease-in-out infinite; }
@keyframes reel { 0%{transform:translateY(-2px)} 50%{transform:translateY(2px)} 100%{transform:translateY(-2px)} }
@keyframes glow { 0%,100%{box-shadow:0 0 7px -4px #F59E0B} 50%{box-shadow:0 0 13px -3px #F59E0B} }

/* ---- CARD — compact for iPhone fit ---- */
.card {
  position:relative; background:#1C2028; border:1px solid #2A3040; border-radius:8px;
  overflow:hidden; padding:0; cursor:pointer; text-align:left; color:#fff;
  display:flex; flex-direction:column; font-family:inherit;
  transition:transform .1s, border-color .15s, box-shadow .15s, opacity .2s, filter .2s;
}
.card:not(:disabled):hover { border-color:#4b5563; transform:translateY(-1px); }
.card:not(:disabled):active { transform:scale(.95); }
.card:focus-visible { outline:2px solid #F59E0B; outline-offset:1px; }
.card.frost  { filter:blur(1.5px); opacity:.35; background:#14171E; pointer-events:none; }
.card.over   { opacity:.3; filter:grayscale(1); cursor:not-allowed; }
.card.pdim   { opacity:.22; filter:grayscale(.6); }
.card.sel    { background:#0D2010; border-color:#22C55E; box-shadow:0 0 10px -4px #22C55E; }
.card.sel .pname, .card.sel .stats span { color:#86EFAC; }
.card.has-chem { border-color:#60A5FA66; }

/* badges */
.check {
  position:absolute; top:3px; right:3px; z-index:2;
  background:#22C55E; color:#06270f;
  width:14px; height:14px; border-radius:50%; font-size:9px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
}
.over-tag {
  position:absolute; top:3px; right:3px; z-index:2;
  background:#EF4444; color:#fff;
  font-size:6px; font-weight:800; letter-spacing:.5px; padding:2px 3px; border-radius:3px;
}
.goat { position:absolute; top:2px; left:3px; z-index:2; font-size:10px; }
.chem-badge {
  position:absolute; bottom:2px; left:2px; z-index:2;
  font-size:9px; line-height:1; background:rgba(0,0,0,.55);
  border-radius:3px; padding:1px 3px;
}

/* avatar */
.ava {
  width:100%; aspect-ratio:1/.72; background:#232936;
  position:relative; overflow:hidden; flex-shrink:0;
}
.ava.legend { display:flex; flex-direction:column; align-items:center; justify-content:center; }
.ava-shine { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.3),rgba(255,255,255,.06)); }
.ava-num {
  font-family:'Bebas Neue',sans-serif; font-size:26px; color:#fff;
  line-height:1; position:relative; text-shadow:0 2px 5px rgba(0,0,0,.5);
}
.ava-team { font-size:7px; font-weight:700; color:rgba(255,255,255,.7); letter-spacing:.8px; position:relative; }

/* card body — ultra compact */
.card-body { padding:3px 4px 4px; display:flex; flex-direction:column; gap:2px; flex:1; }
.pname { font-size:8.5px; font-weight:700; line-height:1.15; min-height:19px; }
.meta { display:flex; align-items:center; justify-content:space-between; gap:2px; }
.team { font-size:6.5px; color:#6B7280; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pill { font-size:8px; font-weight:800; color:#111318; padding:1px 4px; border-radius:999px; flex-shrink:0; }
.pill.big { font-size:11px; padding:2px 7px; }

.stats { display:flex; flex-direction:column; gap:1px; margin-top:1px; }
.stats div { display:flex; justify-content:space-between; font-size:7px; line-height:1.3; }
.stats b { color:#6B7280; font-weight:600; }
.stats span { color:#D1D5DB; font-weight:600; }
.bars { display:flex; flex-direction:column; gap:3px; margin-top:2px; }
.bars i { height:4px; background:#2A3040; border-radius:2px; display:block; }

.grid-pad { height:80px; }

/* ---- bottom bar ---- */
.bottom {
  position:fixed; bottom:0; left:50%; transform:translateX(-50%);
  width:100%; max-width:430px; z-index:60;
  background:rgba(17,19,24,.95); backdrop-filter:blur(10px);
  border-top:1px solid #2A3040;
  padding:8px 10px calc(8px + env(safe-area-inset-bottom));
  display:flex; align-items:center; gap:10px;
}
.prog { display:flex; align-items:center; gap:4px; }
.prog i { width:12px; height:5px; border-radius:2px; background:#2A3040; }
.prog i.fill { background:#22C55E; }
.prog span { font-size:10px; color:#6B7280; font-weight:700; margin-left:3px; }
.line { display:flex; flex-direction:column; line-height:1.1; }
.line b { font-family:'Bebas Neue',sans-serif; font-size:16px; color:#F59E0B; }
.line span { font-size:8px; color:#6B7280; font-weight:700; text-transform:uppercase; }
.sim {
  flex:1; font-family:'Inter',sans-serif; font-weight:800; font-size:13px;
  padding:11px; border-radius:10px; cursor:pointer;
  background:#1C2028; color:#4b5563; border:1px solid #2A3040; transition:all .2s;
}
.sim.ready {
  background:linear-gradient(135deg,#16A34A,#22C55E); color:#04150a;
  border-color:transparent; box-shadow:0 5px 18px -5px #22C55E99;
  animation:pulse 1.6s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }

/* ---- Team Report ---- */
.team-report {
  margin-top:10px; background:#1C2028; border:1px solid #2A3040;
  border-radius:12px; padding:12px; 
}
.report-label {
  font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:2px;
  color:#6B7280; margin-bottom:3px;
}
.report-title { font-family:'Bebas Neue',sans-serif; font-size:22px; color:#F59E0B; letter-spacing:.5px; margin-bottom:8px; }
.chem-report { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px; }
.chem-pill {
  font-size:8.5px; font-weight:700; padding:2px 8px;
  border-radius:999px; border:1px solid; display:inline-flex; align-items:center; gap:3px;
}
.report-cols { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.report-cols > div { display:flex; flex-direction:column; gap:3px; }
.rp-s { font-size:9.5px; color:#86EFAC; line-height:1.3; }
.rp-w { font-size:9.5px; color:#FCA5A5; line-height:1.3; }

/* ---- chemistry color tokens ---- */
.cbt-legendary { color:#FCD34D; background:#F59E0B18; border-color:#F59E0B66; }
.cbt-stack     { color:#93C5FD; background:#60A5FA14; border-color:#60A5FA55; }
.cbt-team      { color:#6EE7B7; background:#10B98118; border-color:#10B98155; }
.cbt-division  { color:#C4B5FD; background:#8B5CF618; border-color:#8B5CF655; }
.cbt-identity  { color:#FDE68A; background:#D9770618; border-color:#D9770655; }
.cbt-era       { color:#F9A8D4; background:#EC489918; border-color:#EC489955; }
.cbt-roster    { color:#A5F3FC; background:#0891B218; border-color:#0891B255; }

/* ---- results ---- */
.results { padding:14px 12px 0; flex:1; display:flex; flex-direction:column; align-items:center; }
.rec-wrap { text-align:center; }
.record { font-family:'Bebas Neue',sans-serif; font-size:80px; line-height:.92; letter-spacing:2px; transition:color .4s; }
.grade { font-size:16px; font-weight:800; opacity:0; transform:translateY(5px); transition:all .4s .1s; margin-top:1px; }
.grade.show { opacity:1; transform:none; }
.ticker { font-size:11px; color:#9CA3AF; margin-top:6px; font-weight:600; min-height:16px; }
.ticker .tw { color:#22C55E; } .ticker .tl { color:#EF4444; }

/* ---- 5 × 4 game grid (20 cells, 5 cols × 4 rows) ---- */
.games {
  display:grid; grid-template-columns:repeat(5,1fr);
  gap:6px; margin:12px 0 6px; width:100%; max-width:300px;
}
.g {
  aspect-ratio:1; border-radius:8px; display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:800; border:1px solid #2A3040; background:#1C2028; color:transparent;
  transition:all .12s;
}
.g.w { background:#0D2010; border-color:#22C55E66; color:#22C55E; }
.g.l { background:#200d0d; border-color:#EF444466; color:#EF4444; }

.sub-stats { display:flex; gap:16px; margin:10px 0 2px; opacity:0; transition:opacity .4s .2s; }
.sub-stats.show { opacity:1; }
.ss { text-align:center; }
.ss b { font-family:'Bebas Neue',sans-serif; font-size:20px; display:block; }
.ss span { font-size:8px; color:#6B7280; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
.form-note { font-size:11px; color:#9CA3AF; margin-top:6px; font-weight:600; }

/* injury / news card */
.injury-card {
  width:100%; max-width:400px; margin-top:10px;
  background:#1C2028; border:1px solid #2A3040; border-radius:10px; padding:10px 12px;
}
.injury-card .report-label { margin-bottom:6px; }
.inj-minor    { color:#FCD34D; font-size:10px; display:block; margin-top:2px; }
.inj-moderate { color:#F97316; font-size:10px; display:block; margin-top:2px; }
.inj-major    { color:#EF4444; font-size:10px; display:block; margin-top:2px; }
.clean-health { color:#6EE7B7; font-size:10px; font-weight:600; }

/* playoffs */
.po {
  width:100%; max-width:400px; margin-top:12px;
  background:#1C2028; border:1px solid #2A3040; border-radius:11px; padding:10px; text-align:center;
}
.po.champ { border-color:#F59E0B; box-shadow:0 0 22px -8px #F59E0B; }
.po-title { font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:1.5px; color:#2DD4BF; margin-bottom:7px; }
.po-game { font-size:11px; color:#D1D5DB; padding:4px 0; border-bottom:1px solid #2A3040; }
.po-game:last-of-type { border-bottom:none; }
.po-game.pw b { color:#22C55E; } .po-game.pl b { color:#EF4444; }
.po-btn {
  margin-top:8px; width:100%; padding:10px; border-radius:9px; border:none; cursor:pointer;
  font-weight:800; font-size:12px; font-family:'Inter',sans-serif;
  background:linear-gradient(135deg,#0D9488,#2DD4BF); color:#022c26;
}
.po-btn:disabled { opacity:.6; }
.po-out { margin-top:8px; font-size:12px; font-weight:700; color:#EF4444; }
.po-miss { margin-top:10px; font-size:10px; color:#6B7280; font-weight:600; }
.champ-banner {
  margin-top:8px; font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:2px;
  color:#F59E0B; text-shadow:0 0 16px #F59E0B66; animation:champPulse 1.4s ease-in-out infinite;
}
@keyframes champPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

/* MVP */
.mvp {
  width:100%; max-width:400px; margin-top:10px;
  display:flex; align-items:center; gap:9px;
  background:linear-gradient(135deg,#1C2028,#22200e);
  border:1px solid #F59E0B55; border-radius:11px; padding:8px 10px;
}
.mvp-ava { width:42px; height:42px; border-radius:8px; overflow:hidden; flex-shrink:0; }
.mvp-ava .ava { aspect-ratio:1; height:100%; }
.mvp-ava .ava-num { font-size:17px; }
.mvp-ava .ava-team { display:none; }
.mvp-info { flex:1; min-width:0; line-height:1.2; }
.mvp-tag { font-size:7px; font-weight:800; letter-spacing:1.5px; color:#F59E0B; display:block; }
.mvp-info b { font-size:12px; display:block; }
.mvp-pts { font-size:9px; color:#9CA3AF; font-weight:600; }
.mvp-trophy { font-size:20px; }

/* player stats */
.stat-card {
  width:100%; max-width:400px; margin-top:10px;
  background:#1C2028; border:1px solid #2A3040; border-radius:11px; padding:10px 12px;
}
.stat-card .report-label { margin-bottom:6px; }
.stat-row {
  display:flex; align-items:center; gap:7px;
  padding:5px 0; border-bottom:1px solid #1e2330;
}
.stat-row:last-child { border-bottom:none; }
.stat-pos { font-size:7.5px; font-weight:800; color:#111318; padding:2px 4px; border-radius:4px; flex-shrink:0; width:24px; text-align:center; }
.stat-info { flex:1; min-width:0; line-height:1.2; }
.stat-info b { font-size:11px; display:block; }
.stat-info span { font-size:9px; color:#9CA3AF; font-weight:600; }
.stat-info em { font-style:normal; }
.stat-pts { font-family:'Bebas Neue',sans-serif; font-size:16px; color:#F59E0B; }

/* recap */
.recap { width:100%; max-width:400px; margin-top:10px; opacity:0; transform:translateY(6px); transition:all .35s .3s; }
.recap.show { opacity:1; transform:none; }
.recap-row {
  display:flex; align-items:center; gap:8px;
  background:#1C2028; border:1px solid #2A3040;
  border-radius:10px; padding:6px 9px; margin-bottom:5px;
}
.chip { font-size:8px; font-weight:800; color:#111318; padding:2px 5px; border-radius:4px; width:26px; text-align:center; flex-shrink:0; }
.recap-ava { width:32px; height:32px; border-radius:7px; overflow:hidden; flex-shrink:0; }
.recap-ava .ava { aspect-ratio:1; height:100%; }
.recap-ava .ava-num { font-size:14px; }
.recap-ava .ava-team { display:none; }
.recap-name { flex:1; min-width:0; line-height:1.15; }
.recap-name b { font-size:11px; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.recap-name span { font-size:8px; color:#6B7280; font-weight:600; }
.paid { font-family:'Bebas Neue',sans-serif; font-size:16px; color:#F59E0B; width:22px; text-align:right; }

.career { margin-top:10px; font-size:9px; color:#6B7280; font-weight:700; text-transform:uppercase; letter-spacing:.5px; }

.end-btns { display:flex; gap:7px; width:100%; max-width:400px; margin-top:10px; opacity:0; transition:opacity .4s .4s; }
.end-btns.show { opacity:1; }
.share {
  flex:1; padding:13px; border-radius:11px; border:1px solid #2A3040; cursor:pointer;
  font-weight:800; font-size:13px; font-family:'Inter',sans-serif;
  background:#1C2028; color:#E5E7EB;
}
.again {
  flex:1.4; padding:13px; border-radius:11px; border:none; cursor:pointer;
  font-weight:800; font-size:13px; font-family:'Inter',sans-serif;
  background:linear-gradient(135deg,#F59E0B,#FBBF24); color:#2a1a00;
  box-shadow:0 5px 18px -6px #F59E0B88;
}
.again:active, .share:active, .po-btn:active { transform:scale(.97); }

@media (prefers-reduced-motion:reduce) {
  .price.spin, .price.gold, .sim.ready, .champ-banner, .confetti span { animation:none; }
  * { transition-duration:.01ms !important; }
}
`;
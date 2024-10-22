import { readFile, writeFile } from "fs/promises";

const json = JSON.parse(
  await readFile(new URL("./new-db.json", import.meta.url))
);

//insert into "cities" ("id","province_id","name","type","unofficial_id","province_unofficial_id") values
//insert into "district" ("id", "city_id", "name")
//
let dml_district = 'insert into "districts" ("id", "city_id", "name") values\n';
for (let i = 0; i < json["district-official"].length; i++) {
  dml_district +=
    "(" +
    [
      json["district-official"][i]["id"],
      json["district-official"][i]["city_id"],
      "'" + json["district-official"][i]["district"].replace(/'/g, "''") + "'",
    ].join(",") +
    ")";
  if (i !== json["district-official"].length - 1) dml_district += ",\n";
  else dml_district += ";";
}

writeFile("./seed_district.sql", dml_district, (err) => {
  if (err) console.log(err);
  else console.log("successfully write seed_district.sql");
});

let dml_sub_district =
  'insert into "sub_districts" ("id", "district_id", "name") values\n';
for (let i = 0; i < json["sub-district"].length; i++) {
  dml_sub_district +=
    "(" +
    [
      json["sub-district"][i]["id"],
      json["sub-district"][i]["district_id"],
      "'" + json["sub-district"][i]["sub_district"].replace(/'/g, "''") + "'",
    ].join(",") +
    ")";
  if (i !== json["sub-district"].length - 1) dml_sub_district += ",\n";
  else dml_sub_district += ";";
}

writeFile("./seed_sub_district.sql", dml_sub_district, (err) => {
  if (err) console.log(err);
  else console.log("successfully write seed_sub_district.sql");
});

var populate = require("./");
populate.populateMongo("mongodb://localhost/test", {}, "pruebasa", "./schema.yaml", 3, 2, 10);
populate.populateElastic("localhost:9200", "test", "data", 30, 2, 10);

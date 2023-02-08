conn = new Mongo();
db = conn.getDB("test_database");

db.test_classes.drop()

db.test_classes.insert({ "keyword": "AI", "name": "CAP 4770"});
db.test_classes.insert({ "keyword": "Circuits", "name": "CDA 3101"});
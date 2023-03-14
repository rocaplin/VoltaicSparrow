console.log("Initializing Class Database");

const { MongoClient } = require("mongodb");
const { parse } = require("csv-parse/sync");
var fs = require('fs');

const uri =
  "mongodb://localhost:27017?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('chompsci');
    const courses = database.collection('courses');
    await courses.deleteMany({});

	const doc = {
      name: "Intro To Databases",
      description: "Basic class about databases",
    }
	
	var docs = []
	
	var rawCourseData = fs.readFileSync("./classdata.csv","utf-8");
	
	var parsedCourseData = parse(rawCourseData,{ delimiter: ",", from_line: 2 });
	
	parsedCourseData.forEach(parsedCourse => {
		docs.push(
			{
				code:parsedCourse[0],
				name:parsedCourse[1],
				description:parsedCourse[2],
				website:parsedCourse[3],
				credits:parsedCourse[4],
				prerequisites:parsedCourse[5],
				corequisites:parsedCourse[6]
			});
	});
	
	const result = await courses.insertMany(docs);

	console.log("Insert Complete. Test query results for COP 3530:")
	
    const query = { code: 'COP 3530' };
    const course = await courses.findOne(query);
    console.log(course);
	
	var dbCourseCount = await courses.estimatedDocumentCount();
	
	console.log("Data base current course count: "+dbCourseCount);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
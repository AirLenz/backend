import Queue from "bull";
import { Environment } from "utilities";
import axios from "axios";
import { DataNodeInterface } from "interfaces";
import moment from "moment";
import { DataNodeRepository } from "repositories";
var MongoClient = require("mongodb").MongoClient;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
import file from "../regions.json";

const axiosInstace = axios.create({
  baseURL: "https://linked-things-apis.eu-de.mybluemix.net/api",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJsdW1zQG90dG9tYXRpY2FsbHkuY29tIiwic2NoZW1hIjoiVXNlciIsImxldmVscyI6W3sicm9sZXMiOlsiU1VQRVJBRE1JTiJdLCJfaWQiOiJMVU1TIn1dLCJpYXQiOjE2MTc5NDkzMjAsImV4cCI6MTY4MTAyMTMyMH0.Xj_hLkKQitYLHS0ywnLQmzpLvKiRPMohqi48SDPNmaw",
  },
});

interface ParamsInterface {
  startDate: string;
  endDate: string;
}

const getSnapshotData = (params: ParamsInterface) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const { data } = await axiosInstace.get("/v1/levels/LUMS/events", {
        params: {
          ...params,
        },
      });
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

// const DataNodeQueue = new Queue("Data Node Processing", {
// 	redis: {
// 		host: "127.0.0.1",
// 		port: 6379,
// 	},
// });

const csvWriter = createCsvWriter({
  // Output csv file name is geek_data
  path: "nodeData.csv",
  header: [
    // Title of the columns (column_names)
    { id: "created", title: "Created" },
    { id: "levelId", title: "LevelID" },
    { id: "name", title: "Name" },
    { id: "deviceId", title: "DeviceID" },
    { id: "reason", title: "Reason" },
    { id: "value", title: "Value" },
    { id: "lat", title: "lat" },
    { id: "lng", title: "lng" },
    { id: "status", title: "Status" },
  ],
});

MongoClient.connect(Environment.MONGO_URI, function (err: any, db: any) {
  if (err) throw err;
  var dbo = db.db("AirLenz");

  dbo.collection("regions").insertMany(file, function (err: any, res: any) {
    if (err) throw err;
    console.log("Regions imported");
  });

  setInterval(async () => {
    const dataNodes = await getSnapshotData({
      startDate: moment().add(5, "hours").subtract(1, "minute").toISOString(),
      endDate: moment().add(5, "hours").toISOString(),
    });

    dbo
      .collection("datanodes")
      .insertMany(dataNodes, function (err: any, res: any) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
      });
  }, 30000);
});

// const DataNodeQueue = new Queue("Data Node Processing", Environment.REDIS_URL);

// DataNodeQueue.process(async (params: any) => {
//   try {
//     if (!params.data) {
//       return Promise.resolve();
//     }
//     const dataNodes = await getSnapshotData({
//       startDate: params.data.startDate,
//       endDate: params.data.endDate,
//     });
//     console.log(dataNodes);
//     await DataNodeRepository.createDataNode(
//       dataNodes.map((i: any) => {
//         return {
//           location: {
//             type: "Point",
//             coordinates: [i.lng, i.lat],
//           },
//           created: i.created,
//           levelId: i.levelId,
//           name: i.name,
//           deviceId: i.deviceId,
//           reason: i.reason,
//           value: i.value,
//           status: i.status,
//         };
//       })
//     );
//   } catch (err) {
//     console.log(err);
//   }
//   return Promise.resolve();
// });

// DataNodeQueue.add(
//   {
//     startDate: moment().add(5, "hours").subtract(1, "minute").toISOString(),
//     endDate: moment().add(5, "hours").toISOString(),
//   },
//   { repeat: { cron: "* * * * *" } }
// );

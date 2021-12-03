import Queue from "bull";
import { Environment } from "utilities";
import axios from "axios";
import { DataNodeInterface } from "interfaces";
import moment from "moment";
import { DataNodeRepository } from "repositories";

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
const DataNodeQueue = new Queue("Data Node Processing", Environment.REDIS_URL);

DataNodeQueue.process(async (params: any) => {
	try {
		if (!params.data) {
			return Promise.resolve();
		}
		const dataNodes = await getSnapshotData({
			startDate: params.data.startDate,
			endDate: params.data.endDate,
		});
		await DataNodeRepository.createDataNode(
			dataNodes.map((i: any) => {
				return {
					location: {
						type: "Point",
						coordinates: [i.lng, i.lat],
					},
					created: i.created,
					levelId: i.levelId,
					name: i.name,
					deviceId: i.deviceId,
					reason: i.reason,
					value: i.value,
					status: i.status,
				};
			})
		);
	} catch (err) {
		console.log(err);
	}
	return Promise.resolve();
});

DataNodeQueue.add(
	{
		startDate: moment().add(5, "hours").subtract(1, "minute").toISOString(),
		endDate: moment().add(5, "hours").toISOString(),
	},
	{ repeat: { cron: "* * * * *" } }
);

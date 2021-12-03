import { DataNodeInterface, DataNodeParams } from "interfaces";
import { DataNode } from "models";

const createDataNode = (dataNodes: DataNodeInterface[]): Promise<void> => {
	return new Promise(async (res, rej) => {
		try {
			await DataNode.insertMany(dataNodes, { ordered: false });
			res();
		} catch (error) {
			console.log(error);
			rej(error);
		}
	});
};

const getNodeDateByDevice = (
	params: DataNodeParams
): Promise<DataNodeInterface[]> => {
	return new Promise(async (resolve, reject) => {
		try {
			const dataNodes = await DataNode.find({
				...params,
			});
			resolve(dataNodes);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

export const DataNodeRepository = {
	createDataNode,
	getNodeDateByDevice,
};

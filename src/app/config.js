const dotenv = require("dotenv").config();
const mongodbUsername = process.env.MONGODB_USERNAME;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const mongodbCluster = process.env.MONGODB_CLUSTER;
const mongodbNet = process.env.MONGODB_NET;
const mongodbDataBase = process.env.MONGODB_DATABASE;

const connectionStringSRV = `mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbCluster}.${mongodbNet}.mongodb.net/${mongodbDataBase}`;

// Endereços diretos descobertos via nslookup (solução alternativa para DNS problemático)
const directHosts = [
	`ac-kkmk0np-shard-00-00.${mongodbNet}.mongodb.net:27017`,
	`ac-kkmk0np-shard-00-01.${mongodbNet}.mongodb.net:27017`,
	`ac-kkmk0np-shard-00-02.${mongodbNet}.mongodb.net:27017`,
].join(",");

const connectionStringDirect = `mongodb://${mongodbUsername}:${mongodbPassword}@${directHosts}/${mongodbDataBase}?ssl=true&authSource=admin&retryWrites=true&w=majority`;

module.exports = {
	// Se MONGODB_TYPE for 'DIRECT' no .env, usa a direta. Caso contrário usa SRV.
	connectionString:
		process.env.MONGODB_TYPE === "DIRECT"
			? connectionStringDirect
			: connectionStringSRV,
	connectionStringSRV: connectionStringSRV,
	connectionStringDirect: connectionStringDirect,
};

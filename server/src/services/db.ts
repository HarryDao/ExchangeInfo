// import { Sequelize } from 'sequelize';
// import { PSQL_URL } from '../configs';

// export const getSequelize = (function() {
//     let sequelize: Sequelize;
//     let initializing: Promise<Sequelize> | null = null;

//     return function(): Promise<Sequelize> {
//         if (sequelize) {
//             return new Promise(resolve => resolve(sequelize));
//         }

//         if (!initializing) {
//             initializing = new Promise((resolve, reject) => {
//                 const connection = new Sequelize(PSQL_URL);
//                 connection.authenticate()
//                     .then(() => {
//                         console.log('DB connected!');
//                         sequelize = connection;
//                         resolve(sequelize);
//                     })
//                     .catch(error => {
//                         console.error('DB connection error:', error);
//                         reject(error);
//                     });
//             });
//         }

//         return initializing;
//     }
// })();
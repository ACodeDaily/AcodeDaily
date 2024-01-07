import { connect, set } from 'mongoose';
import { NODE_ENV, DB_PASSWORD } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://shubhamjr:${DB_PASSWORD}@cluster0.72jmhwi.mongodb.net/?retryWrites=true&w=majority`,
  };
  // const dbConfig = {
  //   url: `mongodb://localhost:27017/acd`,
  // };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfig.url);
};

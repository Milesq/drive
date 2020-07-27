import assert from 'assert';
import mongoose from 'mongoose';
import app from './app';

require('dotenv').config();

['MONGO_URI'].forEach(variable => {
  assert(process.env[variable], `process.env.${variable} is undefined!`);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 8080, () => console.log('Server is online'));
  });

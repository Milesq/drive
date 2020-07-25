import express from 'express';

const app = express();

app.use((req, res) => res.status(201).send({ token: 'asdad.asd.sadasd' }));

export default app;

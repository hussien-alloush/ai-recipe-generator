import db from './config/db.js';

const run = async () => {
  const res = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['users']);
  console.log(JSON.stringify(res.rows));
  await db.pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

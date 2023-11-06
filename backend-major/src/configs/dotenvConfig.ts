import dotenv from 'dotenv';

function loadEnv() {
  const localResult = dotenv.config({ path: '.env.local' });
  if (localResult.error) {
    dotenv.config();
  }
}

export default loadEnv;

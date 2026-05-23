export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || 'postgres_user',
    password: process.env.DB_PASSWORD || 'postgres_password',
    database_name: process.env.DB_NAME || 'tmdt_database',
  },
});

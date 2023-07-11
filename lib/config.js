const environments = {
    staging: {
        httpPort: 3000,
        httpsPort: 3001,
        envName: 'staging',
        hashingSecret: 'mySecret'
    },
    production: {
        httpPort: 5000,
        httpsPort: 5001,
        envName: 'production',
        hashingSecret: 'myHttpsSecret'
    }
}

const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : ''
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentToExport
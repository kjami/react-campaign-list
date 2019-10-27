const logger = {};

const methods = ['log', 'info', 'warn', 'error'];

methods.forEach((method) => {
    logger[method] = (message) => {
        console[method](message);
    }
});

export default logger;
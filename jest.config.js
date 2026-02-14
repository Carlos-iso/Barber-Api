module.exports = {
  testEnvironment: 'node',
  // Ignora a pasta node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    '!src/controllers/index-controller.js' // Exemplo de exclusão
  ],
  // Timeout para testes assíncronos (padrão é 5000ms)
  testTimeout: 10000 
};

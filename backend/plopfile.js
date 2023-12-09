module.exports = plop => {
  plop.setGenerator('feature', {
    description: 'generating models + controller + routes + service + dto + interface',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'type name of feature',
      },
    ],
    actions: [
      {
        type: 'add',
        path: './src/models/{{name}}.model.ts',
        templateFile: 'plop_templates/model.hbs',
      },
      {
        type: 'add',
        path: './src/routes/{{name}}.route.ts',
        templateFile: 'plop_templates/route.hbs',
      },
      {
        type: 'add',
        path: './src/controllers/{{name}}.controller.ts',
        templateFile: 'plop_templates/controller.hbs',
      },
      {
        type: 'add',
        path: './src/services/{{name}}.service.ts',
        templateFile: 'plop_templates/service.hbs',
      },
      {
        type: 'add',
        path: './src/interfaces/{{name}}.interface.ts',
        templateFile: 'plop_templates/interface.hbs',
      },
      {
        type: 'add',
        path: './src/dtos/{{name}}.dto.ts',
        templateFile: 'plop_templates/dtos.hbs',
      },
      {
        type: 'append',
        path: './src/server.ts',
        templateFile: 'plop_templates/routeImport.hbs',
        pattern: 'plop_append_import',
      },
    ],
  });
  plop.setHelper('camel', txt => txt.charAt(0).toUpperCase() + txt.slice(1));
};

import commandLineArgs from 'command-line-args';

const { argv } = process;

export const optionDefinitions = [
  {
    name: 'es6',
    type: Boolean,
    defaultValue: false,
    description: 'Use es6 syntax, require babel'
  }, {
    name: 'seedersFolder',
    alias: 'f',
    type: String,
    defaultValue: 'seeders',
    description: 'Seeders folder name'
  }, {
    name: 'help',
    alias: 'h',
    type: Boolean,
    defaultValue: false,
    description: 'Show usage guide'
  }
];

export const getOptions = argv => {
  const {
    es6,
    seedersFolder,
    help: helpWanted
  } = commandLineArgs(optionDefinitions, { argv });

  return { es6, seedersFolder, helpWanted };
};

export default getOptions;

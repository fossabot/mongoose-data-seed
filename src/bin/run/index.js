import 'babel-register';
import 'babel-polyfill';

import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { Spinner } from 'clui';

import { mustContainUserConfig } from '../../lib/utils'
import getOptions from './options';
import usageGuide from './usageGuide';
import config from '../../lib/config';
import seed from '../../lib/seed';

export default function () {
  mustContainUserConfig();

  const { mongoose, mongoURL } = config.userConfig;
  const { selectedSeeders, dropDatabase, helpWanted } = getOptions(process.argv);

  if (helpWanted) {
    console.log(usageGuide);
  } else {
    run({
      mongoose,
      mongoURL,
      selectedSeeders,
      dropDatabase
    });
  }
}

function run({ mongoose, mongoURL, selectedSeeders, dropDatabase }) {

  const spinner = new Spinner(`Trying to connect to MongoDB: ${mongoURL}`);
  spinner.start();

  // MongoDB Connection
  mongoose.connect(mongoURL, (error) => {
    spinner.stop();

    if (error) {
      console.log(`${logSymbols.error} Unable to connected to MongoDB: ${chalk.gray(mongoURL)}`);
      return process.exit(1);
    }

    console.log(`${logSymbols.success} Successfully connected to MongoDB: ${chalk.gray(mongoURL)}`);

    if (dropDatabase === true) {
      spinner.message(`Droping database...`);
      spinner.start();

      mongoose.connection.db.dropDatabase();

      spinner.stop();
      console.log(`${logSymbols.success} Database dropped!`);
    }

    console.log();
    console.log(`${chalk.cyan('Seeding Results:')}`);

    seed(selectedSeeders).subscribe({
      next: ({name, results}) => {
        spinner.stop();

        if (results) {
          const { run, created } = results;

          if (run) {
            console.log(`${logSymbols.success} ${name}: ${chalk.gray(created)}`);
          } else {
            console.log(`${logSymbols.error} ${name}`);
          }
        } else {
          spinner.message(name);
          spinner.start();
        }
      },
      error: ({name, error}) => {
        spinner.stop();

        console.log(`${logSymbols.error} ${name}`);
        console.log();
        console.log(chalk.red('ERROR'));
        console.log(error.stack);

        process.exit(1);
      },
      complete: () => process.exit(),
    });
  });
};

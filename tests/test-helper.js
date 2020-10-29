import Application from 'cheevies-jerk/app';
import config from 'cheevies-jerk/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

const app = Application.create(config.APP);

setApplication(app);
start();

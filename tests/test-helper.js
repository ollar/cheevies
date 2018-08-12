import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

const app = Application.create(config.APP);

setApplication(app);
start();

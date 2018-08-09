import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import DS from 'ember-data';

const app = Application.create(config.APP);

// app.resolveRegistration('adapter:application').extend(DS.RESTAdapter);
var ad = app.resolveRegistration('adapter:application');
console.dir(ad);

setApplication(app);

start();

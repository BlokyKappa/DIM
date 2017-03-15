import angular from 'angular';

import UIRouterModule from 'angular-ui-router';

import { ActivityTrackerDirective, ActivityTrackerService } from './activity-tracker';
import { PlatformChoiceComponent } from './platform-choice';
import shellComponent from './shell/shell.component';
import contentComponent from './content/content.component';

export const ShellModule = angular
  .module('dimShell', [
    UIRouterModule
  ])
  .directive('dimActivityTracker', ActivityTrackerDirective)
  .service('dimActivityTrackerService', ActivityTrackerService)
  .component('dimPlatformChoice', PlatformChoiceComponent)
  .component('dimShell', shellComponent)
  .component('content', contentComponent)
  .config(function($stateProvider) {
    'ngInject';

    const states = [{
      name: 'shell',
      parent: 'root',
      abstract: true,
      component: 'dimShell'
    }, {
      name: 'content',
      parent: 'shell',
      abstract: true,
      component: 'content'
    }];

    states.forEach((state) => {
      $stateProvider.state(state);
    });
  })
  .name;

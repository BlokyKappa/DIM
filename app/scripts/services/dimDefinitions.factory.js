(function(angular) {
  'use strict';

  const lazyTables = [
    'InventoryItem',
    'Objective',
    'SandboxPerk',
    'Stat',
    'TalentGrid',
    'Progression',
    'Record',
    'ItemCategory'
  ];

  const eagerTables = [
    'InventoryBucket',
    'Class',
    'Race',
    'Faction',
    'Vendor'
  ];

  angular.module('dimApp').factory('dimDefinitions', Definitions);

  /**
   * Manifest database definitions. This returns a promise for an
   * objet that has a property named after each of the tables listed
   * above (defs.TalentGrid, etc.).
   */
  function Definitions($q, dimManifestService) {
    function getDefinitions() {
      return dimManifestService.getManifest()
        .then(function(db) {
          const defs = {};

          // Load objects that lazily load their properties from the sqlite DB.
          lazyTables.forEach(function(tableShort) {
            const table = `Destiny${tableShort}Definition`;
            defs[tableShort] = new Proxy({}, {
              get: function(target, name) {
                if (name === 'then') {
                  return undefined;
                }

                if (this.hasOwnProperty(name)) {
                  return this[name];
                }
                const val = dimManifestService.getRecord(db, table, name);
                this[name] = val;
                return val;
              }
            });
          });

          // Resources that need to be fully loaded (because they're iterated over)
          eagerTables.forEach(function(tableShort) {
            const table = `Destiny${tableShort}Definition`;
            defs[tableShort] = dimManifestService.getAllRecords(db, table);
          });

          return defs;
        })
        .catch(function(e) {
          console.error(e);
          return $q.reject(e);
        });
    }

    let definitions$ = undefined;

    return {
      getDefinitions: function () {
        if (!definitions$) {
          definitions$ = getDefinitions();
        }

        return definitions$;
      }
    };
  }
})(angular);

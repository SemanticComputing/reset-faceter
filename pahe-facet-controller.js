(function() {

    'use strict';

    angular.module('facetApp')
    //.constant('google', google)


    /*
    * The controller.
    */
    .controller('PaheFacetController', PaheFacetController);

    /* @ngInject */
    function PaheFacetController($scope, FacetHandler, paheService, facetUrlStateHandlerService) {
        var vm = this;
        vm.disableFacets = disableFacets;

        // Get the facet configurations from findsService.
        vm.facets = paheService.getFacets();
        // Initialize the facet handler
        vm.handler = new FacetHandler(getFacetOptions());

        // Disable the facets while reusults are being retrieved.
        function disableFacets() {
            return vm.isLoadingResults;
        }

        // Setup the FacetHandler options.
        function getFacetOptions() {
            var options = paheService.getFacetOptions();
            options.scope = $scope;

            // Get initial facet values from URL parameters (refresh/bookmark) using facetUrlStateHandlerService.
            options.initialState = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
            return options;
        }

    }
})();

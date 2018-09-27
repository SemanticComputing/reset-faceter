(function() {

    'use strict';

    angular.module('facetApp')
    //.constant('google', google)


    /*
    * The controller.
    */
    .controller('PaheFacetController', PaheFacetController);

    /* @ngInject */
    function PaheFacetController($scope, $state, FacetHandler, paheService, facetUrlStateHandlerService) {
        var vm = this;
        vm.disableFacets = disableFacets;

	//vm.runebergFacet2 = '{"dataset":{"value":"<http://ldf.fi/nbf/sources/source4>","constraint":"?id <http://purl.org/dc/terms/source> <http://ldf.fi/nbf/sources/source4>."}}'

	vm.runebergFacet = decodeURIComponent('{"name":{"value":"<http://ldf.fi/relse/personp838>","constraint":" ?id <http://ldf.fi/relse/personSubject>/^<http://www.w3.org/2002/07/owl#sameAs> <http:%2F%2Fldf.fi%2Frelse%2Fpersonp838> . "}}');

	vm.artistFirenzeFacet = decodeURIComponent('{"title":{"value":"<http:%2F%2Fldf.fi%2Fnbf%2Ftitles%2Ftaidemaalari>","constraint":" %3Fid <http:%2F%2Fldf.fi%2Frelse%2FpersonSubject>%2F^<http:%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23sameAs>%2F<http:%2F%2Fxmlns.com%2Ffoaf%2F0.1%2Ffocus>%2F^<http:%2F%2Fldf.fi%2Fschema%2Fbioc%2Finheres_in>%2F<http:%2F%2Fldf.fi%2Fnbf%2Fhas_title>%20%20%20%20%20%20%20 <http:%2F%2Fldf.fi%2Fnbf%2Ftitles%2Ftaidemaalari> . "},"placeHierarchy":{"value":"<http:%2F%2Fldf.fi%2Fnbf%2Fplaces%2FFirenze>","constraint":" %3Fseco_v_placeHierarchy (<http:%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23broader> )* <http:%2F%2Fldf.fi%2Fnbf%2Fplaces%2FFirenze> .%20 %3Fid <http:%2F%2Fldf.fi%2Frelse%2FplaceObject>%2F<http:%2F%2Fldf.fi%2Frelse%2Fnbf> %3Fseco_v_placeHierarchy . "}}');


	vm.paataloFacet = decodeURIComponent('{"name":{"value":"<http:%2F%2Fldf.fi%2Frelse%2Fpersonp1237>","constraint":" %3Fid <http:%2F%2Fldf.fi%2Frelse%2FpersonSubject>%2F^<http:%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23sameAs>%20%20%20%20%20%20%20%20%20%20%20 <http:%2F%2Fldf.fi%2Frelse%2Fpersonp1237> . "},"placeHierarchy":{"value":"<http:%2F%2Fldf.fi%2Fnbf%2Fplaces%2FPohjoisPohjanmaa>","constraint":" %3Fseco_v_placeHierarchy (<http:%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23broader> )* <http:%2F%2Fldf.fi%2Fnbf%2Fplaces%2FPohjoisPohjanmaa> .%20 %3Fid <http:%2F%2Fldf.fi%2Frelse%2FplaceObject>%2F<http:%2F%2Fldf.fi%2Frelse%2Fnbf> %3Fseco_v_placeHierarchy . "}}');

        // Get the facet configurations from findsService.
        vm.facets = paheService.getFacets();
        // Initialize the facet handler
        vm.handler = new FacetHandler(getFacetOptions());

	vm.removeFacetSelections = removeFacetSelections;

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

        function removeFacetSelections() {
            //$state.reload();
	    $state.transitionTo($state.current, {}, { reload: true, inherit: false, notify: false });
	}

    }
})();

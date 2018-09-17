(function() {

    'use strict';

    /* eslint-disable angular/no-service-method */

    angular.module('facetApp')

    /*
     * finds service
     * Handles SPARQL queries and defines facet configurations.
     */
    .service('paheService', paheService);

    /* @ngInject */
    function paheService(FacetResultHandler, SPARQL_ENDPOINT_URL) {

        /* Public API */

        // Get the results based on the facet selections.
        this.getResults = getResults;
        // Get the facet definitions.
        this.getFacets = getFacets;
        // Get the facet options.
        this.getFacetOptions = getFacetOptions;

        /* Implementation */

        // Facet definitions
        // 'facetId' is a "friendly" identifier for the facet,
        //  and should be unique within the set of facets.
        // 'predicate' is the property that defines the facet (can also be
        //  a property path, for example).
        // 'name' is the title of the facet to show to the user.
        // If 'enabled' is not true, the facet will be disabled by default.

        var facets = {
            date: {
                facetId: 'date',
                predicate: '<http://ldf.fi/relse/date> ',
                min: 1200,
                max: 2018,
                enabled: true,
                name: 'Vuosi',
            },
            name: {
                facetId: 'name',
                //predicate: '<http://www.w3.org/2002/07/owl#sameAs>/<http://ldf.fi/relsearch/personSubject>/<http://www.w3.org/2008/05/skos-xl#prefLabel>',
		predicate: '<http://ldf.fi/relse/personSubject>/^<http://www.w3.org/2002/07/owl#sameAs>    ',
                enabled: true,
		chart: true,
                name: 'Henkilö',
		priority: 9
            },
            title: {
                facetId: 'title',
                //	/<http://www.w3.org/2004/02/skos/core#prefLabel>
                predicate: '<http://ldf.fi/relse/personSubject>/^<http://www.w3.org/2002/07/owl#sameAs>/<http://xmlns.com/foaf/0.1/focus>/^<http://ldf.fi/schema/bioc/inheres_in>/<http://ldf.fi/nbf/has_title>    ',
                name: 'Arvo, ammatti tai toiminta',
                hierarchy: '<http://www.w3.org/2004/02/skos/core#broader> ',
                depth: 3,
                chart: true,
                enabled: false
	    },  // /<http://www.w3.org/2002/07/owl#sameAs>/<http://www.w3.org/2004/02/skos/core#prefLabel>
            placeHierarchy: {
                facetId: 'placeHierarchy',
                predicate: '<http://ldf.fi/relse/placeObject>/<http://www.w3.org/2004/02/skos/core#exactMatch>   ',
                enabled: true,
		hierarchy: '<http://www.w3.org/2004/02/skos/core#broader> ',
                depth: 6,
		chart: false,
                name: 'Paikka',
            },
            placeName: {
                facetId: 'placeName',
                predicate: '<http://ldf.fi/relse/placeObject>   ',
                enabled: true,
		chart: true,
                name: 'Paikka',
            },
	    relationTypeHierarchy: {
                facetId: 'relationTypeHierarchy',
                predicate: '<http://ldf.fi/relse/relationType>   ',
                enabled: false,
                name: 'Yhteyden tyyppi',
		hierarchy: '<http://www.w3.org/2004/02/skos/core#broader> ',
                depth: 5,
            }
        };

        var endpointUrl = SPARQL_ENDPOINT_URL;

        //var rdfClass = '<http://ldf.fi/nbf/PersonConcept>';
        var rdfClass = '<http://ldf.fi/relse/Relation>';

        // The facet configuration also accept a 'constraint' option.
        // The value should be a valid SPARQL pattern.
        // One could restrict the results further, e.g., to writers in the
        // science fiction genre by using the 'constraint' option:
        //
        // var constraint = '?id <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Science_fiction> .';
        //
        // Note that the variable representing a result in the constraint should be "?id".
        //
        // 'rdfClass' is just a shorthand constraint for '?id a <rdfClass> .'
        // Both rdfClass and constraint are optional, but you should define at least
        // one of them, or you might get bad results when there are no facet selections.
        var facetOptions = {
            endpointUrl: endpointUrl, // required
            rdfClass: rdfClass, // optional
            usePost: true,
            preferredLang : 'fi', // required
	    constraint: '?id <http://ldf.fi/relse/personSubject>/^<http://www.w3.org/2002/07/owl#sameAs>/<http://www.w3.org/2004/02/skos/core#prefLabel> ?name . ',
        };

        var prefixes =
        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
        ' PREFIX dbp: <http://dbpedia.org/property/>' +
        ' PREFIX dbo: <http://dbpedia.org/ontology/>' +
        ' PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
        ' PREFIX dc: <http://purl.org/dc/elements/1.1/>' +
        ' PREFIX rel: <http://ldf.fi/relse/>' +
	' PREFIX skosxl: <http://www.w3.org/2008/05/skos-xl#> ' +
	' PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
	' PREFIX schema: <http://schema.org/> ' +
        ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>';


        var queryTemplate =
        ' SELECT DISTINCT * WHERE { ' +
        '  <RESULT_SET> ' +
	'   OPTIONAL { ' + 
        '   ?id skos:prefLabel ?description . ' +
	'   } ' +
	'   OPTIONAL { ' + 
        '   ?id rel:source ?source . ' +
	'   } ' +
	'   OPTIONAL { ' + 
        '   ?id rel:sourceName ?sourceName . ' +
	'   } ' +
	'   OPTIONAL { ' + 
        '   ?id rel:placeObject ?place__id . ' +
	'   ?place__id skos:prefLabel ?place__label . ' +
	'   ?place__id skos:exactMatch ?place__match . ' +
	'   } ' +
	'   OPTIONAL { ' + 
        '   ?id rel:personSubject ?person . ' +
	'   ?person__id owl:sameAs ?person . ' +
	'   ?person__id skos:prefLabel ?person__name . ' +
	'   ?person__id schema:relatedLink ?person__bio . ' +
	'   } ' +
/*	'   OPTIONAL { ' + 
        '   ?id rel:personSubject ?person__id . ' +
	'   ?person__id skosxl:prefLabel ?person__label . ' +
	'   ?person__label skos:prefLabel ?person__name . ' +
	'   ?person__id schema:relatedLink ?person__bio . ' +  // this limits the results to those people with link to bio in nbf
	'   } ' + */
	'   OPTIONAL { ' + 
	'   ?id rel:sourceLink ?link . ' +
	'   }  ' +
	'   OPTIONAL { ' + 
	'   ?id rel:relationType ?type . ' +
	'   ?type skos:prefLabel ?typeLabel . ' +
	'   }   ' +
        ' } ' ;

        var resultOptions = {
            prefixes: prefixes, // required if the queryTemplate uses prefixes
            queryTemplate: queryTemplate, // required
            resultsPerPage: 20, // optional (default is 10)
            pagesPerQuery: 1, // optional (default is 1)
            paging: true // optional (default is true), if true, enable paging of the results
        };

        var endpointConfig = {
          endpointUrl: endpointUrl,
          usePost: true,
        }

        // FacetResultHandler is a service that queries the endpoint with
        // the query and maps the results to objects.
        var resultHandler = new FacetResultHandler(endpointConfig, resultOptions);

        // This function receives the facet selections from the controller
        // and gets the results from DBpedia.
        // Returns a promise.
        function getResults(facetSelections) {
            // If there are variables used in the constraint option (see above),
            // you can also give getResults another parameter that is the sort
            // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
            // The results are sorted by URI (?id) by default.
            return resultHandler.getResults(facetSelections, '?name').then(function(pager) {
                // We'll also query for the total number of results, and load the
                // first page of results.
                return pager.getTotalCount().then(function(count) {
                    pager.totalCount = count;
                    return pager.getPage(0);
                }).then(function() {
                    return pager;
                });
            });
        }

        // Getter for the facet definitions.
        function getFacets() {
            return facets;
        }

        // Getter for the facet options.
        function getFacetOptions() {
            return facetOptions;
        }
    }
})();


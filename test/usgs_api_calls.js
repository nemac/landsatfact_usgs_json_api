var axios = require('axios');

var assert = require('assert');
var chai = require('chai');
var expect  = require("chai").expect;
var should = require('chai').should();
chai.use(require('chai-fuzzy'));
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

//get modules
var USGS_CONSTANT = require("../lib/usgs_api/usgs_constants.js");
var USGS_FUNCTION = require("../lib/usgs_api/usgs_functions.js");
var USGS_HELPER = require("../lib/usgs_api/usgs_helpers.js");

//get testjson
const test_datasetfields_request_json = require("../json/test-datasetfields-request.json")

const test_search_request_json = require("../json/test-search.json")

const test_datasetfields_response_json = require("../json/test-datasetfields-response.json")
const test_search_response_json = require("../json/test-search-response.json")

const test_download_request_json = require("../json/test-download-request.json")
const test_download_response_regexp = new RegExp('\Qhttp://dds.cr.usgs.gov/ltaauth//sno18/ops/l1/2014/013/028/LC80130282014100LGN00.tar.gz?id=\E[A-Za-z0-9]*\Q&iid=LC80130282014100LGN00&did=\E[0-9]*\Q&ver=production\E')
const test_downloadoptions_request_json = require("../json/test-downloadoptions-request.json")
const test_downloadoptions_response_json = require("../json/test-downloadoptions-response.json")

//set base URL for axios
axios.defaults.baseURL = USGS_CONSTANT.USGS_URL;

//login and get promise for api key
const api_key_promise = USGS_HELPER.get_api_key();

const test_api_call = function (request_code, body) {
  return api_key_promise.then(
    function (apiKey) {
      const api_key_object = {apiKey};
      const request_body = USGS_HELPER.mergejson(api_key_object, body);
      const usgs_request_code = USGS_HELPER.get_usgs_response_code(request_code);

      //make call to USGS api and return promise
      return USGS_HELPER.get_usgsapi_response(usgs_request_code, request_body);
    },
    function (err) {
      throw err;
    }
  )
}

describe('USGS API TESTS', function() {

  describe("request code: 'login'", function() {
    it('returns a valid api key', function() {
      return api_key_promise.should.be.fulfilled.and.eventually.have.length.of.at.least(5);
    })
  });

  describe("request code: 'datasetfields'", function() {
    it('response json is what we expect it to be', function() {
      const test_promise = test_api_call('datasetfields', test_datasetfields_request_json)
      return test_promise.should.eventually.be.like(test_datasetfields_response_json);
    })
  });
 
  describe("request code: 'download'", function() {
    it('download URL structure is what we expect it to be', function() {
      const test_promise = test_api_call('download', test_download_request_json)
      const test_result = test_promise.then(function (response) {
        console.log('RESPONSE: ', response, '\n')
        return test_download_response_regexp.test(response[0])
      })
      return test_result.should.eventually.equal(true)
    })
  })

/*
  describe('USGS request code: downloadoptions', function() {

    // Each time we run a download request the response url will have a new iid field in the url,
    // so we can't check the response against a static url

    it('should be fullfilled', function(done) {
      api_key.then( apiKey => {
        const test_promise = test_api_call(apiKey, 'downloadoptions', test_downloadoptions_request_json)
      })
    })
  })

  describe('USGS search', function() {

    it('should be fullfilled', function(done) {
      api_key.then( apiKey => {
        const test_promise = test_api_call(apiKey, 'search', test_search_request_json)
        test_promise.should.be.fulfilled.and.notify(done);
      })
    })

    it('response json should match', function(done) {
      api_key.then( apiKey => {
        const test_promise = test_api_call(apiKey, 'search', test_search_request_json)
        test_promise.then(function(result){
          try {
            expect(result).to.be.like(test_search_response_json);
            done();
          } catch(err) {
            done(err);
          }
        }, done);
      })
    })

  });
*/

});

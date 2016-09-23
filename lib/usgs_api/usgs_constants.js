
exports.USGS_URL = 'https://earthexplorer.usgs.gov/inventory/json/';
exports.REQUEST_POST_HEADERS = {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
};


//default node for USGS api EE
// CWIC / LSI Explorer	http://lsiexplorer.cr.usgs.gov	CWIC
// EarthExplorer	http://earthexplorer.usgs.gov	EE
// HDDSExplorer	http://hddsexplorer.usgs.gov	HDDS
// LPCSExplorer	http://lpcsexplorer.cr.usgs.gov	LPCS
exports.NODE_CWIC = "CWIC";
exports.NODE_EE = "EE";
exports.NODE_HDDS= "HDDS";
exports.NODE_LPCS = "LPCS";

//constants for standardizing inputs for api and default values
//dataset name
  // Landsat 8
  exports.LANDSAT_8 = "LANDSAT_8";
  //when Landsat 7 newer
  exports.LANDSAT_ETM_SLC_OFF = "LANDSAT_ETM_SLC_OFF";
  //when Landsat 7 older
  exports.LANDSAT_ETM = "LANDSAT_ETM";
  //when Landsat 5
  exports.LANDSAT_TM = "LANDSAT_TM";

//download products
exports.PRODUCTS = ["STANDARD"];

//for grid2ll
exports.GRIDTYPE_WRS1 = "WRS1";
exports.GRIDTYPE_WRS2 = "WRS2";
exports.RESPONSEHAPE_POINT = 'POINT';
exports.RESPONSEHAPE_POLYGON = 'POLYGON';

//down media default for us
exports.OUTPUT_MEDIA_DWNLD = "DWNLD";


// slc is off when the image is before may 5th 2003
exports.SLC_ONFF_DATE = new Date("2003-05-31");
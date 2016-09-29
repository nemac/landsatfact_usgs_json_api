var fs = require('fs');
var winston = require('winston');


function app_helpers() {

  const LOG_LEVEL_ERR = 'error';
  const LOG_LEVEL_INFO = 'info';
  var logger_level = 'debug'
  var logger;

  return {

    set_logfile: function(name){

      //get todays data as string
      today = this.get_date_string()

      logger_file = 'logs/' + name + '-' + today + '.log'

      //setup logger
      logger = new (winston.Logger)({
        transports: [
          new (winston.transports.File)({ filename: logger_file})
        ]
      });

      logger.level = logger_level;

    },

    set_logger_level: function(level){
       logger_level = level
       return level;
    },

    // remove on day from current day
    date_by_subtracting_days: function(date, days) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - days,
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        );
    },

    //check if a file exists synchronously
    file_exists: function(path) {
      try {
        fs.accessSync(path, fs.F_OK);
          return true
        } catch (e) {
          return false
        }
    },


    //delete a file used to manage logs and failed download and error files
    delete_file: function(file){

      //check if file exists
      the_file_exists = this.file_exists(file);

      //if the file exists delete it.
      if(the_file_exists){
        fs.unlink(file,function(err){
             if(err) {
               return console.log(err);
             }

             msg_header = 'old file deleted';
             msg = file;
             this.write_message(LOG_LEVEL_INFO, msg_header, msg)

         });
      }
    },

    //deletes old log and failure files (older than 7 days)
    delete_old_files: function(name){

      const days_to_keep_files = 7;

      const week_ago = this.date_by_subtracting_days(new Date(),days_to_keep_files)
      week_ago_string = this.get_date_string(week_ago)

      var file = 'logs/' + name +'-' + week_ago_string+ '.log'
      this.delete_file(file)


    },

    //function builds a list of scenes for using in a SQL where in statement
    list_array_to_sql_list: function(array){

      var list = "";

      //assumes that the array is simple list of items that can be converted into
      //  list sutable for sql in where clause list
      array.forEach(function (line) {
        list = list + "'" + line  + "',";
      });

      list  = "(" + list.substring(0,list.length-1) + ")"
      return list

    },

    //function converts a contents of a file into array of strings fro each line
    file_list_to_array: function(file){
      //take each line of file and make the lines into array elements
      //  really assumes each line is one thing or a list
      return fs.readFileSync(file).toString().split('\n')
    },

    //function to create a sting from the current date for writing logs and other files...
    //   the date input is optional if you pass nothing this function assumes todays date
    get_date_string: function(date){
      var date;

      if(!date){
        the_date = new Date()
      } else {
        the_date = date
      }

      return the_date.getFullYear()+""+("0" + (the_date.getMonth() + 1)).slice(-2)+""+("0" + the_date.getDate()).slice(-2)
    },


    //get yesterdays download failures and add get a SQL list
    //  so we can add it to todays list.  if it fails it should again it will end up back on the
    //  download list
    get_yesterdays_failures: function() {

      var list = "";
      const dayago_string = this.date_by_subtracting_days(new Date(),1)

      //format a day string for writing failires
      const dayago = this.get_date_string(dayago_string)

      const file = 'download_failed-' + dayago + '.txt';

      const yesterdays_failed_scenes = this.file_list_to_array(file);

      list = this.list_array_to_sql_list(yesterdays_failed_scenes);

      return list;
    },

    //generic message for logging and console writing
    write_message: function(level, msg, val){
      console.error(msg + ': ' + val);
      logger.log(level, msg + ': ' + val);
    },

  }

}


module.exports = app_helpers;